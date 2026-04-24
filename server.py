"""
Breach Monitor API Server
Run: uvicorn server:app --reload
"""

import json
import smtplib
import threading
import time
from datetime import datetime
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Optional

import requests
import uvicorn
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from breach_monitor3 import run_full_scan

# ==============================================================
#  EMAIL CONFIG  — fill these in before running
# ==============================================================

SMTP_HOST     = "smtp.gmail.com"
SMTP_PORT     = 587
SMTP_USER     = ""   # e.g. yourname@gmail.com
SMTP_PASSWORD = ""   # Gmail App Password (Settings → Security → App Passwords)

# ==============================================================
#  GEMINI CONFIG
# ==============================================================

GEMINI_API_KEY = ""   # get at aistudio.google.com
GEMINI_MODEL   = "gemini-2.0-flash"

# ==============================================================
#  APP
# ==============================================================

app = FastAPI(title="Breach Monitor API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # lock down to your frontend origin in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================
#  SHARED STATE  (thread-safe — background scan runs in a thread)
# ==============================================================

_lock  = threading.Lock()
_state = {
    "status":       "idle",   # idle | running | done | error
    "started_at":   None,
    "completed_at": None,
    "keywords":     [],
    "results":      [],
    "summary":      None,
    "error":        None,
}

# ==============================================================
#  MODELS
# ==============================================================

class ScanRequest(BaseModel):
    keywords:     List[str]
    notify_email: Optional[str] = None   # address to receive JSON results

# ==============================================================
#  RESULT CONDENSING  (api response vs full email json)
# ==============================================================

def _condense_results(results: list) -> dict:
    """
    Returns a compact representation for the API response.
    Hudson Rock keeps its per-domain counts.
    Sourcegraph collapses to count + file list.
    IntelX collapses to count + {name, bucket} list.
    """
    hudson = [
        {k: v for k, v in r.items() if k not in ("source", "raw")}
        for r in results if r.get("source") == "hudson_rock"
    ]

    sg_items = [r for r in results if r.get("source") == "sourcegraph"]
    sourcegraph = {
        "count": len(sg_items),
        "files": [f"{r['repo']}/{r['file']}" for r in sg_items],
    }

    ix_items = [r for r in results if r.get("source") == "intelx"]
    intelx = {
        "count": len(ix_items),
        "records": [{"name": r["name"], "bucket": r["bucket"]} for r in ix_items],
    }

    return {"hudson_rock": hudson, "sourcegraph": sourcegraph, "intelx": intelx}


def _total_count(results: list) -> int:
    total = 0
    for r in results:
        if r.get("source") == "hudson_rock":
            total += (r.get("stealer_count", 0)
                      + r.get("employee_count", 0)
                      + r.get("user_count", 0))
        else:
            total += 1
    return total


# ==============================================================
#  GEMINI SUMMARIZATION
# ==============================================================

def _summarize_with_gemini(results: list) -> str:
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY":
        return "Gemini API key not configured — skipping summary."

    prompt = (
        "You are a cybersecurity analyst reviewing breach monitor scan results. "
        "Summarize the findings concisely: overall exposure level, which domains/keywords "
        "had the most significant hits, what types of data were found (stealers, credentials, "
        "public leaks), and a short recommended action. Keep it under 200 words.\n\n"
        f"Scan results:\n{json.dumps(results, indent=2)}"
    )

    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    )

    for attempt in range(3):
        try:
            r = requests.post(
                url,
                json={"contents": [{"parts": [{"text": prompt}]}]},
                timeout=30,
            )
            if r.status_code == 429:
                wait = 5 * (2 ** attempt)   # 5s, 10s, 20s
                print(f"[GEMINI] Rate limited — retrying in {wait}s (attempt {attempt + 1}/3)")
                time.sleep(wait)
                continue
            r.raise_for_status()
            return r.json()["candidates"][0]["content"]["parts"][0]["text"]
        except requests.exceptions.HTTPError as e:
            return f"Gemini summarization failed: {e}"
        except Exception as e:
            return f"Gemini summarization failed: {e}"

    return "Gemini summarization failed: rate limit persisted after 3 retries."


# ==============================================================
#  EMAIL HELPER
# ==============================================================

def _send_email(to: str, results: list, summary: str = ""):
    if not SMTP_USER or not SMTP_PASSWORD:
        print("[EMAIL] SMTP not configured — skipping")
        return

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    filename  = f"breach_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

    # full detail + summary goes into the attachment
    email_data = {"summary": summary, "results": results}
    payload    = json.dumps(email_data, indent=2, ensure_ascii=False).encode("utf-8")

    # build per-source tally for email body
    tally: dict = {}
    for r in results:
        s = r.get("source", "unknown")
        if s == "hudson_rock":
            tally[s] = tally.get(s, 0) + (
                r.get("stealer_count", 0)
                + r.get("employee_count", 0)
                + r.get("user_count", 0)
            )
        else:
            tally[s] = tally.get(s, 0) + 1
    tally_lines = "\n".join(f"  {src}: {count} records" for src, count in tally.items())

    body = (
        f"Breach Monitor scan completed at {timestamp}.\n\n"
        f"Total records: {_total_count(results)}\n"
        f"{tally_lines}\n\n"
        f"--- AI Summary ---\n{summary}\n\n"
        f"Full results are attached as {filename}."
    )

    msg            = MIMEMultipart()
    msg["Subject"] = f"Breach Monitor Results — {timestamp}"
    msg["From"]    = SMTP_USER
    msg["To"]      = to
    msg.attach(MIMEText(body, "plain"))

    att = MIMEBase("application", "octet-stream")
    att.set_payload(payload)
    encoders.encode_base64(att)
    att.add_header("Content-Disposition", "attachment", filename=filename)
    msg.attach(att)

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as srv:
            srv.starttls()
            srv.login(SMTP_USER, SMTP_PASSWORD)
            srv.sendmail(SMTP_USER, to, msg.as_string())
        print(f"[EMAIL] Sent results to {to}")
    except Exception as e:
        print(f"[EMAIL] Failed: {e}")

# ==============================================================
#  BACKGROUND SCAN TASK
# ==============================================================

def _run_scan(keywords: List[str], notify_email: Optional[str]):
    try:
        results = run_full_scan(keywords)
        summary = _summarize_with_gemini(results)

        with _lock:
            _state["results"]      = results
            _state["summary"]      = summary
            _state["status"]       = "done"
            _state["completed_at"] = datetime.now().isoformat()

        if notify_email:
            _send_email(notify_email, results, summary)

    except Exception as e:
        with _lock:
            _state["status"] = "error"
            _state["error"]  = str(e)
        print(f"[SCAN ERROR] {e}")

# ==============================================================
#  ROUTES
# ==============================================================

@app.post("/scan", status_code=202)
async def start_scan(body: ScanRequest, background_tasks: BackgroundTasks):
    """
    Trigger a new scan. Accepts a list of keywords and an optional email
    address. Returns 409 if a scan is already running.
    """
    with _lock:
        if _state["status"] == "running":
            raise HTTPException(status_code=409, detail="A scan is already running")
        _state.update(
            status="running",
            started_at=datetime.now().isoformat(),
            completed_at=None,
            keywords=body.keywords,
            results=[],
            error=None,
        )

    background_tasks.add_task(_run_scan, body.keywords, body.notify_email)
    return {"message": "Scan started", "keywords": body.keywords}


@app.get("/status")
async def get_status():
    """
    Poll this to check if a scan is idle / running / done / error.
    """
    with _lock:
        return {
            "status":       _state["status"],
            "started_at":   _state["started_at"],
            "completed_at": _state["completed_at"],
            "keywords":     _state["keywords"],
            "error":        _state["error"],
        }


@app.get("/results")
async def get_results():
    """
    Fetch results from the most recent completed scan.
    Returns 202 if still running, 404 if no scan has been run yet.
    """
    with _lock:
        if _state["status"] == "idle":
            raise HTTPException(status_code=404, detail="No scan has been run yet")
        if _state["status"] == "running":
            raise HTTPException(status_code=202, detail="Scan still in progress — poll /status")
        return {
            "status":       _state["status"],
            "completed_at": _state["completed_at"],
            "count":        _total_count(_state["results"]),
            "summary":      _state["summary"],
            "results":      _condense_results(_state["results"]),
        }


# ==============================================================
#  ENTRY POINT
# ==============================================================

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

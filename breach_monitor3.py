"""
Breach & Leak Keyword Monitor  v2
Blocks: Hudson Rock, Sourcegraph, IntelX
Errors warn only — never crash.
"""

import requests
import time
import json
from datetime import datetime

# ==============================================================
#  CONFIG
# ==============================================================

INTELX_API_KEY = ""
INTELX_BASE    = "https://free.intelx.io"

SOURCEGRAPH_TOKEN = ""   # optional — get free at sourcegraph.com/user/settings/tokens

ORG_KEYWORDS = [
    "@dsce.edu.in",
    "@dayanandasagar.edu",
    "@bmsce.ac.in",
]

CUSTOM_KEYWORDS = []

BREACH_INDICATORS = [
    "credential dump", "database leak", "db dump",
    "combo list", "stealer logs", "password dump",
    "leaked passwords", "email dump", "breach dump",
]

SCAN_KEYWORDS = ORG_KEYWORDS + CUSTOM_KEYWORDS
OUTPUT_FILE   = r"C:\Users\theso\OneDrive\Desktop\breach_monitor_results.json"

# ==============================================================
#  HELPERS
# ==============================================================

def ts():
    return datetime.now().strftime("%H:%M:%S")

def log(msg, level="info"):
    tag = {"info": "·", "hit": "!!!", "warn": "WARN", "ok": "OK"}.get(level, "·")
    print(f"[{ts()}] {tag}  {msg}")

def warn(msg):
    log(msg, "warn")

def section(title):
    print("\n" + "=" * 55)
    print("  " + title)
    print("=" * 55)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0"
}


# ==============================================================
#  BLOCK 1 — HUDSON ROCK CAVALIER  (no auth)
# ==============================================================

def scan_hudson_rock(scan_keywords, results_list):
    section("BLOCK 1 · Hudson Rock Cavalier")

    base    = "https://cavalier.hudsonrock.com/api/json/v2/osint-tools"
    domains = [kw.lstrip("@") for kw in scan_keywords if "." in kw]

    for domain in domains:
        log(f"Checking: {domain}")
        try:
            r = requests.get(
                f"{base}/search-by-domain",
                params={"domain": domain},
                headers=HEADERS,
                timeout=20,
            )
            if r.status_code != 200:
                warn(f"Hudson Rock returned {r.status_code} for {domain}")
                continue

            data = r.json()

            def as_count(val):
                if isinstance(val, int):  return val
                if isinstance(val, list): return len(val)
                return 0

            def as_list(val):
                if isinstance(val, list): return val
                return []

            stealer_count  = as_count(data.get("stealers",  data.get("total_stealers",  0)))
            employee_count = as_count(data.get("employees", data.get("total_employees", 0)))
            user_count     = as_count(data.get("users",     data.get("total_users",     0)))
            total = stealer_count + employee_count + user_count

            if total == 0:
                log(f"  No hits for {domain}", "ok")
            else:
                log(f"  [HIT] {domain} -> {stealer_count} stealers, "
                    f"{employee_count} employee creds, {user_count} user creds", "hit")

            results_list.append({
                "source":          "hudson_rock",
                "domain":          domain,
                "stealer_count":   stealer_count,
                "employee_count":  employee_count,
                "user_count":      user_count,
                "stealers_sample": as_list(data.get("stealers",  []))[:3],
                "users_sample":    as_list(data.get("users",     []))[:3],
                "raw":             data,
            })

            time.sleep(2)

        except requests.exceptions.Timeout:
            warn(f"Hudson Rock timed out for {domain}, skipping")
        except Exception as e:
            warn(f"Hudson Rock error for {domain}: {e}")

    log("Hudson Rock done", "ok")


# ==============================================================
#  BLOCK 2 — SOURCEGRAPH  (searches all public GitHub + more)
# ==============================================================

def scan_sourcegraph(scan_keywords, results_list, token=""):
    section("BLOCK 2 · Sourcegraph (public code search)")

    token   = (token or SOURCEGRAPH_TOKEN).strip()
    headers = {**HEADERS, "Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"token {token}"
        log("Using Sourcegraph token")
    else:
        log("No token — trying unauthenticated")

    seen = set()
    hits = 0

    gql_query = """
    query Search($query: String!) {
      search(query: $query, patternType: literal) {
        results {
          results {
            ... on FileMatch {
              repository { name }
              file { path url }
              lineMatches { preview }
            }
          }
        }
      }
    }
    """

    for kw in scan_keywords:
        log(f"Sourcegraph search: '{kw}'")
        try:
            r = requests.post(
                "https://sourcegraph.com/.api/graphql",
                headers=headers,
                json={"query": gql_query, "variables": {"query": kw}},
                timeout=15,
            )

            if r.status_code == 401:
                warn("Sourcegraph needs a token — sign up free at sourcegraph.com, "
                     "get token from /user/settings/tokens, paste into SOURCEGRAPH_TOKEN")
                break
            if r.status_code != 200:
                warn(f"Sourcegraph returned {r.status_code} for '{kw}'")
                time.sleep(2)
                continue

            body = r.json()
            if "errors" in body:
                warn(f"Sourcegraph error for '{kw}': {body['errors'][0].get('message','')}")
                time.sleep(2)
                continue

            matches = (body
                       .get("data", {})
                       .get("search", {})
                       .get("results", {})
                       .get("results", []))

            for item in matches:
                repo = item.get("repository", {}).get("name", "")
                path = item.get("file", {}).get("path", "")
                url  = item.get("file", {}).get("url", "")
                if not url.startswith("http"):
                    url = "https://sourcegraph.com" + url

                uid = repo + "/" + path
                if uid in seen:
                    continue
                seen.add(uid)
                hits += 1

                lines   = item.get("lineMatches", [])
                snippet = lines[0].get("preview", "") if lines else ""

                log(f"  [SOURCEGRAPH HIT] {repo}/{path}", "hit")
                log(f"  -> {url}", "hit")
                if snippet:
                    log(f"  Snippet: {snippet[:120].strip()}", "hit")

                results_list.append({
                    "source":  "sourcegraph",
                    "keyword": kw,
                    "repo":    repo,
                    "file":    path,
                    "url":     url,
                    "snippet": snippet[:300],
                })

            time.sleep(3)

        except requests.exceptions.Timeout:
            warn(f"Sourcegraph timed out for '{kw}', skipping")
        except Exception as e:
            warn(f"Sourcegraph error for '{kw}': {e}")

    log(f"Sourcegraph done — {hits} hits", "ok")


# ==============================================================
#  BLOCK 3 — INTELX  (free API key)
# ==============================================================

def _intelx_search(term, api_key):
    r = requests.post(
        INTELX_BASE + "/intelligent/search",
        headers={"x-key": api_key, "Content-Type": "application/json"},
        json={
            "term":       term,
            "maxresults": 10,
            "media":      0,
            "target":     0,
            "timeout":    10,
            "datefrom":   "",
            "dateto":     "",
        },
        timeout=20,
    )
    r.raise_for_status()
    return r.json().get("id")


def _intelx_results(search_id, api_key):
    time.sleep(3)
    r = requests.get(
        INTELX_BASE + "/intelligent/search/result",
        headers={"x-key": api_key},
        params={"id": search_id, "limit": 10},
        timeout=20,
    )
    r.raise_for_status()
    return r.json().get("records") or []


def scan_intelx(scan_keywords, results_list, api_key=None):
    section("BLOCK 3 · IntelX")

    api_key = (api_key or INTELX_API_KEY).strip()
    if api_key == "YOUR_INTELX_API_KEY" or not api_key:
        warn("IntelX skipped — paste your key into INTELX_API_KEY")
        return

    hits = 0
    for kw in scan_keywords:
        log(f"IntelX search: '{kw}'")
        try:
            sid = _intelx_search(kw, api_key)
            if not sid:
                warn(f"No search ID returned for '{kw}'")
                continue

            for rec in _intelx_results(sid, api_key):
                hits += 1
                name   = rec.get("name", "")
                bucket = rec.get("bucket", "")
                date   = rec.get("date", "")
                log(f"  [INTELX HIT] bucket={bucket} | {name} | {date}", "hit")
                results_list.append({
                    "source":    "intelx",
                    "keyword":   kw,
                    "name":      name,
                    "bucket":    bucket,
                    "date":      date,
                    "record_id": rec.get("systemid", ""),
                    "size":      rec.get("size", 0),
                    "type":      rec.get("type", ""),
                })

        except requests.exceptions.Timeout:
            warn(f"IntelX timed out for '{kw}', skipping")
        except requests.exceptions.HTTPError as e:
            warn(f"IntelX HTTP error for '{kw}': {e}")
        except Exception as e:
            warn(f"IntelX error for '{kw}': {e}")

        time.sleep(2)

    log(f"IntelX done — {hits} hits", "ok")


# ==============================================================
#  PUBLIC API  (imported by server.py)
# ==============================================================

def run_full_scan(keywords):
    """Run all three scan blocks and return the combined results list."""
    results = []
    scan_sourcegraph(keywords, results)
    scan_intelx(keywords, results)
    scan_hudson_rock(keywords, results)
    return results


# ==============================================================
#  SUMMARY + STANDALONE MAIN
# ==============================================================

def summary(results):
    tally = {}
    for r in results:
        s = r.get("source", "unknown")
        if s == "hudson_rock":
            count = (r.get("stealer_count", 0)
                     + r.get("employee_count", 0)
                     + r.get("user_count", 0))
            tally[s] = tally.get(s, 0) + count
        else:
            tally[s] = tally.get(s, 0) + 1

    total = sum(tally.values())
    print("\n" + "=" * 55)
    print(f"  SCAN COMPLETE — {total} total hits")
    print("=" * 55)
    labels = {
        "hudson_rock": "Hudson Rock (creds)",
        "sourcegraph":  "Sourcegraph (files)",
        "intelx":       "IntelX (records)",
    }
    for src, count in tally.items():
        label = labels.get(src, src)
        print(f"  {label:<26} {count}")
    print(f"\n  Results saved -> {OUTPUT_FILE}")
    print("=" * 55 + "\n")


if __name__ == "__main__":
    print(f"\n  Breach Monitor v2 · {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"  Scanning {len(SCAN_KEYWORDS)} keywords across 3 sources\n")

    results = run_full_scan(SCAN_KEYWORDS)
    summary(results)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

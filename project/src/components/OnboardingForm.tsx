import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronDown, Lock, Zap, Globe, Radio, Mail, Settings, DollarSign } from 'lucide-react';

function TagInput({ tags, onChange, placeholder }: { tags: string[]; onChange: (t: string[]) => void; placeholder: string }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput('');
  };
  return (
    <div className="min-h-[40px] flex flex-wrap gap-1.5 items-center border border-border rounded-lg px-3 py-2 bg-bg-base focus-within:border-border-hover transition-colors">
      {tags.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 font-mono-data text-[11px] bg-accent-blue/10 border border-accent-blue/20 text-accent-blue px-2 py-0.5 rounded">
          {t}
          <button onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-danger transition-colors"><X size={9} /></button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[100px] bg-transparent text-[12px] text-text-primary placeholder:text-text-muted/40 outline-none font-dm"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
        onBlur={add}
      />
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block font-dm text-[12px] font-medium text-text-primary mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 font-dm text-[10px] text-text-muted">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, optional }: { value: string; onChange: (v: string) => void; placeholder?: string; optional?: boolean }) {
  return (
    <input
      className="w-full bg-bg-base border border-border rounded-lg px-3 py-2.5 text-[12px] text-text-primary placeholder:text-text-muted/40 font-dm outline-none focus:border-border-hover transition-colors"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`${placeholder || ''}${optional ? ' (optional)' : ''}`}
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        className="w-full appearance-none bg-bg-base border border-border rounded-lg px-3 py-2.5 text-[12px] text-text-primary font-dm outline-none focus:border-border-hover transition-colors pr-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
    </div>
  );
}

function ChipSelect({ options, selected, onChange, multi }: { options: string[]; selected: string[]; onChange: (v: string[]) => void; multi?: boolean }) {
  const toggle = (o: string) => {
    if (multi) onChange(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o]);
    else onChange([o]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => toggle(o)}
          className={`font-dm text-[11px] px-3 py-1.5 rounded-lg border transition-all duration-150 ${
            selected.includes(o)
              ? 'bg-accent-blue/15 border-accent-blue/50 text-accent-blue'
              : 'bg-bg-base border-border text-text-muted hover:border-border-hover hover:text-text-primary'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

const STEPS = [
  { label: 'Identity', icon: Globe },
  { label: 'Domains', icon: Radio },
  { label: 'Emails', icon: Mail },
  { label: 'Assets', icon: Settings },
  { label: 'Finance', icon: DollarSign },
];

const INDUSTRIES = ['Healthcare', 'Finance & Banking', 'IT & SaaS', 'Education', 'Government', 'Legal', 'E-commerce', 'Manufacturing', 'Other'];
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Germany', 'Singapore', 'Canada', 'Australia', 'UAE', 'Other'];
const CLOUD = ['AWS', 'GCP', 'Azure', 'DigitalOcean', 'Cloudflare', 'Oracle', 'Other'];
const SENSITIVITY = ['Low', 'Medium', 'High', 'Critical Only'];
const SCAN_FREQ = ['Real-time', 'Hourly', 'Daily', 'Weekly'];
const NOTIF = ['Email', 'Slack', 'Webhook', 'SMS', 'PagerDuty'];

type FD = {
  orgName: string; brandNames: string[]; industry: string; country: string;
  primaryDomain: string; additionalDomains: string[]; ipRanges: string; cloudProviders: string[]; githubUrl: string;
  emailDomains: string[]; execEmails: string[]; adminEmailPatterns: string; notifEmail: string;
  apiKeyFormats: string; awsAccountId: string; paymentGatewayIds: string; internalTools: string[]; npmOrgNames: string; sslFingerprints: string;
  gstNumber: string; panNumber: string; cinNumber: string; dunsNumber: string; npi: string; ifscCodes: string;
  alertSensitivity: string[]; scanFrequency: string[]; notificationMethods: string[]; webhookUrl: string;
};

const init: FD = {
  orgName: '', brandNames: [], industry: '', country: '',
  primaryDomain: '', additionalDomains: [], ipRanges: '', cloudProviders: [], githubUrl: '',
  emailDomains: [], execEmails: [], adminEmailPatterns: '', notifEmail: '',
  apiKeyFormats: '', awsAccountId: '', paymentGatewayIds: '', internalTools: [], npmOrgNames: '', sslFingerprints: '',
  gstNumber: '', panNumber: '', cinNumber: '', dunsNumber: '', npi: '', ifscCodes: '',
  alertSensitivity: ['High'], scanFrequency: ['Real-time'], notificationMethods: ['Email'], webhookUrl: '',
};

function AttackSurfacePreview({ data }: { data: FD }) {
  const items: { icon: string; label: string; show: boolean }[] = [
    { icon: '📡', label: `Monitoring: ${data.primaryDomain || 'your domain'}`, show: !!data.primaryDomain },
    { icon: '🌐', label: `Subdomains: +${data.additionalDomains.length} additional`, show: data.additionalDomains.length > 0 },
    { icon: '📧', label: `Email patterns: ${Math.max(data.emailDomains.length, data.execEmails.length)} watchlists`, show: data.emailDomains.length > 0 || data.execEmails.length > 0 },
    { icon: '☁️', label: `Cloud assets: ${data.cloudProviders.join(', ')}`, show: data.cloudProviders.length > 0 },
    { icon: '🔑', label: `API patterns: ${data.apiKeyFormats ? 'tracked' : '—'}`, show: !!data.apiKeyFormats },
    { icon: '💳', label: `Financial IDs: ${[data.gstNumber && 'GST', data.panNumber && 'PAN'].filter(Boolean).join(', ')}`, show: !!(data.gstNumber || data.panNumber) },
    { icon: '🏢', label: 'GitHub org: tracked', show: !!data.githubUrl },
    { icon: '⚙️', label: `Compliance IDs: ${[data.gstNumber && 'GST', data.panNumber && 'PAN', data.cinNumber && 'CIN'].filter(Boolean).length} active`, show: !!(data.gstNumber || data.panNumber || data.cinNumber) },
  ];

  const count = items.filter((i) => i.show).length;
  const pct = Math.min(count * 12.5, 100);
  const level = count <= 2 ? 'MINIMAL' : count <= 4 ? 'MODERATE' : count <= 6 ? 'LARGE' : 'CRITICAL SURFACE';
  const levelColor = count <= 2 ? 'text-success' : count <= 4 ? 'text-accent-amber' : 'text-danger';

  return (
    <div className="glass-card rounded-[10px] p-5 border border-border sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sora text-[13px] font-semibold text-text-primary">Attack Surface Preview</h3>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue" />
        </span>
      </div>

      <div className="space-y-2 mb-5 min-h-[100px]">
        {items.filter((i) => i.show).length === 0 ? (
          <p className="font-dm text-[11px] text-text-muted italic">Fill in your details to see your attack surface...</p>
        ) : (
          <AnimatePresence>
            {items.filter((i) => i.show).map((item) => (
              <motion.div key={item.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 font-dm text-[11px] text-text-secondary">
                <span className="text-[12px]">{item.icon}</span>
                <span>{item.label}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono-data text-[9px] text-text-muted uppercase tracking-wider">Estimated Exposure Surface</span>
          <span className={`font-mono-data text-[11px] font-bold ${levelColor}`}>{level}</span>
        </div>
        <div className="w-full h-2 bg-bg-base rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
            style={{
              background: count <= 2 ? '#10B981' : count <= 4 ? '#F59E0B' : '#EF4444',
            }}
          />
        </div>
      </div>

      {/* Auto-enrichment */}
      <div className="mt-5 border-l-2 border-accent-blue/40 bg-accent-blue/[0.04] rounded-r-lg p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Zap size={10} className="text-accent-blue" />
          <span className="font-sora text-[10px] font-semibold text-accent-blue">Auto-Enrichment Active</span>
        </div>
        <p className="font-dm text-[10px] text-text-muted leading-relaxed mb-1.5">After submission, LEAKSHIELD auto-discovers:</p>
        <ul className="space-y-0.5">
          {[
            'All subdomains via crt.sh SSL transparency logs',
            'Exposed emails via OSINT enrichment engines',
            'Public GitHub repos linked to your org',
            'Open ports via Shodan passive recon',
            'Historical records from 15+ breach databases',
          ].map((item) => (
            <li key={item} className="font-dm text-[10px] text-text-muted flex items-start gap-1">
              <span className="text-accent-blue mt-px">·</span>{item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Step1({ d, u }: { d: FD; u: (k: keyof FD, v: unknown) => void }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2"><Field label="Company / Organization Name"><TextInput value={d.orgName} onChange={(v) => u('orgName', v)} placeholder="Acme Corp" /></Field></div>
      <div className="sm:col-span-2"><Field label="Brand Names or Aliases" hint="Press Enter after each alias"><TagInput tags={d.brandNames} onChange={(v) => u('brandNames', v)} placeholder="Add a brand name..." /></Field></div>
      <Field label="Industry"><Select value={d.industry} onChange={(v) => u('industry', v)} options={INDUSTRIES} /></Field>
      <Field label="Country of Operation"><Select value={d.country} onChange={(v) => u('country', v)} options={COUNTRIES} /></Field>
    </div>
  );
}

function Step2({ d, u }: { d: FD; u: (k: keyof FD, v: unknown) => void }) {
  const validDomain = /^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/.test(d.primaryDomain);
  return (
    <div className="space-y-4">
      <Field label="Primary Domain">
        <div className="relative">
          <TextInput value={d.primaryDomain} onChange={(v) => u('primaryDomain', v)} placeholder="company.com" />
          {validDomain && <Check size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-success" />}
        </div>
      </Field>
      <Field label="Additional Domains / Subdomains" hint="Press Enter to add each domain">
        <TagInput tags={d.additionalDomains} onChange={(v) => u('additionalDomains', v)} placeholder="api.company.com" />
      </Field>
      <Field label="Known IP Ranges"><TextInput value={d.ipRanges} onChange={(v) => u('ipRanges', v)} placeholder="192.168.0.0/24" optional /></Field>
      <Field label="Cloud Provider"><ChipSelect options={CLOUD} selected={d.cloudProviders} onChange={(v) => u('cloudProviders', v)} multi /></Field>
      <Field label="GitHub Organization URL"><TextInput value={d.githubUrl} onChange={(v) => u('githubUrl', v)} placeholder="https://github.com/acme-corp" optional /></Field>
    </div>
  );
}

function Step3({ d, u }: { d: FD; u: (k: keyof FD, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-accent-amber/[0.06] border-l-2 border-accent-amber rounded-r-lg p-3">
        <span className="text-accent-amber text-[13px] mt-0.5">📌</span>
        <p className="font-dm text-[11px] text-text-secondary leading-relaxed">
          Email identifiers are the <span className="text-accent-amber font-medium">#1 most leaked asset</span> on dark web marketplaces.
        </p>
      </div>
      <Field label="Email Domain(s)" hint="Press Enter to add each domain"><TagInput tags={d.emailDomains} onChange={(v) => u('emailDomains', v)} placeholder="@company.com" /></Field>
      <Field label="Executive / Critical Emails to Monitor" hint="Add C-suite, board members, key department heads"><TagInput tags={d.execEmails} onChange={(v) => u('execEmails', v)} placeholder="ceo@company.com" /></Field>
      <Field label="Admin / IT Email Patterns" hint="Comma-separated prefix patterns"><TextInput value={d.adminEmailPatterns} onChange={(v) => u('adminEmailPatterns', v)} placeholder="admin@, it@, devops@, noreply@" optional /></Field>
      <Field label="Notification Email for Alerts" hint="Where LEAKSHIELD will send critical threat alerts"><TextInput value={d.notifEmail} onChange={(v) => u('notifEmail', v)} placeholder="security@company.com" /></Field>
    </div>
  );
}

function Step4({ d, u }: { d: FD; u: (k: keyof FD, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <Field label="API Key Format / Prefix" hint="We match these patterns, not the actual keys"><TextInput value={d.apiKeyFormats} onChange={(v) => u('apiKeyFormats', v)} placeholder="sk-xxxx, pk_live_xxxx" optional /></Field>
      <Field label="AWS Account ID"><TextInput value={d.awsAccountId} onChange={(v) => u('awsAccountId', v)} placeholder="1234-5678-9012" optional /></Field>
      <Field label="Payment Gateway IDs"><TextInput value={d.paymentGatewayIds} onChange={(v) => u('paymentGatewayIds', v)} placeholder="Razorpay MID, Stripe Account ID" optional /></Field>
      <Field label="Internal Tool / Portal Names" hint="Named internal tools that may be referenced in leak posts"><TagInput tags={d.internalTools} onChange={(v) => u('internalTools', v)} placeholder="Jira, Confluence, HR portal" /></Field>
      <Field label="Source Code / NPM Org Names"><TextInput value={d.npmOrgNames} onChange={(v) => u('npmOrgNames', v)} placeholder="@acme-corp, acme-internal" optional /></Field>
      <Field label="SSL Certificate Fingerprints"><TextInput value={d.sslFingerprints} onChange={(v) => u('sslFingerprints', v)} placeholder="SHA256:xxxx" optional /></Field>
    </div>
  );
}

function Step5({ d, u }: { d: FD; u: (k: keyof FD, v: unknown) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-accent-blue/[0.04] border-l-2 border-accent-blue/40 rounded-r-lg p-3">
        <span className="text-accent-blue text-[13px] mt-0.5">🔒</span>
        <p className="font-dm text-[11px] text-text-secondary leading-relaxed">
          These identifiers help detect targeted financial fraud and regulatory data exposure on dark web markets.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="GST Number (India)"><TextInput value={d.gstNumber} onChange={(v) => u('gstNumber', v)} placeholder="27AABCU9603R1ZX" optional /></Field>
        <Field label="PAN Number (India)"><TextInput value={d.panNumber} onChange={(v) => u('panNumber', v)} placeholder="AABCU9603R" optional /></Field>
        <Field label="CIN Number"><TextInput value={d.cinNumber} onChange={(v) => u('cinNumber', v)} placeholder="U74999MH2020PTC123456" optional /></Field>
        <Field label="DUNS Number (Global)"><TextInput value={d.dunsNumber} onChange={(v) => u('dunsNumber', v)} placeholder="12-345-6789" optional /></Field>
        <Field label="Healthcare NPI"><TextInput value={d.npi} onChange={(v) => u('npi', v)} placeholder="1234567890" optional /></Field>
        <Field label="Banking / IFSC Codes"><TextInput value={d.ifscCodes} onChange={(v) => u('ifscCodes', v)} placeholder="HDFC0001234" optional /></Field>
      </div>
    </div>
  );
}

function ScanPreferences({ d, u }: { d: FD; u: (k: keyof FD, v: unknown) => void }) {
  return (
    <div className="mt-8 border-t border-border pt-8 space-y-5">
      <h3 className="font-sora text-[13px] font-semibold text-text-primary">Scan Preferences</h3>
      <Field label="Alert Sensitivity"><ChipSelect options={SENSITIVITY} selected={d.alertSensitivity} onChange={(v) => u('alertSensitivity', v)} /></Field>
      <Field label="Scan Frequency"><ChipSelect options={SCAN_FREQ} selected={d.scanFrequency} onChange={(v) => u('scanFrequency', v)} /></Field>
      <Field label="Notification Channels"><ChipSelect options={NOTIF} selected={d.notificationMethods} onChange={(v) => u('notificationMethods', v)} multi /></Field>
      {(d.notificationMethods.includes('Webhook') || d.notificationMethods.includes('PagerDuty')) && (
        <Field label="Webhook URL"><TextInput value={d.webhookUrl} onChange={(v) => u('webhookUrl', v)} placeholder="https://hooks.slack.com/..." optional /></Field>
      )}
    </div>
  );
}

export default function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FD>(init);
  const [submitted, setSubmitted] = useState(false);

  const update = useCallback((k: keyof FD, v: unknown) => setData((d) => ({ ...d, [k]: v })), []);

  const panels = [
    <Step1 key="s1" d={data} u={update} />,
    <Step2 key="s2" d={data} u={update} />,
    <Step3 key="s3" d={data} u={update} />,
    <Step4 key="s4" d={data} u={update} />,
    <Step5 key="s5" d={data} u={update} />,
  ];

  const isLast = step === STEPS.length - 1;

  if (submitted) {
    return (
      <section id="threat-scan" className="py-24">
        <div className="max-w-xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-[10px] p-12">
            <div className="w-16 h-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-6">
              <Check size={28} className="text-success" />
            </div>
            <h2 className="font-sora text-2xl font-bold text-text-primary mb-3">Scan Initiated</h2>
            <p className="font-dm text-text-secondary mb-6">Your threat scan is now active. We'll notify you the moment any of your assets surface on the dark web.</p>
            <button onClick={() => { setSubmitted(false); setStep(0); setData(init); }} className="font-dm text-sm text-accent-blue hover:underline">Start a new scan</button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="threat-scan" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="font-mono-data text-[11px] text-accent-blue uppercase tracking-[0.2em] mb-3">Onboarding</p>
          <h2 className="font-sora text-[36px] lg:text-[44px] font-bold text-text-primary mb-3 leading-tight">Tell Us What To Protect</h2>
          <p className="font-dm text-text-secondary max-w-[480px]">LEAKSHIELD maps your entire digital footprint from minimal inputs — then auto-discovers the rest.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          <div>
            {/* Step indicator */}
            <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const active = i === step;
                return (
                  <div key={i} className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => i < step && setStep(i)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-dm transition-all duration-200 ${
                        active ? 'bg-accent-blue/15 border border-accent-blue/40 text-accent-blue' : done ? 'bg-success/10 border border-success/20 text-success cursor-pointer hover:bg-success/15' : 'border border-border text-text-muted'
                      }`}
                    >
                      {done ? <Check size={10} /> : <Icon size={10} />}
                      {s.label}
                    </button>
                    {i < STEPS.length - 1 && <div className="w-4 h-px bg-border flex-shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Form card */}
            <div className="glass-card rounded-[10px] p-6 border border-border">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                  <h3 className="font-sora text-[14px] font-semibold text-text-primary mb-5">Step {step + 1}: {STEPS[step].label}</h3>
                  {panels[step]}
                  {isLast && <ScanPreferences d={data} u={update} />}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <button onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0} className="font-dm text-[12px] text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors">← Back</button>
                {isLast ? (
                  <button onClick={() => setSubmitted(true)} className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white font-dm font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-glow-blue hover:scale-[1.01] text-[13px] w-full ml-8">
                    <Zap size={14} /> Launch Threat Scan
                  </button>
                ) : (
                  <button onClick={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))} className="bg-accent-blue hover:bg-accent-blue/90 text-white font-dm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 text-[12px] hover:shadow-glow-blue">Continue →</button>
                )}
              </div>
            </div>

            {isLast && (
              <p className="mt-4 flex items-center gap-2 font-dm text-[11px] text-text-muted">
                <Lock size={11} /> Encrypted in transit · Never stored post-scan · GDPR & DPDP Act compliant · SOC 2 Ready
              </p>
            )}
          </div>

          <AttackSurfacePreview data={data} />
        </div>
      </div>
    </section>
  );
}

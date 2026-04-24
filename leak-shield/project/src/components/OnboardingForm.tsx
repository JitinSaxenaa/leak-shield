import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Zap, Globe, Server, Building2, Mail } from 'lucide-react';

function TagInput({ tags, onChange, placeholder, pillStyle }: { tags: string[]; onChange: (t: string[]) => void; placeholder: string; pillStyle: 'blue' | 'indigo' }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput('');
  };
  
  const tagBg = pillStyle === 'blue' ? 'rgba(14,165,233,0.12)' : 'rgba(99,102,241,0.12)';
  const tagBorder = pillStyle === 'blue' ? 'rgba(14,165,233,0.3)' : 'rgba(99,102,241,0.3)';
  const tagColor = pillStyle === 'blue' ? '#0EA5E9' : '#6366F1';

  return (
    <div className="min-h-[48px] flex flex-wrap gap-1.5 items-center bg-bg-surface border border-border rounded-[8px] px-3 py-2 focus-within:ring-2 focus-within:ring-accent-blue/40 transition-shadow">
      {tags.map((t) => (
        <span 
          key={t} 
          className="inline-flex items-center gap-1 font-mono-data text-[12px] rounded-[4px] px-[8px] py-[3px]"
          style={{ background: tagBg, border: `1px solid ${tagBorder}`, color: tagColor }}
        >
          {t}
          <button onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:opacity-70 transition-opacity ml-1"><X size={12} /></button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[120px] bg-transparent text-[14px] text-text-primary placeholder:text-text-muted/40 outline-none font-dm"
        placeholder={tags.length === 0 ? placeholder : ""}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
        onBlur={add}
      />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-mono-data text-[11px] uppercase tracking-wider text-accent-blue mb-2">
      {children}
    </label>
  );
}

function IconInput({ value, onChange, placeholder, icon: Icon }: { value: string; onChange: (v: string) => void; placeholder: string; icon: any }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-blue">
        <Icon size={18} />
      </div>
      <input
        className="w-full bg-bg-surface border border-border rounded-[8px] h-[48px] text-[14px] text-text-primary placeholder:text-text-muted/40 outline-none focus:ring-2 focus:ring-accent-blue/40 transition-shadow pl-[40px] pr-3 font-dm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

type FD = {
  orgName: string;
  contactEmail: string;
  websiteName: string;
  ipAddress: string;
  emailDomains: string[];
  keywords: string[];
};

const init: FD = {
  orgName: '',
  contactEmail: '',
  websiteName: '',
  ipAddress: '',
  emailDomains: [],
  keywords: [],
};

function AttackSurfacePreview({ data }: { data: FD }) {
  const items: { icon: string; label: string; show: boolean }[] = [
    { icon: '🏢', label: `Org: ${data.orgName || 'pending'}`, show: !!data.orgName },
    { icon: '📡', label: `Domain: ${data.websiteName || 'pending'}`, show: !!data.websiteName },
    { icon: '🌐', label: `IP Range: ${data.ipAddress}`, show: !!data.ipAddress },
    { icon: '📧', label: `Email domains: ${data.emailDomains.length} active`, show: data.emailDomains.length > 0 },
    { icon: '🔑', label: `Keywords: ${data.keywords.length} active`, show: data.keywords.length > 0 },
  ];

  const count = items.filter((i) => i.show).length;
  const pct = Math.min(count * 20, 100);
  const level = count === 0 ? 'MINIMAL' : count <= 2 ? 'MODERATE' : count <= 4 ? 'LARGE' : 'CRITICAL SURFACE';
  const levelColor = count === 0 ? 'text-success' : count <= 2 ? 'text-accent-amber' : 'text-danger';

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
          <p className="font-dm text-[11px] text-text-muted italic">Awaiting telemetry data...</p>
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
              background: count <= 1 ? '#10B981' : count <= 3 ? '#F59E0B' : '#EF4444',
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
        <p className="font-dm text-[10px] text-text-secondary leading-relaxed mb-1.5">After submission, LEAKSHIELD auto-discovers:</p>
        <ul className="space-y-0.5">
          {[
            'Subdomains via crt.sh SSL logs',
            'Exposed credentials on dark web markets',
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

export default function OnboardingForm() {
  const [data, setData] = useState<FD>(init);
  const [submitted, setSubmitted] = useState(false);

  const update = useCallback((k: keyof FD, v: unknown) => setData((d) => ({ ...d, [k]: v })), []);

  if (submitted) {
    return (
      <section id="threat-scan" className="py-24">
        <div className="max-w-xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-[10px] p-12 border border-border">
            <div className="w-16 h-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-6">
              <Check size={28} className="text-success" />
            </div>
            <h2 className="font-sora text-2xl font-bold text-text-primary mb-3">Scan Initiated</h2>
            <p className="font-dm text-text-secondary mb-6">Your threat scan is now active. We'll notify you the moment any of your assets surface on the dark web.</p>
            <button onClick={() => { setSubmitted(false); setData(init); }} className="font-mono-data text-sm text-accent-blue hover:underline">Start a new scan</button>
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
          <div 
            className="glass-card p-6 md:p-8" 
            style={{ borderRadius: '12px' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <FieldLabel>ORGANISATION NAME</FieldLabel>
                <IconInput 
                  value={data.orgName} 
                  onChange={(v) => update('orgName', v)} 
                  placeholder="Acme Corp" 
                  icon={Building2} 
                />
              </div>

              <div>
                <FieldLabel>CONTACT EMAIL</FieldLabel>
                <IconInput 
                  value={data.contactEmail} 
                  onChange={(v) => update('contactEmail', v)} 
                  placeholder="security@acmecorp.com" 
                  icon={Mail} 
                />
              </div>

              <div>
                <FieldLabel>WEBSITE / DOMAIN</FieldLabel>
                <IconInput 
                  value={data.websiteName} 
                  onChange={(v) => update('websiteName', v)} 
                  placeholder="acmecorp.com" 
                  icon={Globe} 
                />
              </div>
              
              <div>
                <FieldLabel>IP ADDRESS / RANGE</FieldLabel>
                <IconInput 
                  value={data.ipAddress} 
                  onChange={(v) => update('ipAddress', v)} 
                  placeholder="192.168.1.1 or 10.0.0.0/24" 
                  icon={Server} 
                />
              </div>

              <div>
                <FieldLabel>EMAIL DOMAINS</FieldLabel>
                <TagInput 
                  tags={data.emailDomains} 
                  onChange={(v) => update('emailDomains', v)} 
                  placeholder="domain.com + Enter" 
                  pillStyle="blue"
                />
              </div>

              <div>
                <FieldLabel>KEYWORDS TO MONITOR</FieldLabel>
                <TagInput 
                  tags={data.keywords} 
                  onChange={(v) => update('keywords', v)} 
                  placeholder="brand alias + Enter"
                  pillStyle="indigo"
                />
              </div>
            </div>

            <button 
              onClick={() => setSubmitted(true)} 
              className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white font-bold h-[52px] rounded-[8px] transition-all flex items-center justify-center gap-2 hover:shadow-glow-blue"
            >
              Start Monitoring →
            </button>
          </div>

          <AttackSurfacePreview data={data} />
        </div>
      </div>
    </section>
  );
}

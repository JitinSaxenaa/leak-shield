import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Zap, Check } from 'lucide-react';
import Logo from './Logo';

type TerminalLine = {
  text: string;
  color: string;
  bold?: boolean;
  indent?: boolean;
  divider?: boolean;
  delay?: number;
};

const TERMINAL_LINES: TerminalLine[] = [
  { text: '$ initializing crawler network...', color: '#94A3B8' },
  { text: '✓ Tor circuit established [3 hops]', color: '#10B981', delay: 80 },
  { text: '✓ Watchlist loaded: 847 identifiers', color: '#10B981' },
  { text: '✓ Connected to threat intelligence feeds', color: '#10B981' },
  { text: '', color: '', divider: false },
  { text: '~ scanning: breachforums.st', color: '#0EA5E9' },
  { text: '~ scanning: dread.onion', color: '#0EA5E9' },
  { text: '~ scanning: raidforums.mirror.onion', color: '#0EA5E9' },
  { text: '', color: '', divider: false },
  { text: '⚠ ANOMALY DETECTED', color: '#F59E0B', bold: true },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', color: '#F59E0B', divider: true },
  { text: 'Platform  : BreachForums [Tier-1]', color: '#94A3B8', indent: true },
  { text: 'Match     : hr@target-company.com', color: '#94A3B8', indent: true },
  { text: 'Data type : Credential dump (hash+plain)', color: '#94A3B8', indent: true },
  { text: 'Volume    : 4,821 records', color: '#94A3B8', indent: true },
  { text: 'Risk score: 91/100', color: '#EF4444', indent: true, bold: true },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', color: '#F59E0B', divider: true },
  { text: '→ Notifying security team...', color: '#94A3B8' },
  { text: '→ Creating incident ticket...', color: '#94A3B8' },
  { text: '→ Flagging threat actor: PGP:A3F9...', color: '#94A3B8' },
];

function TerminalCard() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= TERMINAL_LINES.length) {
      const reset = setTimeout(() => setVisibleCount(0), 2500);
      return () => clearTimeout(reset);
    }
    const timer = setTimeout(() => setVisibleCount((v) => v + 1), 580);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  const [cpu, setCpu] = useState(23);
  const [mem, setMem] = useState(1.2);

  useEffect(() => {
    const i = setInterval(() => {
      setCpu(20 + Math.floor(Math.random() * 12));
      setMem(+(1.1 + Math.random() * 0.3).toFixed(1));
    }, 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="glass-card rounded-[10px] overflow-hidden w-full max-w-[520px] mx-auto lg:mx-0 shadow-float">
      {/* Chrome bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-bg-card border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-[6px] h-[6px] rounded-full bg-danger" />
          <div className="w-[6px] h-[6px] rounded-full bg-accent-blue" />
          <div className="w-[6px] h-[6px] rounded-full bg-success" />
        </div>
        <span className="font-mono-data text-[11px] text-text-muted">leakshield-monitor v2.4.1</span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-[6px] w-[6px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
            <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-success" />
          </span>
          <span className="font-mono-data text-[10px] text-success">LIVE</span>
        </div>
      </div>

      {/* Terminal body */}
      <div className="p-5 min-h-[300px] font-mono-data text-[12px] space-y-[3px]" style={{ background: '#04080F' }}>
        {TERMINAL_LINES.slice(0, visibleCount).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className={`leading-relaxed ${line.indent ? 'pl-4' : ''} ${line.divider ? 'select-none' : ''}`}
            style={{
              color: line.color,
              fontWeight: line.bold ? 600 : 400,
            }}
          >
            {line.text}
          </motion.div>
        ))}

        {visibleCount < TERMINAL_LINES.length && (
          <span className="inline-block w-[7px] h-[14px] bg-accent-blue animate-blink" style={{ marginTop: '1px' }} />
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border font-mono-data text-[9px] text-text-muted" style={{ background: '#060B14' }}>
        <span>CPU {cpu}%</span>
        <span>MEM {mem}GB</span>
        <span>THREATS TODAY: 47</span>
        <span>UPTIME: 99.97%</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const words1 = 'Your Data Is Already'.split(' ');
  const words2 = 'On The Dark Web.'.split(' ');

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden noise-overlay">
      {/* Background layers */}
      <div className="absolute inset-0 radar-bg z-0" />
      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 25% 50%, rgba(14,165,233,0.06) 0%, transparent 60%)' }} />

      {/* Large rotating hex watermark */}
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 z-0">
        <Logo size="watermark" className="animate-hex-spin" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-accent-blue/25"
            style={{ left: `${8 + i * 15}%`, top: `${15 + (i % 4) * 20}%` }}
            animate={{ y: [0, -12, 0], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-28">
        <div className="grid lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div>
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 bg-bg-card border-l-[3px] border-danger px-4 py-2.5 rounded-r-lg mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-danger" />
              </span>
              <span className="font-mono-data text-[11px] text-text-primary">
                LIVE &nbsp;—&nbsp;
                <span className="text-text-secondary">Real-time monitoring · 10,247 Tor sites active</span>
              </span>
            </motion.div>

            {/* Headline with staggered word animation */}
            <h1 className="font-sora font-extrabold text-[40px] sm:text-[52px] lg:text-[64px] text-text-primary leading-[1.1] tracking-tight mb-6">
              <span className="block">
                {words1.map((word, i) => (
                  <motion.span
                    key={`w1-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                    className="inline-block mr-[0.3em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block">
                {words2.map((word, i) => (
                  <motion.span
                    key={`w2-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                    className="inline-block mr-[0.3em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                className="block text-accent-blue"
              >
                Do You Know?
              </motion.span>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="font-dm text-[18px] text-text-secondary leading-relaxed mb-8 max-w-[480px]"
            >
              LEAKSHIELD monitors Tor networks, hacker forums, and breach marketplaces 24/7 — alerting your team the moment your domains, credentials, or data surfaces.{' '}
              <span className="text-text-primary font-medium">Before the world finds out.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              <a
                href="#threat-scan"
                className="inline-flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white font-dm font-medium px-6 py-3.5 rounded-lg transition-all duration-200 hover:shadow-glow-blue hover:scale-[1.02] text-sm"
              >
                Scan My Organization
                <ArrowRight size={15} />
              </a>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="flex items-center gap-3 font-dm text-xs text-text-muted"
            >
              <span className="flex items-center gap-1"><Lock size={11} /> No credit card</span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1"><Zap size={11} /> 2-min setup</span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1"><Check size={11} /> GDPR + DPDP Compliant</span>
            </motion.div>
          </div>

          {/* Right — Terminal card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-2xl pointer-events-none" style={{ background: 'rgba(14,165,233,0.06)', filter: 'blur(30px)' }} />
            <TerminalCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

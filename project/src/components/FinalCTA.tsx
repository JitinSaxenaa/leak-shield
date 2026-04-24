import { motion } from 'framer-motion';
import { ArrowRight, Lock, Check } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative py-28 overflow-hidden border-t border-border">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(14,165,233,0.06) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="font-mono-data text-[11px] text-accent-blue uppercase tracking-[0.2em] mb-6">Act Now</p>

          <h2 className="font-sora text-[40px] lg:text-[52px] font-extrabold text-text-primary mb-5 leading-tight">
            Your Breach Clock
            <br />
            <span className="text-accent-blue">Is Already Ticking.</span>
          </h2>

          <p className="font-dm text-[16px] text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
            The average organization takes <span className="text-text-primary font-medium">194 days</span> to detect a breach.
            LEAKSHIELD cuts that to minutes.
          </p>

          <div className="relative inline-block">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-lg animate-pulse-ring pointer-events-none" style={{ boxShadow: '0 0 0 0 rgba(14,165,233,0.4)' }} />
            <a
              href="#threat-scan"
              className="relative inline-flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white font-dm font-semibold px-8 py-4 rounded-lg transition-all duration-200 hover:shadow-glow-blue text-[15px]"
            >
              Scan My Organization — Free
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 font-dm text-[12px] text-text-muted">
            <span className="flex items-center gap-1"><Lock size={11} /> No credit card</span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1"><Check size={11} /> GDPR Compliant</span>
            <span className="text-border">·</span>
            <span>Setup in 2 minutes</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

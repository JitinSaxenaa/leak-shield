import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How does LEAKSHIELD access the dark web without exposing my org?',
    a: 'LEAKSHIELD uses isolated Tor circuits running on air-gapped crawler infrastructure. Your organization\'s identity is never used in the crawling process — we monitor passively and never interact with threat actors. All crawling is read-only and legally compliant.',
  },
  {
    q: 'Is my data safe with LEAKSHIELD?',
    a: 'Input data is encrypted AES-256 in transit and at rest, processed in isolated environments, and never retained beyond the scan session. We are GDPR and India DPDP Act compliant. SOC 2 Type II audit-ready with quarterly third-party security assessments.',
  },
  {
    q: 'How is this different from HaveIBeenPwned?',
    a: 'HIBP checks historical breaches after they\'re public. LEAKSHIELD monitors active dark web forums in real time — detecting threats weeks before public disclosure, with AI-powered contextual analysis, actor correlation, and risk scoring that HIBP does not provide.',
  },
  {
    q: 'What is PGP key correlation and why does it matter?',
    a: 'Threat actors use PGP keys as digital signatures across platforms. LEAKSHIELD collects and fingerprints these — so when the same attacker appears on three different forums, we connect the dots and track their activity history, giving you proactive intelligence on repeat offenders.',
  },
  {
    q: 'How quickly are alerts delivered?',
    a: 'Critical threats trigger alerts within 60-90 seconds of detection. Delivery via Email, Slack webhook, API, or SMS — based on your preferences. Critical severity alerts are always given priority processing and delivery.',
  },
  {
    q: 'Is LEAKSHIELD compliant with GDPR and India\'s DPDP Act?',
    a: 'Yes. LEAKSHIELD was built with privacy-by-design principles. Data minimization, purpose limitation, and right-to-erasure are all built into the core architecture. We maintain full compliance documentation available on request.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 border-t border-border" style={{ background: '#080F1C' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="font-mono-data text-[11px] text-accent-blue uppercase tracking-[0.2em] mb-3">FAQ</p>
          <h2 className="font-sora text-[36px] lg:text-[44px] font-bold text-text-primary">Common Questions</h2>
        </motion.div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="border border-border rounded-[10px] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-sora text-[13px] font-semibold text-text-primary pr-4">{faq.q}</span>
                <ChevronDown size={16} className={`text-text-muted flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-border pt-4">
                      <p className="font-dm text-[13px] text-text-secondary leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

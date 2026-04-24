import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    quote: 'LEAKSHIELD flagged our credentials on a dark web forum 19 days before we discovered it internally. That\'s 19 days of potential breach damage avoided — credentials were rotated, access revoked, and clients notified proactively.',
    name: 'Rohan M.',
    role: 'CISO, Series B FinTech',
    company: 'Bengaluru',
    initials: 'RM',
    color: 'bg-accent-blue/20 text-accent-blue',
  },
  {
    quote: 'The PGP actor correlation is genuinely unique. No other tool at this price point tracks repeat attackers across multiple platforms the way LEAKSHIELD does. We\'ve pre-emptively blocked two coordinated attack attempts using actor profiles.',
    name: 'Priya S.',
    role: 'Senior Security Analyst',
    company: 'International NGO',
    initials: 'PS',
    color: 'bg-success/15 text-success',
  },
  {
    quote: 'We went from reactive incident response to predictive threat intelligence. The dashboard alone justified the cost — our SOC team now has a real-time feed of relevant threats instead of noise from generic tools.',
    name: 'Anil K.',
    role: 'CTO',
    company: 'Healthcare SaaS Platform',
    initials: 'AK',
    color: 'bg-accent-blue/15 text-accent-blue',
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#0EA5E9">
          <path d="M6 0.5L7.545 4.29L11.5 4.635L8.695 7.085L9.545 11L6 8.86L2.455 11L3.305 7.085L0.5 4.635L4.455 4.29L6 0.5Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="font-mono-data text-[11px] text-accent-blue uppercase tracking-[0.2em] mb-3">From The Field</p>
          <h2 className="font-sora text-[36px] lg:text-[44px] font-bold text-text-primary">Trusted by Security Teams</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-card rounded-[10px] p-6 border border-border hover:border-accent-blue/30 hover:-translate-y-1 hover:shadow-glow-blue-sm transition-all duration-200 flex flex-col"
            >
              <Stars />
              <blockquote className="font-dm text-[14px] text-text-secondary leading-relaxed mt-4 flex-1">
                "{t.quote}"
              </blockquote>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                <div className={`w-9 h-9 rounded-lg ${t.color} flex items-center justify-center font-sora text-[11px] font-bold flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-sora text-[13px] font-semibold text-text-primary">{t.name}</div>
                  <div className="font-dm text-[11px] text-text-muted">{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

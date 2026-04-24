import { motion } from 'framer-motion';
import { Clock, DollarSign, Heart } from 'lucide-react';

const CARDS = [
  {
    icon: Clock,
    title: 'Detection Speed',
    body: 'LEAKSHIELD detects breaches an average of 3 weeks before public disclosure — turning months of hidden damage into minutes of response time.',
    visual: <DetectionBar />,
  },
  {
    icon: DollarSign,
    title: 'Financial Prevention',
    body: 'The average data breach costs $4.45M (IBM 2024). Detecting early prevents legal fines, regulatory penalties, and reputational collapse before escalation.',
    visual: null,
  },
  {
    icon: Heart,
    title: 'Accessibility',
    body: 'Enterprise-grade dark web intelligence — now accessible to hospitals, NGOs, legal firms, and funded startups. Not just Fortune 500 security teams.',
    visual: null,
  },
];

function DetectionBar() {
  return (
    <div className="space-y-2 mt-3">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-dm text-[10px] text-text-muted">Traditional: 194 days avg</span>
        </div>
        <div className="w-full h-2 bg-bg-base rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-danger/60 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-dm text-[10px] text-accent-blue">LEAKSHIELD: Minutes</span>
        </div>
        <div className="w-full h-2 bg-bg-base rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent-blue rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: '3%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Impact() {
  return (
    <section id="impact" className="py-24" style={{ background: '#080F1C' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="font-mono-data text-[11px] text-accent-blue uppercase tracking-[0.2em] mb-3">The Stakes</p>
          <h2 className="font-sora text-[36px] lg:text-[44px] font-bold text-text-primary">Why It Matters</h2>
        </motion.div>

        <div className="space-y-4">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative glass-card rounded-[10px] p-6 border border-border hover:border-border-hover transition-all duration-200 flex items-start gap-6 overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-blue rounded-l-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="w-12 h-12 rounded-lg bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-blue/15 transition-colors">
                  <Icon size={20} className="text-accent-blue" />
                </div>
                <div className="flex-1">
                  <h3 className="font-sora text-[16px] font-semibold text-text-primary mb-2">{card.title}</h3>
                  <p className="font-dm text-[13px] text-text-secondary leading-relaxed max-w-3xl">{card.body}</p>
                  {card.visual}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

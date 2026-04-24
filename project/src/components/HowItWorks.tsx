import { motion } from 'framer-motion';

const STAGES = [
  {
    step: '01',
    title: 'Dark Web Monitoring',
    desc: 'Bots crawl 10,000+ Tor onion sites, forums, dump sites in real time. Adaptive scraping handles constantly changing dark web structures.',
    tags: ['Tor Network', 'Onion Crawlers', 'Adaptive Scraper', 'Real-time'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2C8 6 6 9 6 12s2 6 6 10" />
        <path d="M12 2c4 4 6 7 6 10s-2 6-6 10" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'AI Threat Detection',
    desc: 'BERT semantic embeddings detect indirect mentions, obfuscated language, and hacker slang. Pattern recognition surfaces leaks that keyword tools miss.',
    tags: ['BERT NLP', 'Semantic Search', 'Slang Analyzer', 'Pattern Recognition'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><circle cx="12" cy="16" r="3" />
        <line x1="8" y1="11" x2="12" y2="13" /><line x1="16" y1="11" x2="12" y2="13" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Threat Actor Correlation',
    desc: 'PGP key fingerprinting tracks attackers across multiple platforms. Cross-platform identity graphs expose coordinated and repeat attacks.',
    tags: ['PGP Fingerprint', 'Identity Graph', 'Cross-platform', 'Repeat Actors'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54A5 5 0 0 0 14 8" />
        <path d="M6 9a5 5 0 0 1 7.54-.54" />
        <circle cx="7" cy="7" r="2" /><circle cx="17" cy="17" r="2" />
        <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Risk Scoring & Alerts',
    desc: 'Dynamic scoring by severity, frequency, and source credibility. Critical threats go to your team instantly. Noise goes to logs only.',
    tags: ['Risk Model', 'Instant Alerts', 'API Webhook', 'Slack / Email'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
];

function DashedArrow() {
  return (
    <div className="hidden lg:flex items-center justify-center w-10 flex-shrink-0 mt-10">
      <svg width="40" height="2" className="overflow-visible">
        <line x1="0" y1="1" x2="40" y2="1" stroke="#0EA5E9" strokeWidth="1.5" className="dashed-arrow" opacity="0.5" />
        <polygon points="36,-2 40,1 36,5" fill="#0EA5E9" opacity="0.5" />
      </svg>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="pipeline" className="py-24" style={{ background: '#04080F' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="font-mono-data text-[11px] text-accent-blue uppercase tracking-[0.2em] mb-3">
            HOW IT WORKS
          </p>
          <h2 className="font-sora text-[36px] lg:text-[44px] font-bold text-text-primary mb-3 leading-tight">
            Four Autonomous Layers
          </h2>
          <p className="font-dm text-text-secondary max-w-[480px]">
            From dark web crawl to actionable alert — in under 4 minutes.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-0">
          {STAGES.map((stage, i) => (
            <div key={i} className="flex flex-col lg:flex-row items-start lg:flex-1">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-bg-card border border-border rounded-[10px] p-5 hover:bg-bg-surface hover:border-l-[3px] hover:border-l-accent-blue hover:-translate-y-1 hover:shadow-glow-blue-sm transition-all duration-200 cursor-default flex-1 w-full overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center group-hover:bg-accent-blue/15 transition-colors">
                    {stage.icon}
                  </div>
                  <span className="font-mono-data text-[11px] text-text-muted/40 font-semibold">{stage.step}</span>
                </div>

                <h3 className="font-sora text-[14px] font-semibold text-text-primary mb-2 leading-snug">
                  {stage.title}
                </h3>
                <p className="font-dm text-[12px] text-text-secondary leading-relaxed mb-4">
                  {stage.desc}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {stage.tags.map((tag) => (
                    <span key={tag} className="font-mono-data text-[9px] bg-accent-blue/[0.07] border border-accent-blue/15 text-accent-blue px-2 py-[2px] rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {i < STAGES.length - 1 && <DashedArrow />}

              {i < STAGES.length - 1 && (
                <div className="lg:hidden flex items-center justify-center h-6 w-full">
                  <div className="w-px h-full border-l-2 border-dashed border-accent-blue/25" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

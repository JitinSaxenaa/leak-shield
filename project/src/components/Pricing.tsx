import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Starter',
    price: { monthly: 0, annual: 0 },
    features: [
      '1 domain monitored',
      '3 email patterns',
      '50 alerts per month',
      'Basic threat dashboard',
      'Community support',
      'Standard scan speed',
    ],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: { monthly: 99, annual: 79 },
    features: [
      '10 domains monitored',
      'Unlimited email & people tracking',
      'Unlimited alerts',
      'Full dashboard + threat actor profiles',
      'API + Webhook access',
      'Slack integration',
      'Email support',
      '30-day history',
    ],
    cta: 'Start Pro Trial',
    highlight: true,
    badge: 'MOST POPULAR',
  },
  {
    name: 'Enterprise',
    price: { monthly: null, annual: null },
    features: [
      'Unlimited domains & monitoring',
      'Custom integrations',
      'Dedicated security analyst',
      'On-premise deployment option',
      'SLA guarantee (99.9%)',
      '24/7 priority support',
      'Custom retention & audit logs',
      'SIEM integration',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="font-mono-data text-[11px] text-accent-blue uppercase tracking-[0.2em] mb-3">Pricing</p>
          <h2 className="font-sora text-[36px] lg:text-[44px] font-bold text-text-primary mb-6">Simple, Transparent Pricing</h2>

          <div className="flex items-center gap-3">
            <span className={`font-dm text-[13px] ${!annual ? 'text-text-primary' : 'text-text-muted'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${annual ? 'bg-accent-blue' : 'bg-border'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${annual ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className={`font-dm text-[13px] ${annual ? 'text-text-primary' : 'text-text-muted'}`}>Annual</span>
            {annual && (
              <span className="font-mono-data text-[9px] bg-success/15 border border-success/30 text-success px-2 py-0.5 rounded">SAVE 20%</span>
            )}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-[10px] border p-6 flex flex-col transition-all duration-200 ${
                plan.highlight
                  ? 'border-accent-blue/50 bg-accent-blue/[0.04] shadow-[0_0_30px_rgba(14,165,233,0.12)]'
                  : 'bg-bg-card border-border hover:border-border-hover'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6">
                  <span className="font-mono-data text-[9px] font-semibold bg-accent-blue text-white px-3 py-1 rounded-full">{plan.badge}</span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-sora text-[18px] font-bold text-text-primary mb-1">{plan.name}</h3>
                {plan.price.monthly === null ? (
                  <span className="font-sora text-[32px] font-bold text-text-primary">Custom</span>
                ) : plan.price.monthly === 0 ? (
                  <span className="font-sora text-[32px] font-bold text-text-primary">Free</span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="font-sora text-[32px] font-bold text-text-primary">
                      ${annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="font-dm text-[13px] text-text-muted">/mo</span>
                  </div>
                )}
                {annual && plan.price.monthly !== null && plan.price.monthly > 0 && (
                  <p className="font-dm text-[11px] text-text-muted mt-1">Billed ${(plan.price.annual! * 12).toLocaleString()}/year</p>
                )}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={13} className={`mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-accent-blue' : 'text-success'}`} />
                    <span className="font-dm text-[12px] text-text-secondary">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-dm font-medium text-[13px] transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-accent-blue hover:bg-accent-blue/90 text-white hover:shadow-glow-blue'
                    : 'border border-border hover:border-border-hover text-text-primary hover:bg-white/[0.03]'
                }`}
              >
                {plan.cta}
                {plan.highlight && <ArrowRight size={14} />}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

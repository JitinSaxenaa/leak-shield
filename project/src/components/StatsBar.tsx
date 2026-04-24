import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const STATS = [
  { value: 10247, suffix: '+', label: 'Tor Sites Monitored', prefix: '' },
  { value: 3, suffix: ' Weeks', label: 'Earlier Breach Detection', prefix: '' },
  { value: 94, suffix: '%', label: 'False Positive Reduction', prefix: '' },
  { value: 4.45, suffix: 'M', label: 'Avg. Breach Cost Prevented', prefix: '$' },
];

export default function StatsBar() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="features" className="border-y border-border py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="px-6 py-6 lg:py-0 lg:first:pl-0"
            >
              <div className="font-sora text-[48px] lg:text-[64px] font-bold text-accent-blue leading-none mb-2 whitespace-nowrap">
                {inView ? (
                  <>
                    {stat.prefix}
                    <CountUp end={stat.value} decimals={stat.value % 1 !== 0 ? 2 : 0} duration={2.2} />
                    {stat.suffix}
                  </>
                ) : (
                  `${stat.prefix}0${stat.suffix}`
                )}
              </div>
              <div className="font-dm text-[14px] text-text-secondary leading-snug">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
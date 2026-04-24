const ITEMS = [
  { severity: 'CRITICAL', color: 'text-danger', dot: 'bg-danger', msg: 'healthcare-org.in · 4,200 credentials on BreachForums', time: '4m ago' },
  { severity: 'HIGH', color: 'text-accent-amber', dot: 'bg-accent-amber', msg: 'API keys exposed: fintech-startup.com · GitHub leak', time: '11m ago' },
  { severity: 'RESOLVED', color: 'text-success', dot: 'bg-success', msg: 'logistics-corp.net · alert neutralized', time: '19m ago' },
  { severity: 'CRITICAL', color: 'text-danger', dot: 'bg-danger', msg: 'Employee PII: 8,300 records · edutech-india.com', time: '26m ago' },
  { severity: 'HIGH', color: 'text-accent-amber', dot: 'bg-accent-amber', msg: 'Subdomain indexed: mail.medcare.in · dark web crawler', time: '34m ago' },
  { severity: 'CRITICAL', color: 'text-danger', dot: 'bg-danger', msg: 'Database dump: bank-client-data · RaidForums', time: '41m ago' },
];

function Item({ item }: { item: typeof ITEMS[0] }) {
  return (
    <span className="inline-flex items-center gap-2 mx-8 whitespace-nowrap">
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot} flex-shrink-0`} />
      <span className={`font-mono-data text-[11px] font-semibold ${item.color}`}>{item.severity}</span>
      <span className="text-text-muted font-dm text-[11px]">—</span>
      <span className="text-text-secondary font-dm text-[11px]">{item.msg}</span>
      <span className="text-text-muted font-mono-data text-[10px]">· {item.time}</span>
      <span className="text-border mx-4 text-base leading-none">|</span>
    </span>
  );
}

export default function LiveTicker() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="border-y border-border py-3" style={{ background: '#080F1C' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        {/* Live feed label */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-danger" />
          </span>
          <span className="font-mono-data text-[10px] font-semibold text-danger tracking-wider">LIVE FEED</span>
        </div>

        {/* Scrolling marquee */}
        <div className="flex-1 overflow-hidden ticker-fade">
          <div className="flex" style={{ animation: 'tickerScroll 50s linear infinite', width: 'max-content' }}>
            {doubled.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

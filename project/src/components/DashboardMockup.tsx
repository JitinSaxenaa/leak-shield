import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  AlertTriangle, ShieldAlert, ShieldCheck, Activity, Home, Users, Globe, FileText, Settings, Bell, Search,
} from 'lucide-react';

const CHART_DATA = [
  { t: '00', v: 2 }, { t: '02', v: 4 }, { t: '04', v: 3 }, { t: '06', v: 7 },
  { t: '08', v: 12 }, { t: '10', v: 9 }, { t: '12', v: 18 }, { t: '14', v: 15 },
  { t: '16', v: 22 }, { t: '18', v: 16 }, { t: '20', v: 11 }, { t: '22', v: 8 }, { t: '24', v: 5 },
];

const DONUT_DATA = [
  { name: 'Domains', value: 8, color: '#0EA5E9' },
  { name: 'Email patterns', value: 12, color: '#F59E0B' },
  { name: 'API patterns', value: 4, color: '#EF4444' },
  { name: 'Technical', value: 6, color: '#10B981' },
];

type ThreatRow = { time: string; platform: string; type: string; target: string; risk: number; status: string; action: string };

const INITIAL_ROWS: ThreatRow[] = [
  { time: '14:47:03', platform: 'BreachForums', type: 'Cred Dump', target: 'hr@company.com', risk: 94, status: 'CRITICAL', action: 'Investigate →' },
  { time: '14:44:21', platform: 'Dread.onion', type: 'Data Market', target: 'company.com DB', risk: 81, status: 'REVIEWING', action: 'View →' },
  { time: '14:39:55', platform: 'Telegram Ch.', type: 'PII Leak', target: '10,200 records', risk: 67, status: 'MONITOR', action: 'Track →' },
  { time: '14:35:12', platform: 'RaidForums', type: 'API Keys', target: 'sk-xxxx payment', risk: 88, status: 'ALERTED', action: 'Block →' },
  { time: '14:28:44', platform: 'PasteBin Tor', type: 'Domain Ref', target: 'mail.company.com', risk: 43, status: 'LOGGED', action: 'View →' },
  { time: '14:22:09', platform: 'XSS.is Forum', type: 'Vuln Scan', target: 'login.company.com', risk: 71, status: 'MONITOR', action: 'Assess →' },
];

const NEW_ROWS: ThreatRow[] = [
  { time: '14:50:18', platform: 'BreachForums', type: 'Password Hash', target: 'admin@company.com', risk: 91, status: 'CRITICAL', action: 'Investigate →' },
  { time: '14:52:33', platform: 'Dread.onion', type: 'Cookie Leak', target: 'app.company.com', risk: 75, status: 'REVIEWING', action: 'View →' },
];

const ACTORS = [
  { alias: 'ph4nt0m_sell', platforms: 4, last: '2h ago', risk: 'Critical', color: 'text-danger', bg: 'bg-danger' },
  { alias: 'd4rkn3t_brad', platforms: 2, last: '6h ago', risk: 'High', color: 'text-accent-amber', bg: 'bg-accent-amber' },
  { alias: 'xX_leakm4st', platforms: 3, last: '1d ago', risk: 'High', color: 'text-accent-amber', bg: 'bg-accent-amber' },
];

const TIMELINE = [
  { time: '14:47', label: 'Critical credential dump', color: 'bg-danger' },
  { time: '14:39', label: 'PII leak detected', color: 'bg-accent-amber' },
  { time: '14:35', label: 'API key exposure', color: 'bg-danger' },
  { time: '14:22', label: 'Threat resolved', color: 'bg-success' },
  { time: '13:58', label: 'New threat actor flagged', color: 'bg-accent-amber' },
];

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    CRITICAL: 'bg-danger/15 text-danger border-danger/30',
    REVIEWING: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
    MONITOR: 'bg-accent-amber/10 text-accent-amber border-accent-amber/30',
    ALERTED: 'bg-danger/10 text-danger border-danger/20',
    LOGGED: 'bg-text-muted/10 text-text-muted border-text-muted/20',
  };
  return <span className={`font-mono-data text-[9px] px-1.5 py-0.5 rounded border ${map[status] || ''}`}>{status}</span>;
}

function RiskBadge({ risk }: { risk: number }) {
  const color = risk >= 80 ? 'text-danger' : risk >= 50 ? 'text-accent-amber' : 'text-success';
  return <span className={`font-mono-data text-[10px] font-bold ${color}`}>{risk}</span>;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-bg-card border border-border rounded-lg px-3 py-2 text-[11px]">
        <p className="font-mono-data text-text-muted">{label}:00</p>
        <p className="font-mono-data text-accent-blue font-semibold">{payload[0].value} threats</p>
      </div>
    );
  }
  return null;
};

// Heatmap grid
function HeatmapGrid() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['0', '4', '8', '12', '16', '20'];
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <div className="w-6" />
        {hours.map((h) => (
          <div key={h} className="w-5 text-center font-mono-data text-[7px] text-text-muted">{h}</div>
        ))}
      </div>
      {days.map((day) => (
        <div key={day} className="flex items-center gap-1">
          <div className="w-6 font-mono-data text-[7px] text-text-muted">{day}</div>
          {hours.map((h) => {
            const intensity = Math.random();
            const bg = intensity > 0.7 ? 'bg-accent-blue/40' : intensity > 0.4 ? 'bg-accent-blue/20' : intensity > 0.15 ? 'bg-accent-blue/10' : 'bg-bg-base';
            return <div key={`${day}-${h}`} className={`w-5 h-4 rounded-sm ${bg} border border-border/50`} />;
          })}
        </div>
      ))}
    </div>
  );
}

export default function DashboardMockup() {
  const [rows, setRows] = useState(INITIAL_ROWS);
  const [rowIdx, setRowIdx] = useState(0);
  const [timeRange, setTimeRange] = useState('24H');

  useEffect(() => {
    const timer = setInterval(() => {
      setRows((prev) => {
        const next = NEW_ROWS[rowIdx % NEW_ROWS.length];
        return [next, ...prev.slice(0, 6)];
      });
      setRowIdx((i) => i + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, [rowIdx]);

  return (
    <section id="dashboard" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="font-mono-data text-[11px] text-accent-blue uppercase tracking-[0.2em] mb-3">Command Center</p>
          <h2 className="font-sora text-[36px] lg:text-[44px] font-bold text-text-primary mb-3 leading-tight">Everything In One Place</h2>
          <p className="font-dm text-text-secondary max-w-[480px]">Built for security teams that need signal, not noise.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-[10px] overflow-hidden border border-border shadow-float relative">
          {/* Reflection shadow */}
          <div className="absolute -bottom-4 left-[10%] right-[10%] h-4 bg-bg-base/50 blur-xl rounded-full" />

          {/* Browser chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border" style={{ background: 'linear-gradient(180deg, #0C1525 0%, #080F1C 100%)' }}>
            <div className="flex items-center gap-2">
              <div className="w-[7px] h-[7px] rounded-full bg-danger/80" />
              <div className="w-[7px] h-[7px] rounded-full bg-accent-amber/80" />
              <div className="w-[7px] h-[7px] rounded-full bg-success/80" />
            </div>
            <div className="flex items-center gap-2 bg-bg-base border border-border rounded-md px-3 py-1">
              <ShieldCheck size={10} className="text-success" />
              <span className="font-mono-data text-[10px] text-text-muted">app.leakshield.io/threats</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-muted">
              <div className="w-3 h-0.5 bg-text-muted/30 rounded" />
              <div className="w-3 h-3 border border-text-muted/30 rounded-sm" />
            </div>
          </div>

          {/* Dashboard content */}
          <div className="flex bg-bg-base min-h-[580px]">
            {/* Sidebar */}
            <div className="w-14 border-r border-border flex flex-col items-center py-4 flex-shrink-0">
              <div className="w-6 h-6 mb-6">
                <svg viewBox="0 0 24 28" fill="none" className="w-full h-full">
                  <polygon points="12,1 22,7 22,21 12,27 2,21 2,7" stroke="#0EA5E9" strokeWidth="1" fill="none" />
                </svg>
              </div>
              {[
                { icon: Home, label: 'Overview', active: false },
                { icon: AlertTriangle, label: 'Threats', active: true },
                { icon: Users, label: 'Actors', active: false },
                { icon: Globe, label: 'Assets', active: false },
                { icon: FileText, label: 'Reports', active: false },
                { icon: Settings, label: 'Settings', active: false },
              ].map(({ icon: Icon, label, active }) => (
                <div
                  key={label}
                  className={`relative w-10 h-10 flex items-center justify-center rounded-lg mb-1 cursor-default transition-colors ${
                    active ? 'bg-accent-blue/10 text-accent-blue' : 'text-text-muted hover:bg-white/3'
                  }`}
                >
                  {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent-blue rounded-r" />}
                  <Icon size={14} />
                </div>
              ))}
              <div className="mt-auto flex flex-col items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent-blue/20 flex items-center justify-center text-[9px] font-sora font-bold text-accent-blue">LS</div>
                <div className="relative">
                  <Bell size={14} className="text-text-muted" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-danger rounded-full" />
                </div>
              </div>
            </div>

            {/* Main area */}
            <div className="flex-1 p-4 overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-sora text-[14px] font-semibold text-text-primary">Threat Intelligence Feed</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="font-mono-data text-[9px] text-success">Last updated: 2s ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-danger/10 border border-danger/20 rounded px-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                    <span className="font-mono-data text-[9px] text-danger font-semibold">LIVE</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {['1H', '6H', '24H', '7D'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setTimeRange(r)}
                        className={`font-mono-data text-[9px] px-2 py-1 rounded transition-colors ${timeRange === r ? 'bg-accent-blue/15 text-accent-blue' : 'text-text-muted hover:text-text-primary'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {[
                  { border: 'border-t-danger', icon: AlertTriangle, iconColor: 'text-danger', value: '7', label: 'Critical Threats', trend: '▲ 3 from yesterday', trendColor: 'text-danger' },
                  { border: 'border-t-accent-amber', icon: ShieldAlert, iconColor: 'text-accent-amber', value: '23', label: 'High Priority', trend: '▼ 5 from yesterday', trendColor: 'text-success' },
                  { border: 'border-t-success', icon: ShieldCheck, iconColor: 'text-success', value: '142', label: 'Resolved This Week', trend: '▲ 28% vs last week', trendColor: 'text-success' },
                  { border: 'border-t-accent-blue', icon: Activity, iconColor: 'text-accent-blue', value: '89', label: 'Risk Score', sub: 'Organization-wide', trend: '', trendColor: '' },
                ].map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={kpi.label} className={`bg-bg-card border border-border ${kpi.border}-[3px] rounded-lg p-3`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={13} className={kpi.iconColor} />
                        <span className="font-dm text-[10px] text-text-muted">{kpi.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-sora text-[20px] font-bold text-text-primary">{kpi.value}</span>
                        {kpi.label === 'Risk Score' && (
                          <svg width="28" height="28" viewBox="0 0 36 36" className="-rotate-90">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#162032" strokeWidth="3" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#0EA5E9" strokeWidth="3" strokeDasharray="79 88" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      {kpi.trend && <span className={`font-mono-data text-[8px] ${kpi.trendColor}`}>{kpi.trend}</span>}
                    </div>
                  );
                })}
              </div>

              {/* Main content split */}
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Threat feed table */}
                <div className="lg:flex-[3] bg-bg-surface rounded-lg border border-border overflow-hidden">
                  <div className="px-3 py-2 border-b border-border flex items-center justify-between">
                    <span className="font-sora text-[11px] font-semibold text-text-primary">Live Threat Feed</span>
                    <Search size={12} className="text-text-muted" />
                  </div>
                  <div className="grid grid-cols-[56px_1fr_1fr_40px_72px] gap-2 px-3 py-1.5 border-b border-border">
                    {['Time', 'Platform', 'Type / Target', 'Risk', 'Status'].map((h) => (
                      <span key={h} className="font-mono-data text-[8px] text-text-muted uppercase tracking-wider truncate">{h}</span>
                    ))}
                  </div>
                  <div className="divide-y divide-border/50">
                    {rows.map((row, i) => (
                      <motion.div
                        key={`${row.time}-${i}`}
                        initial={i === 0 ? { opacity: 0, y: -8 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-[56px_1fr_1fr_40px_72px] gap-2 px-3 py-2 hover:bg-white/[0.02] transition-colors items-center"
                      >
                        <span className="font-mono-data text-[9px] text-text-muted truncate">{row.time}</span>
                        <span className="font-dm text-[10px] text-text-primary truncate">{row.platform}</span>
                        <div className="truncate">
                          <span className="font-dm text-[10px] text-text-secondary">{row.type}</span>
                          <span className="font-mono-data text-[9px] text-text-muted ml-1.5">{row.target}</span>
                        </div>
                        <RiskBadge risk={row.risk} />
                        <StatusChip status={row.status} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right column */}
                <div className="lg:flex-[2] flex flex-col gap-3">
                  {/* Area chart */}
                  <div className="bg-bg-surface rounded-lg border border-border p-3">
                    <span className="font-sora text-[11px] font-semibold text-text-primary">Threat Activity — 24H</span>
                    <ResponsiveContainer width="100%" height={90}>
                      <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                        <defs>
                          <linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="t" tick={{ fontSize: 7, fill: '#475569', fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} interval={2} />
                        <YAxis tick={{ fontSize: 7, fill: '#475569' }} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="v" stroke="#0EA5E9" strokeWidth={1.5} fill="url(#tGrad)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Threat actors */}
                  <div className="bg-bg-surface rounded-lg border border-border p-3">
                    <span className="font-sora text-[11px] font-semibold text-text-primary">Top Threat Actors This Week</span>
                    <div className="space-y-2 mt-2">
                      {ACTORS.map((actor) => (
                        <div key={actor.alias} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-md ${actor.bg}/15 flex items-center justify-center font-mono-data text-[8px] font-bold ${actor.color}`}>
                              {actor.alias.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-mono-data text-[10px] text-text-primary">{actor.alias}</div>
                              <div className="font-dm text-[8px] text-text-muted">{actor.platforms} platforms · {actor.last}</div>
                            </div>
                          </div>
                          <span className={`font-mono-data text-[8px] font-bold ${actor.color}`}>{actor.risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom mini panels */}
              <div className="grid lg:grid-cols-3 gap-3 mt-3">
                {/* Monitored Assets donut */}
                <div className="bg-bg-surface rounded-lg border border-border p-3">
                  <span className="font-sora text-[11px] font-semibold text-text-primary">Monitored Assets</span>
                  <div className="flex items-center gap-3 mt-2">
                    <svg width="70" height="70" viewBox="0 0 70 70">
                      {(() => {
                        const total = DONUT_DATA.reduce((s, d) => s + d.value, 0);
                        let offset = 0;
                        const r = 22;
                        const circ = 2 * Math.PI * r;
                        return DONUT_DATA.map((d) => {
                          const len = (d.value / total) * circ;
                          const el = (
                            <circle
                              key={d.name}
                              r={r}
                              cx="35"
                              cy="35"
                              fill="none"
                              stroke={d.color}
                              strokeWidth="10"
                              strokeDasharray={`${len} ${circ - len}`}
                              strokeDashoffset={-offset}
                              transform="rotate(-90 35 35)"
                            />
                          );
                          offset += len;
                          return el;
                        });
                      })()}
                    </svg>
                    <div className="space-y-1">
                      {DONUT_DATA.map((d) => (
                        <div key={d.name} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-sm" style={{ background: d.color }} />
                          <span className="font-dm text-[9px] text-text-muted">{d.name}: {d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Platform Heatmap */}
                <div className="bg-bg-surface rounded-lg border border-border p-3">
                  <span className="font-sora text-[11px] font-semibold text-text-primary">Platform Heatmap</span>
                  <div className="mt-2">
                    <HeatmapGrid />
                  </div>
                </div>

                {/* Recent Alerts Timeline */}
                <div className="bg-bg-surface rounded-lg border border-border p-3 max-h-[140px] overflow-y-auto">
                  <span className="font-sora text-[11px] font-semibold text-text-primary">Recent Alerts</span>
                  <div className="space-y-2 mt-2">
                    {TIMELINE.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="flex flex-col items-center mt-1">
                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                          {i < TIMELINE.length - 1 && <div className="w-px h-3 bg-border" />}
                        </div>
                        <div>
                          <span className="font-mono-data text-[9px] text-text-muted">{item.time}</span>
                          <p className="font-dm text-[9px] text-text-secondary">{item.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

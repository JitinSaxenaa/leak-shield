import { Github, Linkedin, Twitter } from 'lucide-react';
import Logo from './Logo';

const LINKS = {
  Product: ['Features', 'Dashboard', 'API Docs', 'Status', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security', 'GDPR', 'DPDP Act'],
};

export default function Footer() {
  return (
    <footer className="border-t border-border" style={{ background: '#04080F' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Logo size="nav" />
            <p className="font-dm text-[11px] text-text-muted mt-4 leading-relaxed max-w-[180px]">
              AI-powered dark web threat intelligence for organizations that can't afford to wait.
            </p>
            <div className="flex items-center gap-2 mt-5">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-accent-blue hover:border-border-hover transition-all duration-200">
                  <Icon size={13} />
                </button>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([col, items]) => (
            <div key={col}>
              <h4 className="font-sora text-[10px] font-semibold text-text-primary mb-4 uppercase tracking-wider">{col}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="font-dm text-[11px] text-text-muted hover:text-accent-blue transition-colors duration-150 relative group">
                      {item}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent-blue transition-all duration-200 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-dm text-[11px] text-text-muted">
            © 2025 LEAKSHIELD · Built by Team LEAKSHIELD · DSCE Bengaluru, India
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {['SOC 2 Ready', 'GDPR', 'DPDP'].map((badge) => (
              <span key={badge} className="font-mono-data text-[8px] border border-border text-text-muted px-2 py-1 rounded">{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

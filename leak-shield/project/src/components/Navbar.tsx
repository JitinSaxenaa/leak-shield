import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from './Logo';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Scan', href: '#threat-scan' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logoSize = scrolled ? 'nav' : 'full';

  return (
    <>
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(4,8,15,0.92)' : 'transparent',
          borderBottom: scrolled ? '1px solid #162032' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16" id = "owl-nav">
            <Logo size={logoSize} />

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative text-sm font-dm text-text-secondary hover:text-text-primary transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent-blue transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button className="text-sm font-dm text-text-secondary hover:text-text-primary border border-border hover:border-border-hover px-4 py-2 rounded-lg transition-all duration-200">
                Sign In
              </button>
              <button className="flex items-center gap-2 text-sm font-dm font-medium bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-glow-blue">
                Start Free Scan
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile fullscreen drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg-base/98 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-sora text-2xl font-semibold text-text-secondary hover:text-accent-blue transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-6 w-64">
                <button className="text-sm font-dm text-text-secondary border border-border px-4 py-3 rounded-lg">
                  Sign In
                </button>
                <button className="flex items-center justify-center gap-2 text-sm font-dm font-medium bg-accent-blue text-white px-4 py-3 rounded-lg">
                  Start Free Scan <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

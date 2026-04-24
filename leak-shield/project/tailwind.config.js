/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          base: '#04080F',
          surface: '#080F1C',
          card: '#0C1525',
        },
        border: {
          DEFAULT: '#162032',
          hover: '#1E3A5F',
        },
        accent: {
          blue: '#0EA5E9',
          amber: '#F59E0B',
        },
        danger: '#EF4444',
        success: '#10B981',
        text: {
          primary: '#EFF6FF',
          secondary: '#94A3B8',
          muted: '#475569',
        },
      },
      boxShadow: {
        'glow-blue': '0 0 30px rgba(14,165,233,0.15)',
        'glow-blue-sm': '0 0 15px rgba(14,165,233,0.12)',
        'glow-red': '0 0 20px rgba(239,68,68,0.2)',
        'glow-amber': '0 0 15px rgba(245,158,11,0.15)',
        'float': '0 20px 60px rgba(0,0,0,0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'dash': 'dashFlow 1.5s linear infinite',
        'ticker': 'tickerScroll 50s linear infinite',
        'blink': 'cursorBlink 1s step-end infinite',
        'hex-spin': 'hexSpin 8s linear infinite',
        'hex-spin-fast': 'hexSpin 4s linear infinite',
        'scan-line': 'scanLine 2.5s ease-in-out infinite',
        'row-slide': 'rowSlide 0.35s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
      },
      keyframes: {
        dashFlow: {
          to: { strokeDashoffset: '-24' },
        },
        tickerScroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        hexSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-8px)', opacity: '1' },
          '100%': { transform: 'translateY(8px)', opacity: '0' },
        },
        rowSlide: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

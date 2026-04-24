import { useEffect, useState, useRef } from 'react';

type LogoSize = 'full' | 'nav' | 'nav-mobile' | 'watermark';

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const SIZE_MAP = {
  full: { hex: 52, text: 22, tagline: 9, gap: 12 },
  nav: { hex: 32, text: 16, tagline: 7, gap: 8 },
  'nav-mobile': { hex: 32, text: 0, tagline: 0, gap: 0 },
  watermark: { hex: 400, text: 0, tagline: 0, gap: 0 },
};

export default function Logo({ size = 'full', className = '' }: LogoProps) {
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (size === 'watermark') return;
    let speed = 0;
    const onScroll = () => {
      const now = Date.now();
      const dt = now - lastScrollTime.current;
      if (dt > 0) {
        speed = Math.min(Math.abs(window.scrollY - lastScrollY.current) / dt * 8, 3);
      }
      lastScrollY.current = window.scrollY;
      lastScrollTime.current = now;
      setScrollSpeed(speed);
    };
    const onScrollEnd = () => {
      setScrollSpeed(0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    let timeout: ReturnType<typeof setTimeout>;
    const debouncedEnd = () => {
      clearTimeout(timeout);
      timeout = setTimeout(onScrollEnd, 150);
    };
    window.addEventListener('scroll', debouncedEnd, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', debouncedEnd);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeout);
    };
  }, [size]);

  const s = SIZE_MAP[size];
  const isWatermark = size === 'watermark';
  const isMobile = size === 'nav-mobile';
  const spinDuration = scrollSpeed > 0.5 ? 4 : 8;

  return (
    <div className={`flex items-center ${className}`} style={{ gap: `${s.gap}px` }}>
      {/* Hexagon SVG */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: s.hex,
          height: s.hex * 1.15,
          opacity: isWatermark ? 0.04 : 1,
        }}
      >
        <svg
          width={s.hex}
          height={s.hex * 1.15}
          viewBox="0 0 52 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id={`glow-${size}`}>
              <feGaussianBlur stdDeviation={isWatermark ? 0 : 1.5} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer hexagon */}
          <polygon
            points="26,2 48,14 48,46 26,58 4,46 4,14"
            stroke="#0EA5E9"
            strokeWidth="1.5"
            fill="none"
            filter={`url(#glow-${size})`}
          />

          {/* Rotating dashed overlay */}
          <g style={{ transformOrigin: '26px 30px', animation: `hexSpin ${spinDuration}s linear infinite` }}>
            <polygon
              points="26,2 48,14 48,46 26,58 4,46 4,14"
              stroke="#0EA5E9"
              strokeWidth="1"
              fill="none"
              strokeDasharray="4 8"
              opacity="0.5"
            />
          </g>

          {/* Vertex dots */}
          {[
            [26, 2], [48, 14], [48, 46], [26, 58], [4, 46], [4, 14],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.5" fill="#0EA5E9" opacity="0.7" />
          ))}

          {/* Inner concentric hexagon */}
          <polygon
            points="26,10 40,18 40,42 26,50 12,42 12,18"
            stroke="#1E3A5F"
            strokeWidth="1"
            fill="none"
          />

          {/* Shield outline */}
          <path
            d="M26 16 L36 20.5 V30 C36 35 31 38 26 40 C21 38 16 35 16 30 V20.5 Z"
            stroke="#0EA5E9"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Scan lines inside shield */}
          {!isWatermark && (
            <>
              <line x1="20" y1="24" x2="32" y2="24" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.4" />
              <line x1="20" y1="28" x2="32" y2="28" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.6">
                <animate attributeName="y1" values="24;32;24" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="y2" values="24;32;24" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
              </line>
              <line x1="20" y1="32" x2="32" y2="32" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.3" />
            </>
          )}
        </svg>
      </div>

      {/* Wordmark */}
      {!isMobile && !isWatermark && (
        <div className="flex flex-col">
          <div className="flex items-baseline leading-none" style={{ gap: '0px' }}>
            <span
              className="font-sora font-bold text-text-primary"
              style={{ fontSize: `${s.text}px` }}
            >
              LEAK
            </span>
            <span
              className="font-sora font-bold text-accent-blue"
              style={{ fontSize: `${s.text}px` }}
            >
              SHIELD
            </span>
          </div>
          {s.tagline > 0 && (
            <span
              className="font-mono-data text-text-muted tracking-widest"
              style={{ fontSize: `${s.tagline}px`, lineHeight: '1.2', marginTop: '2px' }}
            >
              DARK WEB INTELLIGENCE
            </span>
          )}
        </div>
      )}
    </div>
  );
}

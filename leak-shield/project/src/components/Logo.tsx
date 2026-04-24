import { useEffect, useState, useRef } from 'react';

type LogoSize = 'full' | 'nav' | 'nav-mobile' | 'watermark';

interface LogoProps {
  size?: LogoSize;
  className?: string;
}

const SIZE_MAP = {
  full: { svg: 64, containerPad: 'p-6', gap: 4 },
  nav: { svg: 32, containerPad: 'p-2', gap: 2 },
  'nav-mobile': { svg: 32, containerPad: 'p-1.5', gap: 1 },
  watermark: { svg: 400, containerPad: 'p-0', gap: 0 },
};

export default function Logo({ size = 'full', className = '' }: LogoProps) {
  const isWatermark = size === 'watermark';
  const isMobile = size === 'nav-mobile';
  const s = SIZE_MAP[size];

  if (isWatermark) {
    return (
      <div className={`opacity-5 ${className}`}>
        <CipherOwlSvg size={s.svg} color="#0EA5E9" />
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center bg-bg-surface rounded-xl border border-border ${s.containerPad} ${className}`}
      style={{ 
        boxShadow: size === 'full' ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
        background: size === 'nav' ? 'transparent' : '',
        border: size === 'nav' ? 'none' : ''
      }}
    >
      <div className="flex items-center" style={{ gap: `12px` }}>
        <CipherOwlSvg size={s.svg} color="#0EA5E9" />
        
        {!isMobile && (
          <div className="flex flex-col">
            <div className="flex items-baseline leading-none" style={{ gap: '0px' }}>
              <span className="font-sora font-bold text-text-primary" style={{ fontSize: size === 'nav' ? '18px' : '24px' }}>LEAK</span>
              <span className="font-sora font-bold text-accent-blue" style={{ fontSize: size === 'nav' ? '18px' : '24px' }}>SHIELD</span>
            </div>
            {size === 'full' && (
              <span className="font-mono-data text-text-muted tracking-widest text-[10px] mt-1">
                DARK WEB INTELLIGENCE
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CipherOwlSvg({ size, color }: { size: number; color: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="-4 -4 72 72" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_8px_rgba(14,165,233,0.3)]"
    >
      {/* Outer body */}
      <path 
        d="M32 18C24 18 18 24 18 31C18 35 20 38 22 40C18 44 16 50 17 56C19 62 25 64 32 64C39 64 45 62 47 56C48 50 46 44 42 40C44 38 46 35 46 31C46 24 40 18 32 18Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Ears */}
      <path 
        d="M22 20L18 10L26 16M42 20L46 10L38 16" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Eyes outlines */}
      <circle cx="25" cy="30" r="6" stroke={color} strokeWidth="2"/>
      <circle cx="39" cy="30" r="6" stroke={color} strokeWidth="2"/>
      
      {/* Pupils */}
      <circle 
        cx="25" 
        cy="30" 
        r="2.5" 
        fill={color} 
        className="animate-pulse"
      />
      <circle 
        cx="39" 
        cy="30" 
        r="2.5" 
        fill={color} 
        className="animate-pulse"
      />
      
      {/* Beak */}
      <path d="M32 34L30 38H34L32 34Z" fill={color} opacity="0.8"/>
      
      {/* Feet */}
      <path 
        d="M24 58L20 64M25 58L25 64M26 58L29 64M40 58L44 64M39 58L39 64M38 58L35 64" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

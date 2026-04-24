import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// The animation owl is rendered at 64px (= 2× the 32px nav logo).
// It starts at CSS scale:2 → 128px visual (big, dramatic).
// It lands at CSS scale:0.5 → 32px visual (exactly the nav logo size).
//
// With transformOrigin:'center', the visual top-left shifts by:
//   offset = (OWL_ANIM/2) * (1 - scale)
// So at scale=0.5:  offset = 32 * 0.5 = 16px
// → xLand = rect.left - 16,  yLand = rect.top - 16

const OWL_ANIM   = 256;
const LAND_SCALE = 0.5;                                   // 64 * 0.5 = 32px visual = nav logo
const LAND_OFF   = (OWL_ANIM / 2) * (1 - LAND_SCALE);    // 16px

function OwlSvg({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-4 -4 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: `drop-shadow(0 0 16px ${color}) drop-shadow(0 0 40px ${color}55)` }}
    >
      <path
        d="M32 18C24 18 18 24 18 31C18 35 20 38 22 40C18 44 16 50 17 56C19 62 25 64 32 64C39 64 45 62 47 56C48 50 46 44 42 40C44 38 46 35 46 31C46 24 40 18 32 18Z"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M22 20L18 10L26 16M42 20L46 10L38 16"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="25" cy="30" r="6" stroke={color} strokeWidth="2" />
      <circle cx="39" cy="30" r="6" stroke={color} strokeWidth="2" />
      <circle cx="25" cy="30" r="2.5" fill={color} />
      <circle cx="39" cy="30" r="2.5" fill={color} />
      <path d="M32 34L30 38H34L32 34Z" fill={color} opacity="0.8" />
      <path
        d="M24 58L20 64M25 58L25 64M26 58L29 64M40 58L44 64M39 58L39 64M38 58L35 64"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export default function IntroAnimation({ onDone }: { onDone: () => void }) {
  const owlCtrl = useAnimation();
  const bgCtrl  = useAnimation();

  // Computed synchronously so `initial` gets correct values on first render.
  // position: fixed; top:0; left:0 — all motion via x/y transforms.
  const [dims] = useState(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    return {
      W,
      // Start: element placed so its visual center (at scale:2) is at bottom-center of viewport.
      // visual_center = element_center = (x + OWL_ANIM/2,  y + OWL_ANIM/2)
      // At scale:2  visual_center = element_center  (scale doesn't shift center with 'center' origin)
      // Want visual_center = (W/2, H)  →  x = W/2 - 32,  y = H - 32
      xStart: W / 2 - OWL_ANIM / 2,
      yStart: H     - OWL_ANIM / 2,
    };
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const { W } = dims;

    async function run() {
      // Brief blank-screen pause before the owl appears.
      await new Promise<void>((r) => setTimeout(r, 280));

      // Measure the real logo owl's exact viewport rect.
      // It's in the DOM (hidden behind the overlay) so getBoundingClientRect works fine.
      const el   = document.getElementById('owl-nav');
      const rect = el?.getBoundingClientRect();

      // xLand / yLand: element position so that at LAND_SCALE the visual top-left
      // sits exactly on top of the real logo owl.
      const xLand = (rect?.left ?? 24) - LAND_OFF;
      const yLand = (rect?.top  ?? 16) - LAND_OFF;

      // Phase 1 — soar straight up, visual center stays at x = W/2, scale 2 → 0.5
      // element_center_x = W/2  →  x = W/2 - 32  (no horizontal change from start)
      // visual top at landing scale: y + LAND_OFF = 44  →  y = 28
      await owlCtrl.start({
        x:     W / 2 - OWL_ANIM / 2,
        y:     28,
        scale: LAND_SCALE,
        transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
      });

      // Phase 2 — glide diagonally to exact logo position (top-left corner of navbar)
      await owlCtrl.start({
        x: xLand,
        y: yLand,
        transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] },
      });

      // Phase 3 — landing pulse  (page "comes to life" at this moment)
      await owlCtrl.start({
        scale: [LAND_SCALE, LAND_SCALE * 1.7, LAND_SCALE * 0.85, LAND_SCALE],
        transition: { duration: 0.52, times: [0, 0.28, 0.7, 1] },
      });

      await new Promise<void>((r) => setTimeout(r, 80));

      // Fade overlay out (reveals page) and animated owl out (real logo underneath).
      await Promise.all([
        bgCtrl.start({ opacity: 0, transition: { duration: 0.45, ease: 'easeOut' } }),
        owlCtrl.start({ opacity: 0, transition: { duration: 0.22, ease: 'easeOut' } }),
      ]);

      document.body.style.overflow = '';
      onDone();
    }

    run();
    return () => { document.body.style.overflow = ''; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Full-screen background overlay — covers the page until animation finishes */}
      <motion.div
        animate={bgCtrl}
        initial={{ opacity: 1 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#04080F',
          zIndex: 9998,
          pointerEvents: 'none',
        }}
      />

      {/* Animated owl — separate layer so it fades independently of the background */}
      <motion.div
        animate={owlCtrl}
        initial={{ x: dims.xStart, y: dims.yStart, scale: 2, opacity: 1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: OWL_ANIM,
          height: OWL_ANIM,
          zIndex: 9999,
          transformOrigin: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Radial halo glow that travels with the owl */}
        <div
          style={{
            position: 'absolute',
            inset: '-32px',
            background: 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 65%)',
            borderRadius: '50%',
          }}
        />
        <OwlSvg size={OWL_ANIM} color="#0EA5E9" />
      </motion.div>
    </>
  );
}

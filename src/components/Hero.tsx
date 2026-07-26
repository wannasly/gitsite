import { useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useReducedMotion, type Variants } from 'framer-motion';
import PufferFigure from './PufferFigure';
import MagneticButton from './MagneticButton';

// Brand marks (lucide dropped these) — minimal inline SVGs
const IconInstagram = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);
const IconFacebook = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={p.className} aria-hidden="true">
    <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1z" />
  </svg>
);
const IconX = (p: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={p.className} aria-hidden="true">
    <path d="M17.5 3h3l-7 8 8.2 10h-6.4l-5-6.3L8 21H5l7.5-8.6L4.5 3h6.5l4.5 5.9L17.5 3z" />
  </svg>
);
const SOCIALS = [IconInstagram, IconFacebook, IconX];

const SIZES = ['S', 'M', 'L', 'XL'];
const COLOURS = ['WHITE', 'SILVER'];

const lineReveal: Variants = {
  hidden: { y: '110%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  const [size, setSize] = useState('L');
  const [colour, setColour] = useState('SILVER');
  const reduce = useReducedMotion();

  // Mouse parallax for the hero figure
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 120, damping: 20 });
  const py = useSpring(my, { stiffness: 120, damping: 20 });

  const stageRef = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 28);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 22);
  };

  return (
    <section
      id="top"
      className="relative min-h-dvh bg-gradient-to-b from-frost-mist via-frost-base to-frost-base pt-20 sm:pt-24 overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 h-full">
        {/* top meta row */}
        <motion.div
          variants={fade}
          custom={0}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-x-6 gap-y-1 pt-4 pb-8"
        >
          <span className="tech-label">[ TARGET: STAGE 01 ]</span>
          <span className="tech-label">[ SERIES ]</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* LEFT — heading + product controls */}
          <div className="lg:col-span-4 order-2 lg:order-1 space-y-8">
            <h1 className="display text-6xl sm:text-7xl xl:text-8xl text-frost-white">
              <span className="block reveal-mask">
                <motion.span className="block" variants={lineReveal} custom={0} initial="hidden" animate="visible">
                  COLLECTION
                </motion.span>
              </span>
              <span className="block reveal-mask">
                <motion.span className="block" variants={lineReveal} custom={1} initial="hidden" animate="visible">
                  ARTIC 01
                  <sup className="text-2xl align-super">™</sup>
                </motion.span>
              </span>
            </h1>

            {/* SIZE selector */}
            <motion.div variants={fade} custom={1} initial="hidden" animate="visible" className="space-y-2">
              <div className="flex items-center gap-6">
                <span className="tech-label w-14">SIZE</span>
                <div className="flex items-center gap-4">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`mono text-sm transition-colors relative py-1 ${
                        size === s ? 'text-frost-white' : 'text-frost-white/45 hover:text-frost-white/80'
                      }`}
                      aria-pressed={size === s}
                    >
                      {s}
                      {size === s && (
                        <motion.span
                          layoutId="size-underline"
                          className="absolute -bottom-0 left-0 w-full h-px bg-frost-white"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLOUR selector */}
              <div className="flex items-center gap-6">
                <span className="tech-label w-14">COLOUR</span>
                <div className="flex items-center gap-4">
                  {COLOURS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColour(c)}
                      className={`mono text-sm transition-colors relative py-1 ${
                        colour === c ? 'text-frost-white' : 'text-frost-white/45 hover:text-frost-white/80'
                      }`}
                      aria-pressed={colour === c}
                    >
                      {c}
                      {colour === c && (
                        <motion.span
                          layoutId="colour-underline"
                          className="absolute -bottom-0 left-0 w-full h-px bg-frost-white"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ADD TO CART */}
            <motion.div variants={fade} custom={2} initial="hidden" animate="visible" className="flex items-center gap-5">
              <MagneticButton
                ariaLabel="Add to cart"
                strength={10}
                className="group relative w-16 h-16 flex items-center justify-center border border-frost-white/40 text-frost-white hover:bg-frost-white hover:text-frost-ink transition-colors duration-300 cursor-pointer"
                style={{ clipPath: 'polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)' }}
              >
                <ArrowUpRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
              <div>
                <div className="tech-label">ADD TO CART</div>
                <div className="display text-2xl text-frost-white mt-1">$899.99</div>
              </div>
            </motion.div>
          </div>

          {/* CENTER — hero figure */}
          <div
            ref={stageRef}
            onMouseMove={onMove}
            onMouseLeave={() => {
              mx.set(0);
              my.set(0);
            }}
            className="lg:col-span-5 order-1 lg:order-2 relative flex items-end justify-center min-h-[420px] lg:min-h-[620px]"
          >
            {/* graffiti tag behind */}
            <span className="tag absolute top-8 left-1/2 -translate-x-1/2 text-[9rem] sm:text-[13rem] rotate-[-6deg] whitespace-nowrap">
              FRZN
            </span>
            {/* radial glow */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[70%] h-[70%] bg-frost-snow/20 rounded-full blur-[80px]" />

            <motion.div
              style={{ x: px, y: py }}
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <PufferFigure
                  uid="hero"
                  from="#e2e8ec"
                  to="#7d909d"
                  className="w-[280px] sm:w-[360px] lg:w-[440px] h-auto drop-shadow-[0_40px_60px_rgba(18,25,31,0.45)]"
                />
              </motion.div>
            </motion.div>

            {/* floating meta chips */}
            <motion.span
              variants={fade}
              custom={3}
              initial="hidden"
              animate="visible"
              className="absolute bottom-4 left-2 tech-label"
            >
              [ {size} / {colour} ]
            </motion.span>
          </div>

          {/* RIGHT — thumbnails + pager + socials */}
          <div className="lg:col-span-3 order-3 flex flex-col justify-between h-full lg:min-h-[620px] py-4">
            <motion.div
              variants={fade}
              custom={2}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3"
            >
              {[
                { from: '#e6ebee', to: '#8a9ca8', g: true },
                { from: '#cfd8de', to: '#6f8390', g: false },
              ].map((tone, i) => (
                <div
                  key={i}
                  className="quilt notch-tr aspect-3/4 flex items-end justify-center overflow-hidden tile-vignette cursor-pointer group"
                  style={{ ['--quilt-tint' as string]: tone.to }}
                >
                  <PufferFigure
                    uid={`thumb-${i}`}
                    from={tone.from}
                    to={tone.to}
                    goggles={tone.g}
                    className="w-[80%] h-auto translate-y-4 transition-transform duration-500 group-hover:-translate-y-0 group-hover:scale-105"
                  />
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={fade}
              custom={4}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mono text-sm text-frost-white/70 mt-6"
            >
              <span className="text-frost-white">01</span>
              <span className="flex-1 h-px bg-frost-line" />
              <span>07</span>
            </motion.div>

            <motion.div
              variants={fade}
              custom={5}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-2 mt-6 lg:mt-0 lg:justify-end"
            >
              {SOCIALS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-frost-line text-frost-white/70 hover:text-frost-ink hover:bg-frost-white transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

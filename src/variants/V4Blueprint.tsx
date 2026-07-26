import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Check,
  Copy,
  Menu,
  X,
  Compass,
  Layers,
  SlidersHorizontal,
  Box,
  Mail,
  Circle,
  Plus,
  ExternalLink,
  Terminal,
  Cpu,
  Shield,
} from 'lucide-react';
import { CONTENT } from '../content';
import type { VariantProps } from './types';

/* ------------------------------------------------------------------ *
 *  V4 — BLUEPRINT
 *  A calm precision instrument: the layout of a monochrome 3D tool,
 *  rendered on soft neumorphic surfaces. Almost no colour — it all
 *  lives in the light and the linework.
 * ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const RAISED =
  'shadow-[8px_8px_20px_rgba(22,26,31,0.14),-8px_-8px_20px_rgba(255,255,255,0.85)]';
const RAISED_LG =
  'shadow-[14px_14px_34px_rgba(22,26,31,0.16),-12px_-12px_30px_rgba(255,255,255,0.9)]';
const INSET =
  'shadow-[inset_4px_4px_10px_rgba(22,26,31,0.13),inset_-4px_-4px_10px_rgba(255,255,255,0.8)]';
const INSET_SM =
  'shadow-[inset_2px_2px_6px_rgba(22,26,31,0.12),inset_-2px_-2px_6px_rgba(255,255,255,0.75)]';
const PRESS =
  'active:shadow-[inset_4px_4px_10px_rgba(22,26,31,0.13),inset_-4px_-4px_10px_rgba(255,255,255,0.8)] active:translate-y-[1px]';
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6BFF]';

const SURFACE = 'bg-[#E4E8EC]';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, delay: (i as number) * 0.075, ease: EASE },
  }),
};

const lineUp: Variants = {
  hidden: { y: '108%' },
  show: (i = 0) => ({
    y: '0%',
    transition: { duration: 0.9, delay: 0.15 + (i as number) * 0.11, ease: EASE },
  }),
};

type IconType = typeof Compass;

const NAV_ICONS: Record<string, IconType> = {
  top: Compass,
  about: Layers,
  stack: SlidersHorizontal,
  projects: Box,
  contact: Mail,
};

const PROJECT_ICONS: Record<string, IconType> = {
  defi: Cpu,
  scanner: Shield,
  discord: Terminal,
};

/* ---------------------------------- viewport chrome --------------- */

function Ticks({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <Plus className="absolute left-2.5 top-2.5 w-3 h-3 text-[#161A1F]/35" strokeWidth={1} />
      <Plus className="absolute right-2.5 top-2.5 w-3 h-3 text-[#161A1F]/35" strokeWidth={1} />
      <Plus className="absolute left-2.5 bottom-2.5 w-3 h-3 text-[#161A1F]/35" strokeWidth={1} />
      <Plus className="absolute right-2.5 bottom-2.5 w-3 h-3 text-[#161A1F]/35" strokeWidth={1} />
    </div>
  );
}

function GridFloor({ height = '55%' }: { height?: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
      style={{ height, perspective: '460px' } as CSSProperties}
      aria-hidden="true"
    >
      <div
        className="absolute inset-x-[-60%] bottom-0 h-[220%] origin-bottom"
        style={
          {
            transform: 'rotateX(74deg)',
            backgroundImage:
              'linear-gradient(to right, rgba(22,26,31,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(22,26,31,0.18) 1px, transparent 1px)',
            backgroundSize: '58px 58px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 70%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 70%)',
          } as CSSProperties
        }
      />
    </div>
  );
}

/* ---------------------------------- wireframe cube ---------------- */

const CUBE_V: [number, number, number][] = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];

const CUBE_E: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

interface Pt {
  x: number;
  y: number;
  k: number;
}

function projectCube(ax: number, ay: number, size: number, cx: number, cy: number): Pt[] {
  const ca = Math.cos(ay);
  const sa = Math.sin(ay);
  const cb = Math.cos(ax);
  const sb = Math.sin(ax);
  return CUBE_V.map(([x0, y0, z0]) => {
    const x1 = x0 * ca + z0 * sa;
    const z1 = -x0 * sa + z0 * ca;
    const y1 = y0 * cb - z1 * sb;
    const z2 = y0 * sb + z1 * cb;
    const k = 5.6 / (5.6 + z2);
    return { x: cx + x1 * size * k, y: cy + y1 * size * k, k };
  });
}

function depth(k: number): number {
  const n = (k - 0.76) / 0.69;
  return Math.min(0.95, Math.max(0.18, 0.18 + n * 0.72));
}

function WireCube({ reduced }: { reduced: boolean }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const easedRef = useRef({ x: 0, y: 0 });
  const [ang, setAng] = useState({ ax: -0.38, ay: 0.62 });

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let spin = 0.62;
    const loop = () => {
      spin += 0.0034;
      easedRef.current.x += (targetRef.current.x - easedRef.current.x) * 0.07;
      easedRef.current.y += (targetRef.current.y - easedRef.current.y) * 0.07;
      setAng({
        ax: -0.38 + easedRef.current.y * 0.34,
        ay: spin + easedRef.current.x * 0.62,
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const handleMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const el = hostRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    targetRef.current = {
      x: ((e.clientX - r.left) / r.width) * 2 - 1,
      y: ((e.clientY - r.top) / r.height) * 2 - 1,
    };
  }, []);

  const handleLeave = useCallback(() => {
    targetRef.current = { x: 0, y: 0 };
  }, []);

  const outer = projectCube(ang.ax, ang.ay, 56, 120, 108);
  const inner = projectCube(ang.ax * 0.85, -ang.ay * 1.4, 24, 120, 108);
  const spread = Math.max(...outer.map((p) => Math.abs(p.x - 120)));

  return (
    <div
      ref={hostRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="absolute inset-0 flex items-center justify-center"
    >
      <svg viewBox="0 0 240 240" className="w-full h-full max-w-[380px]" aria-hidden="true">
        <defs>
          <filter id="v4-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* ground shadow */}
        <ellipse
          cx="120"
          cy="196"
          rx={spread * 0.92}
          ry="11"
          fill="rgba(22,26,31,0.26)"
          filter="url(#v4-soft)"
        />
        <line
          x1="120"
          y1="168"
          x2="120"
          y2="192"
          stroke="#161A1F"
          strokeWidth="0.8"
          strokeDasharray="2 4"
          opacity="0.35"
        />

        {/* inner core */}
        {CUBE_E.map(([a, b], i) => {
          const p1 = inner[a];
          const p2 = inner[b];
          return (
            <line
              key={`i-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#2F6BFF"
              strokeWidth="0.9"
              opacity={depth((p1.k + p2.k) / 2) * 0.75}
              strokeLinecap="round"
            />
          );
        })}

        {/* outer wireframe */}
        {CUBE_E.map(([a, b], i) => {
          const p1 = outer[a];
          const p2 = outer[b];
          return (
            <line
              key={`o-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#161A1F"
              strokeWidth="1.1"
              opacity={depth((p1.k + p2.k) / 2)}
              strokeLinecap="round"
            />
          );
        })}

        {outer.map((p, i) => (
          <circle key={`v-${i}`} cx={p.x} cy={p.y} r={1.9} fill="#161A1F" opacity={depth(p.k)} />
        ))}
      </svg>
    </div>
  );
}

/* ---------------------------------- schematics -------------------- */

function Schematic({ kind }: { kind: number }) {
  const spin = 'animate-spin-slow motion-reduce:animate-none';
  const origin = { transformBox: 'view-box', transformOrigin: '60px 60px' } as CSSProperties;

  if (kind === 1) {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
        <g fill="none" stroke="#161A1F" strokeWidth="0.7" opacity="0.3">
          <line x1="6" y1="60" x2="114" y2="60" />
          <line x1="60" y1="6" x2="60" y2="114" />
        </g>
        <circle cx="60" cy="60" r="42" fill="none" stroke="#161A1F" strokeWidth="0.9" opacity="0.4" />
        <g className={spin} style={origin}>
          <circle
            cx="60"
            cy="60"
            r="30"
            fill="none"
            stroke="#161A1F"
            strokeWidth="0.9"
            strokeDasharray="4 5"
            opacity="0.5"
          />
          <circle cx="60" cy="30" r="3.4" fill="#2F6BFF" />
        </g>
        <circle cx="60" cy="60" r="15" fill="none" stroke="#161A1F" strokeWidth="1.1" opacity="0.7" />
        <circle cx="60" cy="60" r="4" fill="#161A1F" opacity="0.75" />
        <circle cx="102" cy="60" r="2.6" fill="#161A1F" opacity="0.5" />
      </svg>
    );
  }

  if (kind === 2) {
    return (
      <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
        <g fill="none" stroke="#161A1F" opacity="0.32" strokeWidth="0.7">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={16 + i * 8} y={16 + i * 8} width={88 - i * 16} height={88 - i * 16} />
          ))}
        </g>
        <g className={spin} style={origin}>
          <path d="M60 60 L60 14 A46 46 0 0 1 92 28 Z" fill="#2F6BFF" opacity="0.18" />
          <line x1="60" y1="60" x2="60" y2="14" stroke="#2F6BFF" strokeWidth="1.2" />
        </g>
        <line x1="6" y1="60" x2="114" y2="60" stroke="#161A1F" strokeWidth="0.7" opacity="0.3" />
        <line x1="60" y1="6" x2="60" y2="114" stroke="#161A1F" strokeWidth="0.7" opacity="0.3" />
        <circle cx="60" cy="60" r="3.2" fill="#161A1F" opacity="0.8" />
        <circle cx="82" cy="42" r="2.4" fill="#161A1F" opacity="0.55" />
        <circle cx="38" cy="76" r="2.4" fill="#161A1F" opacity="0.55" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <g stroke="#161A1F" strokeWidth="0.8" opacity="0.42" fill="none">
        <path d="M60 24 L26 50 M60 24 L94 50 M26 50 L60 78 M94 50 L60 78 M26 50 L26 88 M94 50 L94 88 M60 78 L60 100" />
      </g>
      <g fill="none" stroke="#161A1F" strokeWidth="1.1" opacity="0.7">
        <rect x="52" y="16" width="16" height="16" rx="3" />
        <rect x="18" y="42" width="16" height="16" rx="3" />
        <rect x="86" y="42" width="16" height="16" rx="3" />
        <rect x="18" y="80" width="16" height="16" rx="3" />
        <rect x="86" y="80" width="16" height="16" rx="3" />
      </g>
      <rect x="52" y="70" width="16" height="16" rx="3" fill="#2F6BFF" opacity="0.9" />
      <circle cx="60" cy="52" r="2.2" fill="#161A1F" opacity="0.55" />
    </svg>
  );
}

/* ---------------------------------- primitives -------------------- */

function useSeen<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, seen };
}

function Counter({ value, reduced }: { value: string; reduced: boolean }) {
  const { ref, seen } = useSeen<HTMLSpanElement>();
  const decimals = value.includes('.') ? value.split('.')[1].length : 0;
  const target = parseFloat(value);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduced) {
      setN(target);
      return;
    }
    if (!seen) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1500;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setN(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, target, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {n.toFixed(decimals)}
    </span>
  );
}

function SectionHead({
  label,
  title,
  index,
}: {
  label: string;
  title: string;
  index: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="flex items-end justify-between gap-6 mb-9 sm:mb-14"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.3em] uppercase text-[#161A1F]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF]" />
          <span className="min-w-0 truncate">{label}</span>
        </div>
        <h2 className="mt-3.5 font-manrope font-extrabold lowercase leading-[1] tracking-[0.01em] text-[#161A1F] text-[clamp(1.75rem,4.6vw,3rem)]">
          {title}
        </h2>
      </div>
      <div className="hidden sm:flex items-center gap-3 shrink-0 pb-1.5">
        <span className="h-px w-14 bg-[#161A1F]/20" />
        <span className="font-mono text-[10px] tracking-[0.22em] text-[#161A1F]">{index}</span>
      </div>
    </motion.div>
  );
}

/* ================================================================== */

export default function V4Blueprint({ lang, setLang }: VariantProps) {
  const t = CONTENT[lang];
  const prefersReduced = useReducedMotion();
  const reduced = !!prefersReduced;

  const [active, setActive] = useState<string>('top');
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const copyTimer = useRef<number | null>(null);

  const stamp = useMemo(() => {
    const d = new Date();
    const p = (v: number) => String(v).padStart(2, '0');
    return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
  }, []);

  /* active section — drives the solid pill in the rail */
  useEffect(() => {
    const els = t.nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [t.nav]);

  /* body scroll lock + focus return for the mobile drawer */
  useEffect(() => {
    if (!menuOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [menuOpen]);

  useEffect(
    () => () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  /* copies, and only reports "copied" when the write actually succeeded */
  const handleCopy = useCallback((id: string, val: string) => {
    const done = () => {
      setCopied(id);
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(null), 2000);
    };

    /* legacy path for insecure origins where the async API is missing */
    const legacy = () => {
      const ta = document.createElement('textarea');
      ta.value = val;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      try {
        ta.select();
        return document.execCommand('copy');
      } catch {
        return false;
      } finally {
        ta.remove();
      }
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(val).then(done, () => {
        if (legacy()) done();
      });
    } else if (legacy()) {
      done();
    }
  }, []);

  const langBtn = (code: 'ru' | 'en') => {
    const on = lang === code;
    return (
      <button
        key={code}
        type="button"
        onClick={() => setLang(code)}
        aria-pressed={on}
        aria-label={code.toUpperCase()}
        className={`h-11 min-w-[52px] px-4 rounded-[16px] font-mono text-[11px] tracking-[0.18em] uppercase transition-all duration-200 cursor-pointer ${FOCUS} ${
          on
            ? 'bg-[#161A1F] text-[#E4E8EC] font-bold'
            : `text-[#4A525B] hover:text-[#161A1F] ${PRESS}`
        }`}
      >
        {code}
      </button>
    );
  };

  const panelBase = `${SURFACE} ${RAISED} rounded-[28px] border border-white/45`;

  return (
    <div
      className="relative min-h-screen font-manrope text-[#161A1F] antialiased selection:bg-[#2F6BFF] selection:text-white"
      style={{
        background: 'linear-gradient(178deg, #DDE1E6 0%, #D6DAE0 42%, #C9CFD6 100%)',
      }}
    >
      {/* ------------------------------------------------ fixed chrome */}
      <div
        className="hidden lg:block fixed z-30 bottom-6 right-7 pointer-events-none"
        aria-hidden="true"
      >
        <div className="font-mono text-[10px] tracking-[0.24em] text-[#161A1F] text-right leading-relaxed">
          <div className="opacity-80">idx</div>
          <div className="text-[26px] font-medium tracking-[0.06em] leading-none mt-1">013</div>
        </div>
      </div>

      {/* ------------------------------------------------ left rail */}
      <aside className="hidden lg:flex fixed z-40 left-5 top-1/2 -translate-y-1/2 w-[208px] flex-col">
        <div className={`${panelBase} p-3`}>
          <div className="flex items-center justify-between px-2.5 pt-1 pb-3">
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#161A1F] opacity-65">
              {stamp}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF]" />
          </div>
          <div className="h-px bg-[#161A1F]/12 mb-3" />

          <nav className="flex flex-col gap-1">
            {t.nav.map((item) => {
              const Icon = NAV_ICONS[item.id] ?? Circle;
              const on = active === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative flex items-center gap-3 h-11 px-3 rounded-[16px] cursor-pointer transition-colors duration-200 ${FOCUS} ${
                    on ? '' : 'hover:bg-[#161A1F]/[0.045]'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="v4-rail-pill"
                      className="absolute inset-0 rounded-[16px] bg-[#161A1F] shadow-[4px_4px_12px_rgba(22,26,31,0.28)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                    />
                  )}
                  <Icon
                    className={`relative w-[15px] h-[15px] shrink-0 ${
                      on ? 'text-[#E4E8EC]' : 'text-[#4A525B]'
                    }`}
                    strokeWidth={1.6}
                  />
                  <span
                    className={`relative font-manrope text-[13px] font-semibold lowercase tracking-[0.05em] min-w-0 truncate ${
                      on ? 'text-[#E4E8EC]' : 'text-[#4A525B]'
                    }`}
                  >
                    {item.label}
                  </span>
                  {on && <span className="relative ml-auto w-1.5 h-1.5 rounded-full bg-[#2F6BFF]" />}
                </a>
              );
            })}
          </nav>

          <div className="h-px bg-[#161A1F]/12 my-3" />
          <div className={`${INSET_SM} rounded-[16px] px-3 py-2.5 flex items-center gap-2.5`}>
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-[#2F6BFF] opacity-70 motion-safe:animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-[#2F6BFF]" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#161A1F] min-w-0 truncate">
              {t.about.status}
            </span>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------ top bar */}
      <header className="fixed top-0 inset-x-0 z-50 lg:pl-[240px]">
        <div className="px-4 sm:px-8 lg:px-10 pt-4">
          <div className="max-w-[1400px] mx-auto">
            <div
              className={`bg-[#E4E8EC]/88 backdrop-blur-xl rounded-[22px] border border-white/50 ${RAISED} flex items-center justify-between gap-3 pl-4 pr-2 sm:pl-6 sm:pr-3 py-2`}
            >
              <div className="flex items-baseline gap-3 min-w-0">
                <a
                  href="#top"
                  className={`font-manrope font-extrabold lowercase tracking-[0.16em] text-[15px] sm:text-[17px] text-[#161A1F] cursor-pointer ${FOCUS} rounded-md`}
                >
                  {t.brand}
                </a>
                <span className="hidden sm:inline font-mono text-[11px] tracking-[0.22em] text-[#4A525B]">
                  {stamp}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden xl:flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[#4A525B] pr-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF]" />
                  {t.availability}
                </span>
                <div
                  className={`flex items-center gap-1 rounded-[18px] p-1 ${INSET_SM}`}
                  role="group"
                >
                  {(['ru', 'en'] as const).map(langBtn)}
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Menu"
                  aria-expanded={menuOpen}
                  className={`lg:hidden w-11 h-11 grid place-items-center rounded-[16px] ${RAISED} ${PRESS} ${FOCUS} cursor-pointer transition-all`}
                >
                  <Menu className="w-[18px] h-[18px] text-[#161A1F]" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------ mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer"
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="absolute inset-0 bg-[#C9CFD6]/85 backdrop-blur-xl"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t.brand}
              className={`absolute inset-x-4 top-4 ${SURFACE} rounded-[28px] border border-white/50 ${RAISED_LG} p-4`}
              initial={{ y: -22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <div className="flex items-center justify-between mb-4 pl-2">
                <span className="font-manrope font-extrabold lowercase tracking-[0.16em] text-[15px]">
                  {t.brand}
                </span>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close"
                  className={`w-11 h-11 grid place-items-center rounded-[16px] ${RAISED} ${PRESS} ${FOCUS} cursor-pointer`}
                >
                  <X className="w-[18px] h-[18px] text-[#161A1F]" strokeWidth={1.8} />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {t.nav.map((item) => {
                  const Icon = NAV_ICONS[item.id] ?? Circle;
                  const on = active === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3.5 h-14 px-4 rounded-[18px] cursor-pointer transition-all ${FOCUS} ${
                        on ? 'bg-[#161A1F] text-[#E4E8EC]' : `${INSET_SM} text-[#4A525B]`
                      }`}
                    >
                      <Icon className="w-[17px] h-[17px] shrink-0" strokeWidth={1.6} />
                      <span className="font-manrope text-[15px] font-semibold lowercase tracking-[0.05em]">
                        {item.label}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-auto opacity-85" strokeWidth={1.6} />
                    </a>
                  );
                })}
              </nav>

              <div className="mt-4 pt-4 border-t border-[#161A1F]/12 flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#4A525B]">
                  {t.about.location}
                </span>
                <div className={`flex items-center gap-1 rounded-[18px] p-1 ${INSET_SM}`}>
                  {(['ru', 'en'] as const).map(langBtn)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================ page */}
      <main className="relative lg:pl-[240px]">
        {/* ------------------------------------------ hero */}
        <section
          id="top"
          className="relative min-h-[100svh] flex items-center overflow-hidden pt-28 sm:pt-32 pb-14"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,rgba(255,255,255,0.8),rgba(255,255,255,0)_62%)]"
            aria-hidden="true"
          />
          <GridFloor height="52%" />

          <div className="relative z-10 w-full px-5 sm:px-8 lg:px-10">
            <div className="max-w-[1400px] mx-auto grid gap-10 xl:gap-14 xl:grid-cols-[minmax(0,1fr)_384px] items-center">
              {/* --- copy column --- */}
              <div className="min-w-0">
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className={`inline-flex items-center gap-2.5 rounded-full pl-3 pr-4 py-2 ${INSET_SM} max-w-full`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF] shrink-0" />
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#161A1F] min-w-0 truncate">
                    {t.hero.kicker}
                  </span>
                </motion.div>

                <h1 className="mt-7 font-manrope font-extrabold lowercase leading-[0.98] tracking-[-0.01em] text-[#161A1F] text-[clamp(1.6rem,7vw,4.3rem)]">
                  {t.hero.titleLines.map((line, i) => (
                    <span key={i} className="reveal-mask block pb-[0.14em] -mb-[0.14em]">
                      <motion.span
                        className="block"
                        variants={lineUp}
                        custom={i}
                        initial={reduced ? false : 'hidden'}
                        animate="show"
                      >
                        {line}
                      </motion.span>
                    </span>
                  ))}
                </h1>

                <div className="mt-6 flex items-start gap-4 max-w-[620px]">
                  <span className="hidden sm:block mt-2.5 h-px w-10 bg-[#161A1F]/25 shrink-0" />
                  <motion.p
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
                    className="text-[14px] sm:text-[15.5px] leading-relaxed text-[#4A525B]"
                  >
                    {t.hero.lead}
                  </motion.p>
                </div>

                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.62, ease: EASE }}
                  className="mt-9 flex flex-wrap items-center gap-3"
                >
                  <a
                    href="#projects"
                    className={`group inline-flex items-center gap-3 h-[52px] px-6 rounded-[20px] bg-[#161A1F] text-[#E4E8EC] font-semibold text-[14px] tracking-[0.02em] cursor-pointer transition-all duration-200 shadow-[6px_6px_18px_rgba(22,26,31,0.28)] hover:shadow-[8px_8px_24px_rgba(22,26,31,0.34)] active:translate-y-[1px] ${FOCUS}`}
                  >
                    {t.hero.ctaPrimary}
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={1.8}
                    />
                  </a>
                  <a
                    href="#contact"
                    className={`group inline-flex items-center gap-3 h-[52px] px-6 rounded-[20px] ${SURFACE} ${RAISED} ${PRESS} ${FOCUS} font-semibold text-[14px] text-[#161A1F] cursor-pointer transition-all duration-200`}
                  >
                    {t.hero.ctaSecondary}
                    <ArrowUpRight
                      className="w-4 h-4 text-[#4A525B] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.8}
                    />
                  </a>
                </motion.div>

                <motion.div
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.85 }}
                  className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[#4A525B]"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#161A1F]" />
                    {t.role}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-2">
                    <ArrowDown className="w-3.5 h-3.5 motion-safe:animate-bounce" strokeWidth={1.6} />
                    {t.hero.scroll}
                  </span>
                </motion.div>
              </div>

              {/* --- instrument column --- */}
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.35, ease: EASE }}
                className="min-w-0 flex flex-col gap-4"
              >
                {/* viewport */}
                <div
                  className={`relative ${SURFACE} rounded-[28px] ${INSET} border border-white/40 h-[280px] sm:h-[340px] xl:h-[368px] overflow-hidden`}
                >
                  <GridFloor height="46%" />
                  <WireCube reduced={reduced} />
                  <Ticks />
                  <div className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.22em] uppercase text-[#161A1F] opacity-70">
                    013 / xyz
                  </div>
                  <div className="absolute right-4 top-4 font-mono text-[10px] tracking-[0.2em] text-[#161A1F] opacity-70">
                    74°
                  </div>
                  <div className="absolute left-4 bottom-4 font-mono text-[10px] tracking-[0.2em] text-[#161A1F] opacity-70">
                    ×1.00
                  </div>
                  <div className="absolute right-4 bottom-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#161A1F]/25" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#161A1F]/25" />
                  </div>
                </div>

                {/* readout */}
                <div className={`${panelBase} p-4`}>
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#161A1F]/12">
                    <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#161A1F]">
                      {t.about.sectionLabel}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#4A525B] min-w-0 truncate">
                      {t.about.location}
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-[#4A525B] font-medium">
                    {t.role}
                  </p>
                  <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                    {t.marquee.slice(0, 4).map((m, i) => (
                      <div
                        key={i}
                        className={`${INSET_SM} rounded-[16px] px-3 py-3 flex items-center gap-2`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            i === 0 ? 'bg-[#2F6BFF]' : 'bg-[#161A1F]/35'
                          }`}
                        />
                        <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#161A1F] min-w-0 truncate">
                          {m}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------ metrics */}
        <section className="relative px-5 sm:px-8 lg:px-10 pb-4">
          <div className="max-w-[1400px] mx-auto grid gap-4 sm:grid-cols-3">
            {t.metrics.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                className={`${panelBase} p-5 sm:p-6`}
              >
                <div className="flex items-start justify-between">
                  <div className="font-manrope font-extrabold leading-none text-[#161A1F] text-[clamp(2.2rem,5vw,3.1rem)]">
                    <Counter value={m.value} reduced={reduced} />
                    <span className="text-[#2F6BFF]">{m.suffix}</span>
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#161A1F] opacity-65 pt-1.5">
                    0{i + 1}
                  </span>
                </div>
                <div className={`mt-5 h-1.5 rounded-full ${INSET_SM}`}>
                  <motion.div
                    className="h-full w-0 rounded-full bg-[#161A1F]/70"
                    initial={reduced ? false : { width: 0 }}
                    whileInView={{ width: `${[96, 74, 58][i] ?? 60}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.2 + i * 0.1, ease: EASE }}
                  />
                </div>
                <p className="mt-3.5 text-[13px] leading-snug text-[#4A525B] font-medium">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------ marquee */}
        <div className="relative my-12 sm:my-16 overflow-hidden border-y border-[#161A1F]/12 py-3.5">
          <div className="flex w-max animate-marquee motion-reduce:animate-none">
            {[0, 1].map((dup) => (
              <div
                key={dup}
                className="flex items-center shrink-0"
                aria-hidden={dup === 1 ? 'true' : undefined}
              >
                {t.marquee.map((m, i) => (
                  <span key={i} className="flex items-center shrink-0">
                    <span className="font-mono text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[#4A525B] px-6">
                      {m}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF]/70" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------ about */}
        <section id="about" className="relative px-5 sm:px-8 lg:px-10 py-6 sm:py-10">
          <div className="max-w-[1400px] mx-auto">
            <SectionHead label={t.about.sectionLabel} title={t.about.sectionTitle} index="001" />

            <div className="grid gap-4 lg:grid-cols-12">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                className={`${panelBase} p-6 sm:p-8 lg:col-span-7`}
              >
                <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.24em] uppercase text-[#161A1F]">
                  <Layers className="w-3.5 h-3.5" strokeWidth={1.6} />
                  {t.about.bioLabel}
                </div>
                <p className="mt-5 text-[15px] sm:text-[17px] leading-[1.7] text-[#161A1F] font-medium">
                  {t.about.bio}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <span
                    className={`${INSET_SM} rounded-full px-4 py-2.5 font-mono text-[10px] tracking-[0.18em] uppercase text-[#161A1F]`}
                  >
                    {t.about.location}
                  </span>
                  <span
                    className={`${INSET_SM} rounded-full px-4 py-2.5 font-mono text-[10px] tracking-[0.18em] uppercase text-[#161A1F] inline-flex items-center gap-2`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF]" />
                    {t.about.status}
                  </span>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={1}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                className={`${panelBase} p-6 sm:p-8 lg:col-span-5 flex flex-col`}
              >
                <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.24em] uppercase text-[#161A1F]">
                  <Cpu className="w-3.5 h-3.5" strokeWidth={1.6} />
                  {t.about.focusLabel}
                </div>
                <p className="mt-5 text-[14px] sm:text-[15px] leading-[1.7] text-[#4A525B]">
                  {t.about.focus}
                </p>
                <div className="mt-auto pt-7">
                  <div className={`${INSET} rounded-[22px] p-4 flex items-center gap-4`}>
                    <div className="w-16 h-16 shrink-0 opacity-90">
                      <Schematic kind={1} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#161A1F] opacity-65">
                        {t.availability}
                      </div>
                      <div className="mt-1 font-manrope font-extrabold lowercase tracking-[0.05em] text-[15px] text-[#161A1F] min-w-0 truncate">
                        {t.brand}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------ stack */}
        <section id="stack" className="relative px-5 sm:px-8 lg:px-10 py-14 sm:py-20">
          <div className="max-w-[1400px] mx-auto">
            <SectionHead label={t.stack.sectionLabel} title={t.stack.sectionTitle} index="002" />

            <div className="grid gap-4 lg:grid-cols-12">
              {/* sliders */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                className={`${panelBase} p-6 sm:p-8 lg:col-span-7`}
              >
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#161A1F]/12">
                  <span className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.24em] uppercase text-[#161A1F]">
                    <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.6} />
                    {t.stack.languagesLabel}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#161A1F] opacity-65">
                    %
                  </span>
                </div>

                <div className="mt-7 flex flex-col gap-8">
                  {t.stack.languages.map((l, i) => (
                    <div key={l.name}>
                      <div className="flex items-end justify-between gap-4 mb-3.5">
                        <div className="min-w-0">
                          <div className="font-manrope font-extrabold lowercase tracking-[0.04em] text-[17px] sm:text-[19px] text-[#161A1F] min-w-0 truncate">
                            {l.name}
                          </div>
                          <div className="mt-1 font-mono text-[11px] tracking-[0.16em] uppercase text-[#4A525B] min-w-0 truncate">
                            {l.level}
                          </div>
                        </div>
                        <div className="font-mono text-[20px] sm:text-[22px] font-medium tabular-nums text-[#161A1F] leading-none shrink-0">
                          {l.pct}
                          <span className="text-[12px] align-top opacity-65 ml-0.5">%</span>
                        </div>
                      </div>

                      {/* thin slider track */}
                      <div className={`relative h-2.5 rounded-full ${INSET_SM}`}>
                        <motion.div
                          className="absolute inset-y-0 left-0 w-0 rounded-full bg-[#2F6BFF]"
                          initial={reduced ? false : { width: 0 }}
                          whileInView={{ width: `${l.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.15 + i * 0.14, ease: EASE }}
                        />
                        <motion.div
                          className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#E4E8EC] shadow-[3px_3px_8px_rgba(22,26,31,0.28),-2px_-2px_6px_rgba(255,255,255,0.9)] grid place-items-center"
                          initial={reduced ? false : { left: '0%' }}
                          whileInView={{ left: `${l.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.15 + i * 0.14, ease: EASE }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6BFF]" />
                        </motion.div>
                      </div>

                      <div className="mt-2.5 flex justify-between font-mono text-[10px] tracking-[0.18em] text-[#161A1F] opacity-65">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* option tiles */}
              <motion.div
                variants={fadeUp}
                custom={1}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className={`${panelBase} p-6 sm:p-8 lg:col-span-5`}
              >
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#161A1F]/12">
                  <span className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.24em] uppercase text-[#161A1F]">
                    <Box className="w-3.5 h-3.5" strokeWidth={1.6} />
                    {t.stack.toolsLabel}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#161A1F] opacity-65 tabular-nums">
                    {String(t.stack.tools.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2.5">
                  {t.stack.tools.map((tool, i) => {
                    const last = i === t.stack.tools.length - 1 && t.stack.tools.length % 2 === 1;
                    return (
                      <div
                        key={tool}
                        className={`${INSET_SM} rounded-[18px] px-3.5 py-4 flex items-start gap-2.5 ${
                          last ? 'col-span-2' : ''
                        }`}
                      >
                        <span
                          className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                            i % 3 === 0 ? 'bg-[#2F6BFF]' : 'bg-[#161A1F]/35'
                          }`}
                        />
                        <span className="font-manrope text-[13px] font-semibold leading-snug text-[#161A1F] break-words">
                          {tool}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className={`mt-5 ${INSET} rounded-[22px] p-4 flex items-center gap-4`}>
                  <div className="w-16 h-16 shrink-0 opacity-90">
                    <Schematic kind={2} />
                  </div>
                  <p className="min-w-0 text-[13px] leading-snug text-[#4A525B] font-medium">
                    <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-[#161A1F] opacity-65">
                      {t.stack.sectionLabel}
                    </span>
                    <span className="block mt-1.5 text-[#161A1F] break-words">{t.hero.kicker}</span>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------ projects */}
        <section id="projects" className="relative px-5 sm:px-8 lg:px-10 py-14 sm:py-20">
          <div className="max-w-[1400px] mx-auto">
            <SectionHead
              label={t.projects.sectionLabel}
              title={t.projects.sectionTitle}
              index="003"
            />

            <div className="flex flex-col gap-4 sm:gap-5">
              {t.projects.items.map((p, i) => {
                const Icon = PROJECT_ICONS[p.id] ?? Box;
                return (
                  <motion.article
                    key={p.id}
                    variants={fadeUp}
                    custom={i}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className={`group relative ${SURFACE} rounded-[28px] border border-white/45 ${RAISED} hover:shadow-[16px_16px_38px_rgba(22,26,31,0.18),-12px_-12px_30px_rgba(255,255,255,0.92)] transition-shadow duration-300 overflow-hidden`}
                  >
                    <div className="grid lg:grid-cols-[228px_minmax(0,1fr)] xl:grid-cols-[264px_minmax(0,1fr)]">
                      {/* schematic bay */}
                      <div className="relative p-5 sm:p-6 lg:border-r border-[#161A1F]/10">
                        <div
                          className={`relative ${INSET} rounded-[22px] aspect-[16/10] lg:aspect-square overflow-hidden`}
                        >
                          <div className="absolute inset-0 grid place-items-center p-7">
                            <div className="w-full h-full max-w-[150px] max-h-[150px]">
                              <Schematic kind={i + 1} />
                            </div>
                          </div>
                          <Ticks />
                          <div className="absolute left-3.5 top-3.5 font-mono text-[10px] tracking-[0.22em] text-[#161A1F] opacity-70">
                            {p.index}
                          </div>
                          <div className="absolute right-3.5 bottom-3.5 font-mono text-[10px] tracking-[0.18em] text-[#161A1F] opacity-70">
                            {p.year}
                          </div>
                        </div>
                      </div>

                      {/* body */}
                      <div className="p-5 sm:p-7 lg:pl-8 flex flex-col">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-[#161A1F]">
                            <Icon className="w-3.5 h-3.5 text-[#4A525B]" strokeWidth={1.6} />
                            {p.category}
                          </span>
                          <span className="h-px flex-1 min-w-6 bg-[#161A1F]/15" />
                          <span className="font-mono text-[10px] tracking-[0.2em] text-[#161A1F] opacity-65">
                            {p.year}
                          </span>
                        </div>

                        <h3 className="mt-4 font-manrope font-extrabold lowercase leading-[1.05] tracking-[0.005em] text-[#161A1F] text-[clamp(1.25rem,3.1vw,2rem)] break-words">
                          {p.title}
                        </h3>

                        <p className="mt-4 text-[14px] sm:text-[15px] leading-[1.7] text-[#4A525B] max-w-[720px]">
                          {p.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                          {p.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`${INSET_SM} rounded-full px-3.5 py-2 font-mono text-[10px] tracking-[0.14em] uppercase text-[#161A1F] break-all`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-7 pt-5 border-t border-[#161A1F]/12 flex items-center justify-between gap-4">
                          <span className="inline-flex items-center gap-2.5 font-manrope text-[13px] font-bold lowercase tracking-[0.08em] text-[#161A1F]">
                            <span className="relative block h-px w-8 bg-[#161A1F]/30 overflow-hidden">
                              <span className="absolute inset-y-0 left-0 w-0 bg-[#2F6BFF] transition-all duration-500 group-hover:w-full" />
                            </span>
                            {t.projects.viewLabel}
                          </span>
                          <span
                            className={`w-11 h-11 grid place-items-center rounded-[16px] ${RAISED} transition-transform duration-300 group-hover:-translate-y-0.5`}
                          >
                            <ArrowUpRight className="w-4 h-4 text-[#161A1F]" strokeWidth={1.8} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------ contact */}
        <section id="contact" className="relative px-5 sm:px-8 lg:px-10 py-14 sm:py-20">
          <div className="max-w-[1400px] mx-auto">
            <SectionHead
              label={t.contact.sectionLabel}
              title={t.contact.sectionTitle}
              index="004"
            />

            <div className="grid gap-4 lg:grid-cols-12">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className={`${panelBase} p-6 sm:p-8 lg:col-span-5 flex flex-col`}
              >
                <p className="text-[15px] sm:text-[16.5px] leading-[1.7] text-[#161A1F] font-medium">
                  {t.contact.lead}
                </p>
                <div className="mt-6 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] uppercase text-[#4A525B]">
                  <Copy className="w-3.5 h-3.5" strokeWidth={1.6} />
                  {t.contact.copyHint}
                </div>
                <div className="mt-auto pt-8">
                  <div className={`${INSET} rounded-[22px] p-5`}>
                    <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-[#161A1F] opacity-65">
                      {t.availability}
                    </div>
                    <div className="mt-2.5 flex items-center gap-2.5">
                      <span className="relative flex w-2.5 h-2.5">
                        <span className="absolute inset-0 rounded-full bg-[#2F6BFF] opacity-70 motion-safe:animate-ping" />
                        <span className="relative w-2.5 h-2.5 rounded-full bg-[#2F6BFF]" />
                      </span>
                      <span className="font-manrope font-extrabold lowercase tracking-[0.06em] text-[15px] text-[#161A1F]">
                        {t.about.status}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={1}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className={`${panelBase} p-4 sm:p-5 lg:col-span-7 flex flex-col gap-3`}
              >
                {t.contact.items.map((c, i) => {
                  const isCopied = copied === c.id;
                  const inner = (
                    <>
                      <span
                        className={`w-11 h-11 shrink-0 grid place-items-center rounded-[15px] ${INSET_SM}`}
                      >
                        {c.href ? (
                          c.id === 'mail' ? (
                            <Mail className="w-4 h-4 text-[#161A1F]" strokeWidth={1.7} />
                          ) : (
                            <ExternalLink className="w-4 h-4 text-[#161A1F]" strokeWidth={1.7} />
                          )
                        ) : isCopied ? (
                          <Check className="w-4 h-4 text-[#2F6BFF]" strokeWidth={2.2} />
                        ) : (
                          <Copy className="w-4 h-4 text-[#161A1F]" strokeWidth={1.7} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block font-mono text-[11px] tracking-[0.24em] uppercase text-[#4A525B]">
                          {c.label}
                        </span>
                        <span
                          className="block mt-1 font-manrope font-extrabold text-[15px] sm:text-[17px] tracking-[0.01em] text-[#161A1F] break-all"
                          aria-live="polite"
                        >
                          {isCopied ? t.contact.copied : c.value}
                        </span>
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.2em] text-[#161A1F] opacity-65 shrink-0 hidden sm:block">
                        0{i + 1}
                      </span>
                      <ArrowUpRight
                        className="w-4 h-4 text-[#4A525B] shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        strokeWidth={1.8}
                      />
                    </>
                  );

                  const cls = `group flex items-center gap-4 w-full min-h-[76px] px-4 sm:px-5 py-4 rounded-[22px] ${RAISED} ${PRESS} ${FOCUS} cursor-pointer transition-all duration-200`;

                  return c.href ? (
                    <a
                      key={c.id}
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={c.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                      className={cls}
                    >
                      {inner}
                    </a>
                  ) : (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleCopy(c.id, c.copyValue ?? c.value)}
                      title={t.contact.copyHint}
                      className={cls}
                    >
                      {inner}
                    </button>
                  );
                })}
              </motion.div>
            </div>

            {/* closing statement */}
            <div className="mt-14 sm:mt-20">
              {t.contact.statement.map((w, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.5 }}
                  className="flex items-baseline gap-4 sm:gap-7 border-b border-[#161A1F]/12 py-3 sm:py-5"
                >
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-[#161A1F] opacity-80 shrink-0 w-8">
                    0{i + 1}
                  </span>
                  <span className="font-manrope font-extrabold lowercase leading-[1] tracking-[-0.01em] text-[#161A1F] text-[clamp(2rem,9vw,6rem)] break-words">
                    {w}
                  </span>
                  <span
                    className={`ml-auto shrink-0 w-2 h-2 rounded-full ${
                      i === t.contact.statement.length - 1 ? 'bg-[#2F6BFF]' : 'bg-[#161A1F]/25'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------ footer */}
        <footer className="relative px-5 sm:px-8 lg:px-10 pt-10 pb-28 sm:pb-32">
          <div className="max-w-[1400px] mx-auto">
            <div
              className={`${SURFACE} rounded-[28px] border border-white/45 ${RAISED} p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className={`w-11 h-11 shrink-0 grid place-items-center rounded-[15px] ${INSET_SM}`}>
                  <Circle className="w-3.5 h-3.5 text-[#2F6BFF]" strokeWidth={2.4} />
                </span>
                <div className="min-w-0">
                  <div className="font-manrope font-extrabold lowercase tracking-[0.16em] text-[15px] text-[#161A1F]">
                    {t.brand}
                  </div>
                  <div className="mt-1 text-[13px] text-[#4A525B] break-words">
                    {t.footer.rights}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#4A525B] break-words">
                  {t.footer.built}
                </span>
                <a
                  href="#top"
                  aria-label={t.nav[0].label}
                  className={`w-11 h-11 shrink-0 grid place-items-center rounded-[16px] ${RAISED} ${PRESS} ${FOCUS} cursor-pointer transition-all`}
                >
                  <ArrowUpRight className="w-4 h-4 text-[#161A1F]" strokeWidth={1.8} />
                </a>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-[#161A1F] opacity-80">
              <span>{stamp}</span>
              <span>013</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

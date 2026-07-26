import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { ArrowDown, ArrowUpRight, Check, Copy, Menu, X } from 'lucide-react';
import { CONTENT, type Lang } from '../content';
import type { VariantProps } from './types';

/* ------------------------------------------------------------------ *
 *  V3 — EDITORIAL / "ZERO™"
 *  Design-magazine spread. Warm paper, one saturated periwinkle,
 *  oversized Inter Black headlines, monospace bracket labels.
 * ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Only used inside inline `style` gradients — Tailwind classes are always
   written out as literals so the v4 scanner can see them. */
const BLUE = '#4C6FE7';
const BLUE_DEEP = '#3B5BD9';

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const riseSoft: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.04 } },
};

/* Per-line display sizes — the first line is the "poster" line. */
const HEAD_SIZES = [
  'clamp(2.9rem, 10.2vw, 10.5rem)',
  'clamp(1.95rem, 6.6vw, 7rem)',
  'clamp(2.4rem, 8vw, 8.5rem)',
];

/* Labels that never appear on screen (icon buttons / drawer name) and therefore
   have no slot in CONTENT — still localised so screen readers follow the toggle. */
const UI: Record<Lang, { menu: string; close: string; nav: string }> = {
  ru: { menu: 'Открыть меню', close: 'Закрыть меню', nav: 'Навигация' },
  en: { menu: 'Open menu', close: 'Close menu', nav: 'Navigation' },
};

/* ------------------------------ atoms ----------------------------- */

function Bracket({
  children,
  tone = 'ink',
  onBlueHover = false,
}: {
  children: ReactNode;
  tone?: 'ink' | 'white';
  /* when the parent `.group` flips to a blue background, take the type with it */
  onBlueHover?: boolean;
}) {
  const text = tone === 'white' ? 'text-white' : 'text-[#111111]';
  const brk = tone === 'white' ? 'text-white/85' : 'text-[#3B5BD9]';
  const hoverText = onBlueHover ? ' group-hover:text-white' : '';
  const hoverBrk = onBlueHover ? ' group-hover:text-white/85' : '';
  return (
    <span
      className={`inline-flex items-center gap-[0.55em] font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${text}${hoverText}`}
    >
      <span className={`${brk}${hoverBrk} transition-colors`}>[</span>
      <span>{children}</span>
      <span className={`${brk}${hoverBrk} transition-colors`}>]</span>
    </span>
  );
}

function SectionHead({ label, title, num }: { label: string; title: string; num: string }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-b border-[#DAD7D2] pb-6"
    >
      <div className="min-w-0">
        <motion.div variants={riseSoft}>
          <Bracket>{label}</Bracket>
        </motion.div>
        <motion.h2
          variants={rise}
          className="mt-4 font-inter font-black tracking-[-0.045em] leading-[0.86] text-[#111111] break-words"
          style={{ fontSize: 'clamp(2.2rem, 6.4vw, 5.5rem)' }}
        >
          {title}
        </motion.h2>
      </div>
      <motion.span
        variants={riseSoft}
        className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#111111] pb-2 shrink-0"
      >
        — {num}
      </motion.span>
    </motion.div>
  );
}

/* -------------------------- floating device ----------------------- */

function DeviceShell() {
  /* Purely decorative mock — kept out of the a11y tree (it also carries a
     low-contrast ™ glyph that has no business being announced). */
  return (
    <div className="relative w-full" aria-hidden="true">
      <div
        className="rounded-[30px] bg-[#111111] p-[9px]"
        style={{ boxShadow: '0 46px 90px -34px rgba(17,17,17,0.62), 0 4px 14px rgba(17,17,17,0.18)' }}
      >
        <div
          className="relative overflow-hidden rounded-[22px]"
          style={{
            aspectRatio: '3 / 4',
            background: `linear-gradient(158deg, #6482EE 0%, ${BLUE} 34%, ${BLUE_DEEP} 66%, #2B47BB 100%)`,
          }}
        >
          {/* fine grid */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 26px), repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 26px)',
            }}
          />
          {/* glass sheen */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(122deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0) 46%)' }}
          />
          {/* speaker */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 h-[5px] w-14 rounded-full bg-white/35" />

          <svg viewBox="0 0 300 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="248" cy="92" r="42" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
            <circle cx="248" cy="92" r="26" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
            <circle cx="248" cy="92" r="6" fill="rgba(255,255,255,0.85)" />

            <polyline
              points="34,268 74,232 110,246 150,186 190,204 228,148 268,116"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g fill="#FFFFFF">
              <circle cx="34" cy="268" r="4" />
              <circle cx="150" cy="186" r="4" />
              <circle cx="268" cy="116" r="5.5" />
            </g>

            <rect x="34" y="316" width="58" height="10" rx="5" fill="rgba(255,255,255,0.85)" />
            <rect x="34" y="336" width="128" height="10" rx="5" fill="rgba(255,255,255,0.38)" />
            <rect x="34" y="356" width="88" height="10" rx="5" fill="rgba(255,255,255,0.24)" />

            <rect x="196" y="312" width="70" height="58" rx="14" fill="rgba(255,255,255,0.16)" />
            <path
              d="M214 341 h34 M231 324 v34"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>

          <span className="absolute bottom-3 right-4 font-mono text-[10px] tracking-[0.28em] text-white/80">
            ™
          </span>
        </div>
      </div>
      {/* side button */}
      <span className="absolute -right-[3px] top-[24%] h-14 w-[3px] rounded-full bg-[#111111]" />
      <span className="absolute -left-[3px] top-[18%] h-8 w-[3px] rounded-full bg-[#111111]" />
    </div>
  );
}

function FloatingDevice({ parallax }: { parallax: boolean }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 52, damping: 18, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 52, damping: 18, mass: 0.7 });
  const x = useTransform(sx, [-1, 1], [-30, 30]);
  const y = useTransform(sy, [-1, 1], [-22, 22]);
  const rotate = useTransform(sx, [-1, 1], [2.6, -2.6]);

  useEffect(() => {
    if (!parallax) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [parallax, mx, my]);

  return (
    <motion.div
      style={{ x, y, rotate }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.55, ease: EASE }}
      className="w-full"
    >
      <div className="rotate-[-9deg]">
        <div className={parallax ? 'animate-float' : ''}>
          <DeviceShell />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------ counter --------------------------- */

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const reduce = useReducedMotion();
  const decimals = value.includes('.') ? value.split('.')[1].length : 0;
  const target = Number.parseFloat(value);
  const [display, setDisplay] = useState<string>(reduce ? value : (0).toFixed(decimals));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    if (!started) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1500;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay((target * eased).toFixed(decimals));
      if (p < 1) raf = window.requestAnimationFrame(step);
    };
    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [started, reduce, target, decimals, value]);

  return (
    <motion.span
      className="inline-flex items-baseline"
      viewport={{ once: true, amount: 0.5 }}
      onViewportEnter={() => setStarted(true)}
    >
      <span className="tabular-nums">{display}</span>
      <span className="text-[#3B5BD9]">{suffix}</span>
    </motion.span>
  );
}

/* ------------------------------- page ----------------------------- */

export default function V3Editorial({ lang, setLang }: VariantProps) {
  const t = CONTENT[lang];
  const reduce = useReducedMotion();
  const parallax = !reduce;

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>('top');

  /* body scroll lock while the drawer is open (restored on unmount) */
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  /* esc closes the drawer */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  /* copy feedback timer */
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(null), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  /* scroll spy */
  useEffect(() => {
    const els = t.nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [t.nav]);

  /* Only flips to "copied" when the text actually reached the clipboard. */
  const handleCopy = useCallback((id: string, text: string) => {
    const legacyCopy = () => {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '0';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) setCopied(id);
      } catch {
        /* clipboard unavailable — leave the label on "copy" */
      }
    };

    const written = navigator.clipboard?.writeText(text);
    if (written) {
      written.then(() => setCopied(id)).catch(legacyCopy);
    } else {
      legacyCopy();
    }
  }, []);

  /* NB: no `overflow-x-hidden` on the root — it would create a scroll container
     and break the sticky header. `body` already clips the x-axis (index.css). */
  return (
    <div className="min-h-screen bg-[#F4F3F1] text-[#111111] font-manrope antialiased">
      {/* ==================== THIN META BAR ==================== */}
      <div className="border-b border-[#DAD7D2]">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12 py-2.5">
          <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-4 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#111111]">
            <span className="min-w-0 truncate">{t.role}</span>
            <span className="hidden md:block min-w-0 text-center truncate">{t.hero.kicker}</span>
            <span className="flex min-w-0 items-center justify-end gap-2 overflow-hidden">
              <span className="relative flex h-[7px] w-[7px] shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#3B5BD9] opacity-70 animate-ping" />
                <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-[#3B5BD9]" />
              </span>
              <span className="min-w-0 truncate">{t.availability}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ==================== NAV ==================== */}
      <header className="sticky top-0 z-50 border-b border-[#DAD7D2] bg-[#F4F3F1]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-4 h-[68px]">
            <a
              href="#top"
              className="font-inter font-black tracking-[-0.05em] text-[19px] sm:text-[22px] leading-none text-[#111111] shrink-0"
            >
              {t.brand}
              <sup className="font-mono text-[9px] align-super ml-[3px] text-[#3B5BD9]">™</sup>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              {t.nav.map((n) => {
                const active = activeId === n.id;
                return (
                  <a
                    key={n.id}
                    href={n.href}
                    aria-current={active ? 'true' : undefined}
                    className={`relative font-mono text-[11px] uppercase tracking-[0.18em] px-3.5 min-h-[44px] flex items-center transition-colors cursor-pointer ${
                      active ? 'text-[#111111]' : 'text-[#5A5A5A] hover:text-[#111111]'
                    }`}
                  >
                    {n.label}
                    <span
                      className={`absolute left-3.5 right-3.5 bottom-3 h-[2px] bg-[#3B5BD9] origin-left transition-transform duration-500 ${
                        active ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 rounded-full border border-[#DAD7D2] p-0.5">
                {(['ru', 'en'] as const).map((code) => {
                  const active = lang === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLang(code)}
                      aria-pressed={active}
                      className={`font-mono text-[11px] uppercase tracking-[0.16em] min-h-[44px] min-w-[48px] rounded-full transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#111111] text-white font-bold'
                          : 'text-[#5A5A5A] hover:text-[#111111] hover:bg-[#EAE8E5]'
                      }`}
                    >
                      {code.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={UI[lang].menu}
                aria-expanded={menuOpen}
                aria-controls="v3-mobile-nav"
                className="md:hidden h-11 w-11 flex items-center justify-center rounded-full border border-[#DAD7D2] text-[#111111] hover:bg-[#EAE8E5] transition-colors cursor-pointer"
              >
                <Menu size={18} strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== MOBILE DRAWER ==================== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="v3-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label={UI[lang].nav}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-[#F4F3F1] md:hidden overflow-y-auto"
          >
            <div className="px-5 sm:px-8 py-5 flex items-center justify-between border-b border-[#DAD7D2]">
              <span className="font-inter font-black tracking-[-0.05em] text-[19px] text-[#111111]">
                {t.brand}
                <sup className="font-mono text-[9px] align-super ml-[3px] text-[#3B5BD9]">™</sup>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={UI[lang].close}
                className="h-11 w-11 flex items-center justify-center rounded-full border border-[#DAD7D2] text-[#111111] cursor-pointer"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            <nav className="px-5 sm:px-8 py-6">
              {t.nav.map((n, i) => (
                <motion.a
                  key={n.id}
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05 + i * 0.05, ease: EASE }}
                  className="group flex items-baseline gap-4 border-b border-[#DAD7D2] py-5 cursor-pointer"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[#5A5A5A] w-8 shrink-0">
                    0{i + 1}
                  </span>
                  <span className="font-inter font-black tracking-[-0.04em] text-[clamp(1.9rem,9vw,2.75rem)] leading-[0.95] text-[#111111] group-hover:text-[#3B5BD9] transition-colors">
                    {n.label}
                  </span>
                </motion.a>
              ))}
            </nav>

            <div className="px-5 sm:px-8 pb-28">
              <Bracket>{t.contact.sectionLabel}</Bracket>
              <div className="mt-4 space-y-2">
                {t.contact.items.map((item) => (
                  <p key={item.id} className="font-manrope text-[15px] text-[#5A5A5A] break-all">
                    <span className="text-[#111111] font-semibold">{item.label}</span> — {item.value}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== HERO ==================== */}
      <section id="top" className="scroll-mt-24 px-5 sm:px-8 lg:px-12 pt-10 sm:pt-16">
        <div className="mx-auto max-w-[1500px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-[#DAD7D2] pb-5"
          >
            <Bracket>{t.projects.sectionLabel}</Bracket>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#111111]">
              {t.footer.built}
            </span>
          </motion.div>

          {/* --- headline + occluding device --- */}
          <div className="relative mt-8 sm:mt-14">
            <div className="pointer-events-none absolute z-20 hidden md:block right-[2%] lg:right-[5%] top-[26%] w-[clamp(190px,20vw,320px)]">
              <FloatingDevice parallax={parallax} />
            </div>

            <h1 className="relative z-10 font-inter font-black text-[#111111] tracking-[-0.045em] leading-[0.85] break-words">
              {t.hero.titleLines.map((line, i) => (
                <span key={i} className="reveal-mask block">
                  <motion.span
                    className="block"
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.95, delay: 0.12 + i * 0.11, ease: EASE }}
                    style={{ fontSize: HEAD_SIZES[i] ?? HEAD_SIZES[2] }}
                  >
                    {i === 2 ? (
                      <>
                        <span className="text-[#3B5BD9]">{line.slice(0, 1)}</span>
                        {line.slice(1)}
                      </>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          {/* --- lead / device (mobile) / CTAs --- */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-10 border-t border-[#DAD7D2] pt-8 sm:pt-10"
          >
            <motion.div variants={rise} className="md:col-span-5">
              <Bracket>{t.about.sectionLabel}</Bracket>
              <p className="mt-4 font-manrope text-[15px] sm:text-[17px] leading-relaxed text-[#5A5A5A] max-w-[52ch]">
                {t.hero.lead}
              </p>
            </motion.div>

            {/* mobile-only device — no occlusion on small screens */}
            <motion.div variants={rise} className="md:hidden">
              <div className="w-[58%] max-w-[240px] mx-auto">
                <div className="rotate-[-7deg]">
                  <div className={parallax ? 'animate-float' : ''}>
                    <DeviceShell />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={rise} className="md:col-span-4 md:col-start-9">
              <div className="flex flex-col sm:flex-row md:flex-col gap-3">
                <a
                  href="#projects"
                  className="group inline-flex items-center justify-between gap-4 rounded-full bg-[#111111] text-white px-7 min-h-[56px] font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-[#3B5BD9] transition-colors cursor-pointer"
                >
                  {t.hero.ctaPrimary}
                  <ArrowUpRight
                    size={17}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </a>
                <a
                  href="#contact"
                  className="group inline-flex items-center justify-between gap-4 rounded-full border border-[#111111]/25 text-[#111111] px-7 min-h-[56px] font-mono text-[11px] uppercase tracking-[0.2em] hover:border-[#3B5BD9] hover:text-[#3B5BD9] transition-colors cursor-pointer"
                >
                  {t.hero.ctaSecondary}
                  <ArrowUpRight
                    size={17}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </a>
              </div>

              <div className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#111111]">
                <ArrowDown size={14} strokeWidth={2} className={reduce ? '' : 'animate-bounce'} />
                {t.hero.scroll}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== METRICS ==================== */}
      <section className="mt-14 sm:mt-20 border-y border-[#DAD7D2]">
        <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#DAD7D2]">
            {t.metrics.map((m, i) => (
              <motion.div
                key={i}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.75, ease: EASE, delay: i * 0.1 }}
                className="py-8 sm:py-12 sm:px-8 sm:first:pl-0 sm:last:pr-0"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#111111]">
                  0{i + 1}
                </span>
                <div
                  className="mt-3 font-inter font-black tracking-[-0.05em] leading-[0.9] text-[#111111]"
                  style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)' }}
                >
                  <Counter value={m.value} suffix={m.suffix} />
                </div>
                <p className="mt-3 font-manrope text-[15px] leading-snug text-[#5A5A5A] max-w-[26ch]">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MARQUEE ==================== */}
      <div className="bg-[#111111] overflow-hidden py-4 sm:py-5">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {t.marquee.map((word, i) => (
                <span key={i} className="flex items-center shrink-0">
                  <span className="font-inter font-black tracking-[-0.03em] text-white text-[clamp(1.1rem,2.6vw,2rem)] px-6 sm:px-9 whitespace-nowrap">
                    {word}
                  </span>
                  <span className="h-[7px] w-[7px] rounded-full bg-[#4C6FE7] shrink-0" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ==================== ABOUT — BLUE FEATURE BLOCK ==================== */}
      <section id="about" className="scroll-mt-24 px-5 sm:px-8 lg:px-12 pt-16 sm:pt-24">
        <div className="mx-auto max-w-[1500px]">
          <SectionHead label={t.about.sectionLabel} title={t.about.sectionTitle} num="01" />

          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="relative mt-10 sm:mt-14 rounded-[28px] overflow-hidden text-white"
            style={{
              background: `linear-gradient(180deg, #4160DC 0%, ${BLUE_DEEP} 45%, #2F4CC2 100%)`,
              boxShadow: '0 40px 90px -46px rgba(43,71,187,0.75)',
            }}
          >
            {/* decorative field */}
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 84px)',
              }}
            />
            <svg
              viewBox="0 0 400 400"
              className="pointer-events-none absolute -bottom-24 -right-16 h-[380px] w-[380px] opacity-40"
              aria-hidden="true"
            >
              <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
              <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
            </svg>

            <span className="absolute top-6 right-7 font-inter font-black text-[26px] leading-none text-white/90 select-none">
              ™
            </span>

            <div className="relative p-7 sm:p-12 lg:p-16">
              <Bracket tone="white">{t.about.focusLabel}</Bracket>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
                <div className="lg:col-span-5">
                  <h3
                    className="font-inter font-black tracking-[-0.045em] leading-[0.88] text-white break-words"
                    style={{ fontSize: 'clamp(2rem, 5.2vw, 4.25rem)' }}
                  >
                    {t.brand}
                  </h3>
                  <p className="mt-5 font-manrope text-[15px] sm:text-[17px] leading-relaxed text-white max-w-[40ch]">
                    {t.about.focus}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2.5">
                    <span className="inline-flex items-center rounded-full border border-white/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white">
                      {t.about.location}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#2F4CC2] font-bold">
                      <span className="h-[7px] w-[7px] rounded-full bg-[#2F4CC2]" />
                      {t.about.status}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-6 lg:col-start-7">
                  <div className="border-t border-white/30 pt-6">
                    <Bracket tone="white">{t.about.bioLabel}</Bracket>
                    <p className="mt-5 font-manrope text-[16px] sm:text-[19px] leading-relaxed text-white max-w-[54ch]">
                      {t.about.bio}
                    </p>
                  </div>
                  <div className="mt-8 border-t border-white/30 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== STACK ==================== */}
      <section id="stack" className="scroll-mt-24 px-5 sm:px-8 lg:px-12 pt-20 sm:pt-28">
        <div className="mx-auto max-w-[1500px]">
          <SectionHead label={t.stack.sectionLabel} title={t.stack.sectionTitle} num="02" />

          <div className="mt-10 sm:mt-14">
            <Bracket>{t.stack.languagesLabel}</Bracket>

            <div className="mt-7">
              {t.stack.languages.map((s, i) => (
                <motion.div
                  key={i}
                  variants={rise}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.75, ease: EASE, delay: i * 0.08 }}
                  className="group py-7 border-t border-[#DAD7D2] first:border-t-0"
                >
                  <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
                    <h4
                      className="font-inter font-black tracking-[-0.04em] leading-none text-[#111111] group-hover:text-[#3B5BD9] transition-colors duration-500"
                      style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.75rem)' }}
                    >
                      {s.name}
                    </h4>
                    <div className="flex items-baseline gap-5">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#111111]">
                        {s.level}
                      </span>
                      <span className="font-inter font-black tabular-nums tracking-[-0.03em] text-[#3B5BD9] text-[clamp(1.1rem,2.2vw,1.75rem)] leading-none">
                        {s.pct}
                        <span className="text-[0.6em]">%</span>
                      </span>
                    </div>
                  </div>

                  {/* long thin rule that fills with blue */}
                  <div className="relative mt-6 h-[3px] w-full bg-[#DAD7D2] overflow-hidden">
                    <motion.span
                      className="absolute inset-y-0 left-0 bg-[#3B5BD9]"
                      initial={reduce ? { width: `${s.pct}%` } : { width: '0%' }}
                      whileInView={{ width: `${s.pct}%` }}
                      viewport={{ once: true, amount: 0.6 }}
                      /* `width` is not a transform, so MotionConfig's reduced-motion
                         handling does not cover it — gate the duration by hand. */
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { duration: 1.2, delay: 0.15 + i * 0.12, ease: EASE }
                      }
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-12 border-t border-[#DAD7D2] pt-8"
          >
            <Bracket>{t.stack.toolsLabel}</Bracket>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {t.stack.tools.map((tool, i) => (
                <motion.span
                  key={i}
                  variants={riseSoft}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
                  className="inline-flex items-center rounded-full border border-[#111111]/20 bg-[#EAE8E5] px-4 py-2.5 font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#111111] hover:border-[#3B5BD9] hover:text-[#3B5BD9] hover:bg-[#F4F3F1] transition-colors"
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== PROJECTS ==================== */}
      <section id="projects" className="scroll-mt-24 px-5 sm:px-8 lg:px-12 pt-20 sm:pt-28">
        <div className="mx-auto max-w-[1500px]">
          <SectionHead label={t.projects.sectionLabel} title={t.projects.sectionTitle} num="03" />

          <div className="mt-4 sm:mt-6">
            {t.projects.items.map((p, i) => (
              <motion.article
                key={p.id}
                variants={rise}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.06 }}
                className="group relative border-b border-[#DAD7D2] cursor-pointer"
              >
                {/* hover wash */}
                <span className="pointer-events-none absolute inset-x-[-1rem] inset-y-0 bg-[#EAE8E5] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[16px]" />
                {/* blue rule wipe */}
                <span className="pointer-events-none absolute left-0 bottom-[-1px] h-[3px] w-full origin-left scale-x-0 bg-[#3B5BD9] transition-transform duration-[900ms] ease-out group-hover:scale-x-100" />

                <div className="relative grid grid-cols-12 gap-x-6 gap-y-6 py-10 sm:py-16">
                  <div className="col-span-12 md:col-span-1 flex md:block items-baseline justify-between">
                    <span
                      className="font-inter font-black tracking-[-0.05em] leading-none text-[#6F6A63] group-hover:text-[#3B5BD9] transition-colors duration-500"
                      style={{ fontSize: 'clamp(2.4rem, 5vw, 4.25rem)' }}
                    >
                      {p.index}
                    </span>
                    <span className="md:hidden font-mono text-[11px] uppercase tracking-[0.2em] text-[#111111]">
                      {p.year}
                    </span>
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <Bracket>{p.category}</Bracket>
                    <h3
                      className="mt-4 font-inter font-black tracking-[-0.04em] leading-[0.92] text-[#111111] break-words"
                      style={{ fontSize: 'clamp(1.6rem, 3.3vw, 3rem)' }}
                    >
                      {p.title}
                    </h3>
                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#111111] underline underline-offset-[6px] decoration-[#111111]/30 group-hover:decoration-[#3B5BD9] transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-4 flex flex-col justify-between gap-6">
                    <p className="font-manrope text-[15px] sm:text-[16px] leading-relaxed text-[#5A5A5A] max-w-[48ch]">
                      {p.description}
                    </p>
                    <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#111111] group-hover:text-[#3B5BD9] transition-colors">
                      {t.projects.viewLabel}
                      <ArrowUpRight
                        size={16}
                        strokeWidth={2}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </span>
                  </div>

                  <div className="hidden md:flex md:col-span-1 justify-end">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#111111]">
                      {p.year}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CONTACT ==================== */}
      <section id="contact" className="scroll-mt-24 px-5 sm:px-8 lg:px-12 pt-20 sm:pt-28">
        <div className="mx-auto max-w-[1500px]">
          <SectionHead label={t.contact.sectionLabel} title={t.contact.sectionTitle} num="04" />

          {/* channel cards */}
          <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#DAD7D2] rounded-[24px] overflow-hidden border border-[#DAD7D2]">
            {t.contact.items.map((item, i) => {
              const isCopied = copied === item.id;
              const href = item.href;

              const body = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <Bracket onBlueHover>{item.label}</Bracket>
                    <span className="font-mono text-[10px] tracking-[0.24em] text-[#5A5A5A] group-hover:text-white/85 transition-colors">
                      0{i + 1}
                    </span>
                  </div>

                  <div className="mt-8">
                    <p className="font-inter font-black tracking-[-0.035em] leading-[1.05] text-[#111111] group-hover:text-white transition-colors break-all text-[clamp(1.15rem,2.4vw,1.6rem)]">
                      {item.value}
                    </p>
                    <span
                      aria-live="polite"
                      className="mt-5 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#5A5A5A] group-hover:text-white transition-colors"
                    >
                      {href ? (
                        <>
                          {t.projects.viewLabel}
                          <ArrowUpRight
                            size={15}
                            strokeWidth={2}
                            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                          />
                        </>
                      ) : isCopied ? (
                        <>
                          {t.contact.copied}
                          <Check size={15} strokeWidth={2.2} />
                        </>
                      ) : (
                        <>
                          {t.contact.copyHint}
                          <Copy size={15} strokeWidth={2} />
                        </>
                      )}
                    </span>
                  </div>
                </>
              );

              const cls =
                'group relative flex flex-col justify-between text-left bg-[#F4F3F1] hover:bg-[#3B5BD9] transition-colors duration-300 p-7 sm:p-9 min-h-[210px] cursor-pointer';

              if (!href) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleCopy(item.id, item.copyValue ?? item.value)}
                    aria-label={`${item.label}: ${item.value} — ${
                      isCopied ? t.contact.copied : t.contact.copyHint
                    }`}
                    className={cls}
                  >
                    {body}
                  </button>
                );
              }

              const external = href.startsWith('http');
              return (
                <a
                  key={item.id}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer noopener' : undefined}
                  className={cls}
                >
                  {body}
                </a>
              );
            })}
          </div>

          {/* closing two-column block */}
          <div className="mt-20 sm:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 border-t border-[#DAD7D2] pt-12 sm:pt-16">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="lg:col-span-7"
            >
              <h2
                className="font-inter font-black tracking-[-0.05em] leading-[0.84] text-[#111111] break-words"
                style={{ fontSize: 'clamp(2.4rem, 7vw, 6.5rem)' }}
              >
                {t.contact.statement.map((word, i) => (
                  <span key={i} className="reveal-mask block">
                    <motion.span variants={rise} className="block">
                      <span className={i === 1 ? 'text-[#3B5BD9]' : undefined}>{word}</span>
                      {i === t.contact.statement.length - 1 ? (
                        <span className="text-[#3B5BD9]">.</span>
                      ) : null}
                    </motion.span>
                  </span>
                ))}
              </h2>
            </motion.div>

            <motion.div
              variants={rise}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="lg:col-span-4 lg:col-start-9"
            >
              <Bracket>{t.about.sectionLabel}</Bracket>
              <p className="mt-5 font-manrope text-[15px] sm:text-[17px] leading-relaxed text-[#5A5A5A]">
                {t.contact.lead}
              </p>
              <div className="mt-8 border-t border-[#DAD7D2] pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#111111]">
                {t.availability}
              </div>
              <a
                href="#top"
                className="group mt-6 inline-flex items-center justify-between gap-4 rounded-full bg-[#111111] text-white px-7 min-h-[56px] font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-[#3B5BD9] transition-colors cursor-pointer w-full sm:w-auto"
              >
                {t.nav[0].label}
                <ArrowUpRight
                  size={17}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="mt-20 sm:mt-28 px-5 sm:px-8 lg:px-12 pb-28 sm:pb-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="border-t border-[#DAD7D2] pt-8">
            <h2
              className="font-inter font-black tracking-[-0.055em] leading-[0.8] text-[#111111] break-words select-none"
              style={{ fontSize: 'clamp(2.6rem, 15vw, 13rem)' }}
            >
              {t.brand}
              <sup className="font-mono align-super text-[0.16em] ml-[0.05em] text-[#3B5BD9]">™</sup>
            </h2>

            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#DAD7D2] pt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[#111111]">
              <span>{t.footer.rights}</span>
              <span className="text-[#5A5A5A] text-[12px] normal-case tracking-[0.1em]">
                {t.footer.built}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

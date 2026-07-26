import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Check, Copy, Menu, X } from 'lucide-react';

import { CONTENT } from '../content';
import type { VariantProps } from './types';

/* ------------------------------------------------------------------ *
 *  V1 — "lab."  ·  Swiss brutalist poster
 *  paper #F2F1EE · panel #E8E7E3 · ink #0A0A0A · one accent #FF3B18
 *  zero radius, hairline rules, brutal scale contrast.
 * ------------------------------------------------------------------ */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SHELL = 'mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-12';
const META = 'font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] leading-[1.7]';
const SWIPE = 'ease-[cubic-bezier(0.76,0,0.24,1)]';

/* ----------------------------- primitives ----------------------------- */

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function ArrowSquare() {
  return (
    <span
      aria-hidden="true"
      className="grid h-11 w-11 shrink-0 place-items-center bg-[#0A0A0A] text-[#F2F1EE]"
    >
      <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2} />
    </span>
  );
}

function SectionHead({ num, label, title }: { num: string; label: string; title: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-[#0A0A0A] pb-5">
      <div className="flex min-w-0 items-end gap-4 sm:gap-6">
        <span className={`${META} mb-2 shrink-0 text-[#0A0A0A]/70`}>{num}</span>
        <h2 className="min-w-0 break-words font-unbounded text-[clamp(1.9rem,6vw,4.4rem)] font-black lowercase leading-[0.85] tracking-[-0.045em] text-[#0A0A0A]">
          {title}
        </h2>
      </div>
      <span className={`${META} mb-2 text-[#0A0A0A]/70`}>{label}</span>
    </div>
  );
}

function VerticalNumeral({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none font-unbounded font-black leading-none ${className}`}
      style={{
        writingMode: 'vertical-rl',
        WebkitTextStroke: '1.5px #0A0A0A',
        color: 'transparent',
        letterSpacing: '-0.04em',
      }}
    >
      {text}
    </span>
  );
}

/* -------------------------- animated numerals -------------------------- */

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const reduce = useReducedMotion();
  const decimals = value.includes('.') ? value.split('.')[1].length : 0;
  const target = parseFloat(value);
  const [shown, setShown] = useState<string>(value);
  const rafRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  /* park at zero only when motion is allowed, the value is numeric, and we have not run yet */
  useEffect(() => {
    if (!reduce && !doneRef.current && !Number.isNaN(target)) setShown((0).toFixed(decimals));
  }, [reduce, decimals, target]);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const run = useCallback(() => {
    if (reduce || doneRef.current || Number.isNaN(target)) {
      setShown(value);
      return;
    }
    doneRef.current = true;
    const duration = 1500;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      if (p < 1) {
        setShown((target * eased).toFixed(decimals));
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setShown(value);
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [reduce, target, decimals, value]);

  return (
    <motion.span
      onViewportEnter={run}
      viewport={{ once: true, amount: 0.4 }}
      className="inline-flex items-baseline font-unbounded text-[clamp(2.4rem,7.5vw,5.4rem)] font-black leading-[0.8] tracking-[-0.05em] text-[#0A0A0A] tabular-nums"
    >
      {shown}
      <span className="text-[#FF3B18]">{suffix}</span>
    </motion.span>
  );
}

/* ---------------------------- hero artwork ----------------------------- */

function LabFigure() {
  return (
    <svg
      viewBox="0 0 360 560"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className="h-full w-full"
    >
      <g stroke="#F2F1EE" strokeWidth="1" opacity="0.5">
        <line x1="72" y1="0" x2="72" y2="560" />
        <line x1="180" y1="0" x2="180" y2="560" />
        <line x1="288" y1="0" x2="288" y2="560" />
      </g>
      <circle cx="234" cy="128" r="98" fill="none" stroke="#0A0A0A" strokeWidth="1.25" opacity="0.75" />

      <g fill="#0A0A0A">
        {/* head */}
        <polygon points="146,26 234,8 246,90 156,110" />
        {/* neck */}
        <polygon points="176,104 214,98 219,138 179,144" />
        {/* torso */}
        <polygon points="148,126 252,142 276,268 238,326 126,312 114,196" />
        {/* raised left arm */}
        <polygon points="116,152 132,158 100,262 74,346 50,338 84,246" />
        {/* right arm */}
        <polygon points="256,158 306,232 288,262 242,198" />
        {/* legs */}
        <polygon points="130,312 188,318 178,548 116,548" />
        <polygon points="198,318 240,322 262,548 202,548" />
      </g>

      {/* poster slash cutting the figure */}
      <polygon points="42,318 356,194 356,238 50,360" fill="#F2F1EE" opacity="0.94" />
      <polygon points="42,318 356,194 356,203 42,327" fill="#0A0A0A" opacity="0.9" />

      {/* solid marker */}
      <rect x="286" y="402" width="48" height="48" fill="#0A0A0A" />
      <rect x="297" y="413" width="26" height="26" fill="#FF3B18" />
    </svg>
  );
}

/* ================================ PAGE ================================= */

export default function V1Lab({ lang, setLang }: VariantProps) {
  const t = CONTENT[lang];
  const reduce = useReducedMotion();

  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>('top');
  const [copied, setCopied] = useState<string | null>(null);
  const copyTimer = useRef<number | null>(null);

  /* lock body scroll while the drawer is open — restored on unmount too */
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  /* active-section marker in the nav */
  useEffect(() => {
    const els = t.nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [t]);

  useEffect(
    () => () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  const handleCopy = useCallback((id: string, text: string) => {
    /* guarded — and the "copied" state only flips when the write actually resolves */
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(id);
        if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
        copyTimer.current = window.setTimeout(() => setCopied(null), 2000);
      },
      () => undefined,
    );
  }, []);

  const lineVariants: Variants = {
    hidden: { y: '112%' },
    show: (i: number) => ({
      y: '0%',
      transition: { duration: 0.95, ease: EASE, delay: 0.18 + i * 0.1 },
    }),
  };

  const langBtn = (l: 'ru' | 'en') =>
    `h-11 w-11 cursor-pointer font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-200 ${
      lang === l ? 'bg-[#0A0A0A] text-[#F2F1EE]' : 'bg-transparent text-[#0A0A0A] hover:bg-[#0A0A0A]/10'
    }`;

  const lastProject = t.projects.items.length - 1;

  return (
    <div className="grain min-h-screen bg-[#F2F1EE] font-manrope text-[#0A0A0A] selection:bg-[#FF3B18] selection:text-[#0A0A0A]">
      {/* ================================ NAV ================================ */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#0A0A0A] bg-[#F2F1EE]/95 backdrop-blur-[3px]">
        <div className={`${SHELL} flex h-16 items-center justify-between gap-3 sm:h-[74px] sm:gap-4`}>
          <a
            href="#top"
            className="group flex h-11 shrink-0 items-center font-unbounded text-[16px] font-black lowercase leading-none tracking-[-0.05em] sm:text-[19px]"
          >
            {t.brand}
            <span className="text-[#FF3B18] transition-transform duration-300 group-hover:translate-x-1">.</span>
          </a>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {t.nav.map((n) => (
              <a
                key={n.id}
                href={n.href}
                className={`relative flex h-11 items-center px-3 ${META} transition-colors duration-200 ${
                  active === n.id ? 'text-[#0A0A0A]' : 'text-[#0A0A0A]/65 hover:text-[#0A0A0A]'
                }`}
              >
                {n.label}
                <span
                  className={`absolute inset-x-3 bottom-[13px] h-[2px] origin-left bg-[#FF3B18] transition-transform duration-300 ${
                    active === n.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className={`${META} hidden text-[#0A0A0A]/70 xl:inline`}>{t.availability}</span>
            <div className="flex items-stretch border border-[#0A0A0A]">
              <button
                type="button"
                onClick={() => setLang('ru')}
                aria-pressed={lang === 'ru'}
                className={`${langBtn('ru')} border-r border-[#0A0A0A]`}
              >
                RU
              </button>
              <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'} className={langBtn('en')}>
                EN
              </button>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t.a11y.menu}
              aria-expanded={menuOpen}
              className="grid h-11 w-11 cursor-pointer place-items-center bg-[#0A0A0A] text-[#F2F1EE] lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* ============================ MOBILE DRAWER =========================== */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="v1-drawer-title"
          className="fixed inset-0 z-[60] flex flex-col bg-[#F2F1EE] lg:hidden"
        >
          <div className={`${SHELL} flex h-16 shrink-0 items-center justify-between border-b border-[#0A0A0A]`}>
            <span id="v1-drawer-title" className="font-unbounded text-[16px] font-black lowercase tracking-[-0.05em]">
              {t.brand}
              <span className="text-[#FF3B18]">.</span>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={t.a11y.close}
              className="grid h-11 w-11 cursor-pointer place-items-center bg-[#0A0A0A] text-[#F2F1EE]"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto">
            {t.nav.map((n, i) => (
              <a
                key={n.id}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="group flex min-h-[64px] items-center justify-between gap-4 border-b border-[#0A0A0A]/15 px-5 py-4 sm:px-8"
              >
                <span className="flex min-w-0 items-baseline gap-4">
                  <span className={`${META} shrink-0 text-[#0A0A0A]/65`}>{`0${i + 1}`}</span>
                  <span className="break-words font-unbounded text-[clamp(1.5rem,7.5vw,2.3rem)] font-black lowercase leading-none tracking-[-0.045em]">
                    {n.label}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            ))}
          </nav>

          <div className={`${SHELL} shrink-0 border-t border-[#0A0A0A] py-6`}>
            <p className={`${META} text-[#0A0A0A]/70`}>{t.role}</p>
            <p className={`${META} mt-1 flex items-center gap-2 text-[#0A0A0A]`}>
              <span className="h-2 w-2 bg-[#FF3B18]" />
              {t.availability}
            </p>
          </div>
        </div>
      )}

      {/* ================================ HERO =============================== */}
      <section id="top" className="relative scroll-mt-20 pt-16 sm:pt-[74px]">
        <div className={`${SHELL} relative`}>
          {/* marginalia — mono clusters pinned to the top margin of the grid */}
          <div className="hidden grid-cols-3 gap-6 border-b border-[#0A0A0A]/20 py-3 md:grid">
            <span className={`${META} text-[#0A0A0A]/70`}>IDX — 2026</span>
            <span className={`${META} text-center text-[#0A0A0A]/70`}>{t.about.location}</span>
            <span className={`${META} flex items-center justify-end gap-2 text-[#0A0A0A]`}>
              <span className={`h-2 w-2 shrink-0 bg-[#FF3B18] ${reduce ? '' : 'animate-blink'}`} />
              {t.about.status}
            </span>
          </div>

          <div className="grid gap-y-12 pb-4 pt-10 sm:pt-12 lg:grid-cols-12 lg:gap-x-10 lg:pt-16">
            {/* ---------------- left column ---------------- */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-[#0A0A0A] pb-4">
                <span className={`${META} text-[#0A0A0A]`}>{t.hero.kicker}</span>
                <span className={`${META} text-[#0A0A0A]/70`}>{t.role}</span>
              </div>

              <h1 className="mt-8 font-unbounded text-[clamp(1.75rem,6.6vw,6.2rem)] font-black lowercase leading-[0.9] tracking-[-0.05em] text-[#0A0A0A] sm:mt-10">
                {t.hero.titleLines.map((line, i) => (
                  <span key={i} className="reveal-mask block">
                    <motion.span
                      className="block break-words"
                      custom={i}
                      variants={lineVariants}
                      initial={reduce ? undefined : 'hidden'}
                      animate={reduce ? undefined : 'show'}
                    >
                      {i === 1 ? (
                        <>
                          <span className="mr-[0.22em] inline-block h-[0.4em] w-[0.4em] bg-[#FF3B18] align-baseline" />
                          {line}
                        </>
                      ) : (
                        line
                      )}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <div className="mt-9 flex items-end justify-between gap-8 sm:mt-12">
                <p className="max-w-[46ch] text-[15px] leading-[1.65] text-[#0A0A0A]/75 sm:text-[16px]">
                  {t.hero.lead}
                </p>
                <VerticalNumeral text="01" className="hidden shrink-0 text-[72px] sm:block" />
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3 sm:mt-11 sm:gap-4">
                <a
                  href="#projects"
                  className="group inline-flex h-[52px] cursor-pointer items-center gap-4 bg-[#0A0A0A] pl-6 pr-2 text-[#F2F1EE] transition-colors duration-300 hover:bg-[#FF3B18] hover:text-[#0A0A0A]"
                >
                  <span className={`${META} whitespace-nowrap`}>{t.hero.ctaPrimary}</span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#F2F1EE] text-[#0A0A0A] transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowUpRight className="h-[18px] w-[18px]" strokeWidth={2} />
                  </span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex h-[52px] cursor-pointer items-center border border-[#0A0A0A] px-6 text-[#0A0A0A] transition-colors duration-300 hover:bg-[#0A0A0A] hover:text-[#F2F1EE]"
                >
                  <span className={`${META} whitespace-nowrap`}>{t.hero.ctaSecondary}</span>
                </a>
              </div>

              <div className="mt-10 flex items-center gap-3 sm:mt-14">
                <ArrowDown
                  className={`h-4 w-4 shrink-0 text-[#FF3B18] ${reduce ? '' : 'animate-float'}`}
                  strokeWidth={2.5}
                />
                <span className={`${META} text-[#0A0A0A]/70`}>{t.hero.scroll}</span>
              </div>
            </div>

            {/* ---------------- right column: red block + figure ---------------- */}
            <div className="relative lg:col-span-5">
              {/* the full-bleed red block — wipes up on load */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom bg-[#FF3B18]"
                  initial={reduce ? undefined : { scaleY: 0 }}
                  animate={reduce ? undefined : { scaleY: 1 }}
                  transition={{ duration: 0.95, ease: EASE, delay: 0.15 }}
                />
                <motion.div
                  className="absolute inset-0"
                  initial={reduce ? undefined : { opacity: 0 }}
                  animate={reduce ? undefined : { opacity: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.85 }}
                >
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 sm:p-5">
                    <span className={`${META} text-[#0A0A0A]`}>{t.projects.sectionLabel}</span>
                    <span className={`${META} text-[#0A0A0A]`}>{t.projects.items[0]?.year}</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
                    <span className={`${META} text-[#0A0A0A]`}>{t.stack.sectionTitle}</span>
                    <span className="h-6 w-6 shrink-0 bg-[#0A0A0A]" />
                  </div>
                </motion.div>
              </div>

              {/* angular silhouette breaking out of the block */}
              <div className="pointer-events-none absolute -left-[4%] top-[2%] h-[104%] w-[108%]">
                <motion.div
                  initial={reduce ? undefined : { opacity: 0, y: 34 }}
                  animate={reduce ? undefined : { opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 0.55 }}
                  className="h-full w-full"
                >
                  <LabFigure />
                </motion.div>
              </div>

              <div className="mt-12 hidden grid-cols-2 gap-x-6 border-t border-[#0A0A0A] pt-3 lg:grid">
                <span className={`${META} text-[#0A0A0A]/70`}>FIG. 01</span>
                <span className={`${META} text-right text-[#0A0A0A]/70`}>{t.availability}</span>
              </div>
            </div>
          </div>
        </div>

        {/* the giant wordmark anchoring the lower edge */}
        <div className={`${SHELL} pb-5 pt-6 sm:pt-10`}>
          <div className="border-t border-[#0A0A0A] pt-3">
            <h2 className="break-words font-unbounded text-[clamp(2.4rem,12.4vw,11.5rem)] font-black lowercase leading-[0.82] tracking-[-0.06em] text-[#0A0A0A]">
              {t.brand}
              <span className="text-[#FF3B18]">.</span>
            </h2>
          </div>
        </div>
      </section>

      {/* ============================== MARQUEE ============================== */}
      <div className="overflow-hidden border-y border-[#0A0A0A] bg-[#E8E7E3] py-3.5">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0 items-center">
              {t.marquee.map((word, i) => (
                <span key={`${half}-${i}`} className="flex shrink-0 items-center">
                  <span className={`${META} whitespace-nowrap px-5 text-[#0A0A0A] sm:px-7`}>{word}</span>
                  <span className="h-[7px] w-[7px] shrink-0 rotate-45 bg-[#FF3B18]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============================== METRICS ============================== */}
      <section className={`${SHELL} py-[clamp(3rem,7vw,6rem)]`}>
        <div className="grid border-t border-[#0A0A0A] sm:grid-cols-3">
          {t.metrics.map((m, i) => (
            <Reveal
              key={`metric-${i}`}
              delay={i * 0.08}
              className={`border-b border-[#0A0A0A]/15 py-7 sm:border-b-0 sm:py-10 ${
                i > 0 ? 'sm:border-l sm:border-[#0A0A0A]/15 sm:pl-6 lg:pl-9' : ''
              } ${i < 2 ? 'sm:pr-6 lg:pr-9' : ''}`}
            >
              <span className={`${META} text-[#0A0A0A]/70`}>{`0${i + 1}`}</span>
              <div className="mt-5">
                <Counter value={m.value} suffix={m.suffix} />
              </div>
              <p className="mt-5 max-w-[22ch] text-[14px] leading-[1.5] text-[#0A0A0A]/75">{m.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =============================== ABOUT =============================== */}
      <section id="about" className={`${SHELL} scroll-mt-20 py-[clamp(3rem,7vw,6rem)]`}>
        <SectionHead num="02" label={t.about.sectionLabel} title={t.about.sectionTitle} />

        <div className="grid gap-10 pt-10 lg:grid-cols-12 lg:gap-x-10 lg:pt-14">
          <Reveal className="lg:col-span-3">
            <div className="border-t-2 border-[#0A0A0A] pt-4">
              <p className={`${META} text-[#0A0A0A]`}>{t.about.bioLabel}</p>
              <div className="mt-7 hidden lg:block">
                <div className="aspect-square w-full max-w-[186px] bg-[#FF3B18]">
                  <div className="grid h-full w-full grid-cols-2 grid-rows-2">
                    <span className="border-b border-r border-[#0A0A0A]" />
                    <span className="border-b border-[#0A0A0A] bg-[#0A0A0A]" />
                    <span className="border-r border-[#0A0A0A] bg-[#0A0A0A]" />
                    <span />
                  </div>
                </div>
                <p className={`${META} mt-3 text-[#0A0A0A]/70`}>FIG. 02</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-6">
            <p className="text-[clamp(1.05rem,2.1vw,1.5rem)] leading-[1.5] text-[#0A0A0A]">{t.about.bio}</p>
            <div className="mt-10 border-t border-[#0A0A0A]/15 pt-6">
              <p className={`${META} text-[#0A0A0A]/70`}>{t.about.focusLabel}</p>
              <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.65] text-[#0A0A0A]/75 sm:text-[16px]">
                {t.about.focus}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16} className="lg:col-span-3">
            <div className="border-t-2 border-[#0A0A0A] pt-4">
              <dl className="space-y-6">
                <div>
                  <dt className={`${META} text-[#0A0A0A]/70`}>LOC</dt>
                  <dd className={`${META} mt-1.5 text-[#0A0A0A]`}>{t.about.location}</dd>
                </div>
                <div>
                  <dt className={`${META} text-[#0A0A0A]/70`}>STATUS</dt>
                  <dd className={`${META} mt-1.5 flex items-center gap-2 text-[#0A0A0A]`}>
                    <span className={`h-2 w-2 shrink-0 bg-[#FF3B18] ${reduce ? '' : 'animate-blink'}`} />
                    {t.about.status}
                  </dd>
                </div>
                <div>
                  <dt className={`${META} text-[#0A0A0A]/70`}>ROLE</dt>
                  <dd className={`${META} mt-1.5 text-[#0A0A0A]`}>{t.role}</dd>
                </div>
              </dl>
              <div className="mt-8 flex gap-1.5">
                <span className="h-8 w-8 bg-[#0A0A0A]" />
                <span className="h-8 w-8 bg-[#FF3B18]" />
                <span className="h-8 w-8 border border-[#0A0A0A]" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =============================== STACK =============================== */}
      <section id="stack" className="scroll-mt-20 border-y border-[#0A0A0A] bg-[#E8E7E3] py-[clamp(3rem,7vw,6rem)]">
        <div className={SHELL}>
          <SectionHead num="03" label={t.stack.sectionLabel} title={t.stack.sectionTitle} />

          <div className="grid gap-12 pt-10 lg:grid-cols-12 lg:gap-x-10 lg:pt-14">
            {/* meters */}
            <div className="lg:col-span-7">
              <p className={`${META} border-b border-[#0A0A0A]/25 pb-3 text-[#0A0A0A]/70`}>
                {t.stack.languagesLabel}
              </p>
              <ul>
                {t.stack.languages.map((s, i) => (
                  <li key={s.name} className="border-b border-[#0A0A0A]/15 py-6">
                    <Reveal delay={i * 0.08}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                        <span className="font-unbounded text-[clamp(1.1rem,2.6vw,1.7rem)] font-black lowercase leading-none tracking-[-0.04em] text-[#0A0A0A]">
                          {s.name}
                        </span>
                        <span className={`${META} ml-auto text-[#0A0A0A]/70`}>{s.level}</span>
                        <span className="font-mono text-[13px] font-medium tabular-nums text-[#0A0A0A]">{s.pct}%</span>
                      </div>
                      <div className="mt-4 h-3 w-full bg-[#0A0A0A]/12">
                        <motion.div
                          className="h-full origin-left bg-[#0A0A0A]"
                          style={{ width: `${s.pct}%` }}
                          initial={reduce ? undefined : { scaleX: 0 }}
                          whileInView={reduce ? undefined : { scaleX: 1 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 1.05, ease: EASE, delay: 0.12 + i * 0.1 }}
                        />
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>

            {/* tools */}
            <div className="lg:col-span-5">
              <p className={`${META} border-b border-[#0A0A0A]/25 pb-3 text-[#0A0A0A]/70`}>{t.stack.toolsLabel}</p>
              <Reveal delay={0.1}>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {t.stack.tools.map((tool) => (
                    <li key={tool}>
                      <span
                        className={`${META} inline-flex min-h-[44px] cursor-default items-center border border-[#0A0A0A] px-4 text-[#0A0A0A] transition-colors duration-200 hover:bg-[#0A0A0A] hover:text-[#E8E7E3]`}
                      >
                        {tool}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-10 flex items-end justify-between gap-6 border-t border-[#0A0A0A] pt-5">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className={`${META} text-[#0A0A0A]/70`}>FIG. 03</span>
                    <span className={`${META} text-[#0A0A0A]`}>{`× ${t.stack.tools.length}`}</span>
                  </div>
                  <VerticalNumeral text="03" className="shrink-0 text-[58px]" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== PROJECTS ============================= */}
      <section id="projects" className="scroll-mt-20 py-[clamp(3rem,7vw,6rem)]">
        <div className={SHELL}>
          <SectionHead num="04" label={t.projects.sectionLabel} title={t.projects.sectionTitle} />
        </div>

        <div className="mt-10 sm:mt-14">
          {t.projects.items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <a
                href="#contact"
                className={`group relative block border-t border-[#0A0A0A] ${
                  i === lastProject ? 'border-b' : ''
                }`}
              >
                {/* signature: red panel slides up under the whole row */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 origin-bottom scale-y-0 bg-[#FF3B18] transition-transform duration-500 ${SWIPE} group-hover:scale-y-100`}
                />

                <div className={`${SHELL} relative`}>
                  <div className="grid gap-x-8 gap-y-5 py-8 sm:py-10 lg:grid-cols-12 lg:items-start lg:py-12">
                    <div className="lg:col-span-1">
                      <span className={`inline-block font-unbounded text-[clamp(1.5rem,4vw,2.6rem)] font-black leading-none tracking-[-0.05em] text-[#0A0A0A] transition-transform duration-500 ${SWIPE} group-hover:-translate-y-1`}>
                        {p.index}
                      </span>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                        <span className={`${META} text-[#0A0A0A]/70 transition-colors duration-300 group-hover:text-[#0A0A0A]`}>
                          {p.category}
                        </span>
                        <span className={`${META} text-[#0A0A0A]/70 transition-colors duration-300 group-hover:text-[#0A0A0A]`}>
                          {p.year}
                        </span>
                      </div>
                      <h3 className="mt-3 break-words font-unbounded text-[clamp(1.2rem,3.6vw,2.4rem)] font-black leading-[1] tracking-[-0.045em] text-[#0A0A0A]">
                        {p.title}
                      </h3>
                    </div>

                    <div className="lg:col-span-5">
                      <p className="max-w-[58ch] text-[14.5px] leading-[1.6] text-[#0A0A0A]/75 transition-colors duration-300 group-hover:text-[#0A0A0A] sm:text-[15px]">
                        {p.description}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {p.tags.map((tag) => (
                          <li
                            key={tag}
                            className={`${META} border border-[#0A0A0A]/35 px-2.5 py-1.5 text-[#0A0A0A] transition-colors duration-300 group-hover:border-[#0A0A0A]`}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-4 lg:col-span-1 lg:justify-end">
                      <span className={`${META} text-[#0A0A0A] lg:hidden`}>{t.projects.viewLabel}</span>
                      <span className={`inline-block transition-transform duration-500 ${SWIPE} group-hover:translate-x-2`}>
                        <ArrowSquare />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className={`${SHELL} mt-6 flex flex-wrap items-center justify-between gap-3`}>
          <span className={`${META} text-[#0A0A0A]/70`}>
            {`${t.projects.items.length} / ${t.projects.items.length}`}
          </span>
          <span className={`${META} text-[#0A0A0A]/70`}>{t.projects.viewLabel}</span>
        </div>
      </section>

      {/* ============================== CONTACT ============================== */}
      <section id="contact" className="scroll-mt-20 bg-[#0A0A0A] py-[clamp(3.5rem,8vw,7rem)] text-[#F2F1EE]">
        <div className={SHELL}>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-[#F2F1EE]/35 pb-5">
            <div className="flex min-w-0 items-end gap-4 sm:gap-6">
              <span className={`${META} mb-2 shrink-0 text-[#F2F1EE]/70`}>05</span>
              <h2 className="min-w-0 break-words font-unbounded text-[clamp(1.9rem,6vw,4.4rem)] font-black lowercase leading-[0.85] tracking-[-0.045em] text-[#F2F1EE]">
                {t.contact.sectionTitle}
              </h2>
            </div>
            <span className={`${META} mb-2 text-[#F2F1EE]/70`}>{t.contact.sectionLabel}</span>
          </div>

          <div className="grid gap-10 pt-10 lg:grid-cols-12 lg:gap-x-10 lg:pt-14">
            <Reveal className="lg:col-span-5">
              <p className="max-w-[40ch] text-[clamp(1.05rem,2.1vw,1.45rem)] leading-[1.5] text-[#F2F1EE]">
                {t.contact.lead}
              </p>
              <div className="mt-8 flex items-center gap-3">
                <span className={`h-2.5 w-2.5 shrink-0 bg-[#FF3B18] ${reduce ? '' : 'animate-blink'}`} />
                <span className={`${META} text-[#F2F1EE]/80`}>{t.availability}</span>
              </div>
              <div className="mt-10 hidden h-[168px] w-[168px] bg-[#FF3B18] lg:block">
                <div className="grid h-full w-full grid-cols-2 grid-rows-2">
                  <span className="bg-[#0A0A0A]" />
                  <span />
                  <span />
                  <span className="bg-[#0A0A0A]" />
                </div>
              </div>
            </Reveal>

            <div className="lg:col-span-7">
              <ul>
                {t.contact.items.map((item, i) => {
                  const isCopy = Boolean(item.copyValue);
                  const isExternal = Boolean(item.href && item.href.startsWith('http'));
                  const body = (
                    <>
                      <span className="flex min-w-0 flex-1 flex-col gap-2 text-left">
                        <span className="flex items-center gap-4">
                          <span className={`${META} text-[#F2F1EE]/65`}>{`0${i + 1}`}</span>
                          <span className={`${META} text-[#F2F1EE]/85`}>{item.label}</span>
                        </span>
                        <span
                          aria-live={isCopy ? 'polite' : undefined}
                          className="break-all font-unbounded text-[clamp(1.05rem,3.2vw,1.9rem)] font-black lowercase leading-[1.08] tracking-[-0.04em] text-[#F2F1EE]"
                        >
                          {isCopy && copied === item.id ? t.contact.copied : item.value}
                        </span>
                      </span>
                      <span className="ml-4 grid h-11 w-11 shrink-0 place-items-center bg-[#F2F1EE] text-[#0A0A0A] transition-colors duration-300 group-hover:bg-[#FF3B18]">
                        {isCopy ? (
                          copied === item.id ? (
                            <Check className="h-[18px] w-[18px]" strokeWidth={2.4} />
                          ) : (
                            <Copy className="h-[18px] w-[18px]" strokeWidth={2} />
                          )
                        ) : (
                          <ArrowUpRight
                            className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
                            strokeWidth={2}
                          />
                        )}
                      </span>
                    </>
                  );

                  return (
                    <li key={item.id} className="border-t border-[#F2F1EE]/25 last:border-b">
                      {isCopy ? (
                        <button
                          type="button"
                          onClick={() => handleCopy(item.id, item.copyValue ?? item.value)}
                          aria-label={
                            copied === item.id
                              ? `${item.label} — ${t.contact.copied}`
                              : `${item.label} — ${t.contact.copyHint}`
                          }
                          className="group flex w-full cursor-pointer items-center px-1 py-6 text-left transition-colors duration-300 hover:bg-[#F2F1EE]/10"
                        >
                          {body}
                        </button>
                      ) : (
                        <a
                          href={item.href}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noreferrer noopener' : undefined}
                          className="group flex w-full cursor-pointer items-center px-1 py-6 transition-colors duration-300 hover:bg-[#F2F1EE]/10"
                        >
                          {body}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className={`${META} mt-4 text-[#F2F1EE]/70`}>{t.contact.copyHint}</p>
            </div>
          </div>

          {/* closing statement — three words, poster scale */}
          <div className="mt-[clamp(3rem,8vw,6rem)] border-t border-[#F2F1EE]/35 pt-8">
            {t.contact.statement.map((word, i) => (
              <Reveal key={`statement-${i}`} delay={i * 0.07}>
                <div className="flex items-baseline gap-4 border-b border-[#F2F1EE]/15 py-2 sm:gap-8">
                  <span className={`${META} shrink-0 text-[#F2F1EE]/60`}>{`0${i + 1}`}</span>
                  <span
                    className={`min-w-0 break-words font-unbounded text-[clamp(1.75rem,8.4vw,7.5rem)] font-black lowercase leading-[0.95] tracking-[-0.055em] ${
                      i === 1 ? 'text-[#FF3B18]' : 'text-[#F2F1EE]'
                    }`}
                  >
                    {word}
                  </span>
                  {i === 2 && <span className="ml-auto hidden h-8 w-8 shrink-0 bg-[#FF3B18] sm:block" />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =============================== FOOTER ============================== */}
      <footer className="bg-[#F2F1EE] pb-28 pt-10 sm:pt-14">
        <div className={SHELL}>
          <div className="border-t border-[#0A0A0A] pt-6">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
              <a
                href="#top"
                className="inline-flex min-h-[44px] items-center break-words font-unbounded text-[clamp(1.5rem,5vw,3rem)] font-black lowercase leading-none tracking-[-0.055em] text-[#0A0A0A]"
              >
                {t.brand}
                <span className="text-[#FF3B18]">.</span>
              </a>
              <div className="flex flex-col gap-1.5 sm:items-end">
                <span className={`${META} text-[#0A0A0A]/75`}>{t.footer.rights}</span>
                <span className={`${META} text-[#0A0A0A]/75`}>{t.footer.built}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#0A0A0A]/15 pt-5">
              <span className={`${META} text-[#0A0A0A]/70`}>{t.role}</span>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 bg-[#0A0A0A]" />
                <span className="h-3 w-3 bg-[#FF3B18]" />
                <span className="h-3 w-3 border border-[#0A0A0A]" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

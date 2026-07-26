import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowUpRight, ArrowRight, ArrowDown, Menu, X, Check, Copy, Mail,
  Compass, Layers, Terminal, Cpu, Zap,
} from 'lucide-react';
import {
  motion, useInView, useReducedMotion, useMotionValue, useSpring,
  useScroll, useTransform, type Variants,
} from 'framer-motion';
import { CONTENT } from './content';
import type { VariantProps } from './variants/types';

/* ------------------------------------------------------------------ *
 * Editorial layout · instrument controls · dark palette
 *   page #0E1116 · alt #141922 · card #171C26
 *   ink  #ECEFF5 · muted #9BA6BC · accent #4C6FE7 / #8DA6FF
 * ------------------------------------------------------------------ */

// framer's BezierDefinition is a readonly 4-tuple — annotate, don't `as const`
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const lineReveal: Variants = {
  hidden: { y: '110%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 0.9, delay: 0.12 + i * 0.09, ease: EASE },
  }),
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.07, ease: EASE },
  }),
};

const onScroll = {
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true, margin: '-60px' },
  variants: fadeUp,
};

const SECTION_IDS = ['top', 'about', 'stack', 'projects', 'contact'];
const NAV_ICONS = [Compass, Layers, Terminal, Cpu, Mail];

/* ------------------------------------------------------------------ *
 * Small pieces
 * ------------------------------------------------------------------ */

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] ${className}`}>
      <span className="opacity-50">[</span> {children} <span className="opacity-50">]</span>
    </span>
  );
}

function Ticks({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <span className="absolute left-0 top-1/2 h-px w-2.5 -translate-y-1/2 bg-current opacity-40" />
      <span className="absolute left-1/2 top-0 h-2.5 w-px -translate-x-1/2 bg-current opacity-40" />
    </span>
  );
}

function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState('0');
  const target = parseFloat(value);
  const decimals = value.includes('.') ? 1 : 0;

  useEffect(() => {
    if (!inView) return;
    if (reduce || Number.isNaN(target)) {
      setShown(value);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1150, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown((target * eased).toFixed(decimals));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, decimals, value]);

  return <span ref={ref}>{shown}</span>;
}

function Magnetic({
  children, className = '', href, ariaLabel,
}: { children: React.ReactNode; className?: string; href: string; ariaLabel?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 20);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 20);
  };

  return (
    <motion.a
      ref={ref} href={href} aria-label={ariaLabel}
      onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: sx, y: sy }} className={className}
    >
      {children}
    </motion.a>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function Site({ lang, setLang }: VariantProps) {
  const t = CONTENT[lang];
  const reduce = useReducedMotion();

  const [active, setActive] = useState('top');
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) setActive(e.target.id); },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const copyToClipboard = useCallback((value: string) => {
    Promise.resolve(navigator.clipboard?.writeText(value))
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => undefined);
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 110, damping: 20 });
  const py = useSpring(my, { stiffness: 110, damping: 20 });
  const onHeroMove = (e: React.MouseEvent) => {
    if (reduce || !heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 26);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 20);
  };

  const { scrollYProgress } = useScroll();
  const railProgress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const langBtn = (code: 'ru' | 'en') => (
    <button
      key={code}
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      className={`min-h-11 cursor-pointer px-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
        lang === code ? 'font-bold text-[#ECEFF5]' : 'text-[#9BA6BC] hover:text-[#ECEFF5]'
      }`}
    >
      {code}
    </button>
  );

  return (
    <div className="grain min-h-screen bg-[#0E1116] font-manrope text-[#ECEFF5] antialiased">
      {/* one soft accent pool so the dark never reads as flat black */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-[-18rem] z-0 h-[640px] w-[900px] -translate-x-1/2 rounded-full bg-[#4C6FE7]/12 blur-[140px] animate-pulse-glow"
      />

      {/* ============================ TOP META BAR ============================ */}
      <div className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#0E1116]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
          <a href="#top" className="flex h-14 shrink-0 items-center gap-2">
            <span className="font-inter text-[15px] font-black tracking-[-0.03em]">{t.brand}</span>
            <span className="font-mono text-[9px] align-super text-[#8DA6FF]">™</span>
          </a>

          <span className="hidden flex-1 truncate px-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[#9BA6BC] md:block">
            {t.role}
          </span>

          <div className="flex shrink-0 items-center gap-1">
            <span className="mr-2 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#9BA6BC] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4C6FE7]" />
              {t.availability}
            </span>
            <div className="flex items-center rounded-full border border-white/12 bg-white/[0.04]">
              {langBtn('ru')}
              <span className="h-3 w-px bg-white/15" />
              {langBtn('en')}
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label={t.a11y.menu}
              className="ml-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/12 transition-colors hover:bg-[#ECEFF5] hover:text-[#0E1116] lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
        <motion.div aria-hidden="true" style={{ scaleX: scrollYProgress }} className="h-px w-full origin-left bg-[#4C6FE7]" />
      </div>

      {/* ============================ INSTRUMENT RAIL ============================ */}
      <nav aria-label={t.nav[0].label} className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <div className="relative flex flex-col gap-1 rounded-[22px] border border-white/12 bg-[#171C26]/80 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
          {t.nav.map((link, i) => {
            const Icon = NAV_ICONS[i] ?? Compass;
            const on = active === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                aria-current={on ? 'true' : undefined}
                className="group relative flex h-11 items-center gap-3 rounded-2xl px-3 transition-colors"
              >
                {on && (
                  <motion.span
                    layoutId="rail-pill"
                    className="absolute inset-0 rounded-2xl bg-[#ECEFF5]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  className={`relative h-4 w-4 shrink-0 transition-colors ${
                    on ? 'text-[#0E1116]' : 'text-[#9BA6BC] group-hover:text-[#ECEFF5]'
                  }`}
                />
                <span
                  className={`relative max-w-0 overflow-hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] transition-all duration-300 group-hover:max-w-[120px] ${
                    on ? 'max-w-[120px] text-[#0E1116]' : 'text-[#ECEFF5]'
                  }`}
                >
                  {link.label}
                </span>
              </a>
            );
          })}
          <div className="mt-1 flex items-center gap-2 px-3 pb-1 pt-2">
            <div className="h-px flex-1 bg-white/15">
              <motion.div style={{ width: railProgress }} className="h-px bg-[#4C6FE7]" />
            </div>
          </div>
        </div>
      </nav>

      {/* ============================ MOBILE DRAWER ============================ */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          role="dialog" aria-modal="true" aria-label={t.nav[0].label}
          className={`absolute inset-y-0 right-0 flex w-[82%] max-w-sm flex-col bg-[#141922] p-6 shadow-2xl transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <span className="font-inter text-lg font-black tracking-[-0.03em]">{t.brand}</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label={t.a11y.close}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/12"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col">
            {t.nav.map((link, i) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-white/10 py-4 font-inter text-2xl font-black tracking-[-0.03em]"
              >
                {link.label}
                <span className="font-mono text-[10px] font-normal tracking-widest text-[#9BA6BC]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* ============================ HERO ============================ */}
      <section
        id="top" ref={heroRef}
        onMouseMove={onHeroMove}
        onMouseLeave={() => { mx.set(0); my.set(0); }}
        className="relative z-10 scroll-mt-24 px-4 pb-16 pt-24 sm:px-8 sm:pt-28 lg:px-12 lg:pl-32"
      >
        <div className="mx-auto max-w-[1500px]">
          <motion.div {...onScroll} className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Label className="text-[#8DA6FF]">{t.hero.kicker}</Label>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9BA6BC]">{t.about.location}</span>
          </motion.div>

          <div className="relative">
            <h1 className="font-inter font-black uppercase leading-[0.86] tracking-[-0.045em]">
              {t.hero.titleLines.map((line, i) => (
                <span key={i} className="reveal-mask block">
                  <motion.span
                    className="block break-words"
                    style={{ fontSize: i === 1 ? 'clamp(2rem,7.4vw,7rem)' : 'clamp(2.4rem,9vw,8.6rem)' }}
                    variants={lineReveal} custom={i} initial="hidden" animate="visible"
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* floating instrument card */}
            <motion.div
              style={{ x: px, y: py }}
              initial={{ opacity: 0, scale: 0.92, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -7 }}
              transition={{ duration: 1, delay: 0.5, ease: EASE }}
              className="pointer-events-none absolute -top-2 right-0 hidden w-[210px] xl:block"
            >
              <div className="rounded-[22px] border border-white/12 bg-[#171C26] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                <div className="mb-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-[#9BA6BC]">
                  <span>SYS / 013</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4C6FE7]" />
                </div>
                <div className="h-24 rounded-[14px] bg-gradient-to-br from-[#4C6FE7] to-[#3B5BD9]" />
                <div className="mt-3 space-y-1.5">
                  <div className="h-1 w-full rounded-full bg-white/10">
                    <div className="h-1 w-[72%] rounded-full bg-[#ECEFF5]" />
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/10">
                    <div className="h-1 w-[44%] rounded-full bg-[#ECEFF5]" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <motion.p {...onScroll} custom={1} className="max-w-xl text-[15px] leading-relaxed text-[#C7CFDE] lg:col-span-6">
              {t.hero.lead}
            </motion.p>

            <motion.div {...onScroll} custom={2} className="flex flex-wrap items-center gap-4 lg:col-span-6 lg:justify-end">
              <Magnetic
                href="#projects" ariaLabel={t.hero.ctaPrimary}
                className="group inline-flex min-h-[56px] cursor-pointer items-center gap-3 rounded-full bg-[#ECEFF5] px-7 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0E1116] transition-colors hover:bg-[#4C6FE7] hover:text-white"
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Magnetic>
              <a
                href="#contact"
                className="inline-flex min-h-[56px] cursor-pointer items-center gap-2 rounded-full border border-white/20 px-7 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:border-[#ECEFF5] hover:bg-[#ECEFF5] hover:text-[#0E1116]"
              >
                {t.hero.ctaSecondary}
              </a>
            </motion.div>
          </div>

          {/* metrics readout */}
          <motion.div
            {...onScroll} custom={3}
            className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-white/12 bg-white/12 sm:grid-cols-3"
          >
            {t.metrics.map((m, i) => (
              <div key={i} className="relative bg-[#0E1116] p-6">
                <Ticks className="left-3 top-3 h-3 w-3 text-[#8DA6FF]" />
                <div className="font-inter text-4xl font-black tracking-[-0.03em] sm:text-5xl">
                  <Counter value={m.value} />
                  <span className="text-[#8DA6FF]">{m.suffix}</span>
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#9BA6BC]">{m.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.a
          href="#about" {...onScroll} custom={4}
          className="mt-12 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9BA6BC] transition-colors hover:text-[#ECEFF5] lg:inline-flex"
        >
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
          {t.hero.scroll}
        </motion.a>
      </section>

      {/* ============================ MARQUEE ============================ */}
      <div className="relative z-10 overflow-hidden border-y border-white/10 bg-[#141922] py-3" aria-hidden="true">
        <div className={`flex w-max ${reduce ? '' : 'animate-marquee'}`}>
          {[...t.marquee, ...t.marquee, ...t.marquee, ...t.marquee].map((item, i) => (
            <span key={i} className="flex items-center whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.16em]">
              <span className="mx-5 text-[#4C6FE7]">✦</span>
              <span className="text-[#C7CFDE]">{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ============================ ABOUT ============================ */}
      <section id="about" className="relative z-10 scroll-mt-24 px-4 py-24 sm:px-8 lg:px-12 lg:pl-32">
        <div className="mx-auto max-w-[1500px]">
          <motion.div {...onScroll} className="mb-10 flex items-end justify-between gap-6">
            <div className="min-w-0">
              <Label className="text-[#8DA6FF]">{t.about.sectionLabel}</Label>
              <h2 className="mt-3 break-words font-inter text-[clamp(2rem,5.4vw,4.2rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
                {t.about.sectionTitle}
              </h2>
            </div>
            <span className="shrink-0 font-mono text-[11px] tracking-widest text-[#9BA6BC]">01</span>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-12">
            <motion.div {...onScroll} className="relative rounded-[28px] border border-white/12 bg-[#171C26] p-7 sm:p-9 lg:col-span-7">
              <Ticks className="left-4 top-4 h-3 w-3 text-[#8DA6FF]" />
              <Label className="text-[#8DA6FF]">{t.about.bioLabel}</Label>
              <p className="mt-5 text-[16px] leading-relaxed text-[#C7CFDE] sm:text-[17px]">{t.about.bio}</p>
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#9BA6BC]">
                <span>{t.about.location}</span>
                <span className="flex items-center gap-1.5 text-[#8DA6FF]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4C6FE7]" />
                  {t.about.status}
                </span>
              </div>
            </motion.div>

            <motion.div
              {...onScroll} custom={1}
              className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#4C6FE7] to-[#3B5BD9] p-7 text-white sm:p-9 lg:col-span-5"
            >
              <span className="absolute right-6 top-5 font-mono text-[10px] opacity-80">™</span>
              <Label className="text-white/90">{t.about.focusLabel}</Label>
              <p className="mt-5 text-[15px] leading-relaxed text-white sm:text-[16px]">{t.about.focus}</p>
              <div className="mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/90">
                <Zap className="h-3.5 w-3.5" />
                {t.stack.sectionLabel}
              </div>
              <svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 opacity-25">
                <circle cx="100" cy="100" r="86" fill="none" stroke="#fff" strokeWidth="1" />
                <circle cx="100" cy="100" r="58" fill="none" stroke="#fff" strokeWidth="1" />
                <circle cx="100" cy="100" r="30" fill="none" stroke="#fff" strokeWidth="1" />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ STACK ============================ */}
      <section id="stack" className="relative z-10 scroll-mt-24 bg-[#141922] px-4 py-24 sm:px-8 lg:px-12 lg:pl-32">
        <div className="mx-auto max-w-[1500px]">
          <motion.div {...onScroll} className="mb-10 flex items-end justify-between gap-6">
            <div className="min-w-0">
              <Label className="text-[#8DA6FF]">{t.stack.sectionLabel}</Label>
              <h2 className="mt-3 break-words font-inter text-[clamp(2rem,5.4vw,4.2rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
                {t.stack.sectionTitle}
              </h2>
            </div>
            <span className="shrink-0 font-mono text-[11px] tracking-widest text-[#9BA6BC]">02</span>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-12">
            <motion.div {...onScroll} className="rounded-[28px] border border-white/12 bg-[#0E1116] p-7 sm:p-9 lg:col-span-7">
              <Label className="text-[#8DA6FF]">{t.stack.languagesLabel}</Label>
              <div className="mt-7 space-y-7">
                {t.stack.languages.map((s, i) => (
                  <div key={s.name}>
                    <div className="mb-3 flex items-baseline justify-between gap-3">
                      <span className="font-inter text-lg font-black tracking-[-0.02em]">{s.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9BA6BC]">{s.level}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative h-[6px] flex-1 rounded-full bg-white/12">
                        <motion.div
                          className="absolute inset-y-0 left-0 rounded-full bg-[#4C6FE7]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.pct}%` }}
                          viewport={{ once: true, margin: '-40px' }}
                          transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: EASE }}
                        />
                        <motion.span
                          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#4C6FE7] bg-[#0E1116]"
                          initial={{ left: '0%' }}
                          whileInView={{ left: `${s.pct}%` }}
                          viewport={{ once: true, margin: '-40px' }}
                          transition={{ duration: 1, delay: 0.15 + i * 0.12, ease: EASE }}
                        />
                      </div>
                      <span className="w-12 shrink-0 text-right font-mono text-[13px] tabular-nums">{s.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...onScroll} custom={1} className="rounded-[28px] border border-white/12 bg-[#0E1116] p-7 sm:p-9 lg:col-span-5">
              <Label className="text-[#8DA6FF]">{t.stack.toolsLabel}</Label>
              <div className="mt-6 grid grid-cols-2 gap-2.5">
                {t.stack.tools.map((tool) => (
                  <span
                    key={tool}
                    className="flex min-h-[46px] items-center justify-center rounded-[14px] border border-white/12 bg-[#171C26] px-3 text-center font-mono text-[10px] uppercase leading-tight tracking-[0.1em] text-[#C7CFDE] transition-colors hover:border-[#4C6FE7] hover:bg-[#4C6FE7] hover:text-white"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#9BA6BC]">
                <span>FIG. 02</span>
                <span>× {t.stack.tools.length}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ PROJECTS ============================ */}
      <section id="projects" className="relative z-10 scroll-mt-24 px-4 py-24 sm:px-8 lg:px-12 lg:pl-32">
        <div className="mx-auto max-w-[1500px]">
          <motion.div {...onScroll} className="mb-10 flex items-end justify-between gap-6">
            <div className="min-w-0">
              <Label className="text-[#8DA6FF]">{t.projects.sectionLabel}</Label>
              <h2 className="mt-3 break-words font-inter text-[clamp(2rem,5.4vw,4.2rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
                {t.projects.sectionTitle}
              </h2>
            </div>
            <span className="shrink-0 font-mono text-[11px] tracking-widest text-[#9BA6BC]">03</span>
          </motion.div>

          <div className="border-t border-white/15">
            {t.projects.items.map((p, i) => (
              <motion.article
                key={p.id} {...onScroll} custom={i}
                className="group relative overflow-hidden border-b border-white/15"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 bg-[#4C6FE7] transition-transform duration-500 group-hover:scale-x-100"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
                />
                <div className="relative grid gap-5 px-1 py-9 transition-colors duration-300 sm:py-11 lg:grid-cols-12 lg:gap-8 lg:px-6">
                  <div className="flex items-start gap-4 lg:col-span-5">
                    <span className="font-mono text-[11px] tracking-widest text-[#9BA6BC] transition-colors group-hover:text-white/80">
                      {p.index}
                    </span>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9BA6BC] transition-colors group-hover:text-white/80">
                        {p.category}
                      </div>
                      <h3 className="mt-2 break-words font-inter text-[clamp(1.35rem,3.1vw,2.4rem)] font-black leading-[0.98] tracking-[-0.035em]">
                        {p.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[14px] leading-relaxed text-[#C7CFDE] transition-colors group-hover:text-white/90 lg:col-span-5">
                    {p.description}
                  </p>

                  <div className="flex items-start justify-between gap-4 lg:col-span-2 lg:flex-col lg:items-end">
                    <span className="font-mono text-[11px] tracking-widest text-[#9BA6BC] transition-colors group-hover:text-white/80">
                      {p.year}
                    </span>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 transition-colors group-hover:border-white/70">
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:col-span-12">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#9BA6BC] transition-colors group-hover:border-white/50 group-hover:text-white/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ CONTACT ============================ */}
      <section id="contact" className="relative z-10 scroll-mt-24 bg-[#141922] px-4 py-24 sm:px-8 lg:px-12 lg:pl-32">
        <div className="mx-auto max-w-[1500px]">
          <motion.div {...onScroll} className="mb-10 flex items-end justify-between gap-6">
            <div className="min-w-0">
              <Label className="text-[#8DA6FF]">{t.contact.sectionLabel}</Label>
              <h2 className="mt-3 break-words font-inter text-[clamp(2rem,5.4vw,4.2rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
                {t.contact.sectionTitle}
              </h2>
            </div>
            <span className="shrink-0 font-mono text-[11px] tracking-widest text-[#9BA6BC]">04</span>
          </motion.div>

          <motion.p {...onScroll} className="mb-10 max-w-2xl text-[15px] leading-relaxed text-[#C7CFDE] sm:text-[16px]">
            {t.contact.lead}
          </motion.p>

          <div className="grid gap-4 sm:grid-cols-3">
            {t.contact.items.map((c, i) => {
              const inner = (
                <>
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-white/15 text-[#8DA6FF] transition-colors group-hover:border-white/50 group-hover:text-white">
                      {c.id === 'mail' ? (
                        <Mail className="h-4 w-4" />
                      ) : c.id === 'tg' ? (
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                          <path d="M21.9 4.3 2.9 11.6c-1.1.4-1 1.1-.2 1.3l4.8 1.5 1.8 5.6c.2.6.4.8.8.8.4 0 .6-.2.8-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.2-.5-1.8-1.8-1.3Z" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                          <path d="M20.3 4.9A16.6 16.6 0 0 0 16.2 3.6l-.2.4a15 15 0 0 0-4-.4c-1.3 0-2.7.1-4 .4l-.2-.4a16.6 16.6 0 0 0-4.1 1.3C1.3 8.6.6 12.2.9 15.7a16.7 16.7 0 0 0 5 2.5l1-1.7a10.6 10.6 0 0 1-1.7-.8l.4-.3c3.3 1.5 6.9 1.5 10.2 0l.4.3c-.5.3-1.1.6-1.7.8l1 1.7a16.7 16.7 0 0 0 5-2.5c.4-4-.7-7.6-2.2-10.8ZM8.3 13.6c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
                        </svg>
                      )}
                    </span>
                    {c.copyValue ? (
                      copied ? <Check className="h-4 w-4 text-[#8DA6FF]" /> : <Copy className="h-4 w-4 text-[#9BA6BC]" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-[#9BA6BC] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                    )}
                  </div>
                  <div className="mt-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9BA6BC] transition-colors group-hover:text-white/80">
                      {c.label}
                    </div>
                    <div className="mt-1 break-all font-inter text-[17px] font-black tracking-[-0.02em]">
                      {c.copyValue && copied ? t.contact.copied : c.value}
                    </div>
                    {c.copyValue && (
                      <div className="mt-1 font-mono text-[10px] text-[#9BA6BC] transition-colors group-hover:text-white/80">
                        {t.contact.copyHint}
                      </div>
                    )}
                  </div>
                </>
              );

              const cls =
                'group flex min-h-[168px] cursor-pointer flex-col justify-between rounded-[24px] border border-white/12 bg-[#171C26] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#4C6FE7] hover:bg-[#4C6FE7] hover:text-white';

              return c.copyValue ? (
                <motion.button
                  key={c.id} {...onScroll} custom={i}
                  onClick={() => copyToClipboard(c.copyValue as string)}
                  aria-label={`${c.label}: ${copied ? t.contact.copied : t.contact.copyHint}`}
                  className={cls}
                >
                  {inner}
                </motion.button>
              ) : (
                <motion.a
                  key={c.id} {...onScroll} custom={i}
                  href={c.href}
                  target={c.href?.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={`${c.label}: ${c.value}`}
                  className={cls}
                >
                  {inner}
                </motion.a>
              );
            })}
          </div>

          <div className="mt-24">
            <h2 className="font-inter font-black uppercase leading-[0.86] tracking-[-0.045em]">
              {t.contact.statement.map((word, i) => (
                <span key={i} className="reveal-mask block">
                  <motion.span
                    className="block break-words"
                    style={{ fontSize: 'clamp(2.2rem,10vw,8rem)' }}
                    variants={lineReveal} custom={i}
                    initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
                  >
                    {i === t.contact.statement.length - 1 ? <span className="text-[#8DA6FF]">{word}</span> : word}
                  </motion.span>
                </span>
              ))}
            </h2>
          </div>
        </div>
      </section>

      {/* ============================ FOOTER ============================ */}
      <footer className="relative z-10 border-t border-white/15 px-4 py-10 pb-20 sm:px-8 lg:px-12 lg:pl-32">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="font-inter text-lg font-black tracking-[-0.03em]">{t.brand}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9BA6BC]">{t.footer.rights}</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9BA6BC]">{t.footer.built}</span>
            <span className="font-mono text-[10px] tracking-widest text-[#8DA6FF]">013</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

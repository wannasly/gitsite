import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code,
  Compass,
  Copy,
  Globe,
  Layers,
  Mail,
  Menu,
  Sparkles,
  Terminal,
  X,
} from 'lucide-react';
import { CONTENT, type Contact, type Lang, type Project, type SkillBar } from '../content';
import type { VariantProps } from './types';

/* ------------------------------------------------------------------ tokens */

const VIOLET = '#8B5CF6';
const ROSE = '#F43F5E';
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Screen-reader labels for the two icon-only buttons. CONTENT has no key for
 * them, so they are localised here instead of shipping English-only strings.
 */
const A11Y: Record<Lang, { menu: string; close: string }> = {
  ru: { menu: 'Открыть меню', close: 'Закрыть меню' },
  en: { menu: 'Open menu', close: 'Close menu' },
};

const HUES: { a: string; b: string }[] = [
  { a: '#8B5CF6', b: '#6366F1' },
  { a: '#F43F5E', b: '#A855F7' },
  { a: '#22D3EE', b: '#8B5CF6' },
];

const BAR_H = [42, 78, 30, 96, 58, 110, 36, 84, 66, 24, 100, 48];
const MESH_NODES: [number, number][] = [
  [62, 72],
  [158, 44],
  [128, 168],
  [236, 108],
  [318, 58],
  [300, 206],
  [402, 132],
  [446, 238],
  [210, 252],
];
const MESH_EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
  [4, 6],
  [5, 6],
  [5, 8],
  [2, 8],
  [6, 7],
  [5, 7],
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/** Masked line reveal — the inner span slides up out of an overflow-hidden box. */
const rise: Variants = {
  hidden: { y: '112%', opacity: 0 },
  show: { y: '0%', opacity: 1, transition: { duration: 0.95, ease: EASE } },
};

/* ----------------------------------------------------------------- helpers */

function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const onMouseMove = useCallback((e: ReactMouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', `${e.clientX - r.left}px`);
    el.style.setProperty('--sy', `${e.clientY - r.top}px`);
  }, []);
  return { ref, onMouseMove };
}

function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

function TopSheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-10 top-0 h-px opacity-60"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)' }}
    />
  );
}

function SectionHead({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={container}
      className="mb-10 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between"
    >
      <motion.div variants={fadeUp}>
        <span className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#B7B7C2]">
          <span className="h-px w-9" style={{ background: `linear-gradient(90deg, ${VIOLET}, transparent)` }} />
          {label}
        </span>
        <h2 className="mt-4 font-oswald text-[clamp(2.1rem,5.4vw,4.2rem)] uppercase leading-[0.94] tracking-[0.02em] text-[#F5F5F7]">
          {title}
        </h2>
      </motion.div>
      {children ? <motion.div variants={fadeUp}>{children}</motion.div> : null}
    </motion.div>
  );
}

interface BentoCardProps {
  className?: string;
  icon?: ReactNode;
  label?: string;
  children: ReactNode;
}

function BentoCard({ className = '', icon, label, children }: BentoCardProps) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <motion.div variants={fadeUp} className={className}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#111114] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_28px_70px_-30px_rgba(139,92,246,0.55)] sm:p-8"
      >
        <TopSheen />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(360px circle at var(--sx, 50%) var(--sy, 0%), ${VIOLET}26, transparent 70%)`,
          }}
        />
        <div className="relative flex h-full flex-col">
          {(icon || label) && (
            <div className="mb-6 flex items-center gap-3">
              {icon ? (
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/12 bg-[#16161A] text-[#DCDCE4] transition-colors duration-500 group-hover:text-[#F5F5F7]"
                  style={{ boxShadow: `inset 0 0 26px ${VIOLET}26` }}
                >
                  {icon}
                </span>
              ) : null}
              {label ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#B7B7C2]">{label}</span>
              ) : null}
            </div>
          )}
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------- brand marks */

function TelegramGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
      <path d="M21.94 4.6 18.9 19.2c-.23 1.02-.84 1.27-1.7.79l-4.7-3.47-2.27 2.19c-.25.25-.46.46-.94.46l.33-4.78 8.7-7.86c.38-.34-.08-.53-.59-.19L7.02 13.1 2.4 11.65c-1-.31-1.02-1 .21-1.48L20.65 3.1c.83-.3 1.56.2 1.29 1.5Z" />
    </svg>
  );
}

function DiscordGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
      <path d="M19.3 5.34A16.7 16.7 0 0 0 15.1 4l-.28.53a12.5 12.5 0 0 1 3.7 1.65 15.9 15.9 0 0 0-12.9 0A12.5 12.5 0 0 1 9.3 4.5L9 4a16.7 16.7 0 0 0-4.2 1.34C2.1 9.35 1.4 13.25 1.7 17.1a16.9 16.9 0 0 0 5.1 2.6l1.1-1.7c-.6-.23-1.2-.5-1.7-.84l.4-.3a12 12 0 0 0 10.9 0l.4.3c-.55.34-1.1.61-1.7.84l1.1 1.7a16.9 16.9 0 0 0 5.1-2.6c.35-4.46-.6-8.32-3.1-11.76ZM8.6 14.9c-1 0-1.85-.93-1.85-2.06s.82-2.07 1.85-2.07 1.87.94 1.85 2.07c0 1.13-.82 2.06-1.85 2.06Zm6.8 0c-1 0-1.85-.93-1.85-2.06s.82-2.07 1.85-2.07 1.87.94 1.85 2.07c0 1.13-.82 2.06-1.85 2.06Z" />
    </svg>
  );
}

/* ------------------------------------------------------------ project art */

function ArtLayer({ index }: { index: number }) {
  const hue = HUES[index % HUES.length];

  if (index % 3 === 0) {
    return (
      <>
        <g fill="none" stroke={hue.a} strokeOpacity="0.5">
          {[34, 66, 98, 130, 164].map((r, i) => (
            <circle key={r} cx="352" cy="104" r={r} strokeWidth={i === 1 ? 1.6 : 0.7} />
          ))}
        </g>
        <g fill="none" stroke={hue.b} strokeOpacity="0.55" strokeWidth="1">
          <ellipse cx="352" cy="104" rx="152" ry="52" transform="rotate(-20 352 104)" />
          <ellipse cx="352" cy="104" rx="152" ry="52" transform="rotate(26 352 104)" />
        </g>
        <circle cx="352" cy="104" r="10" fill={hue.b} fillOpacity="0.9" />
        <g fill="#F5F5F7" fillOpacity="0.8">
          <circle cx="212" cy="60" r="3" />
          <circle cx="466" cy="176" r="2.4" />
          <circle cx="286" cy="244" r="2.4" />
        </g>
      </>
    );
  }

  if (index % 3 === 1) {
    return (
      <>
        <g fill="none" stroke={hue.a} strokeOpacity="0.3">
          {[62, 112, 162, 212].map((r) => (
            <circle key={r} cx="66" cy="82" r={r} />
          ))}
        </g>
        <path
          d="M0 216 L78 216 L104 152 L134 250 L166 116 L198 216 L480 216"
          fill="none"
          stroke={hue.a}
          strokeOpacity="0.75"
          strokeWidth="1.7"
        />
        <g fill={hue.b} fillOpacity="0.42">
          {BAR_H.map((h, i) => (
            <rect key={i} x={296 + i * 14} y={244 - h} width="5" height={h} rx="2.5" />
          ))}
        </g>
        <g fill="#F5F5F7" fillOpacity="0.75">
          <circle cx="166" cy="116" r="3.4" />
        </g>
      </>
    );
  }

  return (
    <>
      <g stroke={hue.a} strokeOpacity="0.45" strokeWidth="0.9">
        {MESH_EDGES.map(([from, to], i) => (
          <line
            key={i}
            x1={MESH_NODES[from][0]}
            y1={MESH_NODES[from][1]}
            x2={MESH_NODES[to][0]}
            y2={MESH_NODES[to][1]}
          />
        ))}
      </g>
      <g>
        {MESH_NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 6.5 : 3.4} fill={i % 2 === 0 ? hue.a : hue.b} fillOpacity="0.92" />
        ))}
      </g>
      <g fill="none" stroke={hue.b} strokeOpacity="0.3" strokeWidth="1">
        <circle cx="236" cy="108" r="46" />
        <circle cx="236" cy="108" r="88" />
      </g>
    </>
  );
}

function ProjectArt({ index }: { index: number }) {
  const hue = HUES[index % HUES.length];
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(88% 76% at 76% 14%, ${hue.b}4d, transparent 62%), radial-gradient(72% 70% at 10% 92%, ${hue.a}40, transparent 64%), linear-gradient(168deg, #16161C, #0A0A0D 72%)`,
        }}
      />
      <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <ArtLayer index={index} />
      </svg>
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(125% 95% at 50% 26%, transparent 38%, rgba(8,8,10,0.9) 100%)' }}
      />
    </div>
  );
}

/* ------------------------------------------------------------- sub-widgets */

function Metric({ value, suffix, label }: { value: string; suffix: string; label: string }) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const decimals = value.includes('.') ? value.split('.')[1].length : 0;
  const target = Number.parseFloat(value);
  const [shown, setShown] = useState<string>(() => (0).toFixed(decimals));

  useEffect(() => {
    if (reduce) {
      setShown(value);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 1500);
      const eased = 1 - Math.pow(1 - p, 4);
      if (p < 1) {
        setShown((target * eased).toFixed(decimals));
        raf = requestAnimationFrame(step);
      } else {
        setShown(value);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, decimals, value]);

  return (
    <motion.div ref={ref} variants={fadeUp} className="px-0 py-8 sm:px-10 sm:py-2 sm:first:pl-0 sm:last:pr-0">
      <div className="flex items-baseline gap-1.5">
        <span className="font-oswald text-[clamp(2.9rem,6.4vw,4.9rem)] leading-none tracking-[0.01em] text-[#F5F5F7] tabular-nums">
          {shown}
        </span>
        {suffix ? (
          <span className="font-oswald text-[clamp(1.5rem,3vw,2.4rem)] leading-none text-[#A1A1AA]">{suffix}</span>
        ) : null}
      </div>
      <p className="mt-3 max-w-[22ch] text-[14px] leading-snug text-[#A1A1AA]">{label}</p>
    </motion.div>
  );
}

function SkillMeter({ item, delay }: { item: SkillBar; delay: number }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <li>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-oswald text-[18px] uppercase tracking-[0.06em] text-[#F5F5F7]">{item.name}</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#B7B7C2]">{item.level}</span>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative h-[6px] flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.span
            className="absolute inset-y-0 left-0 block rounded-full"
            style={{ background: `linear-gradient(90deg, ${VIOLET}, ${ROSE})` }}
            initial={{ width: '0%' }}
            whileInView={{ width: `${item.pct}%` }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reduce ? 0 : 1.25, ease: EASE, delay: reduce ? 0 : delay }}
          />
        </div>
        <span className="w-12 shrink-0 text-right font-mono text-[13px] text-[#F5F5F7] tabular-nums">{item.pct}%</span>
      </div>
    </li>
  );
}

function ProjectCard({ project, i, viewLabel }: { project: Project; i: number; viewLabel: string }) {
  const { ref, onMouseMove } = useSpotlight<HTMLElement>();
  return (
    <motion.div variants={fadeUp}>
      <article
        ref={ref}
        onMouseMove={onMouseMove}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111114] transition-all duration-500 hover:border-white/25 hover:shadow-[0_40px_110px_-50px_rgba(139,92,246,0.75)]"
      >
        <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[16/8]">
          <ProjectArt index={i} />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 opacity-0 transition-all duration-[1200ms] ease-out group-hover:translate-x-[440%] group-hover:opacity-100"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)' }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(420px circle at var(--sx, 50%) var(--sy, 50%), rgba(255,255,255,0.12), transparent 70%)`,
            }}
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5 sm:p-7">
            <span className="font-oswald text-[clamp(2.2rem,4.4vw,3.6rem)] leading-none tracking-[0.02em] text-[#F5F5F7]">
              {project.index}
            </span>
            <span className="rounded-full border border-white/15 bg-black/50 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.18em] text-[#E7E7EC] backdrop-blur-md">
              {project.year}
            </span>
          </div>
        </div>

        <div className="relative border-t border-white/10 bg-[#0D0D11] px-5 pb-6 pt-10 sm:px-8 sm:pb-9 sm:pt-12">
          <a
            href="#contact"
            aria-label={`${viewLabel}: ${project.title}`}
            className="group/btn absolute right-5 top-0 flex h-14 -translate-y-1/2 items-center gap-3 rounded-full border border-white/15 bg-[#16161A]/95 p-1.5 backdrop-blur-md transition-colors duration-300 hover:border-white/40 sm:right-8 sm:pl-6"
          >
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-[#E7E7EC] sm:inline">
              {viewLabel}
            </span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F5F5F7] text-[#08080A]">
              <ArrowUpRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </span>
          </a>

          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#B7B7C2]">{project.category}</p>
          <h3 className="mt-3 font-oswald text-[clamp(1.35rem,3vw,2.15rem)] uppercase leading-[1.06] tracking-[0.02em] text-[#F5F5F7]">
            {project.title}
          </h3>
          <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-[#A1A1AA]">{project.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/10 bg-[#16161A] px-3.5 py-2 font-mono text-[11px] tracking-[0.08em] text-[#D2D2DA]"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </motion.div>
  );
}

/* ==================================================================== page */

export default function V2Noir({ lang, setLang }: VariantProps) {
  const t = CONTENT[lang];
  const reduce = useReducedMotion() ?? false;

  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('top');
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 800], [0, 170]);
  const glowFade = useTransform(scrollY, [0, 700], [1, 0.3]);

  /* ---- scroll state + section spy ---- */
  useEffect(() => {
    const ids = ['top', 'about', 'stack', 'projects', 'contact'];
    const onScroll = () => {
      setScrolled(window.scrollY > 14);
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---- body scroll lock for the drawer ---- */
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
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

  /* ---- clipboard ---- */
  const copy = useCallback((id: string, value: string) => {
    try {
      /* Optional chain short-circuits the whole chain when the API is absent,
         so the "copied" state only ever appears after a resolved write. */
      navigator.clipboard
        ?.writeText(value)
        .then(() => setCopiedId(id))
        .catch(() => undefined);
    } catch {
      /* clipboard unavailable — the value stays visible on screen */
    }
  }, []);

  useEffect(() => {
    if (!copiedId) return;
    const timer = window.setTimeout(() => setCopiedId(null), 2000);
    return () => window.clearTimeout(timer);
  }, [copiedId]);

  const ringText = `${t.hero.scroll} • ${t.hero.scroll} • `;

  const langButton = (l: 'ru' | 'en', compact: boolean) => (
    <button
      key={l}
      type="button"
      onClick={() => setLang(l)}
      aria-pressed={lang === l}
      className={`inline-flex h-11 min-w-[46px] cursor-pointer items-center justify-center rounded-full font-mono text-[12px] uppercase tracking-[0.16em] transition-colors duration-300 ${
        lang === l
          ? 'bg-[#F5F5F7] font-bold text-[#08080A]'
          : 'text-[#B7B7C2] hover:bg-white/10 hover:text-[#F5F5F7]'
      } ${compact ? 'flex-1' : ''}`}
    >
      {l}
    </button>
  );

  const contactIcon = (item: Contact) => {
    if (item.id === 'tg') return <TelegramGlyph />;
    if (item.id === 'ds') return <DiscordGlyph />;
    return <Mail className="h-[18px] w-[18px]" />;
  };

  const contactShell =
    'group relative flex h-full w-full cursor-pointer flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-white/10 bg-[#111114] p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_28px_70px_-30px_rgba(244,63,94,0.5)]';

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative min-h-screen overflow-x-clip bg-[#08080A] font-manrope text-[#F5F5F7] antialiased">
        {/* ------------------------------------------------------------- nav */}
        <header
          className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
            scrolled ? 'border-white/10 bg-[#08080A]/85 backdrop-blur-xl' : 'border-transparent bg-transparent'
          }`}
        >
          <div className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
            <a
              href="#top"
              className="shrink-0 cursor-pointer font-oswald text-[16px] uppercase tracking-[0.26em] text-[#F5F5F7] transition-opacity duration-300 hover:opacity-70 sm:text-[18px]"
            >
              {t.brand}
            </a>

            <nav className="hidden items-center gap-1 lg:flex" aria-label={t.brand}>
              {t.nav.map((item) => {
                const active = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`relative cursor-pointer rounded-full px-4 py-3.5 text-[13px] leading-[1.3] tracking-[0.03em] transition-colors duration-300 ${
                      active ? 'text-[#08080A]' : 'text-[#A1A1AA] hover:text-[#F5F5F7]'
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId="noir-nav-pill"
                        className="absolute inset-0 rounded-full bg-[#F5F5F7]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative">{item.label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-full border border-white/12 bg-white/[0.03] p-1">
                {langButton('ru', false)}
                {langButton('en', false)}
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={A11Y[lang].menu}
                aria-expanded={menuOpen}
                aria-controls="noir-drawer"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/12 bg-white/[0.03] text-[#F5F5F7] transition-colors duration-300 hover:border-white/30 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* ---------------------------------------------------------- drawer */}
        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              className="fixed inset-0 z-[70] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                aria-hidden="true"
                onClick={() => setMenuOpen(false)}
                className="absolute inset-0 bg-[#08080A]/85 backdrop-blur-md"
              />
              <motion.nav
                id="noir-drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.45, ease: EASE }}
                className="absolute inset-y-0 right-0 flex w-[88%] max-w-[380px] flex-col border-l border-white/10 bg-[#0C0C10] px-6 pb-10 pt-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-oswald text-[16px] uppercase tracking-[0.26em] text-[#F5F5F7]">{t.brand}</span>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    aria-label={A11Y[lang].close}
                    className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/12 bg-[#16161A] text-[#F5F5F7] transition-colors duration-300 hover:border-white/30"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <ul className="mt-10 flex flex-1 flex-col gap-1">
                  {t.nav.map((item, i) => (
                    <li key={item.id}>
                      <motion.a
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 + i * 0.06, duration: 0.5, ease: EASE }}
                        className={`flex cursor-pointer items-center justify-between rounded-xl px-4 py-4 font-oswald text-[22px] uppercase tracking-[0.04em] transition-colors duration-300 ${
                          activeId === item.id ? 'bg-white/10 text-[#F5F5F7]' : 'text-[#B7B7C2] hover:text-[#F5F5F7]'
                        }`}
                      >
                        {item.label}
                        <span className="font-mono text-[11px] text-[#A1A1AA]">{String(i + 1).padStart(2, '0')}</span>
                      </motion.a>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#B7B7C2]">{t.role}</p>
                  <div className="mt-4 flex items-center rounded-full border border-white/12 bg-white/[0.03] p-1">
                    {langButton('ru', true)}
                    {langButton('en', true)}
                  </div>
                </div>
              </motion.nav>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ------------------------------------------------------------ hero */}
        <section id="top" className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40 lg:pt-48">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[-14%] flex justify-center">
            <motion.div
              style={{
                y: reduce ? 0 : glowY,
                opacity: reduce ? 0.65 : glowFade,
                background: `radial-gradient(48% 50% at 50% 46%, ${VIOLET}80, transparent 70%), radial-gradient(36% 42% at 66% 62%, ${ROSE}59, transparent 72%), radial-gradient(30% 36% at 32% 60%, #6366F166, transparent 74%)`,
              }}
              className="h-[560px] w-[min(1180px,155vw)] rounded-full blur-[120px]"
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{ background: 'radial-gradient(90% 60% at 50% 0%, transparent 20%, #08080A 78%)' }}
          />

          <Shell className="relative">
            <div className="flex flex-col items-center text-center">
              <motion.span
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5 backdrop-blur-md"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#D8D8E0]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#D0D0D9] sm:text-[11px]">
                  {t.hero.kicker}
                </span>
              </motion.span>

              <h1 className="mt-8 flex flex-col items-center">
                {t.hero.titleLines.map((line, i) => (
                  <span key={i} className="reveal-mask block max-w-full">
                    <motion.span
                      initial={{ y: '108%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      transition={{ duration: 1, ease: EASE, delay: 0.18 + i * 0.12 }}
                      className={
                        i === t.hero.titleLines.length - 1
                          ? 'block pb-[0.14em] font-playfair text-[clamp(1.95rem,7.4vw,6.6rem)] italic leading-[1.02] tracking-[-0.01em] text-[#F5F5F7]'
                          : 'block pb-[0.06em] font-oswald text-[clamp(1.9rem,7.4vw,6.5rem)] uppercase leading-[1] tracking-[0.02em] text-[#F5F5F7]'
                      }
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.8, ease: EASE }}
                className="mt-7 max-w-[64ch] text-[15px] leading-relaxed text-[#A1A1AA] sm:text-[17px]"
              >
                {t.hero.lead}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.76, duration: 0.8, ease: EASE }}
                className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
              >
                <a
                  href="#projects"
                  className="group inline-flex min-h-[54px] cursor-pointer items-center justify-center gap-3 rounded-full bg-[#F5F5F7] px-7 text-[14px] font-semibold tracking-[0.02em] text-[#08080A] transition-all duration-300 hover:shadow-[0_20px_55px_-14px_rgba(245,245,247,0.4)]"
                >
                  {t.hero.ctaPrimary}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex min-h-[54px] cursor-pointer items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-7 text-[14px] tracking-[0.02em] text-[#F5F5F7] backdrop-blur-sm transition-all duration-300 hover:border-white/35 hover:bg-white/[0.08]"
                >
                  {t.hero.ctaSecondary}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </motion.div>
            </div>

            {/* hero foot rail */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="relative mt-16 grid grid-cols-1 items-center gap-10 border-t border-white/10 pt-12 md:grid-cols-3 sm:mt-20"
            >
              <p className="order-2 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#B7B7C2] md:order-1 md:text-left">
                {t.role}
              </p>

              <div className="order-1 flex justify-center md:order-2">
                <a
                  href="#about"
                  aria-label={t.hero.scroll}
                  className="group relative grid h-28 w-28 cursor-pointer place-items-center rounded-full border border-white/12 bg-[#0C0C10]/60 backdrop-blur-sm transition-colors duration-300 hover:border-white/30"
                >
                  <svg
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                    className={`absolute inset-0 h-full w-full ${reduce ? '' : 'animate-spin-slow'}`}
                  >
                    <defs>
                      <path
                        id="noirScrollRing"
                        d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
                        fill="none"
                      />
                    </defs>
                    <text fill="#B7B7C2" fontSize="7.4" letterSpacing="2" className="font-mono uppercase">
                      <textPath href="#noirScrollRing" startOffset="0">
                        {ringText}
                      </textPath>
                    </text>
                  </svg>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-[#16161A] text-[#F5F5F7] transition-transform duration-300 group-hover:translate-y-1">
                    <ArrowDown className="h-4 w-4" />
                  </span>
                </a>
              </div>

              <div className="order-3 flex items-center justify-center gap-2.5 md:justify-end">
                <span className="relative grid h-2.5 w-2.5 place-items-center">
                  <span className="absolute inset-0 rounded-full" style={{ background: VIOLET }} />
                  {!reduce && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      style={{ background: VIOLET }}
                      animate={{ scale: [1, 2.8], opacity: [0.55, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#D0D0D9]">{t.availability}</span>
              </div>
            </motion.div>
          </Shell>
        </section>

        {/* --------------------------------------------------------- marquee */}
        <div className="relative overflow-hidden border-y border-white/10 bg-[#0B0B0E] py-5">
          <div className={`flex w-max ${reduce ? '' : 'animate-marquee'}`}>
            {[0, 1].map((rep) => (
              <div key={rep} className="flex shrink-0 items-center" aria-hidden={rep === 1}>
                {t.marquee.map((word, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-8 px-8 font-oswald text-[clamp(1rem,2vw,1.6rem)] uppercase tracking-[0.14em] text-[#E7E7EC]"
                  >
                    {word}
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: VIOLET }} />
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28"
            style={{ background: 'linear-gradient(90deg, #0B0B0E, transparent)' }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28"
            style={{ background: 'linear-gradient(270deg, #0B0B0E, transparent)' }}
          />
        </div>

        {/* --------------------------------------------------------- metrics */}
        <section className="py-16 sm:py-24">
          <Shell>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={container}
              className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {t.metrics.map((m, i) => (
                <Metric key={i} value={m.value} suffix={m.suffix} label={m.label} />
              ))}
            </motion.div>
          </Shell>
        </section>

        {/* ----------------------------------------------------------- about */}
        <section id="about" className="scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <Shell>
            <SectionHead label={t.about.sectionLabel} title={t.about.sectionTitle}>
              <p className="max-w-[36ch] text-[15px] leading-relaxed text-[#A1A1AA] sm:text-right">{t.role}</p>
            </SectionHead>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={container}
              className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-12"
            >
              <BentoCard className="md:col-span-7" icon={<Terminal className="h-5 w-5" />} label={t.about.bioLabel}>
                <p className="text-[15px] leading-relaxed text-[#A1A1AA] sm:text-[16.5px]">{t.about.bio}</p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#B7B7C2]">{t.brand}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#B7B7C2]">
                    {t.about.location}
                  </span>
                </div>
              </BentoCard>

              <BentoCard className="md:col-span-5" icon={<Globe className="h-5 w-5" />} label={t.about.sectionLabel}>
                <svg
                  viewBox="0 0 200 200"
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-14 -right-12 h-56 w-56 opacity-70"
                >
                  <g fill="none" stroke={VIOLET} strokeOpacity="0.4" strokeWidth="1">
                    <circle cx="100" cy="100" r="74" />
                    <ellipse cx="100" cy="100" rx="30" ry="74" />
                    <ellipse cx="100" cy="100" rx="56" ry="74" />
                    <path d="M26 100 H174" />
                    <path d="M38 60 H162" />
                    <path d="M38 140 H162" />
                  </g>
                  <circle cx="140" cy="72" r="4" fill={ROSE} fillOpacity="0.9" />
                </svg>
                <div className="relative mt-auto">
                  <p className="font-oswald text-[clamp(1.5rem,3.4vw,2.1rem)] uppercase leading-tight tracking-[0.02em] text-[#F5F5F7]">
                    {t.about.location}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-[#16161A] px-4 py-2.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: VIOLET }} />
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#D0D0D9]">
                      {t.about.status}
                    </span>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="md:col-span-4" icon={<Activity className="h-5 w-5" />} label={t.about.status}>
                <p className="font-playfair text-[clamp(1.5rem,3.4vw,2rem)] italic leading-snug text-[#F5F5F7]">
                  {t.availability}
                </p>
                <a
                  href="#contact"
                  className="group/link mt-auto inline-flex cursor-pointer items-center gap-2.5 pt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-[#D0D0D9] transition-colors duration-300 hover:text-[#F5F5F7]"
                >
                  {t.hero.ctaSecondary}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
              </BentoCard>

              <BentoCard className="md:col-span-8" icon={<Compass className="h-5 w-5" />} label={t.about.focusLabel}>
                <p className="text-[15px] leading-relaxed text-[#A1A1AA] sm:text-[16.5px]">{t.about.focus}</p>
              </BentoCard>
            </motion.div>
          </Shell>
        </section>

        {/* ----------------------------------------------------------- stack */}
        <section id="stack" className="scroll-mt-24 py-16 sm:py-24 lg:py-28">
          <Shell>
            <SectionHead label={t.stack.sectionLabel} title={t.stack.sectionTitle} />

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={container}
              className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-12"
            >
              <BentoCard className="md:col-span-7" icon={<Code className="h-5 w-5" />} label={t.stack.languagesLabel}>
                <ul className="mt-2 flex flex-col gap-8">
                  {t.stack.languages.map((item, i) => (
                    <SkillMeter key={item.name} item={item} delay={0.12 + i * 0.14} />
                  ))}
                </ul>
              </BentoCard>

              <BentoCard className="md:col-span-5" icon={<Layers className="h-5 w-5" />} label={t.stack.toolsLabel}>
                <ul className="flex flex-wrap gap-2">
                  {t.stack.tools.map((tool) => (
                    <li
                      key={tool}
                      className="cursor-default rounded-full border border-white/10 bg-[#16161A] px-4 py-2.5 font-mono text-[12px] tracking-[0.05em] text-[#D2D2DA] transition-colors duration-300 hover:border-white/30 hover:text-[#F5F5F7]"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#B7B7C2]">{t.hero.kicker}</p>
                </div>
              </BentoCard>
            </motion.div>
          </Shell>
        </section>

        {/* -------------------------------------------------------- projects */}
        <section id="projects" className="relative scroll-mt-24 py-16 sm:py-24 lg:py-32">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/4 h-[540px] opacity-45 blur-[140px]"
            style={{
              background: `radial-gradient(40% 46% at 22% 30%, ${VIOLET}59, transparent 70%), radial-gradient(38% 44% at 82% 74%, ${ROSE}45, transparent 72%)`,
            }}
          />
          <Shell className="relative">
            <SectionHead label={t.projects.sectionLabel} title={t.projects.sectionTitle}>
              <p className="max-w-[34ch] text-[15px] leading-relaxed text-[#A1A1AA] sm:text-right">{t.hero.lead.split('.')[0]}.</p>
            </SectionHead>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.05 }}
              variants={container}
              className="flex flex-col gap-6 sm:gap-10"
            >
              {t.projects.items.map((project, i) => (
                <ProjectCard key={project.id} project={project} i={i} viewLabel={t.projects.viewLabel} />
              ))}
            </motion.div>
          </Shell>
        </section>

        {/* --------------------------------------------------------- contact */}
        <section id="contact" className="scroll-mt-24 py-16 sm:py-24 lg:py-32">
          <Shell>
            <SectionHead label={t.contact.sectionLabel} title={t.contact.sectionTitle} />

            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
              variants={fadeUp}
              className="max-w-[62ch] text-[16px] leading-relaxed text-[#A1A1AA] sm:text-[18px]"
            >
              {t.contact.lead}
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={container}
              className="mt-10 grid grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4"
            >
              {t.contact.items.map((item) => {
                const isCopy = !item.href && !!item.copyValue;
                const copied = copiedId === item.id;

                const inner = (
                  <>
                    <TopSheen />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(300px circle at 50% 0%, ${ROSE}1f, transparent 70%)`,
                      }}
                    />
                    <span className="relative flex items-center justify-between gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/12 bg-[#16161A] text-[#DCDCE4]">
                        {contactIcon(item)}
                      </span>
                      {isCopy ? (
                        <span
                          aria-live="polite"
                          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#B7B7C2]"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {copied ? (
                              <motion.span
                                key="done"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.2 }}
                                className="inline-flex items-center gap-2 text-[#F5F5F7]"
                              >
                                <Check className="h-3.5 w-3.5" />
                                {t.contact.copied}
                              </motion.span>
                            ) : (
                              <motion.span
                                key="idle"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                transition={{ duration: 0.2 }}
                                className="inline-flex items-center"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                      ) : (
                        <ArrowUpRight className="h-5 w-5 shrink-0 text-[#B7B7C2] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#F5F5F7]" />
                      )}
                    </span>
                    <span className="relative block">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-[#B7B7C2]">
                        {item.label}
                      </span>
                      <span className="mt-2 block break-all font-oswald text-[clamp(1.05rem,2.4vw,1.5rem)] uppercase tracking-[0.02em] text-[#F5F5F7]">
                        {item.value}
                      </span>
                    </span>
                  </>
                );

                return (
                  <motion.div key={item.id} variants={fadeUp} className="h-full">
                    {isCopy ? (
                      <button
                        type="button"
                        onClick={() => copy(item.id, item.copyValue ?? item.value)}
                        aria-label={`${item.label}: ${item.value} — ${t.contact.copyHint}`}
                        className={contactShell}
                      >
                        {inner}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        target={item.href?.startsWith('http') ? '_blank' : undefined}
                        rel={item.href?.startsWith('http') ? 'noreferrer noopener' : undefined}
                        className={contactShell}
                      >
                        {inner}
                      </a>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[#B7B7C2]">{t.contact.copyHint}</p>

            {/* closing statement */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={container}
              className="mt-24 sm:mt-36"
            >
              {t.contact.statement.map((word, i) => (
                <div
                  key={i}
                  className={`reveal-mask max-w-full ${i === 1 ? 'sm:text-center' : ''} ${i === 2 ? 'sm:text-right' : ''}`}
                >
                  <motion.span
                    variants={rise}
                    className={
                      i === 1
                        ? 'block pb-[0.14em] font-playfair text-[clamp(2.3rem,10.4vw,8.5rem)] italic leading-[1] tracking-[-0.01em] text-[#F5F5F7]'
                        : 'block pb-[0.06em] font-oswald text-[clamp(2.3rem,10.4vw,8.5rem)] uppercase leading-[1] tracking-[0.02em] text-[#F5F5F7]'
                    }
                  >
                    {word}
                  </motion.span>
                </div>
              ))}
            </motion.div>
          </Shell>
        </section>

        {/* ---------------------------------------------------------- footer */}
        <footer className="relative overflow-hidden border-t border-white/10 pb-28 pt-12 sm:pb-32 sm:pt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-[-45%] flex justify-center"
          >
            <div
              className="h-[420px] w-[min(900px,130vw)] rounded-full opacity-45 blur-[130px]"
              style={{ background: `radial-gradient(50% 50% at 50% 50%, ${VIOLET}66, transparent 72%)` }}
            />
          </div>
          <Shell className="relative">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-oswald text-[clamp(2rem,6vw,4.4rem)] uppercase leading-none tracking-[0.16em] text-[#F5F5F7]">
                  {t.brand}
                </p>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#B7B7C2]">{t.role}</p>
              </div>
              <a
                href="#top"
                className="group inline-flex cursor-pointer items-center gap-3 self-start rounded-full border border-white/12 bg-white/[0.03] px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#D0D0D9] transition-colors duration-300 hover:border-white/30 hover:text-[#F5F5F7] sm:self-auto"
              >
                {t.nav[0].label}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[12px] text-[#A1A1AA]">{t.footer.rights}</p>
              <p className="font-mono text-[12px] text-[#A1A1AA]">{t.footer.built}</p>
            </div>
          </Shell>
        </footer>
      </div>
    </MotionConfig>
  );
}

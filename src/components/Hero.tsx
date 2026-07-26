import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Terminal as TerminalIcon } from 'lucide-react';
import { motion, useMotionValue, useSpring, useInView, useReducedMotion, type Variants } from 'framer-motion';
import MagneticButton from './MagneticButton';

interface HeroProps {
  lang: 'ru' | 'en';
}

/** Counts from 0 up to a numeric target when scrolled into view */
function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState('0');

  const target = parseFloat(value);
  const suffix = value.replace(/^[\d.]+/, '');
  const decimals = value.includes('.') ? 1 : 0;

  useEffect(() => {
    if (!inView) return;
    if (reduce || isNaN(target)) {
      setDisplay(value);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay((target * eased).toFixed(decimals) + suffix);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, suffix, decimals, value]);

  return <span ref={ref}>{display}</span>;
}

const lineReveal: Variants = {
  hidden: { y: '110%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 0.9, delay: 0.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] },
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

export default function Hero({ lang }: HeroProps) {
  const [line1Text, setLine1Text] = useState('');
  const [showJson, setShowJson] = useState(false);
  const [line2Text, setLine2Text] = useState('');
  const [diagStep, setDiagStep] = useState(0);
  const reduce = useReducedMotion();

  // Terminal typewriter sequence
  useEffect(() => {
    let cancelled = false;
    const cmd1 = 'cat info.json';
    const cmd2 = 'run-diagnostics --verbose';

    if (reduce) {
      setLine1Text(cmd1);
      setShowJson(true);
      setLine2Text(cmd2);
      setDiagStep(4);
      return;
    }

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      setLine1Text('');
      setShowJson(false);
      setLine2Text('');
      setDiagStep(0);

      for (let i = 0; i <= cmd1.length; i++) {
        if (cancelled) return;
        setLine1Text(cmd1.slice(0, i));
        await sleep(60);
      }
      if (cancelled) return;
      await sleep(400);
      setShowJson(true);
      await sleep(600);
      for (let j = 0; j <= cmd2.length; j++) {
        if (cancelled) return;
        setLine2Text(cmd2.slice(0, j));
        await sleep(50);
      }
      for (const step of [1, 2, 3, 4]) {
        if (cancelled) return;
        await sleep(350);
        setDiagStep(step);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reduce]);

  // Mouse parallax for the terminal panel
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
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 18);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 14);
  };

  const t = {
    ru: {
      meta1: '[ ОПЕРАТОР: WANNASLY ]',
      meta2: '[ СЕРИЯ: AUTOMATION_0x01 ]',
      titleLines: ['РАЗРАБОТКА', 'СИСТЕМ АВТОМАТИЗАЦИИ', '& WEB3 РЕШЕНИЙ'],
      subtitle: 'Высокопроизводительная автоматизация, безопасные парсеры, скрипты для смарт-контрактов, движки для Discord и кастомные ИИ-агенты. Строгие бэкенд-утилиты скрытого действия и премиальные интерфейсы.',
      m1v: '99.9', m1s: '%', m1l: 'Автоматизация 24/7',
      m2v: '30', m2s: '+', m2l: 'Скрипты и инструменты',
      m3v: '100', m3s: '%', m3l: 'Скрытый режим',
      cta1a: 'СМОТРЕТЬ',
      cta1b: 'ПРОЕКТЫ',
      cta2: '[ СВЯЗАТЬСЯ ]',
      log1: '> Запуск предпусковой проверки...',
      log2: '> Подключение к сети: Стабильно',
      log3: '> Безопасный туннель: Активен. Брандмауэр настроен.',
      log4: '> Статус: ГОТОВ К РАЗВЕРТЫВАНИЮ',
    },
    en: {
      meta1: '[ OPERATOR: WANNASLY ]',
      meta2: '[ SERIES: AUTOMATION_0x01 ]',
      titleLines: ['BUILDING', 'AUTOMATED SYSTEMS', '& WEB3 SOLUTIONS'],
      subtitle: 'High-performance automation, secure parsers, smart contract scripts, Discord engines, and custom AI agents. Stealth-mode backend utilities and premium interfaces.',
      m1v: '99.9', m1s: '%', m1l: 'Uptime Automation',
      m2v: '30', m2s: '+', m2l: 'Scripts & Tools',
      m3v: '100', m3s: '%', m3l: 'Stealth Mode',
      cta1a: 'VIEW',
      cta1b: 'PROJECTS',
      cta2: '[ ESTABLISH CONTACT ]',
      log1: '> Initializing systems scan...',
      log2: '> Network connection: Operational',
      log3: '> Secure tunneling active. Firewall configured.',
      log4: '> Status: READY TO BUILD',
    },
  }[lang];

  const metrics = [
    { v: t.m1v, s: t.m1s, l: t.m1l },
    { v: t.m2v, s: t.m2s, l: t.m2l },
    { v: t.m3v, s: t.m3s, l: t.m3l },
  ];

  return (
    <section
      id="top"
      className="relative min-h-dvh bg-frost-base pt-24 sm:pt-28 pb-16 overflow-hidden"
    >
      {/* decorative cold glow — behind content, does not affect text contrast */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-frost-mist/20 rounded-full blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute top-1/3 -right-20 w-[380px] h-[380px] bg-frost-deep/40 rounded-full blur-[100px]" aria-hidden="true" />

      <div className="relative max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* top meta row */}
        <motion.div variants={fade} custom={0} initial="hidden" animate="visible" className="flex flex-wrap gap-x-6 gap-y-1 pb-8">
          <span className="tech-label">{t.meta1}</span>
          <span className="tech-label">{t.meta2}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT — headline, metrics, CTAs */}
          <div className="lg:col-span-7 space-y-8">
            <h1 className="display text-[2.6rem] leading-none sm:text-6xl xl:text-7xl text-frost-white">
              {t.titleLines.map((line, i) => (
                <span key={`${lang}-${i}`} className="block reveal-mask">
                  <motion.span className="block" variants={lineReveal} custom={i} initial="hidden" animate="visible">
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              variants={fade}
              custom={1}
              initial="hidden"
              animate="visible"
              className="text-frost-white text-sm sm:text-base leading-relaxed max-w-xl"
            >
              {t.subtitle}
            </motion.p>

            {/* Metrics with animated counters */}
            <motion.div variants={fade} custom={2} initial="hidden" animate="visible" className="grid grid-cols-3 gap-px bg-frost-line max-w-lg border border-frost-line">
              {metrics.map((m, i) => (
                <div key={i} className="bg-frost-base/90 p-4">
                  <div className="display text-2xl sm:text-3xl text-frost-white">
                    <AnimatedCounter value={m.v} />
                    {m.s}
                  </div>
                  <div className="tech-label mt-1.5">{m.l}</div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fade} custom={3} initial="hidden" animate="visible" className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-5">
                <MagneticButton
                  href="#projects"
                  ariaLabel={`${t.cta1a} ${t.cta1b}`}
                  strength={10}
                  className="group relative w-16 h-16 flex items-center justify-center bg-frost-white/12 text-frost-white hover:bg-frost-white hover:text-frost-ink transition-colors duration-300 cursor-pointer"
                  style={{ clipPath: 'polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)' }}
                >
                  <ArrowUpRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </MagneticButton>
                <div>
                  <div className="tech-label">{t.cta1a}</div>
                  <div className="display text-2xl text-frost-white mt-0.5">{t.cta1b}</div>
                </div>
              </div>

              <a
                href="#contact"
                className="mono text-xs tracking-[0.15em] text-frost-white hover:text-frost-ink border border-frost-white/40 hover:bg-frost-white rounded-full px-5 py-3.5 transition-colors min-h-[44px] inline-flex items-center"
              >
                {t.cta2}
              </a>
            </motion.div>
          </div>

          {/* RIGHT — terminal panel with parallax + graffiti */}
          <div
            ref={stageRef}
            onMouseMove={onMove}
            onMouseLeave={() => {
              mx.set(0);
              my.set(0);
            }}
            className="lg:col-span-5 relative"
          >
            <span className="tag absolute -top-14 left-1/2 -translate-x-1/2 text-[7rem] sm:text-[9rem] rotate-[-7deg] whitespace-nowrap">
              WANNASLY
            </span>

            <motion.div
              style={{ x: px, y: py }}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative shadow-[0_40px_80px_-24px_rgba(18,25,31,0.6)]"
            >
              <div className="notch-tr bg-frost-ink/95 border border-frost-white/10 overflow-hidden">
                {/* Header bar */}
                <div className="border-b border-frost-white/10 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-frost-white/25"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-frost-white/25"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-frost-white/60"></span>
                  </div>
                  <span className="mono text-[10px] text-frost-white/50 tracking-wider">sh --session=wannasly@altitude</span>
                  <TerminalIcon className="w-3.5 h-3.5 text-frost-white/70" />
                </div>

                {/* Terminal body */}
                <div className="p-5 sm:p-6 mono text-xs sm:text-[13px] text-left space-y-4 h-[320px] overflow-y-auto">
                  <div className="text-frost-white/55">Last login: Fri Jun 19 21:24:47 on console</div>

                  <div className="space-y-1">
                    <p className="text-frost-white">
                      <span className="text-frost-white/60">wannasly@altitude:~$</span> {line1Text}
                      {!showJson && <span className="inline-block w-2 h-4 bg-frost-white animate-blink align-middle ml-1"></span>}
                    </p>
                    {showJson && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="pl-4 leading-relaxed text-frost-white/70">
                        {'{'}<br />
                        &nbsp;&nbsp;<span className="text-frost-snow">&quot;status&quot;</span>: &quot;building_the_future&quot;,<br />
                        &nbsp;&nbsp;<span className="text-frost-snow">&quot;languages&quot;</span>: [&quot;Python&quot;, &quot;TypeScript&quot;, &quot;C++&quot;],<br />
                        &nbsp;&nbsp;<span className="text-frost-snow">&quot;focus&quot;</span>: [&quot;Web3&quot;, &quot;Automation&quot;, &quot;Security&quot;]<br />
                        {'}'}
                      </motion.div>
                    )}
                  </div>

                  {showJson && (
                    <div className="space-y-1.5">
                      <p className="text-frost-white">
                        <span className="text-frost-white/60">wannasly@altitude:~$</span> {line2Text}
                        {diagStep === 0 && <span className="inline-block w-2 h-4 bg-frost-white animate-blink align-middle ml-1"></span>}
                      </p>
                      {diagStep >= 1 && <p className="text-frost-white/85 font-bold">{t.log1}</p>}
                      {diagStep >= 2 && <p className="text-frost-white/70">{t.log2}</p>}
                      {diagStep >= 3 && <p className="text-frost-white/70">{t.log3}</p>}
                      {diagStep >= 4 && <p className="text-frost-snow font-bold">{t.log4}</p>}
                    </div>
                  )}

                  {diagStep >= 4 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-frost-white">
                      <span className="text-frost-white/60">wannasly@altitude:~$</span>
                      <span className="inline-block w-2 h-4 bg-frost-white animate-blink align-middle ml-1"></span>
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* pager */}
            <motion.div variants={fade} custom={4} initial="hidden" animate="visible" className="flex items-center gap-3 mono text-sm text-frost-white/70 mt-6">
              <span className="text-frost-white">01</span>
              <span className="flex-1 h-px bg-frost-line" />
              <span>04</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

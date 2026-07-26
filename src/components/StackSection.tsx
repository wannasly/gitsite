import { Compass, Zap, Shield, Cpu } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

interface StackSectionProps {
  lang: 'ru' | 'en';
}

const gridStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const tileUp: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export default function StackSection({ lang }: StackSectionProps) {
  const t = {
    ru: {
      title: 'О СЕБЕ & СТЕК',
      metaA: ['[ СИСТЕМНЫЙ_ЛИСТ ]', '[ АРХИТЕКТУРА ]', '[ СЕРИЯ_01 ]'],
      metaB: ['ОСНОВНЫЕ ЯЗЫКИ', 'АВТОМАТИЗАЦИЯ', 'WEB3 БЕЗОПАСНОСТЬ', 'СКРЫТАЯ ЛИНИЯ'],
      bioLabel: 'БИОГРАФИЯ // СВОДКА',
      bio: 'Инженер по автоматизации систем и full-stack разработчик. Мой фокус — написание оптимизированного кода для парсинга данных, веб-скрейпинга, кастомных движков автоматизации в Telegram/Discord и скриптов безопасности в Web3.',
      bioLoc: 'LOC: C-137 // REMOTE',
      bioStatus: 'STATUS: ONLINE',
      focusLabel: 'ТЕКУЩИЙ_ФОКУС',
      focus: 'Разработка автономных ИИ-агентов для оптимизации рабочих процессов, сканирование смарт-контрактов в блокчейн-сетях и построение защищенных распределенных сетей скрейпинга.',
      focusStatus: 'ДВИЖКИ ЗАПУЩЕНЫ',
      langLabel: 'ОСНОВНЫЕ_ЯЗЫКИ',
      adv: 'Продвинутый',
      inter: 'Средний',
      toolsLabel: 'СРЕДА_И_ИНСТРУМЕНТЫ',
      toolsStatus: '> environment_check // ВСЕ_СИСТЕМЫ_АКТИВНЫ',
    },
    en: {
      title: 'ABOUT & STACK',
      metaA: ['[ DATA_SHEET ]', '[ ARCHITECTURE ]', '[ SERIES_01 ]'],
      metaB: ['CORE LANGUAGES', 'AUTOMATION OPS', 'WEB3 SECURITY', 'STEALTH LINE'],
      bioLabel: 'BIO_DATA // SUMMARY',
      bio: 'System automation engineer and full-stack developer. My focus is writing highly optimized code for data parsing, web scraping, custom Telegram/Discord automation engines, and Web3 security scripts.',
      bioLoc: 'LOC: C-137 // REMOTE',
      bioStatus: 'STATUS: ONLINE',
      focusLabel: 'CURRENT_FOCUS',
      focus: 'Developing autonomous AI agents to optimize workflows, scanning smart contracts in blockchain networks, and constructing secure distributed scraping networks.',
      focusStatus: 'ENGINES RUNNING',
      langLabel: 'CORE_LANGUAGES',
      adv: 'Advanced',
      inter: 'Intermediate',
      toolsLabel: 'ENVIRONMENT_AND_TOOLS',
      toolsStatus: '> environment_check // ALL_SYSTEMS_OPERATIONAL',
    },
  }[lang];

  const languages = [
    { name: 'Python', level: t.adv, pct: 92 },
    { name: 'TypeScript / JS', level: t.adv, pct: 86 },
    { name: 'C++', level: t.inter, pct: 64 },
  ];

  const tools = ['Kali Linux', 'Docker', 'Git & CI/CD', 'TailwindCSS', 'Ethers.js / Web3.py', 'AI Agents API', 'FastAPI'];

  return (
    <section id="stack" className="relative bg-frost-base py-20 sm:py-28">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="display text-5xl sm:text-6xl xl:text-7xl text-frost-white"
          >
            {t.title}
          </motion.h2>

          <div className="flex flex-col sm:flex-row gap-8 lg:pt-3">
            <div className="space-y-1">
              {t.metaA.map((m) => (
                <div key={m} className="tech-label">{m}</div>
              ))}
            </div>
            <div className="space-y-1">
              {t.metaB.map((m) => (
                <div key={m} className="tech-label">{m}</div>
              ))}
            </div>
          </div>
        </div>

        {/* tile collage */}
        <motion.div
          variants={gridStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
        >
          {/* Bio — light tile, ink text */}
          <motion.article
            variants={tileUp}
            className="md:col-span-2 notch-tr bg-frost-card text-frost-ink p-6 sm:p-8 flex flex-col justify-between min-h-[240px] tile-vignette transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5" />
                <span className="mono text-[11px] tracking-[0.2em] font-bold uppercase">{t.bioLabel}</span>
              </div>
              <p className="text-sm sm:text-[15px] leading-relaxed max-w-2xl text-frost-ink/80 font-medium">
                {t.bio}
              </p>
            </div>
            <div className="flex justify-between items-center mono text-[10px] tracking-widest uppercase border-t border-frost-ink/15 pt-4 mt-6 text-frost-ink/75">
              <span>{t.bioLoc}</span>
              <span className="flex items-center gap-1.5 text-frost-ink">
                <span className="w-1.5 h-1.5 rounded-full bg-frost-ink animate-pulse"></span>
                {t.bioStatus}
              </span>
            </div>
          </motion.article>

          {/* Focus — quilted deep tile, white text */}
          <motion.article
            variants={tileUp}
            className="quilt notch-tr text-frost-white p-6 sm:p-8 flex flex-col justify-between min-h-[240px] tile-vignette transition-transform duration-300 hover:-translate-y-1"
            style={{ ['--quilt-tint' as string]: '#4d5f6c' }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5" />
                <span className="mono text-[11px] tracking-[0.2em] font-bold uppercase">{t.focusLabel}</span>
              </div>
              <p className="text-sm leading-relaxed text-frost-white/85 font-medium">{t.focus}</p>
            </div>
            <div className="flex items-center gap-2 mono text-[10px] tracking-widest uppercase pt-4">
              <span className="w-2 h-2 rounded-full bg-frost-white animate-pulse"></span>
              <span>{t.focusStatus}</span>
            </div>
          </motion.article>

          {/* Languages — ink tile with bars */}
          <motion.article
            variants={tileUp}
            className="notch-tr bg-frost-ink text-frost-white p-6 sm:p-8 flex flex-col min-h-[240px] transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5" />
                <span className="mono text-[11px] tracking-[0.2em] font-bold uppercase">{t.langLabel}</span>
              </div>
              <div className="space-y-4">
                {languages.map((item, i) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between mono text-xs">
                      <span className="text-frost-white">{item.name}</span>
                      <span className="text-[10px] text-frost-white/50 uppercase tracking-wide">{item.level}</span>
                    </div>
                    <div className="h-1.5 bg-frost-white/10 overflow-hidden" role="presentation">
                      <motion.div
                        className="h-full bg-frost-snow"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.article>

          {/* Tools — snow tile with chips */}
          <motion.article
            variants={tileUp}
            className="md:col-span-2 notch-tr bg-frost-snow text-frost-ink p-6 sm:p-8 flex flex-col justify-between min-h-[240px] tile-vignette transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5" />
                <span className="mono text-[11px] tracking-[0.2em] font-bold uppercase">{t.toolsLabel}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 mono text-[11px] tracking-wide border border-frost-ink/20 text-frost-ink/75 hover:bg-frost-ink hover:text-frost-snow transition-colors duration-200 cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <div className="mono text-[10px] tracking-widest uppercase text-frost-ink/75 border-t border-frost-ink/15 pt-4 mt-6">
              {t.toolsStatus}
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}

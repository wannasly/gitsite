import { Activity, Search, Bot } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

interface ProjectsSectionProps {
  lang: 'ru' | 'en';
}

const gridStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProjectsSection({ lang }: ProjectsSectionProps) {
  const t = {
    ru: {
      title: 'КЛЮЧЕВЫЕ ПРОЕКТЫ',
      metaA: ['[ СИСТЕМНЫЙ_КАТАЛОГ ]', '[ REPOS ]'],
      metaB: ['DEPLOYED', 'PRODUCTION', 'ACTIVE'],
      p1t: 'DeFi Airdrop Automation Suite',
      p1d: 'Комплексная система для автоматизации участия в крипто-аирдропах и тестнетах. Многопоточные скрипты на Web3.py/Ethers.js, автоматический сбор поинтов (включая Grass Stage 1 & 2), симуляция поведения реального пользователя и продвинутая работа с прокси-сетями.',
      p2t: 'Stealth Network Security Scanner',
      p2d: 'Низкоуровневая консольная утилита и бэкенд на C++ и Python для сканирования уязвимостей в корпоративных сетях. Интегрирована с API Nmap и Bettercap, автоматически выявляет критические бреши безопасности и генерирует отчеты в шифрованном виде.',
      p3t: 'Discord Core Engine & Logistics',
      p3d: 'Архитектура для масштабируемых Discord-ботов на TypeScript. Продвинутая система модерации и администрирования серверов. Кастомная структура .env, где динамически хранятся и распределяются переменные для разных каналов, потоки для логов команд и глобальный обработчик всех системных ошибок.',
    },
    en: {
      title: 'KEY PROJECTS',
      metaA: ['[ SYSTEM_DIRECTORY ]', '[ REPOS ]'],
      metaB: ['DEPLOYED', 'PRODUCTION', 'ACTIVE'],
      p1t: 'DeFi Airdrop Automation Suite',
      p1d: 'A comprehensive system for automating participation in crypto airdrops and testnets. Multi-threaded scripts on Web3.py/Ethers.js, automated point harvesting (including Grass Stage 1 & 2), real-user behavior simulation, and advanced proxy network orchestration.',
      p2t: 'Stealth Network Security Scanner',
      p2d: 'Low-level console utility and backend in C++ and Python for scanning corporate network vulnerabilities. Integrated with Nmap and Bettercap APIs, automatically identifying critical security flaws and generating encrypted reports.',
      p3t: 'Discord Core Engine & Logistics',
      p3d: 'Scalable TypeScript architecture for Discord bots featuring advanced moderation and administration systems. A custom .env infrastructure for dynamic routing: separated channel variables, dedicated streams for command usage logs, and a global handler that catches all system-level exceptions.',
    },
  }[lang];

  const projects = [
    { idx: '01', title: t.p1t, desc: t.p1d, cat: 'WEB3 / AUTOMATION', icon: <Activity className="w-5 h-5" />, tags: ['Python', 'Web3.py', 'Ethers.js', 'Proxies'], variant: 'light' as const },
    { idx: '02', title: t.p2t, desc: t.p2d, cat: 'SECURITY / NETWORK', icon: <Search className="w-5 h-5" />, tags: ['C++', 'Python', 'Nmap API', 'Cryptography'], variant: 'ink' as const },
    { idx: '03', title: t.p3t, desc: t.p3d, cat: 'INTEGRATIONS / BOT', icon: <Bot className="w-5 h-5" />, tags: ['TypeScript', 'Node.js', 'WebSockets', 'env-Isolation'], variant: 'quilt' as const },
  ];

  return (
    <section id="projects" className="relative bg-frost-deep py-20 sm:py-28">
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

        {/* project cards */}
        <motion.div
          variants={gridStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
        >
          {projects.map((p) => {
            const styleMap = {
              light: 'bg-frost-card text-frost-ink',
              ink: 'bg-frost-ink text-frost-white',
              quilt: 'quilt text-frost-white',
            };
            const subColor = p.variant === 'light' ? 'text-frost-ink/70' : 'text-frost-white/75';
            const borderColor = p.variant === 'light' ? 'border-frost-ink/15' : 'border-frost-white/15';
            const chipBorder = p.variant === 'light' ? 'border-frost-ink/20 text-frost-ink/70' : 'border-frost-white/20 text-frost-white/70';

            return (
              <motion.article
                key={p.idx}
                variants={cardUp}
                style={p.variant === 'quilt' ? ({ ['--quilt-tint' as string]: '#4d5f6c' } as React.CSSProperties) : undefined}
                className={`group notch-tr p-6 sm:p-7 flex flex-col justify-between min-h-[380px] tile-vignette transition-transform duration-300 hover:-translate-y-1.5 ${styleMap[p.variant]}`}
              >
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 border ${borderColor}`}>{p.icon}</div>
                    <span className="display text-4xl opacity-15 group-hover:opacity-30 transition-opacity">{p.idx}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className={`mono text-[10px] tracking-[0.2em] ${subColor}`}>{p.cat}</div>
                    <h3 className="display text-xl sm:text-2xl leading-tight">{p.title}</h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${subColor} font-medium`} style={{ fontFamily: 'var(--font-sans)' }}>
                    {p.desc}
                  </p>
                </div>

                <div className={`mt-6 pt-4 border-t ${borderColor}`}>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span key={tag} className={`px-2.5 py-1 mono text-[10px] tracking-wide border ${chipBorder} cursor-default`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

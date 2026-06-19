import { Search, Bot, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectsSectionProps {
  lang: 'ru' | 'en';
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  demo?: string;
  icon: React.ReactNode;
  category: string;
  borderColor: string;
  glowColor: string;
}

export default function ProjectsSection({ lang }: ProjectsSectionProps) {
  const t = {
    ru: {
      sub: 'СИСТЕМНЫЙ_КАТАЛОГ // ПРОЕКТЫ',
      title: 'Ключевые проекты',
      demoLink: 'ДЕМО_ВЕРСИЯ',
      proj1Title: 'DeFi Airdrop Automation Suite',
      proj1Desc: 'Комплексная система для автоматизации участия в крипто-аирдропах и тестнетах. Включает многопоточные скрипты на Web3.py/Ethers.js, автоматический сбор поинтов (включая Grass Stage 1 & 2), симуляцию поведения реального пользователя и продвинутую работу с прокси-сетями.',
      proj2Title: 'Stealth Network Security Scanner',
      proj2Desc: 'Низкоуровневая консольная утилита и бэкенд на C++ и Python для сканирования уязвимостей в корпоративных сетях. Интегрирована с API Nmap и Bettercap, автоматически выявляет критические бреши безопасности и генерирует отчеты в шифрованном виде.',
      proj3Title: 'Discord Core Engine & Logistics',
      proj3Desc: 'Архитектура для масштабируемых Discord-ботов следующего поколения на TypeScript. Включает кастомную отказоустойчивую систему изоляции .env переменных, выделенный логгер сессий, обработчик критических ошибок выполнения и кастомные модули модерации трибун (voice stages).',
    },
    en: {
      sub: 'SYSTEM_DIRECTORY // REPOS',
      title: 'Key Projects',
      demoLink: 'LIVE_PREVIEW',
      proj1Title: 'DeFi Airdrop Automation Suite',
      proj1Desc: 'A comprehensive system for automating participation in crypto airdrops and testnets. Includes multi-threaded scripts on Web3.py/Ethers.js, automated point harvesting (including Grass Stage 1 & 2), real-user behavior simulation, and advanced proxy network orchestration.',
      proj2Title: 'Stealth Network Security Scanner',
      proj2Desc: 'Low-level console utility and backend in C++ and Python for scanning corporate network vulnerabilities. Integrated with Nmap and Bettercap APIs, automatically identifying critical security flaws and generating encrypted reports.',
      proj3Title: 'Discord Core Engine & Logistics',
      proj3Desc: 'Next-generation architecture for scalable Discord bots in TypeScript. Features a custom fault-tolerant env-variable isolation system, dedicated session logging, runtime crash handler, and custom voice stage moderation modules.',
    }
  }[lang];

  const projects: Project[] = [
    {
      title: t.proj1Title,
      description: t.proj1Desc,
      tags: ['Python', 'Web3.py', 'Ethers.js', 'Proxies'],
      icon: <Activity className="w-5 h-5 text-cyber-cyan" />,
      category: 'WEB3 / AUTOMATION',
      borderColor: 'rgba(0, 240, 255, 0.3)',
      glowColor: '0 10px 30px -10px rgba(0, 240, 255, 0.15)',
    },
    {
      title: t.proj2Title,
      description: t.proj2Desc,
      tags: ['C++', 'Python', 'Nmap API', 'Cryptography'],
      icon: <Search className="w-5 h-5 text-cyber-accent" />,
      category: 'SECURITY / NETWORK',
      borderColor: 'rgba(0, 255, 102, 0.3)',
      glowColor: '0 10px 30px -10px rgba(0, 255, 102, 0.15)',
    },
    {
      title: t.proj3Title,
      description: t.proj3Desc,
      tags: ['TypeScript', 'Node.js', 'WebSockets', 'env-Isolation'],
      icon: <Bot className="w-5 h-5 text-cyber-magenta" />,
      category: 'INTEGRATIONS / BOT',
      borderColor: 'rgba(255, 0, 127, 0.3)',
      glowColor: '0 10px 30px -10px rgba(255, 0, 127, 0.15)',
    },
  ];

  return (
    <section id="projects" className="py-24 bg-cyber-bg/95 relative border-t border-white/5">
      {/* Background Radial Glow */}
      <div className="absolute bottom-1/4 right-10 w-[300px] h-[300px] bg-cyber-cyan/5 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left mb-16 space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-ping"></span>
            <span>{t.sub}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.title}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyber-cyan to-transparent"></div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div 
              key={project.title}
              className="border border-white/5 bg-cyber-card/60 rounded-2xl p-6 md:p-8 flex flex-col justify-between group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -4, 
                scale: 1.015,
                borderColor: project.borderColor,
                boxShadow: project.glowColor
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="space-y-4">
                {/* Top header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-cyber-accent group-hover:border-cyber-accent/30 transition-colors">
                      {project.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-mono text-[10px] text-cyber-muted tracking-widest">{project.category}</div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyber-accent transition-colors">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-cyber-muted text-sm leading-relaxed text-left font-sans">
                  {project.description}
                </p>
              </div>

              {/* Tags & Action Links */}
              <div className="mt-8 space-y-4 pt-4 border-t border-white/5">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 border border-white/5 text-cyber-muted hover:text-white hover:border-white/10 transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

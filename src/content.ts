/**
 * Single source of truth for all site copy.
 * Every design variant renders THIS data — only the visual language differs.
 */

export type Lang = 'ru' | 'en';

export interface Project {
  id: string;
  index: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
}

export interface SkillBar {
  name: string;
  level: string;
  pct: number;
}

export interface Contact {
  id: string;
  label: string;
  value: string;
  href?: string;
  copyValue?: string;
}

export interface Content {
  brand: string;
  role: string;
  availability: string;
  nav: { label: string; href: string; id: string }[];
  hero: {
    kicker: string;
    titleLines: string[];
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
  };
  metrics: { value: string; suffix: string; label: string }[];
  about: {
    sectionLabel: string;
    sectionTitle: string;
    bioLabel: string;
    bio: string;
    focusLabel: string;
    focus: string;
    location: string;
    status: string;
  };
  stack: {
    sectionLabel: string;
    sectionTitle: string;
    languagesLabel: string;
    toolsLabel: string;
    languages: SkillBar[];
    tools: string[];
  };
  projects: {
    sectionLabel: string;
    sectionTitle: string;
    items: Project[];
    viewLabel: string;
  };
  contact: {
    sectionLabel: string;
    sectionTitle: string;
    lead: string;
    items: Contact[];
    copyHint: string;
    copied: string;
    statement: string[];
  };
  footer: { rights: string; built: string };
  marquee: string[];
}

const TOOLS = ['Kali Linux', 'Docker', 'Git & CI/CD', 'TailwindCSS', 'Ethers.js / Web3.py', 'AI Agents API', 'FastAPI'];

export const CONTENT: Record<Lang, Content> = {
  ru: {
    brand: 'WANNASLY',
    role: 'Инженер автоматизации / Web3-разработчик',
    availability: 'Открыт к проектам',
    nav: [
      { label: 'Главная', href: '#top', id: 'top' },
      { label: 'О себе', href: '#about', id: 'about' },
      { label: 'Стек', href: '#stack', id: 'stack' },
      { label: 'Проекты', href: '#projects', id: 'projects' },
      { label: 'Контакты', href: '#contact', id: 'contact' },
    ],
    hero: {
      kicker: 'Автоматизация · Web3 · Безопасность',
      titleLines: ['Разработка', 'систем автоматизации', '& Web3 решений'],
      lead: 'Высокопроизводительная автоматизация, безопасные парсеры, скрипты для смарт-контрактов, движки для Discord и кастомные ИИ-агенты. Строгие бэкенд-утилиты и премиальные интерфейсы.',
      ctaPrimary: 'Смотреть проекты',
      ctaSecondary: 'Связаться',
      scroll: 'Листай вниз',
    },
    metrics: [
      { value: '99.9', suffix: '%', label: 'Аптайм автоматизации' },
      { value: '30', suffix: '+', label: 'Скриптов и инструментов' },
      { value: '3', suffix: '', label: 'Года в разработке' },
    ],
    about: {
      sectionLabel: 'О себе',
      sectionTitle: 'Кто я',
      bioLabel: 'Биография',
      bio: 'Инженер по автоматизации систем и full-stack разработчик. Мой фокус — написание оптимизированного кода для парсинга данных, веб-скрейпинга, кастомных движков автоматизации в Telegram/Discord и скриптов безопасности в Web3.',
      focusLabel: 'Текущий фокус',
      focus: 'Разработка автономных ИИ-агентов для оптимизации рабочих процессов, сканирование смарт-контрактов в блокчейн-сетях и построение защищённых распределённых сетей скрейпинга.',
      location: 'Удалённо · Доступен',
      status: 'Онлайн',
    },
    stack: {
      sectionLabel: 'Технологии',
      sectionTitle: 'Стек',
      languagesLabel: 'Основные языки',
      toolsLabel: 'Инструменты и среда',
      languages: [
        { name: 'Python', level: 'Продвинутый', pct: 92 },
        { name: 'TypeScript / JS', level: 'Продвинутый', pct: 86 },
        { name: 'C++', level: 'Средний', pct: 64 },
      ],
      tools: TOOLS,
    },
    projects: {
      sectionLabel: 'Работы',
      sectionTitle: 'Проекты',
      viewLabel: 'Подробнее',
      items: [
        {
          id: 'defi',
          index: '01',
          category: 'Web3 / Автоматизация',
          title: 'DeFi Airdrop Automation Suite',
          description: 'Комплексная система для автоматизации участия в крипто-аирдропах и тестнетах. Многопоточные скрипты на Web3.py/Ethers.js, автоматический сбор поинтов, симуляция поведения реального пользователя и продвинутая работа с прокси-сетями.',
          tags: ['Python', 'Web3.py', 'Ethers.js', 'Proxies'],
          year: '2025',
        },
        {
          id: 'scanner',
          index: '02',
          category: 'Безопасность / Сети',
          title: 'Stealth Network Security Scanner',
          description: 'Низкоуровневая консольная утилита и бэкенд на C++ и Python для сканирования уязвимостей в корпоративных сетях. Интеграция с API Nmap и Bettercap, автоматическое выявление критических брешей и генерация зашифрованных отчётов.',
          tags: ['C++', 'Python', 'Nmap API', 'Cryptography'],
          year: '2025',
        },
        {
          id: 'discord',
          index: '03',
          category: 'Интеграции / Боты',
          title: 'Discord Core Engine & Logistics',
          description: 'Архитектура для масштабируемых Discord-ботов на TypeScript. Продвинутая система модерации и администрирования серверов, кастомная структура .env с динамическим распределением переменных по каналам и глобальный обработчик системных ошибок.',
          tags: ['TypeScript', 'Node.js', 'WebSockets', 'env-Isolation'],
          year: '2024',
        },
      ],
    },
    contact: {
      sectionLabel: 'Контакты',
      sectionTitle: 'Связаться',
      lead: 'Открыт к сотрудничеству по автоматизации, Web3 и кастомной разработке. Выбери канал — отвечаю быстро.',
      copyHint: 'Нажми, чтобы скопировать',
      copied: 'Скопировано',
      statement: ['Строю', 'Автоматизирую', 'Разворачиваю'],
      items: [
        { id: 'tg', label: 'Telegram', value: '@wannasly', href: 'https://t.me/wannasly' },
        { id: 'ds', label: 'Discord', value: '@wannsly', copyValue: '@wannsly' },
        { id: 'mail', label: 'Email', value: 'wannaslyy@gmail.com', href: 'mailto:wannaslyy@gmail.com' },
      ],
    },
    footer: {
      rights: '© 2026 WANNASLY. Все права защищены.',
      built: 'React · Vite · Tailwind · Framer Motion',
    },
    marquee: ['Автоматизация', 'Web3', 'Парсеры', 'ИИ-агенты', 'Безопасность', 'Смарт-контракты'],
  },

  en: {
    brand: 'WANNASLY',
    role: 'Automation Engineer / Web3 Developer',
    availability: 'Available for work',
    nav: [
      { label: 'Home', href: '#top', id: 'top' },
      { label: 'About', href: '#about', id: 'about' },
      { label: 'Stack', href: '#stack', id: 'stack' },
      { label: 'Projects', href: '#projects', id: 'projects' },
      { label: 'Contact', href: '#contact', id: 'contact' },
    ],
    hero: {
      kicker: 'Automation · Web3 · Security',
      titleLines: ['Building', 'automated systems', '& Web3 solutions'],
      lead: 'High-performance automation, secure parsers, smart contract scripts, Discord engines, and custom AI agents. Rigorous backend utilities and premium interfaces.',
      ctaPrimary: 'View projects',
      ctaSecondary: 'Get in touch',
      scroll: 'Scroll down',
    },
    metrics: [
      { value: '99.9', suffix: '%', label: 'Automation uptime' },
      { value: '30', suffix: '+', label: 'Scripts & tools' },
      { value: '3', suffix: '', label: 'Years building' },
    ],
    about: {
      sectionLabel: 'About',
      sectionTitle: 'Who I am',
      bioLabel: 'Biography',
      bio: 'System automation engineer and full-stack developer. My focus is writing highly optimized code for data parsing, web scraping, custom Telegram/Discord automation engines, and Web3 security scripts.',
      focusLabel: 'Current focus',
      focus: 'Developing autonomous AI agents to optimize workflows, scanning smart contracts across blockchain networks, and building secure distributed scraping infrastructure.',
      location: 'Remote · Available',
      status: 'Online',
    },
    stack: {
      sectionLabel: 'Technology',
      sectionTitle: 'Stack',
      languagesLabel: 'Core languages',
      toolsLabel: 'Tools & environment',
      languages: [
        { name: 'Python', level: 'Advanced', pct: 92 },
        { name: 'TypeScript / JS', level: 'Advanced', pct: 86 },
        { name: 'C++', level: 'Intermediate', pct: 64 },
      ],
      tools: TOOLS,
    },
    projects: {
      sectionLabel: 'Work',
      sectionTitle: 'Projects',
      viewLabel: 'Read more',
      items: [
        {
          id: 'defi',
          index: '01',
          category: 'Web3 / Automation',
          title: 'DeFi Airdrop Automation Suite',
          description: 'A comprehensive system for automating participation in crypto airdrops and testnets. Multi-threaded scripts on Web3.py/Ethers.js, automated point harvesting, real-user behavior simulation, and advanced proxy network orchestration.',
          tags: ['Python', 'Web3.py', 'Ethers.js', 'Proxies'],
          year: '2025',
        },
        {
          id: 'scanner',
          index: '02',
          category: 'Security / Network',
          title: 'Stealth Network Security Scanner',
          description: 'Low-level console utility and backend in C++ and Python for scanning corporate network vulnerabilities. Integrated with Nmap and Bettercap APIs, automatically identifying critical flaws and generating encrypted reports.',
          tags: ['C++', 'Python', 'Nmap API', 'Cryptography'],
          year: '2025',
        },
        {
          id: 'discord',
          index: '03',
          category: 'Integrations / Bots',
          title: 'Discord Core Engine & Logistics',
          description: 'Scalable TypeScript architecture for Discord bots with advanced moderation and server administration, a custom .env structure that routes variables per channel dynamically, and a global system error handler.',
          tags: ['TypeScript', 'Node.js', 'WebSockets', 'env-Isolation'],
          year: '2024',
        },
      ],
    },
    contact: {
      sectionLabel: 'Contact',
      sectionTitle: 'Get in touch',
      lead: 'Open to collaboration on automation, Web3, and custom development. Pick a channel — I reply fast.',
      copyHint: 'Click to copy',
      copied: 'Copied',
      statement: ['Build', 'Automate', 'Deploy'],
      items: [
        { id: 'tg', label: 'Telegram', value: '@wannasly', href: 'https://t.me/wannasly' },
        { id: 'ds', label: 'Discord', value: '@wannsly', copyValue: '@wannsly' },
        { id: 'mail', label: 'Email', value: 'wannaslyy@gmail.com', href: 'mailto:wannaslyy@gmail.com' },
      ],
    },
    footer: {
      rights: '© 2026 WANNASLY. All rights reserved.',
      built: 'React · Vite · Tailwind · Framer Motion',
    },
    marquee: ['Automation', 'Web3', 'Parsers', 'AI agents', 'Security', 'Smart contracts'],
  },
};

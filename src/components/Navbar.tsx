import { useState, useEffect } from 'react';
import { Send, Menu, X } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface NavbarProps {
  lang: 'ru' | 'en';
  setLang: (lang: 'ru' | 'en') => void;
}

const SECTION_IDS = ['top', 'stack', 'projects', 'contact'];

export default function Navbar({ lang, setLang }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('top');

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = {
    ru: [
      { label: 'СИСТЕМА', href: '#top', id: 'top' },
      { label: 'СТЕК', href: '#stack', id: 'stack' },
      { label: 'ПРОЕКТЫ', href: '#projects', id: 'projects' },
      { label: 'КОНТАКТ', href: '#contact', id: 'contact' },
    ],
    en: [
      { label: 'SYSTEM', href: '#top', id: 'top' },
      { label: 'STACK', href: '#stack', id: 'stack' },
      { label: 'PROJECTS', href: '#projects', id: 'projects' },
      { label: 'CONTACT', href: '#contact', id: 'contact' },
    ],
  }[lang];

  const LangSwitcher = () => (
    <div className="flex items-center gap-1 mono text-[11px] border border-frost-line rounded-full px-2.5 py-1.5 select-none bg-frost-white/5">
      <button
        onClick={() => setLang('ru')}
        aria-pressed={lang === 'ru'}
        className={`cursor-pointer px-1 transition-all duration-150 ${
          lang === 'ru' ? 'text-frost-white font-bold' : 'text-frost-white font-normal opacity-100'
        }`}
      >
        RU
      </button>
      <span className="text-frost-white/70">/</span>
      <button
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`cursor-pointer px-1 transition-all duration-150 ${
          lang === 'en' ? 'text-frost-white font-bold' : 'text-frost-white font-normal opacity-100'
        }`}
      >
        EN
      </button>
    </div>
  );

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? 'bg-frost-deep/90 backdrop-blur-xl border-b border-frost-line' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#top" className="display text-2xl sm:text-[26px] text-frost-white leading-none flex items-baseline gap-2">
            WANNASLY
            <span className="mono text-[9px] tracking-[0.2em] text-frost-white/50 font-normal hidden sm:inline">
              [ 0x01 ]
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`group mono text-[11px] tracking-[0.15em] px-3 py-2 transition-colors ${
                    isActive ? 'text-frost-white font-bold' : 'text-frost-white hover:text-frost-white font-medium'
                  }`}
                >
                  <span className={`transition-colors ${isActive ? 'text-frost-white' : 'text-frost-white/60 group-hover:text-frost-white'}`}>[ </span>
                  {link.label}
                  <span className={`transition-colors ${isActive ? 'text-frost-white' : 'text-frost-white/60 group-hover:text-frost-white'}`}> ]</span>
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://t.me/wannasly"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-frost-line text-frost-white/80 hover:text-frost-ink hover:bg-frost-white transition-colors"
              aria-label="Telegram"
            >
              <Send className="w-4 h-4" />
            </a>
            <LangSwitcher />
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-frost-line text-frost-white/80"
              aria-label={open ? (lang === 'ru' ? 'Закрыть меню' : 'Close menu') : lang === 'ru' ? 'Открыть меню' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll progress */}
      <motion.div
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-frost-white/80"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 top-16 z-40 bg-frost-deep/95 backdrop-blur-xl transition-all duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col p-6 gap-1">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`display text-4xl py-3 border-b border-frost-line transition-colors ${
                active === link.id ? 'text-frost-white' : 'text-frost-white/70 hover:text-frost-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://t.me/wannasly"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mono text-xs tracking-[0.2em] text-frost-white/70 hover:text-frost-white flex items-center gap-2 pt-6"
          >
            <Send className="w-4 h-4" /> [ TELEGRAM ]
          </a>
        </nav>
      </div>
    </motion.header>
  );
}

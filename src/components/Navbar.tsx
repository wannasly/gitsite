import { useState, useEffect } from 'react';
import { Shield, Menu, X, Send } from 'lucide-react';

interface NavbarProps {
  lang: 'ru' | 'en';
  setLang: (lang: 'ru' | 'en') => void;
}

export default function Navbar({ lang, setLang }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = {
    ru: [
      { name: 'SYSTEM', href: '#hero' },
      { name: 'BENTO_GRID', href: '#about' },
      { name: 'ПРОЕКТЫ', href: '#projects' },
      { name: 'КОНТАКТЫ', href: '#contact' },
    ],
    en: [
      { name: 'SYSTEM', href: '#hero' },
      { name: 'BENTO_GRID', href: '#about' },
      { name: 'PROJECTS', href: '#projects' },
      { name: 'CONTACT', href: '#contact' },
    ]
  };

  const activeLinks = navLinks[lang];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-cyber-bg/75 backdrop-blur-md border-b border-cyber-accent/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* Logo / Branding */}
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyber-accent animate-pulse" />
            <a href="#hero" className="font-mono text-sm font-bold tracking-widest text-cyber-text flex items-center gap-1 group">
              <span className="text-cyber-muted">$</span>
              <span>WANNASLY</span>
              <span className="text-cyber-accent font-extrabold animate-pulse">_</span>
              <span className="hidden sm:inline-block text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/20 px-1.5 py-0.5 rounded font-mono ml-2">
                LEVEL: 0x01
              </span>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {activeLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-mono text-xs text-cyber-muted hover:text-cyber-accent transition-colors duration-200 relative py-1 group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-cyber-accent transition-all duration-200 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Icons / Actions / Lang Switcher */}
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <a
                href="https://t.me/wannasly"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-cyber-muted hover:text-cyber-accent hover:bg-white/5 transition-all duration-200"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 font-mono text-[11px] border border-white/10 px-2 py-1 rounded bg-white/5 select-none">
                <button 
                  onClick={() => setLang('ru')}
                  className={`cursor-pointer hover:text-white transition-colors duration-150 ${lang === 'ru' ? 'text-white font-bold' : 'text-zinc-600'}`}
                >
                  RU
                </button>
                <span className="text-zinc-700 font-normal">//</span>
                <button 
                  onClick={() => setLang('en')}
                  className={`cursor-pointer hover:text-white transition-colors duration-150 ${lang === 'en' ? 'text-white font-bold' : 'text-zinc-600'}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-cyber-muted hover:text-cyber-accent hover:bg-white/5 focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <div className={`md:hidden fixed inset-y-0 right-0 z-40 w-64 bg-cyber-bg/95 border-l border-cyber-accent/20 p-6 shadow-2xl transition-transform duration-300 ease-in-out transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex justify-between items-center mb-8">
          {/* Mobile Lang Switcher */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] border border-white/10 px-2 py-1 rounded bg-white/5 select-none">
            <button 
              onClick={() => setLang('ru')}
              className={`cursor-pointer hover:text-white transition-colors duration-150 ${lang === 'ru' ? 'text-white font-bold' : 'text-zinc-600'}`}
            >
              RU
            </button>
            <span className="text-zinc-700 font-normal">//</span>
            <button 
              onClick={() => setLang('en')}
              className={`cursor-pointer hover:text-white transition-colors duration-150 ${lang === 'en' ? 'text-white font-bold' : 'text-zinc-600'}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-cyber-muted hover:text-cyber-accent focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {activeLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-mono text-sm text-cyber-muted hover:text-cyber-accent transition-colors py-2 border-b border-white/5"
            >
              &gt; {link.name}
            </a>
          ))}

          <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
            <a
              href="https://t.me/wannasly"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs text-cyber-muted hover:text-cyber-accent"
            >
              <Send className="w-4 h-4" /> TELEGRAM
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

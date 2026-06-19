import { useState, useEffect } from 'react';
import { Shield, Menu, X, Send } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'SYSTEM', href: '#hero' },
    { name: 'BENTO_GRID', href: '#about' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'CONTACT', href: '#contact' },
  ];

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
              <span>AYAEB</span>
              <span className="text-cyber-accent font-extrabold animate-pulse">_</span>
              <span className="hidden sm:inline-block text-xs bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/20 px-1.5 py-0.5 rounded font-mono ml-2">
                LEVEL: 0x01
              </span>
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
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

            {/* Icons / Actions */}
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <a
                href="https://github.com/ayaeb"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-cyber-muted hover:text-cyber-accent hover:bg-white/5 transition-all duration-200"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/ayaeb"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-cyber-muted hover:text-cyber-accent hover:bg-white/5 transition-all duration-200"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
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
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-cyber-muted hover:text-cyber-accent focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {navLinks.map((link) => (
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
              href="https://github.com/ayaeb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-xs text-cyber-muted hover:text-cyber-accent"
            >
              <GithubIcon className="w-4 h-4" /> GITHUB
            </a>
            <a
              href="https://t.me/ayaeb"
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

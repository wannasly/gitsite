import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

const LINKS = [
  { label: 'CATALOG', href: '#collection' },
  { label: 'PUFFERS', href: '#collection' },
  { label: 'BOOTS', href: '#collection' },
  { label: 'ALTITUDE', href: '#about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? 'bg-frost-deep/70 backdrop-blur-xl border-b border-frost-line' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#top" className="display text-2xl sm:text-[28px] tracking-tight text-frost-white leading-none">
            FRZN
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {LINKS.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="group mono text-[11px] tracking-[0.15em] text-frost-white/70 hover:text-frost-white px-3 py-2 transition-colors"
              >
                <span className="text-frost-white/30 group-hover:text-frost-white/60 transition-colors">[ </span>
                {link.label}
                <span className="text-frost-white/30 group-hover:text-frost-white/60 transition-colors"> ]</span>
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full border border-frost-line text-frost-white/80 hover:text-frost-ink hover:bg-frost-white transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              className="relative w-10 h-10 flex items-center justify-center rounded-full border border-frost-line text-frost-white/80 hover:text-frost-ink hover:bg-frost-white transition-colors"
              aria-label="Cart, 2 items"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-frost-white text-frost-ink mono text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </button>
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-frost-line text-frost-white/80"
              aria-label={open ? 'Close menu' : 'Open menu'}
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
          {LINKS.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onClick={() => setOpen(false)}
              className="display text-4xl text-frost-white/90 hover:text-frost-white py-3 border-b border-frost-line"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}

import { useRef, useState } from 'react';
import { Mail, ArrowUpRight, Check, Copy } from 'lucide-react';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import Mountain from './Mountain';
import Marquee from './Marquee';

interface ContactSectionProps {
  lang: 'ru' | 'en';
}

const TelegramIcon = (p: { className?: string }) => (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className={p.className} fill="currentColor" aria-hidden="true">
    <path d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152 35.56-14.786 42.94-17.354 47.76-17.441 1.06-.017 3.42.245 4.96 1.49 1.28 1.05 1.64 2.47 1.82 3.467.16.996.38 3.266.2 5.038-1.92 20.24-10.26 69.356-14.5 92.026-1.78 9.592-5.32 12.808-8.74 13.122-7.44.684-13.08-4.912-20.28-9.63-11.26-7.386-17.62-11.982-28.56-19.188-12.64-8.328-4.44-12.906 2.76-20.386 1.88-1.958 34.64-31.748 35.26-34.45.08-.338.16-1.598-.6-2.262-.74-.666-1.84-.438-2.64-.258-1.14.256-19.12 12.152-54 35.686-5.1 3.508-9.72 5.218-13.88 5.128-4.56-.098-13.36-2.584-19.9-4.708-8-2.606-14.38-3.984-13.82-8.41.28-2.304 3.46-4.662 9.52-7.072Z" />
  </svg>
);

const DiscordIcon = (p: { className?: string }) => (
  <svg viewBox="0 0 256 199" xmlns="http://www.w3.org/2000/svg" className={p.className} fill="currentColor" aria-hidden="true">
    <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.236 11.804-.221 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z" />
  </svg>
);

const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 1, 2, 2, 1, 3, 1, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1];

const wordReveal: Variants = {
  hidden: { y: '105%' },
  visible: (i: number) => ({
    y: '0%',
    transition: { duration: 0.85, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

const tileUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] } }),
};

export default function ContactSection({ lang }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const graffitiY = useTransform(scrollYProgress, [0, 1], ['-6%', '20%']);
  const mountainY = useTransform(scrollYProgress, [0, 1], ['10%', '-8%']);

  const copyDiscord = () => {
    // Only flip the UI to "copied" once the write actually resolves.
    Promise.resolve(navigator.clipboard?.writeText('@wannsly'))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.warn('Clipboard copy failed:', err));
  };

  const t = {
    ru: {
      title: 'СВЯЗАТЬСЯ',
      metaA: ['[ СИСТЕМНЫЙ_ВЫХОД ]', '[ ENCRYPTED ]'],
      lead: 'Открыт к сотрудничеству по автоматизации, Web3 и кастомной разработке. Выбери канал — отвечаю быстро.',
      statement: ['СТРОЮ', 'АВТОМАТИЗИРУЮ', 'РАЗВОРАЧИВАЮ'],
      copyHint: 'Нажми, чтобы скопировать',
      copied: 'СКОПИРОВАНО',
      footer: '©2026 WANNASLY — СИСТЕМЫ: ОПЕРАЦИОННО',
      enc: 'ШИФРОВАНИЕ: AES-256',
      built: 'React · Vite · Tailwind · Framer Motion',
    },
    en: {
      title: 'CONTACT',
      metaA: ['[ SYSTEM_OUTBOX ]', '[ ENCRYPTED ]'],
      lead: 'Open to collaboration on automation, Web3, and custom development. Pick a channel — I reply fast.',
      statement: ['BUILD', 'AUTOMATE', 'DEPLOY'],
      copyHint: 'Click to copy',
      copied: 'COPIED',
      footer: '©2026 WANNASLY — SYSTEMS: OPERATIONAL',
      enc: 'ENCRYPTION: AES-256',
      built: 'React · Vite · Tailwind · Framer Motion',
    },
  }[lang];

  const socials = [
    { name: 'TELEGRAM', value: '@wannasly', url: 'https://t.me/wannasly', icon: <TelegramIcon className="w-6 h-6" />, variant: 'light' as const },
    { name: 'DISCORD', value: '@wannsly', copy: true, icon: <DiscordIcon className="w-6 h-6" />, variant: 'quilt' as const },
    { name: 'EMAIL', value: 'wannaslyy@gmail.com', url: 'mailto:wannaslyy@gmail.com', icon: <Mail className="w-6 h-6" />, variant: 'ink' as const },
  ];

  return (
    <section id="contact" ref={ref} className="relative bg-frost-base overflow-hidden">
      {/* contact header + tiles */}
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="display text-5xl sm:text-6xl xl:text-7xl text-frost-white"
          >
            {t.title}
          </motion.h2>
          <div className="space-y-1 lg:pt-3">
            {t.metaA.map((m) => (
              <div key={m} className="tech-label">{m}</div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-frost-white/80 max-w-2xl mb-10 text-sm sm:text-base leading-relaxed"
        >
          {t.lead}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {socials.map((s, i) => {
            const styleMap = {
              light: 'bg-frost-card text-frost-ink',
              ink: 'bg-frost-ink text-frost-white',
              quilt: 'quilt text-frost-white',
            };
            const cornerColor = s.variant === 'light' ? 'text-frost-ink/50' : 'text-frost-white/50';
            const borderColor = s.variant === 'light' ? 'border-frost-ink/15' : 'border-frost-white/15';

            const inner = (
              <>
                <div className="flex justify-between items-center w-full">
                  <div className={`p-3 border ${borderColor}`}>{s.icon}</div>
                  {s.copy ? (
                    copied ? <Check className="w-4 h-4" /> : <Copy className={`w-4 h-4 ${cornerColor} group-hover:opacity-100`} />
                  ) : (
                    <ArrowUpRight className={`w-4 h-4 ${cornerColor} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`} />
                  )}
                </div>
                <div>
                  <div className="mono text-[10px] tracking-[0.2em] opacity-75 mb-1">{s.name}</div>
                  <div className="display text-lg sm:text-xl tracking-tight break-all">{s.copy && copied ? t.copied : s.value}</div>
                  {s.copy && <div className="mono text-[10px] opacity-70 mt-1">{t.copyHint}</div>}
                </div>
              </>
            );

            const cls = `group notch-tr p-6 flex flex-col justify-between min-h-[170px] tile-vignette cursor-pointer transition-transform duration-300 hover:-translate-y-1.5 ${styleMap[s.variant]}`;
            const style = s.variant === 'quilt' ? ({ ['--quilt-tint' as string]: '#4d5f6c' } as React.CSSProperties) : undefined;

            if (s.copy) {
              return (
                <motion.button key={s.name} variants={tileUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} onClick={copyDiscord} aria-label={`${t.copyHint}: ${s.value}`} className={cls} style={style}>
                  {inner}
                </motion.button>
              );
            }
            return (
              <motion.a key={s.name} variants={tileUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} href={s.url} target={s.url?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={`${s.name}: ${s.value}`} className={cls} style={style}>
                {inner}
              </motion.a>
            );
          })}
        </div>
      </div>

      {/* marquee divider */}
      <div className="border-y border-frost-line py-3 bg-frost-deep/40">
        <Marquee items={['AUTOMATION', 'WEB3 SECURITY', 'AI AGENTS', 'STEALTH OPS', 'BUILT IN THE MOUNTAINS']} />
      </div>

      {/* mountain finale */}
      <div className="relative">
        <motion.span
          style={{ y: graffitiY }}
          className="tag absolute inset-x-0 top-2 text-center text-[5rem] sm:text-[11rem] lg:text-[15rem] leading-none rotate-[-4deg] z-10 !opacity-[0.08]"
        >
          WANNASLY
        </motion.span>

        <div className="relative h-[420px] sm:h-[560px] lg:h-[640px] overflow-hidden">
          <motion.div style={{ y: mountainY }} className="absolute inset-0 scale-110">
            <Mountain className="w-full h-full" />
          </motion.div>
          <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

          <div className="absolute bottom-6 sm:bottom-10 left-0 w-full px-5 sm:px-8 lg:px-12">
            <div className="max-w-[1600px] mx-auto">
              <h2 className="display text-[3rem] sm:text-[5rem] lg:text-[7rem] text-frost-white leading-[0.9]">
                {t.statement.map((line, i) => (
                  <span key={`${lang}-${i}`} className="block reveal-mask">
                    <motion.span className="block" variants={wordReveal} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="bg-frost-ink">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <span className="display text-xl text-frost-white">WANNASLY</span>
            <span className="mono text-[10px] text-frost-white/50 tracking-widest uppercase">{t.footer}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mono text-[10px] text-frost-white/50 tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-frost-white/70 animate-pulse" />
              {t.enc}
            </div>
            <svg width="150" height="34" viewBox="0 0 150 34" aria-hidden="true">
              {(() => {
                let x = 0;
                return BARS.map((w, i) => {
                  const rect = <rect key={i} x={x} y={0} width={w} height="34" fill={i % 2 === 0 ? '#f2f5f6' : 'transparent'} />;
                  x += w + 1;
                  return rect;
                });
              })()}
            </svg>
          </div>
        </div>
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 pb-5 -mt-1">
          <span className="mono text-[10px] text-frost-white/55 tracking-widest">{t.built}</span>
        </div>
      </footer>
    </section>
  );
}

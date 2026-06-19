import { Mail, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom SVG Icons fetched from MCP Logo Search
const TelegramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
    <path d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152 35.56-14.786 42.94-17.354 47.76-17.441 1.06-.017 3.42.245 4.96 1.49 1.28 1.05 1.64 2.47 1.82 3.467.16.996.38 3.266.2 5.038-1.92 20.24-10.26 69.356-14.5 92.026-1.78 9.592-5.32 12.808-8.74 13.122-7.44.684-13.08-4.912-20.28-9.63-11.26-7.386-17.62-11.982-28.56-19.188-12.64-8.328-4.44-12.906 2.76-20.386 1.88-1.958 34.64-31.748 35.26-34.45.08-.338.16-1.598-.6-2.262-.74-.666-1.84-.438-2.64-.258-1.14.256-19.12 12.152-54 35.686-5.1 3.508-9.72 5.218-13.88 5.128-4.56-.098-13.36-2.584-19.9-4.708-8-2.606-14.38-3.984-13.82-8.41.28-2.304 3.46-4.662 9.52-7.072Z" />
  </svg>
);

const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 256 199" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
    <path d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.236 11.804-.221 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z" />
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface SocialLink {
  name: string;
  value: string;
  url: string;
  icon: React.ReactNode;
  colorClass: string;
  hoverBorderColor: string;
  hoverGlowColor: string;
}

export default function ContactSection() {
  const socials: SocialLink[] = [
    {
      name: 'TELEGRAM',
      value: '@ayaeb',
      url: 'https://t.me/ayaeb',
      icon: <TelegramIcon className="w-5 h-5" />,
      colorClass: 'text-cyber-cyan border-cyber-cyan/15 bg-cyber-cyan/5 hover:text-cyber-cyan',
      hoverBorderColor: 'rgba(0, 240, 255, 0.4)',
      hoverGlowColor: '0 10px 30px -10px rgba(0, 240, 255, 0.15)',
    },
    {
      name: 'GITHUB',
      value: 'github.com/ayaeb',
      url: 'https://github.com/ayaeb',
      icon: <GithubIcon className="w-5 h-5" />,
      colorClass: 'text-cyber-accent border-cyber-accent/15 bg-cyber-accent/5 hover:text-cyber-accent',
      hoverBorderColor: 'rgba(0, 255, 102, 0.4)',
      hoverGlowColor: '0 10px 30px -10px rgba(0, 255, 102, 0.15)',
    },
    {
      name: 'DISCORD',
      value: 'ayaeb',
      url: 'https://discord.com',
      icon: <DiscordIcon className="w-5 h-5" />,
      colorClass: 'text-cyber-magenta border-cyber-magenta/15 bg-cyber-magenta/5 hover:text-cyber-magenta',
      hoverBorderColor: 'rgba(255, 0, 127, 0.4)',
      hoverGlowColor: '0 10px 30px -10px rgba(255, 0, 127, 0.15)',
    },
    {
      name: 'EMAIL',
      value: 'ayaeb@pm.me',
      url: 'mailto:ayaeb@pm.me',
      icon: <Mail className="w-5 h-5" />,
      colorClass: 'text-white border-white/10 bg-white/5 hover:text-white',
      hoverBorderColor: 'rgba(255, 255, 255, 0.3)',
      hoverGlowColor: '0 10px 30px -10px rgba(255, 255, 255, 0.1)',
    },
  ];

  return (
    <section id="contact" className="py-24 bg-cyber-bg relative border-t border-white/5">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyber-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-left mb-16 space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-ping"></span>
            <span>SYSTEM_OUTBOX // ENCRYPTED</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Establish Contact
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyber-accent to-transparent"></div>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socials.map((social) => (
            <motion.a 
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-6 rounded-2xl border text-left flex flex-col justify-between h-[150px] ${social.colorClass} outline-none focus:ring-2 focus:ring-cyber-accent focus:ring-offset-2 focus:ring-offset-cyber-bg min-h-[44px]`}
              aria-label={`Connect via ${social.name}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -4, 
                scale: 1.03,
                borderColor: social.hoverBorderColor,
                boxShadow: social.hoverGlowColor
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex justify-between items-center w-full">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  {social.icon}
                </div>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>

              <div>
                <div className="font-mono text-[10px] tracking-widest opacity-60 mb-0.5">{social.name}</div>
                <div className="font-mono text-sm font-bold tracking-tight">{social.value}</div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-cyber-muted gap-4">
          <div>
            &copy; 2026 AYAEB. ALL RIGHTS SECURED.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse"></span>
            <span>ENCRYPTION_MODE: AES-256</span>
          </div>
        </div>

      </div>
    </section>
  );
}

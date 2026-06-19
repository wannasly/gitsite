import { ExternalLink, Terminal, Search, Bot, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  icon: React.ReactNode;
  category: string;
  borderColor: string;
  glowColor: string;
}

export default function ProjectsSection() {
  const projects: Project[] = [
    {
      title: 'Stealth Scraper Engine',
      description: 'A multi-threaded, proxy-rotated data parser designed to bypass advanced Cloudflare challenges. Supports automatic cookie renewal, user-agent spoofing, and headless browser clusters.',
      tags: ['Python', 'Docker', 'Playwright', 'Redis'],
      github: 'https://github.com/ayaeb/stealth-scraper',
      icon: <Search className="w-5 h-5 text-cyber-accent" />,
      category: 'AUTOMATION',
      borderColor: 'rgba(0, 255, 102, 0.3)',
      glowColor: '0 10px 30px -10px rgba(0, 255, 102, 0.15)',
    },
    {
      title: 'Web3 Contract Scanner',
      description: 'EVM token smart contract security diagnostic tool that scans for honeypots, re-entrancy bugs, ownership locks, and liquidity drain risks. Executes tests in a local fork.',
      tags: ['TypeScript', 'Ethers.js', 'Hardhat', 'Solidity'],
      github: 'https://github.com/ayaeb/web3-scanner',
      demo: 'https://scanner.ayaeb.dev',
      icon: <Activity className="w-5 h-5 text-cyber-cyan" />,
      category: 'WEB3 / SECURITY',
      borderColor: 'rgba(0, 240, 255, 0.3)',
      glowColor: '0 10px 30px -10px rgba(0, 240, 255, 0.15)',
    },
    {
      title: 'Discord Agent Control Panel',
      description: 'A real-time admin dashboard controlling a fleet of custom Discord bots. Features WebSockets for real-time logs, resource usage metrics, and modular command scheduling.',
      tags: ['React', 'Node.js', 'WebSockets', 'Tailwind'],
      github: 'https://github.com/ayaeb/discord-panel',
      demo: 'https://panel.ayaeb.dev',
      icon: <Bot className="w-5 h-5 text-cyber-magenta" />,
      category: 'INTEGRATIONS',
      borderColor: 'rgba(255, 0, 127, 0.3)',
      glowColor: '0 10px 30px -10px rgba(255, 0, 127, 0.15)',
    },
    {
      title: 'AI Agent Workflow Scheduler',
      description: 'Cron-daemon optimizing and orchestrating multiple OpenAI/Anthropic API calls in sequence. Features automatic failover, rate-limit queueing, and local SQLite state auditing.',
      tags: ['Python', 'FastAPI', 'SQLite', 'LLM API'],
      github: 'https://github.com/ayaeb/ai-scheduler',
      icon: <Terminal className="w-5 h-5 text-cyber-accent" />,
      category: 'AI / AUTOMATION',
      borderColor: 'rgba(0, 255, 102, 0.3)',
      glowColor: '0 10px 30px -10px rgba(0, 255, 102, 0.15)',
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
            <span>SYSTEM_DIRECTORY // REPOS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Key Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyber-cyan to-transparent"></div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                <div className="flex justify-between items-center text-xs font-mono pt-2">
                  <a 
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-cyber-muted hover:text-cyber-accent transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>SOURCE_CODE</span>
                  </a>

                  {project.demo && (
                    <a 
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
                    >
                      <span>LIVE_PREVIEW</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

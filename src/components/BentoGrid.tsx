import { Shield, Code, Cpu, Terminal, Compass, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface TechItem {
  name: string;
  level: string;
  icon: React.ReactNode;
  color: string;
}

export default function BentoGrid() {
  const languages: TechItem[] = [
    { name: 'Python', level: 'Advanced', icon: <Terminal className="w-4 h-4" />, color: 'text-cyber-accent border-cyber-accent/20 bg-cyber-accent/5' },
    { name: 'TypeScript / JS', level: 'Advanced', icon: <Code className="w-4 h-4" />, color: 'text-cyber-cyan border-cyber-cyan/20 bg-cyber-cyan/5' },
    { name: 'C++', level: 'Intermediate', icon: <Cpu className="w-4 h-4" />, color: 'text-cyber-magenta border-cyber-magenta/20 bg-cyber-magenta/5' },
  ];

  const tools = [
    'Kali Linux', 'Docker', 'Git & CI/CD', 'Radix UI', 'TailwindCSS', 
    'Ethers.js / Web3', 'AI Agents API', 'Node.js', 'FastAPI', 'Discord API'
  ];

  return (
    <section id="about" className="py-24 bg-cyber-bg relative">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-10 w-[250px] h-[250px] bg-cyber-accent/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-left mb-16 space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-ping"></span>
            <span>DATA_SHEET // ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About & Tech Stack
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyber-accent to-transparent"></div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
          
          {/* Card 1: Vibe & Profile (Spans 2 columns, 1 row) */}
          <motion.div 
            className="md:col-span-2 row-span-1 border border-white/5 bg-cyber-card/60 rounded-2xl p-6 flex flex-col justify-between group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ 
              y: -4, 
              scale: 1.015,
              borderColor: "rgba(0, 255, 102, 0.3)",
              boxShadow: "0 10px 30px -10px rgba(0, 255, 102, 0.15)"
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyber-accent">
                <Compass className="w-5 h-5" />
                <span className="font-mono text-xs tracking-widest font-bold">BIO_DATA // SUMMARY</span>
              </div>
              <p className="text-cyber-muted text-sm leading-relaxed text-left">
                I am a system automation engineer and full-stack developer. My focus is writing highly optimized code for data parsing, web scraping, custom Telegram/Discord automation engines, and Web3 security scripts. I build backend utilities that execute silently and frontends that look premium.
              </p>
            </div>
            <div className="flex justify-between items-center text-xs font-mono border-t border-white/5 pt-4 text-cyber-muted">
              <span>LOC: C-137 // REMOTE</span>
              <span className="text-cyber-accent">STATUS: ONLINE</span>
            </div>
          </motion.div>

          {/* Card 2: Current Focus (Spans 1 column, 1 row) */}
          <motion.div 
            className="md:col-span-1 row-span-1 border border-white/5 bg-cyber-card/60 rounded-2xl p-6 flex flex-col justify-between group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            whileHover={{ 
              y: -4, 
              scale: 1.015,
              borderColor: "rgba(0, 240, 255, 0.3)",
              boxShadow: "0 10px 30px -10px rgba(0, 240, 255, 0.15)"
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyber-cyan">
                <Zap className="w-5 h-5 animate-bounce" />
                <span className="font-mono text-xs tracking-widest font-bold">CURRENT_FOCUS</span>
              </div>
              <p className="text-cyber-muted text-sm text-left">
                Developing AI-driven workflow agents, scanning blockchain token smart contracts, and constructing secure scraper networks.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyber-cyan">
              <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
              <span>ENGINES RUNNING</span>
            </div>
          </motion.div>

          {/* Card 3: Core Languages (Spans 1 column, 1 row) */}
          <motion.div 
            className="md:col-span-1 row-span-1 border border-white/5 bg-cyber-card/60 rounded-2xl p-6 flex flex-col justify-between group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            whileHover={{ 
              y: -4, 
              scale: 1.015,
              borderColor: "rgba(255, 0, 127, 0.3)",
              boxShadow: "0 10px 30px -10px rgba(255, 0, 127, 0.15)"
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyber-magenta">
                <Shield className="w-5 h-5" />
                <span className="font-mono text-xs tracking-widest font-bold">CORE_LANGUAGES</span>
              </div>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.name} className={`flex items-center justify-between p-2 rounded border text-xs font-mono ${lang.color}`}>
                    <div className="flex items-center gap-2">
                      {lang.icon}
                      <span>{lang.name}</span>
                    </div>
                    <span className="text-[10px] opacity-80">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 4: Tools & Platforms (Spans 2 columns, 1 row) */}
          <motion.div 
            className="md:col-span-2 row-span-1 border border-white/5 bg-cyber-card/60 rounded-2xl p-6 flex flex-col justify-between group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            whileHover={{ 
              y: -4, 
              scale: 1.015,
              borderColor: "rgba(0, 255, 102, 0.3)",
              boxShadow: "0 10px 30px -10px rgba(0, 255, 102, 0.15)"
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyber-accent">
                <Cpu className="w-5 h-5" />
                <span className="font-mono text-xs tracking-widest font-bold">ENVIRONMENT_AND_TOOLS</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {tools.map((tool) => (
                  <span 
                    key={tool} 
                    className="px-2.5 py-1 text-xs font-mono rounded bg-white/5 hover:bg-cyber-accent/10 border border-white/5 hover:border-cyber-accent/20 text-cyber-muted hover:text-cyber-accent transition-all duration-200 cursor-default"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-[10px] font-mono text-cyber-muted text-left border-t border-white/5 pt-4">
              &gt; environment_check // ALL_SYSTEMS_OPERATIONAL
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

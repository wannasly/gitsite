import { useState, useEffect } from 'react';
import { Terminal, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [line1Text, setLine1Text] = useState('');
  const [showJson, setShowJson] = useState(false);
  const [line2Text, setLine2Text] = useState('');
  const [diagnosticsStep, setDiagnosticsStep] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    const command1 = 'cat info.json';
    const command2 = 'run-diagnostics --verbose';

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const runSequence = async () => {
      // Step 1: Type command 1
      for (let i = 0; i <= command1.length; i++) {
        if (isCancelled) return;
        setLine1Text(command1.slice(0, i));
        await sleep(60);
      }

      if (isCancelled) return;
      await sleep(400);
      setShowJson(true);

      if (isCancelled) return;
      await sleep(600);

      // Step 2: Type command 2
      for (let j = 0; j <= command2.length; j++) {
        if (isCancelled) return;
        setLine2Text(command2.slice(0, j));
        await sleep(50);
      }

      const steps = [1, 2, 3, 4];
      for (const step of steps) {
        if (isCancelled) return;
        await sleep(350);
        setDiagnosticsStep(step);
      }
    };

    runSequence();

    return () => {
      isCancelled = true;
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  } as const;

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden cyber-grid-bg"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyber-cyan/5 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Cyberpunk Scanline Effect overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Info */}
        <motion.div 
          className="lg:col-span-7 text-left space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-accent/10 border border-cyber-accent/20 text-cyber-accent font-mono text-xs animate-pulse"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SECURE SYSTEM CONNECTION ESTABLISHED</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none"
          >
            Building Automated <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-cyber-cyan cyber-glow-green">
              Systems & Web3
            </span> Solutions
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-cyber-muted text-base sm:text-lg max-w-xl font-sans leading-relaxed"
          >
            Specializing in high-performance automation, secure parsers, smart contract scripts, Discord engines, and custom AI tooling. Developing sleek frontends backed by rock-solid architecture.
          </motion.p>

          {/* Quick Metrics / Badges */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 pt-4 max-w-md font-mono"
          >
            <div className="border border-white/5 bg-cyber-card/40 p-3 rounded-lg">
              <div className="text-xl font-bold text-cyber-accent">99.9%</div>
              <div className="text-[10px] text-cyber-muted uppercase tracking-wider">Uptime Automation</div>
            </div>
            <div className="border border-white/5 bg-cyber-card/40 p-3 rounded-lg">
              <div className="text-xl font-bold text-cyber-cyan">30+</div>
              <div className="text-[10px] text-cyber-muted uppercase tracking-wider">Scripts & Tools</div>
            </div>
            <div className="border border-white/5 bg-cyber-card/40 p-3 rounded-lg">
              <div className="text-xl font-bold text-cyber-text">100%</div>
              <div className="text-[10px] text-cyber-muted uppercase tracking-wider">Stealth Mode</div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-4 pt-2"
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-cyber-accent text-cyber-bg font-mono font-bold text-sm transition-all duration-200 hover:bg-cyber-accent/90 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] touch-target-min min-w-[140px]"
            >
              INITIALIZE_VIEW
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-white/10 hover:border-cyber-cyan/40 bg-white/5 text-white font-mono text-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 touch-target-min min-w-[140px]"
            >
              ESTABLISH_CONTACT
            </a>
          </motion.div>
        </motion.div>

        {/* Right Side Visual (Mock Interactive Terminal) */}
        <motion.div 
          className="lg:col-span-5 w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <div className="relative mx-auto max-w-md lg:max-w-none border border-cyber-accent/20 bg-cyber-bg/90 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            {/* Header bar */}
            <div className="bg-cyber-card border-b border-white/5 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              </div>
              <span className="font-mono text-[10px] text-cyber-muted tracking-wider">sh --session=ayaeb@matrix</span>
              <Terminal className="w-3.5 h-3.5 text-cyber-accent" />
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-xs sm:text-sm text-left space-y-4 h-[300px] overflow-y-auto">
              <div className="text-cyber-muted">
                Last login: Fri Jun 19 21:24:47 on console
              </div>
              
              <div className="space-y-1">
                <p className="text-white">
                  <span className="text-cyber-accent">ayaeb@matrix:~$</span> {line1Text}
                  {!showJson && (
                    <span className="inline-block w-1.5 h-3.5 bg-cyber-accent animate-[pulse_1s_infinite] align-middle ml-1"></span>
                  )}
                </p>
                {showJson && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-cyber-muted pl-4"
                  >
                    {"{"} <br />
                    &nbsp;&nbsp;&quot;status&quot;: &quot;building_the_future&quot;,<br />
                    &nbsp;&nbsp;&quot;languages&quot;: [&quot;Python&quot;, &quot;TypeScript&quot;, &quot;C++&quot;],<br />
                    &nbsp;&nbsp;&quot;tools&quot;: [&quot;AI agents&quot;, &quot;Kali&quot;, &quot;Vite&quot;],<br />
                    &nbsp;&nbsp;&quot;focus&quot;: [&quot;Web3&quot;, &quot;Automation&quot;, &quot;Security&quot;]<br />
                    {"}"}
                  </motion.div>
                )}
              </div>

              {showJson && (
                <div className="space-y-1">
                  <p className="text-white">
                    <span className="text-cyber-accent">ayaeb@matrix:~$</span> {line2Text}
                    {showJson && diagnosticsStep === 0 && (
                      <span className="inline-block w-1.5 h-3.5 bg-cyber-accent animate-[pulse_1s_infinite] align-middle ml-1"></span>
                    )}
                  </p>
                  
                  {diagnosticsStep >= 1 && (
                    <p className="text-cyber-accent font-bold animate-pulse">&gt; Initializing systems scan...</p>
                  )}
                  {diagnosticsStep >= 2 && (
                    <p className="text-cyber-cyan">&gt; Network connection: Operational</p>
                  )}
                  {diagnosticsStep >= 3 && (
                    <p className="text-cyber-accent">&gt; Secure tunneling active. Firewall configured.</p>
                  )}
                  {diagnosticsStep >= 4 && (
                    <p className="text-emerald-400">&gt; Status: READY TO BUILD</p>
                  )}
                </div>
              )}

              {diagnosticsStep >= 4 && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white"
                >
                  <span className="text-cyber-accent">ayaeb@matrix:~$</span>
                  <span className="inline-block w-1.5 h-3.5 bg-cyber-accent animate-[pulse_1s_infinite] align-middle ml-1"></span>
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

import { useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StackSection from './components/StackSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';

function App() {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-frost-base text-frost-white grain">
      {/* Skip link for keyboard users */}
      <a
        href="#stack"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-frost-white focus:text-frost-ink focus:mono focus:text-sm"
      >
        Skip to content
      </a>

      <Navbar lang={lang} setLang={setLang} />

      <main>
        <Hero lang={lang} />
        <StackSection lang={lang} />
        <ProjectsSection lang={lang} />
        <ContactSection lang={lang} />
      </main>
    </div>
    </MotionConfig>
  );
}

export default App;

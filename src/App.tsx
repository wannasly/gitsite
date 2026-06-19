import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BentoGrid from './components/BentoGrid';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';

function App() {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text selection:bg-cyber-accent/30 selection:text-cyber-accent">
      {/* Sticky Top Navigation with language toggle controls */}
      <Navbar lang={lang} setLang={setLang} />

      {/* Main Localized Single Page Sections */}
      <main>
        <HeroSection lang={lang} />
        <BentoGrid lang={lang} />
        <ProjectsSection lang={lang} />
        <ContactSection lang={lang} />
      </main>
    </div>
  );
}

export default App;

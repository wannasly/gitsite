import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BentoGrid from './components/BentoGrid';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';

function App() {
  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text selection:bg-cyber-accent/30 selection:text-cyber-accent">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Single Page Sections */}
      <main>
        <HeroSection />
        <BentoGrid />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;

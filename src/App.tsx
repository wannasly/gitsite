import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Collection from './components/Collection';
import Manifesto from './components/Manifesto';

function App() {
  return (
    <div className="min-h-screen bg-frost-base text-frost-white grain">
      {/* Skip link for keyboard users */}
      <a
        href="#collection"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-frost-white focus:text-frost-ink focus:mono focus:text-sm"
      >
        Skip to content
      </a>

      <Navbar />

      <main>
        <Hero />
        <Collection />
        <Manifesto />
      </main>
    </div>
  );
}

export default App;

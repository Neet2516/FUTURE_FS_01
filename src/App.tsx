import { useState, useEffect } from 'react';
import BootSequence from './components/terminal-os/BootSequence';
import TerminalOS from './components/terminal-os/TerminalOS';
import Desktop from './components/os/Desktop';
import ThemeSelector from './components/common/ThemeSelector';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Achievements from './components/sections/Achievements';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import { useTheme } from './context/ThemeContext';
import { useScrollReveal } from './hooks/useScrollReveal';
import './App.css';

export default function App() {
  const [viewMode, setViewMode] = useState<'boot' | 'desktop' | 'terminal' | 'classic'>('boot');
  const [scrollProgress, setScrollProgress] = useState(0);
  const { toggleThemeSelector, isThemeSelectorOpen } = useTheme();

  // Scroll reveal only for classic view mode
  useScrollReveal();

  // Scroll Progress Bar Tracker for classic view
  useEffect(() => {
    if (viewMode !== 'classic') return;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    let chordTimer: number | null = null;
    let isChordActive = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea';

      // VS Code chord: Ctrl+K then T
      if (isChordActive) {
        if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          isChordActive = false;
          if (chordTimer) clearTimeout(chordTimer);
          toggleThemeSelector();
          return;
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        isChordActive = true;
        if (chordTimer) clearTimeout(chordTimer);
        chordTimer = window.setTimeout(() => {
          isChordActive = false;
        }, 400);
      } else if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleThemeSelector();
      } else if (e.key === '`' || e.key === '~') {
        if (!isInputActive) {
          e.preventDefault();
          if (viewMode === 'desktop') {
            setViewMode('terminal');
          } else if (viewMode === 'terminal') {
            setViewMode('desktop');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (chordTimer) clearTimeout(chordTimer);
    };
  }, [toggleThemeSelector, viewMode, isThemeSelectorOpen]);

  // ── 1. Cinematic Boot Sequence (BOOT) ──────────────────────────
  if (viewMode === 'boot') {
    return (
      <>
        <BootSequence onComplete={() => setViewMode('desktop')} />
        <ThemeSelector />
      </>
    );
  }

  // ── 2. Fullscreen Terminal Mode (Optional via ` / ~) ───────────
  if (viewMode === 'terminal') {
    return (
      <>
        <TerminalOS
          onLaunchGUI={() => setViewMode('desktop')}
          onReboot={() => setViewMode('boot')}
        />
        <ThemeSelector />
      </>
    );
  }

  // ── 3. Fullscreen Ubuntu-Inspired Developer Desktop OS (PRIMARY) ─
  if (viewMode === 'desktop') {
    return (
      <>
        <Desktop />
        <ThemeSelector />
      </>
    );
  }

  // ── 4. Classic Portfolio Page (Fallback / Traditional View) ────
  return (
    <div className="app app--gui-active">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-progress__bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      <Navbar onTerminalOpen={() => setViewMode('desktop')} />

      <main id="main-content">
        <Hero onTerminalOpen={() => setViewMode('desktop')} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
      </main>

      <Footer onTerminalOpen={() => setViewMode('desktop')} />
      <ThemeSelector />

      {/* Floating button to return to Desktop OS */}
      <button
        type="button"
        className="floating-term-btn"
        onClick={() => setViewMode('desktop')}
        title="Switch to Navneet OS Desktop"
      >
        <span className="floating-term-icon">🖥️</span>
      </button>
    </div>
  );
}

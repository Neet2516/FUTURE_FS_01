import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { PERSONAL } from '../../data/portfolio';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
  onTerminalOpen: () => void;
}

export default function Navbar({ onTerminalOpen }: NavbarProps) {
  const { openThemeSelector } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Active section detection
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = section.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar__inner container">
          {/* Logo */}
          <a
            href="#hero"
            className="navbar__logo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Navneet Sinha — Home"
          >
            <span className="navbar__logo-bracket">[</span>
            <span className="navbar__logo-name">NS</span>
            <span className="navbar__logo-bracket">]</span>
          </a>

          {/* Desktop Nav */}
          <div className="navbar__links" role="list">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`navbar__link ${activeSection === link.href.slice(1) ? 'navbar__link--active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                role="listitem"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="navbar__actions">
            <button
              className="btn btn-ghost btn-sm navbar__theme-btn"
              onClick={openThemeSelector}
              aria-label="Change color theme"
              title="Color Theme (Ctrl+K Ctrl+T)"
            >
              <span className="navbar__theme-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11.5 2a3.5 3.5 0 0 1 2.47 5.97l-7.07 7.07a1 1 0 0 1-1.41 0l-3.54-3.54a1 1 0 0 1 0-1.41l7.07-7.07A3.5 3.5 0 0 1 11.5 2zm0 1a2.5 2.5 0 0 0-1.77.73L2.66 10.8l2.12 2.12 7.07-7.07A2.5 2.5 0 0 0 11.5 3zM6.9 14.33l-1.42-1.42 5.66-5.66 1.41 1.42-5.65 5.66z" />
                </svg>
              </span>
              <span>Theme</span>
            </button>

            <button
              className="btn btn-ghost btn-sm navbar__terminal-btn"
              onClick={onTerminalOpen}
              aria-label="Open terminal"
            >
              <span className="navbar__terminal-icon">&gt;_</span>
              Terminal
            </button>

            <a
              href={PERSONAL.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              aria-label="View resume"
            >
              Resume
            </a>

            {/* Mobile hamburger */}
            <button
              className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`navbar__mobile ${mobileOpen ? 'navbar__mobile--open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        <div className="navbar__mobile-links">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__mobile-link"
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
            >
              <span className="navbar__mobile-index">0{i + 1}</span>
              {link.label}
            </a>
          ))}
          <div className="navbar__mobile-actions">
            <button
              className="btn btn-secondary"
              onClick={() => { setMobileOpen(false); openThemeSelector(); }}
            >
              🎨 Themes (Ctrl+K Ctrl+T)
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => { setMobileOpen(false); onTerminalOpen(); }}
            >
              &gt;_ Terminal
            </button>
            <a
              href={PERSONAL.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              onClick={() => setMobileOpen(false)}
            >
              Resume
            </a>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="navbar__overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

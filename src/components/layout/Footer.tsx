import { PERSONAL } from '../../data/portfolio';
import './Footer.css';

interface FooterProps {
  onTerminalOpen: () => void;
}

export default function Footer({ onTerminalOpen }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <div className="footer__top container">
        <div className="footer__col footer__col--brand">
          <div className="footer__logo">
            <span className="footer__logo-bracket">[</span>
            <span className="footer__logo-text">NAVNEET SINHA</span>
            <span className="footer__logo-bracket">]</span>
          </div>
          <p className="footer__desc">
            Full-Stack Developer crafting high-performance, real-time web applications and intuitive interfaces.
          </p>
          <div className="footer__status">
            <span className="footer__status-dot" aria-hidden="true" />
            <span className="footer__status-text">All systems operational &amp; open to opportunities</span>
          </div>
        </div>

        <div className="footer__col footer__col--links">
          <h3 className="footer__col-title">Navigation</h3>
          <ul className="footer__nav-list">
            <li><a href="#hero">00 // Home</a></li>
            <li><a href="#about">01 // About</a></li>
            <li><a href="#skills">02 // Skills</a></li>
            <li><a href="#projects">03 // Projects</a></li>
            <li><a href="#experience">04 // Experience</a></li>
            <li><a href="#achievements">05 // Achievements</a></li>
            <li><a href="#contact">06 // Contact</a></li>
          </ul>
        </div>

        <div className="footer__col footer__col--cli">
          <h3 className="footer__col-title">CLI Terminal</h3>
          <p className="footer__cli-desc">
            Prefer keyboard navigation? Explore this portfolio via an interactive terminal session.
          </p>
          <button 
            type="button"
            className="btn btn-outline btn-sm footer__cli-btn"
            onClick={onTerminalOpen}
            aria-label="Open CLI Terminal"
          >
            <span className="footer__cli-icon">&gt;_</span>
            Launch Terminal
          </button>
        </div>
      </div>

      <div className="footer__bottom container">
        <div className="footer__copy">
          <span>&copy; {currentYear} Navneet Sinha. Designed &amp; engineered from scratch.</span>
        </div>

        <div className="footer__socials">
          <a
            href={PERSONAL.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="footer__social-link"
          >
            GitHub
          </a>
          <span className="footer__sep">/</span>
          <a
            href={PERSONAL.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="footer__social-link"
          >
            LinkedIn
          </a>
          <span className="footer__sep">/</span>
          <a
            href={PERSONAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Profile"
            className="footer__social-link"
          >
            Instagram
          </a>
          <span className="footer__sep">/</span>
          <a
            href={`mailto:${PERSONAL.email}`}
            aria-label="Send Email"
            className="footer__social-link"
          >
            Email
          </a>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="footer__top-btn"
          aria-label="Scroll back to top"
        >
          <span>Top</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>
    </footer>
  );
}

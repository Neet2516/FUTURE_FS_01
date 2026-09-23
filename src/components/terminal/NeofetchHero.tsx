import { Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { PERSONAL } from '../../data/portfolio';
import NeofetchPortrait from './NeofetchPortrait';
import './NeofetchHero.css';

interface NeofetchHeroProps {
  onOpenApp?: (appId: string) => void;
}

const PALETTE_BLOCKS = [
  '#000000',
  '#ff5555',
  '#50fa7b',
  '#f1fa8c',
  '#bd93f9',
  '#ff79c6',
  '#8be9fd',
  '#f8f8f2',
];

const ROLES = [
  'FULL STACK DEVELOPER',
  'UI/UX ENTHUSIAST',
  'PROBLEM SOLVER',
  'LIFELONG LEARNER',
];

export default function NeofetchHero({ onOpenApp: _onOpenApp }: NeofetchHeroProps) {
  const { currentTheme } = useTheme();

  const handleLinkClick = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="nf-hero" role="region" aria-label="Neofetch system information and developer portrait">
      {/* ── Left Column: Cyber-Terminal Interactive Portrait ─── */}
      <div className="nf-hero__left">
        <NeofetchPortrait interactive={true} />
      </div>

      {/* ── Middle Column: Neofetch System Information ───────── */}
      <div className="nf-hero__middle">
        <div className="nf-hero__user-header">
          <span className="nf-hero__username">navneet@portfolio</span>
          <div className="nf-hero__separator">-----------------</div>
        </div>

        <div className="nf-hero__meta-list">
          <div className="nf-hero__meta-row">
            <span className="nf-hero__meta-key">OS:</span>
            <span className="nf-hero__meta-val">Navneet OS (Portfolio Edition)</span>
          </div>
          <div className="nf-hero__meta-row">
            <span className="nf-hero__meta-key">Role:</span>
            <span className="nf-hero__meta-val">Full Stack Developer</span>
          </div>
          <div className="nf-hero__meta-row">
            <span className="nf-hero__meta-key">Stack:</span>
            <span className="nf-hero__meta-val">React • Next.js • Node.js</span>
          </div>
          <div className="nf-hero__meta-row">
            <span className="nf-hero__meta-key">Database:</span>
            <span className="nf-hero__meta-val">MongoDB • PostgreSQL • Redis</span>
          </div>
          <div className="nf-hero__meta-row">
            <span className="nf-hero__meta-key">Focus:</span>
            <span className="nf-hero__meta-val">Real-time Systems</span>
          </div>
          <div className="nf-hero__meta-row">
            <span className="nf-hero__meta-key">Projects:</span>
            <span className="nf-hero__meta-val">3+ Featured Projects</span>
          </div>
          <div className="nf-hero__meta-row">
            <span className="nf-hero__meta-key">DSA:</span>
            <span className="nf-hero__meta-val">150+ Problems</span>
          </div>
          <div className="nf-hero__meta-row">
            <span className="nf-hero__meta-key">Shell:</span>
            <span className="nf-hero__meta-val">portfolio-cli</span>
          </div>
          <div className="nf-hero__meta-row">
            <span className="nf-hero__meta-key">Theme:</span>
            <span className="nf-hero__meta-val">{currentTheme.name || 'Dracula'}</span>
          </div>
          <div className="nf-hero__meta-row">
            <span className="nf-hero__meta-key">Runtime:</span>
            <span className="nf-hero__meta-val">React 18</span>
          </div>
        </div>

        {/* 8-Color Terminal Palette Blocks */}
        <div className="nf-hero__palette" aria-label="Terminal color palette">
          {PALETTE_BLOCKS.map((color) => (
            <span
              key={color}
              className="nf-hero__palette-block"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* ── Right Column: Philosophy, Developer Roles, Socials ── */}
      <div className="nf-hero__right">
        {/* Quote */}
        <div className="nf-hero__quote-box">
          <p className="nf-hero__quote">
            &ldquo;Turning ideas into interactive realities.&rdquo;
          </p>
        </div>

        {/* Developer Roles List */}
        <div className="nf-hero__roles">
          {ROLES.map((role) => (
            <div key={role} className="nf-hero__role-item">
              <span className="nf-hero__role-text">{role}</span>
            </div>
          ))}
        </div>

        <div className="nf-hero__right-divider" />

        {/* Social Links */}
        <div className="nf-hero__socials" role="navigation" aria-label="Social connections">
          <button
            type="button"
            className="nf-hero__social-btn"
            onClick={() => handleLinkClick(PERSONAL.github)}
            title="Visit GitHub Profile"
          >
            <svg
              className="nf-hero__social-icon"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="currentColor"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span>GitHub</span>
          </button>

          <button
            type="button"
            className="nf-hero__social-btn"
            onClick={() => handleLinkClick(PERSONAL.linkedin)}
            title="Connect on LinkedIn"
          >
            <svg
              className="nf-hero__social-icon"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>LinkedIn</span>
          </button>

          <button
            type="button"
            className="nf-hero__social-btn"
            onClick={() => handleLinkClick('https://x.com/its_navneet_25')}
            title="Follow on X (Twitter)"
          >
            <svg
              className="nf-hero__social-icon"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>X (Twitter)</span>
          </button>

          <button
            type="button"
            className="nf-hero__social-btn"
            onClick={() => handleLinkClick(`mailto:${PERSONAL.email}`)}
            title="Send Email"
          >
            <Mail size={15} className="nf-hero__social-icon" />
            <span>Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
}

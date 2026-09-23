import { useState, useEffect, useRef } from 'react';
import { useWindowManager, type AppId } from '../../context/WindowContext';
import { PROJECTS, PERSONAL } from '../../data/portfolio';
import './AppLauncher.css';

interface AppItem {
  id: AppId;
  name: string;
  category: 'System' | 'Portfolio';
  icon: string;
  description: string;
}

const APPS: AppItem[] = [
  { id: 'terminal', name: 'Terminal', category: 'System', icon: '💻', description: 'Interactive portfolio shell & command line' },
  { id: 'chatgpt', name: 'ChatGPT (Groq AI)', category: 'Portfolio', icon: '🤖', description: 'Fast AI Assistant powered by Groq LPU' },
  { id: 'files', name: 'Files', category: 'System', icon: '📁', description: 'Nautilus file manager & portfolio explorer' },
  { id: 'browser', name: 'Navneet Browser', category: 'System', icon: '🌐', description: 'Web browser with bookmarks and shortcuts' },
  { id: 'music', name: 'Music Player', category: 'System', icon: '🎵', description: 'Ambient developer focus music player' },
  { id: 'projects', name: 'Projects Showcase', category: 'Portfolio', icon: '💻', description: 'Interactive gallery of production projects' },
  { id: 'settings', name: 'Settings', category: 'System', icon: '⚙️', description: 'Wallpapers, themes, sound, and system info' },
];

export default function AppLauncher() {
  const [query, setQuery] = useState('');
  const { isAppLauncherOpen, closeAppLauncher, openWindow } = useWindowManager();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAppLauncherOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isAppLauncherOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAppLauncherOpen) {
        closeAppLauncher();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAppLauncherOpen, closeAppLauncher]);

  if (!isAppLauncherOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const filteredApps = APPS.filter(
    (app) => app.name.toLowerCase().includes(trimmed) || app.description.toLowerCase().includes(trimmed)
  );

  const matchingProjects = trimmed
    ? PROJECTS.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.tagline.toLowerCase().includes(trimmed) ||
          p.tech.some((t) => t.toLowerCase().includes(trimmed))
      )
    : [];

  const handleLaunchApp = (id: AppId) => {
    openWindow(id);
    closeAppLauncher();
  };

  const handleOpenProject = (liveUrl: string) => {
    window.open(liveUrl, '_blank', 'noopener,noreferrer');
    closeAppLauncher();
  };

  return (
    <div className="os-launcher-backdrop" onClick={closeAppLauncher}>
      <div className="os-launcher" onClick={(e) => e.stopPropagation()}>
        {/* Search Bar */}
        <div className="os-launcher__search-box">
          <span className="os-launcher__search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="os-launcher__search-input"
            placeholder="Type to search applications, files, and portfolio projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="os-launcher__clear-btn"
              onClick={() => setQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results / App Grid */}
        <div className="os-launcher__results">
          {/* Applications Grid */}
          <div className="os-launcher__section">
            <h3 className="os-launcher__section-title">
              {trimmed ? 'Matching Applications' : 'Applications'}
            </h3>
            <div className="os-launcher__grid">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  className="os-launcher__item"
                  onClick={() => handleLaunchApp(app.id)}
                >
                  <div className="os-launcher__icon-wrap">
                    <span className="os-launcher__icon">{app.icon}</span>
                  </div>
                  <span className="os-launcher__name">{app.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Project Matches */}
          {matchingProjects.length > 0 && (
            <div className="os-launcher__section">
              <h3 className="os-launcher__section-title">Portfolio Projects</h3>
              <div className="os-launcher__project-matches">
                {matchingProjects.map((p) => (
                  <div
                    key={p.id}
                    className="os-launcher__project-row"
                    onClick={() => handleOpenProject(p.live)}
                  >
                    <div className="os-launcher__project-icon">💻</div>
                    <div className="os-launcher__project-info">
                      <span className="os-launcher__project-title">{p.name}</span>
                      <span className="os-launcher__project-sub">{p.tagline}</span>
                    </div>
                    <span className="os-launcher__project-action">Open Project ↗</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shortcuts Footer */}
          {!trimmed && (
            <div className="os-launcher__quick-links">
              <span className="os-launcher__links-label">Quick Links:</span>
              <a
                href={PERSONAL.github}
                target="_blank"
                rel="noopener noreferrer"
                className="os-launcher__quick-link"
              >
                GitHub Profile ↗
              </a>
              <a
                href={PERSONAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="os-launcher__quick-link"
              >
                LinkedIn ↗
              </a>
              <a
                href={PERSONAL.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="os-launcher__quick-link"
              >
                Resume PDF ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

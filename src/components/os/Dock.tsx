import { useWindowManager, type AppId } from '../../context/WindowContext';
import './Dock.css';

interface DockItem {
  id: AppId | 'launcher';
  label: string;
  iconType: string;
}

const DOCK_ITEMS: DockItem[] = [
  { id: 'files', label: 'Files', iconType: 'files' },
  { id: 'terminal', label: 'Terminal', iconType: 'terminal' },
  { id: 'chatgpt', label: 'ChatGPT (Groq AI)', iconType: 'chatgpt' },
  { id: 'browser', label: 'Navneet Browser', iconType: 'browser' },
  { id: 'music', label: 'Music Player', iconType: 'music' },
  { id: 'projects', label: 'Projects Showcase', iconType: 'vscode' },
  { id: 'settings', label: 'Settings', iconType: 'settings' },
];

export default function Dock() {
  const { windows, activeWindowId, openWindow, toggleAppLauncher } = useWindowManager();

  const handleItemClick = (id: AppId | 'launcher') => {
    if (id === 'launcher') {
      toggleAppLauncher();
    } else {
      openWindow(id);
    }
  };

  return (
    <aside className="ubuntu-dock" aria-label="Application Dock">
      {/* Top Ubuntu Branding Logo */}
      <button
        type="button"
        className="ubuntu-dock__logo-btn"
        onClick={() => openWindow('about')}
        title="About Navneet OS"
      >
        <span className="ubuntu-dock__circle-logo">
          <svg viewBox="0 0 100 100" width="26" height="26" fill="currentColor">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#E95420" strokeWidth="8"/>
            <circle cx="50" cy="18" r="9" fill="#E95420"/>
            <circle cx="23" cy="66" r="9" fill="#E95420"/>
            <circle cx="77" cy="66" r="9" fill="#E95420"/>
            <path d="M50 32 A 18 18 0 0 1 66 50" fill="none" stroke="#E95420" strokeWidth="5"/>
            <path d="M36 58 A 18 18 0 0 1 50 68" fill="none" stroke="#E95420" strokeWidth="5"/>
            <path d="M64 58 A 18 18 0 0 1 50 68" fill="none" stroke="#E95420" strokeWidth="5"/>
          </svg>
        </span>
      </button>

      {/* Dock Apps List */}
      <div className="ubuntu-dock__apps">
        {DOCK_ITEMS.map((item) => {
          const win = windows[item.id as AppId];
          const isRunning = win?.isOpen;
          const isActive = activeWindowId === item.id && !win?.isMinimized && win?.isOpen;

          return (
            <div key={item.id} className="ubuntu-dock__item-wrapper">
              <button
                type="button"
                className={`ubuntu-dock__item ${isActive ? 'ubuntu-dock__item--active' : ''}`}
                onClick={() => handleItemClick(item.id)}
                aria-label={item.label}
              >
                {/* Running dot indicator */}
                {isRunning && <span className="ubuntu-dock__indicator" aria-hidden="true" />}

                {/* Render icon based on app type */}
                {item.iconType === 'files' && (
                  <span className="ubuntu-dock__icon ubuntu-dock__icon--files">📁</span>
                )}
                {item.iconType === 'terminal' && (
                  <span className="ubuntu-dock__icon ubuntu-dock__icon--term">&gt;_</span>
                )}
                {item.iconType === 'chatgpt' && (
                  <span className="ubuntu-dock__icon ubuntu-dock__icon--chatgpt" title="ChatGPT">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                      <rect width="24" height="24" rx="6" fill="#10a37f"/>
                      <path d="M12 5.5a3.5 3.5 0 0 1 3.5 3.5v.7a3.5 3.5 0 0 1 3 5.2l-.5.9a3.5 3.5 0 0 1-3 5.2h-.5a3.5 3.5 0 0 1-3-1.7l-.5-1a3.5 3.5 0 0 1-4.2-4.2l.5-1a3.5 3.5 0 0 1 2.2-4.1V9a3.5 3.5 0 0 1 2.5-3.5z" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="2.2" fill="#fff"/>
                    </svg>
                  </span>
                )}
                {item.iconType === 'browser' && (
                  <span className="ubuntu-dock__icon ubuntu-dock__icon--browser">🌐</span>
                )}
                {item.iconType === 'music' && (
                  <span className="ubuntu-dock__icon ubuntu-dock__icon--music">🎵</span>
                )}
                {item.iconType === 'vscode' && (
                  <span className="ubuntu-dock__icon ubuntu-dock__icon--vscode">⚡</span>
                )}
                {item.iconType === 'settings' && (
                  <span className="ubuntu-dock__icon ubuntu-dock__icon--settings">⚙️</span>
                )}

                {/* Hover Tooltip */}
                <span className="ubuntu-dock__tooltip">{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom App Launcher 9-dot Grid Icon */}
      <div className="ubuntu-dock__bottom">
        <button
          type="button"
          className="ubuntu-dock__launcher-btn"
          onClick={toggleAppLauncher}
          title="Show Applications"
          aria-label="Show Applications"
        >
          <span className="ubuntu-dock__grid-icon">
            <span /><span /><span />
            <span /><span /><span />
            <span /><span /><span />
          </span>
          <span className="ubuntu-dock__tooltip">Show Applications</span>
        </button>
      </div>
    </aside>
  );
}

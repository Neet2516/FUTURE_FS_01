import { useState } from 'react';
import { WALLPAPERS, type WallpaperOption } from '../../config/osAssets';
import { THEMES } from '../../data/themes';
import { useWindowManager } from '../../context/WindowContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { useNotification } from '../../context/NotificationContext';
import './SettingsApp.css';

type SettingsTab = 'appearance' | 'audio' | 'about';

export default function SettingsApp() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [themeFilter, setThemeFilter] = useState<'all' | 'dark' | 'light'>('all');
  const [motionEnabled, setMotionEnabled] = useState(true);

  const { activeWallpaper, setWallpaperById } = useWindowManager();
  const { currentTheme, setTheme } = useTheme();
  const { volume, setVolume, isMuted, toggleMute, currentTrack } = useAudio();
  const { notify } = useNotification();

  const handleSelectWallpaper = (wallpaper: WallpaperOption) => {
    setWallpaperById(wallpaper.id);
  };

  const handleSelectTheme = (themeId: string, themeName: string) => {
    setTheme(themeId);
    notify('Theme Changed', `Theme updated to "${themeName}"`, '🎨');
  };

  const filteredThemes = THEMES.filter((t) => {
    if (themeFilter === 'all') return true;
    return t.category === themeFilter;
  });

  return (
    <div className="settings-app">
      {/* Sidebar navigation */}
      <div className="settings-app__sidebar">
        <div className="settings-app__profile">
          <div className="settings-app__avatar">NS</div>
          <div className="settings-app__profile-info">
            <span className="settings-app__user">Navneet Sinha</span>
            <span className="settings-app__role">Administrator</span>
          </div>
        </div>

        <nav className="settings-app__nav">
          <button
            type="button"
            className={`settings-app__nav-btn ${activeTab === 'appearance' ? 'settings-app__nav-btn--active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <span className="settings-app__nav-icon">🎨</span>
            <span>Appearance</span>
          </button>

          <button
            type="button"
            className={`settings-app__nav-btn ${activeTab === 'audio' ? 'settings-app__nav-btn--active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            <span className="settings-app__nav-icon">🔊</span>
            <span>Sound & Audio</span>
          </button>

          <button
            type="button"
            className={`settings-app__nav-btn ${activeTab === 'about' ? 'settings-app__nav-btn--active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <span className="settings-app__nav-icon">ℹ️</span>
            <span>About OS</span>
          </button>
        </nav>
      </div>

      {/* Main content body */}
      <div className="settings-app__content">
        {/* APPEARANCE TAB */}
        {activeTab === 'appearance' && (
          <div className="settings-app__section">
            <h2 className="settings-app__title">Appearance</h2>
            <p className="settings-app__subtitle">Customize your desktop wallpaper, interface themes, and animations.</p>

            {/* Wallpaper Selection */}
            <div className="settings-app__group">
              <h3 className="settings-app__group-title">Desktop Wallpaper</h3>
              <p className="settings-app__group-desc">Select from high-resolution developer wallpapers stored in assets.</p>

              <div className="settings-app__wallpapers">
                {WALLPAPERS.map((wp) => {
                  const isActive = activeWallpaper.id === wp.id;
                  return (
                    <div
                      key={wp.id}
                      className={`settings-app__wallpaper-card ${isActive ? 'settings-app__wallpaper-card--active' : ''}`}
                      onClick={() => handleSelectWallpaper(wp)}
                    >
                      <div className="settings-app__wallpaper-preview">
                        <img src={wp.url} alt={wp.name} loading="lazy" />
                        {isActive && <span className="settings-app__wallpaper-badge">Active</span>}
                      </div>
                      <div className="settings-app__wallpaper-meta">
                        <span className="settings-app__wallpaper-name">{wp.name}</span>
                        <span className="settings-app__wallpaper-desc">{wp.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Theme Selection */}
            <div className="settings-app__group">
              <div className="settings-app__group-header">
                <div>
                  <h3 className="settings-app__group-title">Color Theme</h3>
                  <p className="settings-app__group-desc">12 VS Code & developer IDE color schemes</p>
                </div>
                <div className="settings-app__theme-filter">
                  <button
                    type="button"
                    className={`settings-app__filter-btn ${themeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setThemeFilter('all')}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`settings-app__filter-btn ${themeFilter === 'dark' ? 'active' : ''}`}
                    onClick={() => setThemeFilter('dark')}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    className={`settings-app__filter-btn ${themeFilter === 'light' ? 'active' : ''}`}
                    onClick={() => setThemeFilter('light')}
                  >
                    Light
                  </button>
                </div>
              </div>

              <div className="settings-app__themes-grid">
                {filteredThemes.map((t) => {
                  const isActive = currentTheme.id === t.id;
                  return (
                    <div
                      key={t.id}
                      className={`settings-app__theme-card ${isActive ? 'settings-app__theme-card--active' : ''}`}
                      onClick={() => handleSelectTheme(t.id, t.name)}
                    >
                      <div className="settings-app__theme-swatches">
                        {t.previewColors.map((col, idx) => (
                          <span key={idx} className="settings-app__swatch" style={{ background: col }} />
                        ))}
                      </div>
                      <div className="settings-app__theme-info">
                        <div className="settings-app__theme-header">
                          <span className="settings-app__theme-name">{t.name}</span>
                          {isActive && <span className="settings-app__theme-check">✓</span>}
                        </div>
                        <span className="settings-app__theme-desc">{t.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Motion Settings */}
            <div className="settings-app__group">
              <h3 className="settings-app__group-title">Motion & Accessibility</h3>
              <div className="settings-app__toggle-row">
                <div className="settings-app__toggle-info">
                  <span className="settings-app__toggle-label">Smooth Window & Dock Animations</span>
                  <span className="settings-app__toggle-desc">Enable GPU-accelerated window transitions and dock zoom</span>
                </div>
                <button
                  type="button"
                  className={`settings-app__switch ${motionEnabled ? 'settings-app__switch--on' : ''}`}
                  onClick={() => setMotionEnabled(!motionEnabled)}
                >
                  <span className="settings-app__switch-handle" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AUDIO TAB */}
        {activeTab === 'audio' && (
          <div className="settings-app__section">
            <h2 className="settings-app__title">Sound & Audio</h2>
            <p className="settings-app__subtitle">Manage master audio playback, ambient focus music, and sound balance.</p>

            <div className="settings-app__group">
              <h3 className="settings-app__group-title">Master Volume</h3>
              <div className="settings-app__volume-box">
                <div className="settings-app__vol-slider-row">
                  <button type="button" onClick={toggleMute} className="settings-app__mute-btn">
                    {isMuted || volume === 0 ? '🔇' : '🔊'}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="settings-app__vol-slider"
                  />
                  <span className="settings-app__vol-percent">{Math.round(volume * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="settings-app__group">
              <h3 className="settings-app__group-title">Current Audio Source</h3>
              <div className="settings-app__audio-track-card">
                <div className="settings-app__audio-icon">🎵</div>
                <div className="settings-app__audio-meta">
                  <span className="settings-app__audio-title">{currentTrack.title}</span>
                  <span className="settings-app__audio-artist">{currentTrack.artist} — {currentTrack.album}</span>
                  <span className="settings-app__audio-path">Source: src/assets/song/atlasaudio-soft-soft-music-576656.mp3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="settings-app__section">
            <h2 className="settings-app__title">About Navneet OS</h2>
            <p className="settings-app__subtitle">System specifications and developer portfolio environment details.</p>

            <div className="settings-app__about-badge">
              <div className="settings-app__about-logo">
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="46" fill="#e95420" />
                  <circle cx="50" cy="50" r="32" fill="#77216f" />
                  <circle cx="50" cy="50" r="18" fill="#fff" />
                </svg>
              </div>
              <div className="settings-app__about-head">
                <h3>Navneet OS 24.04 LTS</h3>
                <span className="settings-app__about-edition">Portfolio Developer Workstation</span>
              </div>
            </div>

            <div className="settings-app__specs-table">
              <div className="settings-app__spec-row">
                <span className="settings-app__spec-key">Device Name</span>
                <span className="settings-app__spec-val">portfolio-workstation</span>
              </div>
              <div className="settings-app__spec-row">
                <span className="settings-app__spec-key">Developer / Owner</span>
                <span className="settings-app__spec-val">Navneet Sinha</span>
              </div>
              <div className="settings-app__spec-row">
                <span className="settings-app__spec-key">Role</span>
                <span className="settings-app__spec-val">Full Stack Developer & Software Engineer</span>
              </div>
              <div className="settings-app__spec-row">
                <span className="settings-app__spec-key">Kernel</span>
                <span className="settings-app__spec-val">Linux 6.8.0-portfolio-generic x86_64</span>
              </div>
              <div className="settings-app__spec-row">
                <span className="settings-app__spec-key">Desktop Environment</span>
                <span className="settings-app__spec-val">GNOME 46.2 (Ubuntu Navneet OS Custom)</span>
              </div>
              <div className="settings-app__spec-row">
                <span className="settings-app__spec-key">Display Server</span>
                <span className="settings-app__spec-val">Wayland / WebGL2 React Composite</span>
              </div>
              <div className="settings-app__spec-row">
                <span className="settings-app__spec-key">Frontend Engine</span>
                <span className="settings-app__spec-val">React 19 + TypeScript + Vite</span>
              </div>
              <div className="settings-app__spec-row">
                <span className="settings-app__spec-key">Location</span>
                <span className="settings-app__spec-val">India 🇮🇳</span>
              </div>
            </div>

            <div className="settings-app__links">
              <a
                href="https://github.com/Neet2516"
                target="_blank"
                rel="noopener noreferrer"
                className="settings-app__link-btn"
              >
                GitHub Profile ↗
              </a>
              <a
                href="https://www.linkedin.com/in/navneetsinha-/"
                target="_blank"
                rel="noopener noreferrer"
                className="settings-app__link-btn"
              >
                LinkedIn Profile ↗
              </a>
              <a
                href="mailto:contact@navneetsinha.dev"
                className="settings-app__link-btn settings-app__link-btn--primary"
              >
                Send Email ✉
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

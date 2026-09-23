import { useState, useEffect, useRef } from 'react';
import { useWindowManager } from '../../context/WindowContext';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { PERSONAL } from '../../data/portfolio';
import './TopBar.css';

export default function TopBar() {
  const { toggleAppLauncher, openWindow, isAppLauncherOpen } = useWindowManager();
  const { currentTheme, openThemeSelector } = useTheme();
  const { isPlaying, volume, setVolume, toggleMute, isMuted } = useAudio();

  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isVolumeSliderOpen, setIsVolumeSliderOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Live system clock formatted like GNOME "Sep 22 14:20"
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const monthStr = now.toLocaleDateString('en-US', { month: 'short' });
      const day = now.getDate();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${monthStr} ${day} ${hours}:${minutes}`);
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
        setIsVolumeSliderOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="gnome-topbar">
      {/* Left side: Activities & Brand */}
      <div className="gnome-topbar__left">
        <button
          type="button"
          className={`gnome-topbar__btn ${isAppLauncherOpen ? 'gnome-topbar__btn--active' : ''}`}
          onClick={toggleAppLauncher}
          aria-label="Activities"
        >
          Activities
        </button>

        <button
          type="button"
          className="gnome-topbar__btn gnome-topbar__app-name"
          onClick={() => openWindow('about')}
        >
          <span className="gnome-topbar__os-icon">⬡</span>
          <span>Navneet OS</span>
        </button>
      </div>

      {/* Center: Dynamic Clock */}
      <div className="gnome-topbar__center">
        <button
          type="button"
          className="gnome-topbar__clock-btn"
          onClick={() => openWindow('about')}
          title="System Date & Time"
        >
          {currentTimeStr}
        </button>
      </div>

      {/* Right side: System status & User Profile */}
      <div className="gnome-topbar__right" ref={profileMenuRef}>
        {/* Quick Volume Trigger */}
        <div className="gnome-topbar__quick-item">
          <button
            type="button"
            className="gnome-topbar__icon-btn"
            onClick={() => setIsVolumeSliderOpen(!isVolumeSliderOpen)}
            title={`Sound: ${Math.round(volume * 100)}%`}
          >
            {isMuted || volume === 0 ? '🔇' : isPlaying ? '🔊' : '🔉'}
          </button>

          {isVolumeSliderOpen && (
            <div className="gnome-topbar__slider-popover">
              <span className="gnome-topbar__slider-label">Master Volume</span>
              <div className="gnome-topbar__slider-row">
                <button type="button" onClick={toggleMute} className="gnome-topbar__mini-btn">
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="gnome-topbar__range"
                />
                <span className="gnome-topbar__slider-val">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* System Indicators */}
        <span className="gnome-topbar__indicator" title="Wi-Fi Connected (Gigabit Network)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 2.5c3.96 0 7.55 1.56 10.22 4.1L12 18.9 1.78 10.6C4.45 8.06 8.04 6.5 12 6.5z"/>
          </svg>
        </span>
        <span className="gnome-topbar__indicator" title="Battery: 100% Fully Charged">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 5v1h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm-1 2H8v1h8V7zm2 3H6v8h12v-8z"/>
          </svg>
        </span>

        {/* User Pill / System Dropdown */}
        <button
          type="button"
          className={`gnome-topbar__user-pill ${isProfileMenuOpen ? 'gnome-topbar__user-pill--active' : ''}`}
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          aria-expanded={isProfileMenuOpen}
          aria-haspopup="true"
        >
          <span className="gnome-topbar__avatar-badge">NS</span>
        </button>

        {/* System Settings & User Dropdown */}
        {isProfileMenuOpen && (
          <div className="gnome-topbar__menu" role="menu">
            {/* Header info */}
            <div className="gnome-topbar__menu-header">
              <div className="gnome-topbar__menu-avatar">NS</div>
              <div className="gnome-topbar__menu-info">
                <span className="gnome-topbar__menu-name">{PERSONAL.name}</span>
                <span className="gnome-topbar__menu-role">{PERSONAL.roles[0]}</span>
              </div>
            </div>

            <div className="gnome-topbar__menu-divider" />

            {/* Menu Items */}
            <button
              type="button"
              className="gnome-topbar__menu-item"
              onClick={() => {
                setIsProfileMenuOpen(false);
                openWindow('settings');
              }}
            >
              <span className="gnome-topbar__menu-icon">⚙️</span>
              <span>Settings</span>
            </button>

            <button
              type="button"
              className="gnome-topbar__menu-item"
              onClick={() => {
                setIsProfileMenuOpen(false);
                openThemeSelector();
              }}
            >
              <span className="gnome-topbar__menu-icon">🎨</span>
              <span style={{ flex: 1 }}>Theme</span>
              <span className="gnome-topbar__menu-badge">{currentTheme.name}</span>
            </button>

            <button
              type="button"
              className="gnome-topbar__menu-item"
              onClick={() => {
                setIsProfileMenuOpen(false);
                openWindow('terminal');
              }}
            >
              <span className="gnome-topbar__menu-icon">&gt;_</span>
              <span>Terminal Shell</span>
            </button>

            <button
              type="button"
              className="gnome-topbar__menu-item"
              onClick={() => {
                setIsProfileMenuOpen(false);
                openWindow('about');
              }}
            >
              <span className="gnome-topbar__menu-icon">ⓘ</span>
              <span>About Navneet OS</span>
            </button>

            <div className="gnome-topbar__menu-divider" />

            <button
              type="button"
              className="gnome-topbar__menu-item gnome-topbar__menu-item--danger"
              onClick={() => {
                setIsProfileMenuOpen(false);
                window.location.reload();
              }}
            >
              <span className="gnome-topbar__menu-icon">⏻</span>
              <span>Restart System</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

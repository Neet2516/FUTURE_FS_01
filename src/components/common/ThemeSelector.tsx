import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES, type Theme } from '../../data/themes';
import './ThemeSelector.css';

export default function ThemeSelector() {
  const {
    currentTheme,
    previewTheme,
    isThemeSelectorOpen,
    setTheme,
    previewThemeById,
    closeThemeSelector,
  } = useTheme();

  const [filterText, setFilterText] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  // Filtered themes list based on search text
  const filteredThemes = useMemo(() => {
    const query = filterText.trim().toLowerCase();
    if (!query) return THEMES;
    return THEMES.filter(
      (theme) =>
        theme.name.toLowerCase().includes(query) ||
        theme.category.toLowerCase().includes(query) ||
        theme.description.toLowerCase().includes(query)
    );
  }, [filterText]);

  // When modal opens, focus input & highlight current theme
  useEffect(() => {
    if (isThemeSelectorOpen) {
      setFilterText('');
      const initialIndex = filteredThemes.findIndex((t) => t.id === currentTheme.id);
      setHighlightedIndex(initialIndex >= 0 ? initialIndex : 0);

      // Focus input
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isThemeSelectorOpen, currentTheme.id, filteredThemes]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!isThemeSelectorOpen || !listRef.current) return;
    const activeEl = listRef.current.querySelector<HTMLElement>(`[data-index="${highlightedIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
  }, [highlightedIndex, isThemeSelectorOpen]);

  // Live preview when highlighted index changes
  useEffect(() => {
    if (!isThemeSelectorOpen) return;
    const themeToPreview = filteredThemes[highlightedIndex];
    if (themeToPreview) {
      previewThemeById(themeToPreview.id);
    }
  }, [highlightedIndex, filteredThemes, isThemeSelectorOpen, previewThemeById]);

  // Show VS Code toast message
  const showToast = useCallback((themeName: string) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(`Color theme set to "${themeName}"`);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Confirm selection
  const selectTheme = useCallback(
    (theme: Theme) => {
      setTheme(theme.id);
      closeThemeSelector(false); // don't revert
      showToast(theme.name);
    },
    [setTheme, closeThemeSelector, showToast]
  );

  // Cancel and revert
  const handleCancel = useCallback(() => {
    closeThemeSelector(true); // revert to saved theme
  }, [closeThemeSelector]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredThemes.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredThemes.length) % filteredThemes.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredThemes[highlightedIndex];
      if (selected) {
        selectTheme(selected);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Group filtered themes by category (dark / light)
  const groupedThemes = useMemo(() => {
    const groups: { category: 'dark' | 'light'; label: string; themes: { theme: Theme; globalIndex: number }[] }[] = [
      { category: 'dark', label: 'dark themes', themes: [] },
      { category: 'light', label: 'light themes', themes: [] },
    ];

    filteredThemes.forEach((theme, index) => {
      const group = groups.find((g) => g.category === theme.category);
      if (group) {
        group.themes.push({ theme, globalIndex: index });
      }
    });

    return groups.filter((g) => g.themes.length > 0);
  }, [filteredThemes]);

  return (
    <>
      {/* VS Code QuickPick Modal */}
      {isThemeSelectorOpen && (
        <div className="vscode-quickpick-overlay" onClick={handleCancel} role="presentation">
          <div
            className="vscode-quickpick"
            role="dialog"
            aria-modal="true"
            aria-label="Color Theme Selection"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Header / Input Box */}
            <div className="vscode-quickpick__header">
              <div className="vscode-quickpick__input-wrapper">
                <span className="vscode-quickpick__icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M11.5 2a3.5 3.5 0 0 1 2.47 5.97l-7.07 7.07a1 1 0 0 1-1.41 0l-3.54-3.54a1 1 0 0 1 0-1.41l7.07-7.07A3.5 3.5 0 0 1 11.5 2zm0 1a2.5 2.5 0 0 0-1.77.73L2.66 10.8l2.12 2.12 7.07-7.07A2.5 2.5 0 0 0 11.5 3zM6.9 14.33l-1.42-1.42 5.66-5.66 1.41 1.42-5.65 5.66z" />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  className="vscode-quickpick__input"
                  placeholder="Select Color Theme (up/down keys to preview)"
                  value={filterText}
                  onChange={(e) => {
                    setFilterText(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  aria-autocomplete="list"
                  spellCheck={false}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="vscode-quickpick__close-btn"
                  onClick={handleCancel}
                  aria-label="Close theme selector"
                  title="Close (Esc)"
                >
                  <kbd>Esc</kbd>
                </button>
              </div>
            </div>

            {/* List Body */}
            <div className="vscode-quickpick__list" ref={listRef} role="listbox">
              {groupedThemes.length === 0 ? (
                <div className="vscode-quickpick__empty">No matching color themes found</div>
              ) : (
                groupedThemes.map((group) => (
                  <div key={group.category} className="vscode-quickpick__group">
                    <div className="vscode-quickpick__group-header">
                      <span>{group.label}</span>
                    </div>
                    {group.themes.map(({ theme, globalIndex }) => {
                      const isHighlighted = globalIndex === highlightedIndex;
                      const isCurrentlySaved = theme.id === currentTheme.id;
                      const isCurrentlyPreviewed = previewTheme?.id === theme.id;

                      return (
                        <div
                          key={theme.id}
                          data-index={globalIndex}
                          role="option"
                          aria-selected={isHighlighted}
                          className={`vscode-quickpick__item ${
                            isHighlighted ? 'vscode-quickpick__item--focused' : ''
                          } ${isCurrentlySaved ? 'vscode-quickpick__item--selected' : ''}`}
                          onClick={() => selectTheme(theme)}
                          onMouseEnter={() => setHighlightedIndex(globalIndex)}
                        >
                          {/* Checkmark Indicator */}
                          <span className="vscode-quickpick__check" aria-hidden="true">
                            {isCurrentlySaved ? '✓' : ''}
                          </span>

                          {/* Color Palette Preview Swatch */}
                          <div
                            className="vscode-quickpick__swatch"
                            title={`Palette: ${theme.previewColors.join(', ')}`}
                            aria-hidden="true"
                          >
                            <span style={{ backgroundColor: theme.previewColors[0] }} />
                            <span style={{ backgroundColor: theme.previewColors[1] }} />
                            <span style={{ backgroundColor: theme.previewColors[2] }} />
                            <span style={{ backgroundColor: theme.previewColors[3] }} />
                          </div>

                          {/* Theme Label & Description */}
                          <div className="vscode-quickpick__content">
                            <span className="vscode-quickpick__label">{theme.name}</span>
                            <span className="vscode-quickpick__desc">{theme.description}</span>
                          </div>

                          {/* Badges */}
                          <div className="vscode-quickpick__meta">
                            {isCurrentlySaved && (
                              <span className="vscode-quickpick__badge vscode-quickpick__badge--active">Current</span>
                            )}
                            {isCurrentlyPreviewed && !isCurrentlySaved && (
                              <span className="vscode-quickpick__badge vscode-quickpick__badge--preview">Preview</span>
                            )}
                            <span className="vscode-quickpick__tag">{theme.category}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* QuickPick Footer Info */}
            <div className="vscode-quickpick__footer">
              <div className="vscode-quickpick__footer-hints">
                <span>
                  <kbd>↑</kbd> <kbd>↓</kbd> navigate
                </span>
                <span className="vscode-quickpick__footer-dot">•</span>
                <span>
                  <kbd>↵</kbd> select
                </span>
                <span className="vscode-quickpick__footer-dot">•</span>
                <span>
                  <kbd>esc</kbd> cancel
                </span>
              </div>
              <div className="vscode-quickpick__footer-count">
                {filteredThemes.length} {filteredThemes.length === 1 ? 'theme' : 'themes'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VS Code Notification Toast */}
      {toastMessage && (
        <aside className="vscode-toast" role="status" aria-live="polite">
          <div className="vscode-toast__icon">🎨</div>
          <div className="vscode-toast__body">
            <span className="vscode-toast__title">Theme Applied</span>
            <span className="vscode-toast__message">{toastMessage}</span>
          </div>
          <button
            type="button"
            className="vscode-toast__close"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss toast"
          >
            ×
          </button>
        </aside>
      )}
    </>
  );
}

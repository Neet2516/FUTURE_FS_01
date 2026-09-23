import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { THEMES, DEFAULT_THEME_ID, type Theme } from '../data/themes';

interface ThemeContextType {
  currentTheme: Theme;
  previewTheme: Theme | null;
  activeTheme: Theme;
  isThemeSelectorOpen: boolean;
  setTheme: (themeId: string) => void;
  previewThemeById: (themeId: string | null) => void;
  openThemeSelector: () => void;
  closeThemeSelector: (revert?: boolean) => void;
  toggleThemeSelector: () => void;
}

const STORAGE_KEY = 'vscode-portfolio-theme';

const ThemeContext = createContext<ThemeContextType | null>(null);

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement;
  
  // Set theme data attributes
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-theme-category', theme.category);
  root.style.colorScheme = theme.category;

  // Apply all custom properties
  Object.entries(theme.variables).forEach(([prop, val]) => {
    root.style.setProperty(prop, val);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    } catch {
      // Ignore localStorage errors in restricted environments
    }
    return DEFAULT_THEME_ID;
  });

  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);

  const currentTheme = THEMES.find((t) => t.id === currentThemeId) || THEMES[0];
  const previewTheme = previewThemeId ? THEMES.find((t) => t.id === previewThemeId) || null : null;
  const activeTheme = previewTheme || currentTheme;

  // Sync to DOM whenever active theme changes
  useEffect(() => {
    applyThemeToDOM(activeTheme);
  }, [activeTheme]);

  const setTheme = useCallback((themeId: string) => {
    const target = THEMES.find((t) => t.id === themeId);
    if (!target) return;

    setCurrentThemeId(target.id);
    setPreviewThemeId(null);
    try {
      localStorage.setItem(STORAGE_KEY, target.id);
    } catch {
      // Ignore
    }
  }, []);

  const previewThemeById = useCallback((themeId: string | null) => {
    if (!themeId) {
      setPreviewThemeId(null);
      return;
    }
    const target = THEMES.find((t) => t.id === themeId);
    if (target) {
      setPreviewThemeId(target.id);
    }
  }, []);

  const openThemeSelector = useCallback(() => {
    setIsThemeSelectorOpen(true);
  }, []);

  const closeThemeSelector = useCallback((revert = true) => {
    setIsThemeSelectorOpen(false);
    if (revert) {
      setPreviewThemeId(null);
    }
  }, []);

  const toggleThemeSelector = useCallback(() => {
    setIsThemeSelectorOpen((prev) => {
      if (prev) {
        setPreviewThemeId(null);
        return false;
      }
      return true;
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        previewTheme,
        activeTheme,
        isThemeSelectorOpen,
        setTheme,
        previewThemeById,
        openThemeSelector,
        closeThemeSelector,
        toggleThemeSelector,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

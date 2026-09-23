import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { WALLPAPERS, DEFAULT_WALLPAPER, type WallpaperOption } from '../config/osAssets';
import { useNotification } from './NotificationContext';

export type AppId =
  | 'terminal'
  | 'files'
  | 'browser'
  | 'music'
  | 'projects'
  | 'settings'
  | 'chatgpt'
  | 'about'
  | 'contact';

export interface WindowState {
  id: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const INITIAL_WINDOWS: Record<AppId, WindowState> = {
  terminal: {
    id: 'terminal',
    title: 'navneet@portfolio: ~',
    icon: 'terminal',
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 25,
    position: { x: 78, y: 36 },
    size: { width: 1040, height: 575 },
  },
  files: {
    id: 'files',
    title: 'Files — Home',
    icon: 'folder',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 440, y: 340 },
    size: { width: 560, height: 380 },
  },
  browser: {
    id: 'browser',
    title: 'Navneet Browser',
    icon: 'browser',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 12,
    position: { x: 860, y: 300 },
    size: { width: 580, height: 440 },
  },
  music: {
    id: 'music',
    title: 'Music Player',
    icon: 'music',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9,
    position: { x: 300, y: 180 },
    size: { width: 520, height: 400 },
  },
  projects: {
    id: 'projects',
    title: 'Projects Showcase',
    icon: 'code',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    position: { x: 220, y: 100 },
    size: { width: 720, height: 500 },
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 280, y: 140 },
    size: { width: 680, height: 480 },
  },
  about: {
    id: 'about',
    title: 'About Navneet OS',
    icon: 'info',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    position: { x: 320, y: 160 },
    size: { width: 480, height: 360 },
  },
  contact: {
    id: 'contact',
    title: 'Contact & Connect',
    icon: 'mail',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 5,
    position: { x: 340, y: 180 },
    size: { width: 520, height: 420 },
  },
  chatgpt: {
    id: 'chatgpt',
    title: 'ChatGPT — Navneet Portfolio AI',
    icon: 'chatgpt',
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 16,
    position: { x: 280, y: 70 },
    size: { width: 880, height: 620 },
  },
};

interface WindowContextType {
  windows: Record<AppId, WindowState>;
  activeWindowId: AppId | null;
  activeWallpaper: WallpaperOption;
  isAppLauncherOpen: boolean;
  selectedFilePath: string | null;
  openWindow: (id: AppId, focusParam?: string) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updatePosition: (id: AppId, pos: { x: number; y: number }) => void;
  setWallpaperById: (id: string) => void;
  toggleAppLauncher: () => void;
  closeAppLauncher: () => void;
  openFileInManager: (path: string) => void;
}

const WindowContext = createContext<WindowContextType | null>(null);

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<Record<AppId, WindowState>>(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>('terminal');
  const [, setMaxZIndex] = useState(20);
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const [activeWallpaper, setActiveWallpaper] = useState<WallpaperOption>(() => {
    try {
      const saved = localStorage.getItem('navneet-os-wallpaper');
      const found = WALLPAPERS.find((w) => w.id === saved);
      if (found) return found;
    } catch {
      // Ignore
    }
    return DEFAULT_WALLPAPER;
  });

  const { notify } = useNotification();

  const focusWindow = useCallback(
    (id: AppId) => {
      setMaxZIndex((prev) => {
        const nextZ = prev + 1;
        setWindows((wins) => {
          if (!wins[id]) return wins;
          return {
            ...wins,
            [id]: {
              ...wins[id],
              zIndex: nextZ,
              isMinimized: false,
            },
          };
        });
        setActiveWindowId(id);
        return nextZ;
      });
    },
    []
  );

  const openWindow = useCallback(
    (id: AppId) => {
      setMaxZIndex((prev) => {
        const nextZ = prev + 1;
        setWindows((wins) => {
          const current = wins[id];
          if (!current) return wins;
          return {
            ...wins,
            [id]: {
              ...current,
              isOpen: true,
              isMinimized: false,
              zIndex: nextZ,
            },
          };
        });
        setActiveWindowId(id);
        return nextZ;
      });
    },
    []
  );

  const closeWindow = useCallback((id: AppId) => {
    setWindows((wins) => {
      if (!wins[id]) return wins;
      return {
        ...wins,
        [id]: {
          ...wins[id],
          isOpen: false,
        },
      };
    });
    setActiveWindowId((prev) => (prev === id ? null : prev));
  }, []);

  const minimizeWindow = useCallback((id: AppId) => {
    setWindows((wins) => {
      if (!wins[id]) return wins;
      return {
        ...wins,
        [id]: {
          ...wins[id],
          isMinimized: true,
        },
      };
    });
    setActiveWindowId((prev) => (prev === id ? null : prev));
  }, []);

  const maximizeWindow = useCallback((id: AppId) => {
    setWindows((wins) => {
      if (!wins[id]) return wins;
      return {
        ...wins,
        [id]: {
          ...wins[id],
          isMaximized: !wins[id].isMaximized,
        },
      };
    });
  }, []);

  const updatePosition = useCallback((id: AppId, pos: { x: number; y: number }) => {
    setWindows((wins) => {
      if (!wins[id]) return wins;
      return {
        ...wins,
        [id]: {
          ...wins[id],
          position: pos,
        },
      };
    });
  }, []);

  const setWallpaperById = useCallback((id: string) => {
    const found = WALLPAPERS.find((w) => w.id === id);
    if (found) {
      setActiveWallpaper(found);
      try {
        localStorage.setItem('navneet-os-wallpaper', found.id);
      } catch {
        // Ignore
      }
      notify('Wallpaper Updated', `Desktop background set to "${found.name}"`, '🖼️');
    }
  }, [notify]);

  const toggleAppLauncher = useCallback(() => {
    setIsAppLauncherOpen((prev) => !prev);
  }, []);

  const closeAppLauncher = useCallback(() => {
    setIsAppLauncherOpen(false);
  }, []);

  const openFileInManager = useCallback(
    (path: string) => {
      setSelectedFilePath(path);
      openWindow('files');
    },
    [openWindow]
  );

  return (
    <WindowContext.Provider
      value={{
        windows,
        activeWindowId,
        activeWallpaper,
        isAppLauncherOpen,
        selectedFilePath,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updatePosition,
        setWallpaperById,
        toggleAppLauncher,
        closeAppLauncher,
        openFileInManager,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowProvider');
  }
  return context;
}

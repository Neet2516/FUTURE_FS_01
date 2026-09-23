import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface OSNotification {
  id: string;
  title: string;
  message: string;
  icon?: string;
  timestamp: number;
}

interface NotificationContextType {
  notifications: OSNotification[];
  notify: (title: string, message: string, icon?: string) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<OSNotification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback((title: string, message: string, icon?: string) => {
    const id = Math.random().toString(36).slice(2);
    const newNotif: OSNotification = {
      id,
      title,
      message,
      icon,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]); // max 5 concurrent

    setTimeout(() => {
      dismiss(id);
    }, 4500);
  }, [dismiss]);

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

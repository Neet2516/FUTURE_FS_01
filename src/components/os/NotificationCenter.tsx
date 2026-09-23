import { useNotification } from '../../context/NotificationContext';
import './NotificationCenter.css';

export default function NotificationCenter() {
  const { notifications, dismiss } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <aside aria-label="Notifications" className="os-notifications">
      {notifications.map((n) => (
        <div key={n.id} className="os-toast" role="status">
          <div className="os-toast__icon">{n.icon || '🔔'}</div>
          <div className="os-toast__content">
            <span className="os-toast__title">{n.title}</span>
            <span className="os-toast__message">{n.message}</span>
          </div>
          <button
            type="button"
            className="os-toast__close"
            onClick={() => dismiss(n.id)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </aside>
  );
}

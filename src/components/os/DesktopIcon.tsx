import { useState, useRef, useCallback, useEffect } from 'react';
import './DesktopIcon.css';

interface DesktopIconProps {
  id: string;
  label: string;
  iconType: 'folder' | 'pdf' | 'trash' | 'app' | 'chatgpt';
  iconGlyph?: string;
  initialX?: number;
  initialY?: number;
  onOpen: () => void;
  /** Called whenever the icon finishes moving so Desktop can persist positions */
  onMove?: (id: string, x: number, y: number) => void;
}

const STORAGE_KEY = 'navneet-os-icon-positions';

function loadPosition(id: string, fallbackX: number, fallbackY: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const all = JSON.parse(raw) as Record<string, { x: number; y: number }>;
      if (all[id]) return all[id];
    }
  } catch { /* ignore */ }
  return { x: fallbackX, y: fallbackY };
}

function savePosition(id: string, x: number, y: number) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, { x: number; y: number }>) : {};
    all[id] = { x, y };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

export default function DesktopIcon({
  id,
  label,
  iconType,
  iconGlyph,
  initialX = 16,
  initialY = 16,
  onOpen,
  onMove,
}: DesktopIconProps) {
  const saved = loadPosition(id, initialX, initialY);
  const [pos, setPos] = useState({ x: saved.x, y: saved.y });
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<{
    startMouseX: number;
    startMouseY: number;
    startPosX: number;
    startPosY: number;
    moved: boolean;
  }>({ startMouseX: 0, startMouseY: 0, startPosX: 0, startPosY: 0, moved: false });

  const iconRef = useRef<HTMLDivElement>(null);

  // Deselect when clicking elsewhere on the desktop
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (iconRef.current && !iconRef.current.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsSelected(true);

    dragRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPosX: pos.x,
      startPosY: pos.y,
      moved: false,
    };

    setIsDragging(true);

    const onMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - dragRef.current.startMouseX;
      const dy = ev.clientY - dragRef.current.startMouseY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragRef.current.moved = true;
      }

      setPos({
        x: Math.max(0, dragRef.current.startPosX + dx),
        y: Math.max(0, dragRef.current.startPosY + dy),
      });
    };

    const onMouseUp = (ev: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      setIsDragging(false);

      const dx = ev.clientX - dragRef.current.startMouseX;
      const dy = ev.clientY - dragRef.current.startMouseY;
      const finalX = Math.max(0, dragRef.current.startPosX + dx);
      const finalY = Math.max(0, dragRef.current.startPosY + dy);

      setPos({ x: finalX, y: finalY });
      savePosition(id, finalX, finalY);
      onMove?.(id, finalX, finalY);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [pos.x, pos.y, id, onMove]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dragRef.current.moved) {
      setIsSelected(true);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dragRef.current.moved) {
      onOpen();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const STEP = 8;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen();
    } else if (e.key === 'ArrowLeft') {
      setPos(p => { const nx = Math.max(0, p.x - STEP); savePosition(id, nx, p.y); return { ...p, x: nx }; });
    } else if (e.key === 'ArrowRight') {
      setPos(p => { const nx = p.x + STEP; savePosition(id, nx, p.y); return { ...p, x: nx }; });
    } else if (e.key === 'ArrowUp') {
      setPos(p => { const ny = Math.max(0, p.y - STEP); savePosition(id, p.x, ny); return { ...p, y: ny }; });
    } else if (e.key === 'ArrowDown') {
      setPos(p => { const ny = p.y + STEP; savePosition(id, p.x, ny); return { ...p, y: ny }; });
    }
  };

  return (
    <div
      ref={iconRef}
      className={[
        'desktop-icon',
        isSelected ? 'desktop-icon--selected' : '',
        isDragging ? 'desktop-icon--dragging' : '',
      ].filter(Boolean).join(' ')}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${label} (drag to move, double-click to open)`}
    >
      <div className="desktop-icon__graphic">
        {iconType === 'folder' && (
          <div className="desktop-icon__folder-svg">
            <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
              <path d="M4 10C4 7.79 5.79 6 8 6H18L24 12H40C42.21 12 44 13.79 44 16V38C44 40.21 42.21 42 40 42H8C5.79 42 4 40.21 4 38V10Z" fill="#2563EB" opacity="0.85"/>
              <path d="M4 17C4 14.79 5.79 13 8 13H40C42.21 13 44 14.79 44 17V38C44 40.21 42.21 42 40 42H8C5.79 42 4 40.21 4 38V17Z" fill="#3B82F6"/>
              <path d="M8 15H40V19H8V15Z" fill="#60A5FA" opacity="0.4"/>
            </svg>
          </div>
        )}

        {iconType === 'pdf' && (
          <div className="desktop-icon__pdf-svg">
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
              <path d="M10 6C10 4.9 10.9 4 12 4H30L40 14V42C40 43.1 39.1 44 38 44H12C10.9 44 10 43.1 10 42V6Z" fill="#E11D48"/>
              <path d="M30 4L40 14H32C30.9 14 30 13.1 30 12V4Z" fill="#FDA4AF"/>
              <text x="24" y="32" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">PDF</text>
            </svg>
          </div>
        )}

        {iconType === 'trash' && (
          <div className="desktop-icon__trash-svg">
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
              <path d="M14 14H34V40C34 42.2 32.2 44 30 44H18C15.8 44 14 42.2 14 40V14Z" fill="#94A3B8"/>
              <path d="M10 10H38V14H10V10Z" fill="#64748B"/>
              <path d="M20 6H28V10H20V6Z" fill="#475569"/>
              <line x1="20" y1="20" x2="20" y2="36" stroke="#475569" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="28" y1="20" x2="28" y2="36" stroke="#475569" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {iconType === 'chatgpt' && (
          <div className="desktop-icon__chatgpt-svg">
            <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="url(#desktop-chatgpt-grad)" />
              <g transform="translate(6, 6) scale(0.75)" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M24 11.5a6.5 6.5 0 0 1 6.5 6.5v1.2a6.5 6.5 0 0 1 5.6 9.7l-1 1.8a6.5 6.5 0 0 1-5.6 9.8H27a6.5 6.5 0 0 1-5.6-3.2l-1-1.8a6.5 6.5 0 0 1-7.9-7.9l1-1.8A6.5 6.5 0 0 1 19 16.2V15a6.5 6.5 0 0 1 5-3.5z" />
                <path d="M19 24h10" />
                <path d="M24 19v10" />
                <circle cx="24" cy="24" r="5" fill="#ffffff" fillOpacity="0.2" />
              </g>
              <defs>
                <linearGradient id="desktop-chatgpt-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#10a37f" />
                  <stop offset="1" stopColor="#0a7a5e" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}

        {iconType === 'app' && (
          <div className="desktop-icon__app-glyph">
            <span>{iconGlyph || '⚡'}</span>
          </div>
        )}
      </div>

      <span className="desktop-icon__label">{label}</span>
    </div>
  );
}

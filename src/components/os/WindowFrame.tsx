import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { useWindowManager, type AppId } from '../../context/WindowContext';
import './WindowFrame.css';

interface WindowFrameProps {
  id: AppId;
  title: string;
  iconGlyph?: string;
  children: ReactNode;
  headerControls?: ReactNode;
}

export default function WindowFrame({
  id,
  title,
  iconGlyph,
  children,
  headerControls,
}: WindowFrameProps) {
  const {
    windows,
    activeWindowId,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
  } = useWindowManager();

  const winState = windows[id];
  const isActive = activeWindowId === id;

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  const handleMouseDown = useCallback(() => {
    focusWindow(id);
  }, [focusWindow, id]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (winState.isMaximized) return;
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: winState.position.x,
      startY: winState.position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      const newX = Math.max(60, Math.min(window.innerWidth - 100, dragStartRef.current.startX + deltaX));
      const newY = Math.max(34, Math.min(window.innerHeight - 80, dragStartRef.current.startY + deltaY));

      updatePosition(id, { x: newX, y: newY });
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, id, updatePosition]);

  if (!winState || !winState.isOpen || winState.isMinimized) {
    return null;
  }

  const style: React.CSSProperties = winState.isMaximized
    ? {
        position: 'fixed',
        top: 32,
        left: 58,
        right: 0,
        bottom: 0,
        width: 'auto',
        height: 'auto',
        zIndex: winState.zIndex,
        borderRadius: 0,
      }
    : {
        position: 'fixed',
        left: winState.position.x,
        top: winState.position.y,
        width: winState.size.width,
        height: winState.size.height,
        zIndex: winState.zIndex,
      };

  return (
    <div
      className={`window-frame ${isActive ? 'window-frame--active' : 'window-frame--inactive'} ${
        winState.isMaximized ? 'window-frame--maximized' : ''
      }`}
      style={style}
      onMouseDown={handleMouseDown}
      role="dialog"
      aria-label={title}
    >
      {/* Title Bar */}
      <div
        className="window-frame__titlebar"
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={() => maximizeWindow(id)}
      >
        {/* Traffic Light Buttons */}
        <div className="window-frame__traffic-lights">
          <button
            type="button"
            className="window-frame__dot window-frame__dot--close"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            title="Close"
            aria-label="Close"
          />
          <button
            type="button"
            className="window-frame__dot window-frame__dot--min"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            title="Minimize"
            aria-label="Minimize"
          />
          <button
            type="button"
            className="window-frame__dot window-frame__dot--max"
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
            title={winState.isMaximized ? 'Restore' : 'Maximize'}
            aria-label={winState.isMaximized ? 'Restore' : 'Maximize'}
          />
        </div>

        {/* Title Content */}
        <div className="window-frame__title">
          {iconGlyph && <span className="window-frame__icon">{iconGlyph}</span>}
          <span className="window-frame__title-text">{title}</span>
        </div>

        {/* Optional Extra Header Controls (e.g. search, tabs) */}
        <div className="window-frame__header-controls">
          {headerControls}
        </div>
      </div>

      {/* Window Body Container */}
      <div className="window-frame__body">
        {children}
      </div>
    </div>
  );
}

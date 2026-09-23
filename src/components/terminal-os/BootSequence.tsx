import { useState, useEffect, useCallback } from 'react';
import './BootSequence.css';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const finishBoot = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  }, [onComplete]);

  // Auto complete after full handwriting animation finishes (~2.5s)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      finishBoot();
    }, 2500);

    return () => clearTimeout(timer);
  }, [finishBoot]);

  // Keyboard skip (Space / Enter / Esc)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        finishBoot();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [finishBoot]);

  return (
    <div
      className={`boot-container ${isFadingOut ? 'boot-container--fade' : ''}`}
      onClick={finishBoot}
      role="dialog"
      aria-label="Loading Screen"
    >
      {/* Background Soft Scanlines & Deep Red Ambient Aura */}
      <div className="boot-scanlines" aria-hidden="true" />
      <div className="boot-red-ambient" aria-hidden="true" />

      {/* Subtle Skip button in corner */}
      <button
        type="button"
        className="boot-skip-btn"
        onClick={(e) => {
          e.stopPropagation();
          finishBoot();
        }}
        aria-label="Skip loading"
      >
        <span>Skip</span>
        <kbd>Esc</kbd>
      </button>

      {/* Main Full-Width Handwriting Stage */}
      <div className="boot-handwriting-stage">
        <svg
          viewBox="0 0 1100 260"
          className="boot-handwriting-svg"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Navneet Sinha"
        >
          {/* Main Cursive Handwritten Text */}
          <text
            x="50%"
            y="155"
            textAnchor="middle"
            className="boot-handwriting-text"
          >
            Navneet Sinha
          </text>

          {/* Flowing Cursive Underline Flourish */}
          <path
            d="M 160 190 Q 420 226 680 194 Q 850 174 945 200"
            fill="none"
            stroke="#dc2626"
            strokeWidth="3.2"
            strokeLinecap="round"
            className="boot-flourish-path"
          />
        </svg>
      </div>
    </div>
  );
}

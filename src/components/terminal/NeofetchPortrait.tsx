import React, { useEffect, useRef, useState, useCallback } from 'react';
import portraitImg from '../../assets/photos/removed-bg_selfie.png';
import './NeofetchPortrait.css';

interface NeofetchPortraitProps {
  interactive?: boolean;
}

const WORDS = ['BUILD', 'LEARN', 'CREATE', 'REPEAT'];
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

// Hook for scrambled matrix text reveal
function useScrambledText(finalText: string, delayMs = 0) {
  const [displayText, setDisplayText] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    let iteration = 0;
    let timeoutId: number;
    let intervalId: number;

    timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setDisplayText(
          finalText
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return finalText[index];
              }
              if (char === ' ') return ' ';
              return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            })
            .join('')
        );

        if (iteration >= finalText.length) {
          setIsRevealed(true);
          clearInterval(intervalId);
        }

        iteration += 1 / 2;
      }, 45);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [finalText, delayMs]);

  return { text: displayText, isRevealed };
}

function ScrambledWord({ word, delay }: { word: string; delay: number }) {
  const { text, isRevealed } = useScrambledText(word, delay);
  return (
    <div className={`nf-portrait__word ${isRevealed ? 'nf-portrait__word--ready' : ''}`}>
      <span>{text || ' '}</span>
    </div>
  );
}

export default function NeofetchPortrait({ interactive = true }: NeofetchPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parallax transform state
  const [parallax, setParallax] = useState({ rotateX: 0, rotateY: 0, moveX: 0, moveY: 0 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Canvas particle simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 340);
    let height = (canvas.height = canvas.offsetHeight || 380);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 340;
      height = canvas.height = canvas.offsetHeight || 380;
    };

    window.addEventListener('resize', handleResize);

    // Generate cyber particle matrix
    interface Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      char?: string;
      color: string;
      alpha: number;
      pulseSpeed: number;
    }

    const particles: Particle[] = [];
    const symbols = ['.', ':', '+', '*', '#', '0', '1', '~', 'x'];

    // 1. Grid of subtle background matrix dots / chars (heavier on the left and edges)
    const cols = 18;
    const rows = 20;
    const cellW = width / cols;
    const cellH = height / rows;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Higher density on left side and bottom to frame silhouette
        const distFromCenter = Math.hypot(i - cols * 0.55, j - rows * 0.5);
        if (distFromCenter > 3.5 || (i < cols * 0.4 && Math.random() > 0.3)) {
          const isSymbol = Math.random() > 0.65;
          const x = i * cellW + (Math.random() - 0.5) * 6;
          const y = j * cellH + (Math.random() - 0.5) * 6;
          particles.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            size: isSymbol ? 9 : Math.random() * 2 + 1,
            char: isSymbol ? symbols[Math.floor(Math.random() * symbols.length)] : undefined,
            color: Math.random() > 0.2 ? '#38bdf8' : '#0284c7',
            alpha: Math.random() * 0.35 + 0.1,
            pulseSpeed: Math.random() * 0.03 + 0.01,
          });
        }
      }
    }

    // 2. Floating cyber dust particles
    for (let k = 0; k < 28; k++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.1,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.3 ? '#38bdf8' : '#f87171',
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
      });
    }

    let time = 0;
    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      // Render particles
      particles.forEach((p) => {
        // Soft floating drift for dust particles
        if (p.vx !== 0 || p.vy !== 0) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        // Interactive mouse reaction
        if (mousePos) {
          const dx = p.x - mousePos.x;
          const dy = p.y - mousePos.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 80 && dist > 0) {
            const force = (80 - dist) / 80;
            p.x += (dx / dist) * force * 3;
            p.y += (dy / dist) * force * 3;
          }
        }

        // Spring back to base position smoothly
        if (p.vx === 0 && p.vy === 0) {
          p.x += (p.baseX - p.x) * 0.05;
          p.y += (p.baseY - p.y) * 0.05;
        }

        const alphaPulse = p.alpha + Math.sin(time * p.pulseSpeed * 20) * 0.1;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.05, Math.min(0.8, alphaPulse));

        if (p.char) {
          ctx.font = `${p.size}px "JetBrains Mono", monospace`;
          ctx.fillText(p.char, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  // Handle subtle mouse parallax
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y });

      const normX = (x / rect.width - 0.5) * 2; // -1 to 1
      const normY = (y / rect.height - 0.5) * 2; // -1 to 1

      // Subtle restrained 3D tilt
      setParallax({
        rotateY: normX * 6,
        rotateX: -normY * 6,
        moveX: normX * 8,
        moveY: normY * 8,
      });
    },
    [interactive]
  );

  const handleMouseLeave = useCallback(() => {
    setParallax({ rotateX: 0, rotateY: 0, moveX: 0, moveY: 0 });
    setMousePos(null);
  }, []);

  return (
    <div
      ref={containerRef}
      className="nf-portrait"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="figure"
      aria-label="Cyber-terminal portrait of Navneet Sinha"
    >
      {/* 3D Parallax Stage */}
      <div
        className="nf-portrait__stage"
        style={{
          transform: `perspective(800px) rotateX(${parallax.rotateX}deg) rotateY(${parallax.rotateY}deg)`,
        }}
      >
        {/* Background Cyber ASCII Particle Canvas */}
        <canvas ref={canvasRef} className="nf-portrait__canvas" />

        {/* Ambient Halo & Radial Glow */}
        <div className="nf-portrait__glow-ambient" aria-hidden="true" />

        {/* Coral/Red Orbital Circular Arc (matches reference image) */}
        <div
          className="nf-portrait__orbital-arc"
          style={{
            transform: `translate(${parallax.moveX * 0.4}px, ${parallax.moveY * 0.4}px)`,
          }}
          aria-hidden="true"
        >
          <div className="nf-portrait__arc-ring" />
          <span className="nf-portrait__crosshair nf-portrait__crosshair--arc-top">+</span>
          <span className="nf-portrait__crosshair nf-portrait__crosshair--arc-bottom">+</span>
        </div>

        {/* Floating Red & Cyan Coordinate Crosshairs */}
        <div
          className="nf-portrait__crosshairs-layer"
          style={{
            transform: `translate(${parallax.moveX * 0.6}px, ${parallax.moveY * 0.6}px)`,
          }}
          aria-hidden="true"
        >
          <span className="nf-portrait__coord nf-portrait__coord--tl">+</span>
          <span className="nf-portrait__coord nf-portrait__coord--tr">+</span>
          <span className="nf-portrait__coord nf-portrait__coord--br">+</span>
          <span className="nf-portrait__coord nf-portrait__coord--bl">+</span>
        </div>

        {/* Top-Left Stacked Cyber Words: BUILD, LEARN, CREATE, REPEAT */}
        <div
          className="nf-portrait__word-stack"
          style={{
            transform: `translate(${parallax.moveX * 0.7}px, ${parallax.moveY * 0.7}px)`,
          }}
        >
          {WORDS.map((w, idx) => (
            <ScrambledWord key={w} word={w} delay={idx * 200 + 150} />
          ))}
        </div>

        {/* Portrait Silhouette Layer */}
        <div
          className="nf-portrait__image-wrap"
          style={{
            transform: `translate3d(${parallax.moveX}px, ${parallax.moveY}px, 20px)`,
          }}
        >
          <img
            src={portraitImg}
            alt="Navneet Sinha"
            className="nf-portrait__img"
            loading="eager"
            draggable={false}
          />

          {/* Glitch & Scanline Pass Line */}
          <div className="nf-portrait__scanline" aria-hidden="true" />
        </div>

        {/* Neon Handwritten Signature "Navneet Sinha" (matches reference screenshot) */}
        <div
          className="nf-portrait__signature-wrap"
          style={{
            transform: `translate3d(${parallax.moveX * 1.2}px, ${parallax.moveY * 1.2}px, 35px)`,
          }}
          aria-hidden="true"
        >
          <div className="nf-portrait__signature">
            <span className="nf-portrait__sig-text">Navneet</span>
            <span className="nf-portrait__sig-text nf-portrait__sig-text--last">Sinha</span>
            <svg className="nf-portrait__sig-flourish" viewBox="0 0 120 20" fill="none">
              <path
                d="M 5 12 Q 50 18 115 10"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

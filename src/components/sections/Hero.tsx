import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTypewriter } from '../../hooks/useTypewriter';
import { PERSONAL } from '../../data/portfolio';
import portraitSrc from '../../assets/about/photos/self.png';
import './Hero.css';

const ROLES = [
  'Full Stack Developer',
  'Frontend Engineer',
  'React Specialist',
  'WebSockets Enthusiast',
  'MERN Stack Developer',
];

interface HeroProps {
  onTerminalOpen: () => void;
}

export default function Hero({ onTerminalOpen }: HeroProps) {
  const role = useTypewriter({ strings: ROLES, speed: 70, deleteSpeed: 35, pause: 2000 });

  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const num01Ref = useRef<HTMLSpanElement>(null);
  const num02Ref = useRef<HTMLSpanElement>(null);
  const num03Ref = useRef<HTMLSpanElement>(null);
  const num04Ref = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Lerped current values
  const mouse = useRef({ nx: 0, ny: 0 });
  const current = useRef({
    portrait: { x: 0, y: 0, scale: 1 },
    n01: { x: 0, y: 0 },
    n02: { x: 0, y: 0 },
    n03: { x: 0, y: 0 },
    n04: { x: 0, y: 0 },
    glow: { x: 0, y: 0 },
  });

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Respect prefers-reduced-motion and touch devices
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (prefersReduced || isTouch) return;

    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouse.current.nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;  // [-1, 1]
      mouse.current.ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;  // [-1, 1]
    };

    const onMouseLeave = () => {
      mouse.current.nx = 0;
      mouse.current.ny = 0;
    };

    section.addEventListener('mousemove', onMouseMove, { passive: true });
    section.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // Layer strengths (px) — different for each element
    const PORTRAIT_STR = { x: 14, y: 10 };
    const N01_STR = { x: 38, y: 28 }; // foreground — repels
    const N02_STR = { x: 22, y: 18 }; // background
    const N03_STR = { x: 32, y: 24 }; // foreground
    const N04_STR = { x: 18, y: 14 }; // background

    // Lerp factor — lower = smoother/slower
    const LERP_PORTRAIT = 0.07;
    const LERP_FG = 0.055;
    const LERP_BG = 0.04;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const { nx, ny } = mouse.current;
      const c = current.current;

      // Portrait follows cursor (same direction)
      c.portrait.x = lerp(c.portrait.x, nx * PORTRAIT_STR.x, LERP_PORTRAIT);
      c.portrait.y = lerp(c.portrait.y, ny * PORTRAIT_STR.y, LERP_PORTRAIT);
      const dist = Math.sqrt(nx * nx + ny * ny);
      c.portrait.scale = lerp(c.portrait.scale, 1 + dist * 0.025, LERP_PORTRAIT);

      // Numbers repel from cursor (inverted direction)
      c.n01.x = lerp(c.n01.x, -nx * N01_STR.x, LERP_FG);
      c.n01.y = lerp(c.n01.y, -ny * N01_STR.y, LERP_FG);
      c.n02.x = lerp(c.n02.x, -nx * N02_STR.x, LERP_BG);
      c.n02.y = lerp(c.n02.y, -ny * N02_STR.y, LERP_BG);
      c.n03.x = lerp(c.n03.x, -nx * N03_STR.x, LERP_FG);
      c.n03.y = lerp(c.n03.y, -ny * N03_STR.y, LERP_FG);
      c.n04.x = lerp(c.n04.x, -nx * N04_STR.x, LERP_BG);
      c.n04.y = lerp(c.n04.y, -ny * N04_STR.y, LERP_BG);

      // Glow follows mouse directly
      c.glow.x = lerp(c.glow.x, nx * 20, LERP_PORTRAIT);
      c.glow.y = lerp(c.glow.y, ny * 20, LERP_PORTRAIT);

      // Apply transforms
      if (portraitRef.current) {
        gsap.set(portraitRef.current, {
          x: c.portrait.x,
          y: c.portrait.y,
          scale: c.portrait.scale,
        });
      }
      if (num01Ref.current) gsap.set(num01Ref.current, { x: c.n01.x, y: c.n01.y });
      if (num02Ref.current) gsap.set(num02Ref.current, { x: c.n02.x, y: c.n02.y });
      if (num03Ref.current) gsap.set(num03Ref.current, { x: c.n03.x, y: c.n03.y });
      if (num04Ref.current) gsap.set(num04Ref.current, { x: c.n04.x, y: c.n04.y });
      if (glowRef.current) {
        gsap.set(glowRef.current, { x: c.glow.x, y: c.glow.y });
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    rafRef.current = rafId;

    // Entrance animation for numbers
    const nums = [num01Ref.current, num02Ref.current, num03Ref.current, num04Ref.current];
    gsap.fromTo(
      nums,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.4,
        ease: 'expo.out',
        stagger: 0.15,
        delay: 0.4,
      }
    );

    gsap.fromTo(
      portraitRef.current,
      { autoAlpha: 0, scale: 0.92, y: 20 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: 0.2 }
    );

    return () => {
      section.removeEventListener('mousemove', onMouseMove);
      section.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero section noise-bg grid-bg"
      aria-label="Hero section"
    >
      {/* Gradient orbs */}
      <div className="hero__orb hero__orb--violet" aria-hidden="true" />
      <div className="hero__orb hero__orb--cyan" aria-hidden="true" />

      {/* ── Two-column cinematic layout ── */}
      <div className="hero__layout container">

        {/* LEFT — Text content (existing) */}
        <div className="hero__text-col">
          {/* Status badge */}
          <div className="hero__badge reveal" aria-label={`Status: ${PERSONAL.status}`}>
            <span className="hero__badge-dot" aria-hidden="true" />
            {PERSONAL.status}
          </div>

          {/* Main heading */}
          <h1 className="hero__name reveal" aria-label={`${PERSONAL.name}, Full Stack Developer`}>
            <span className="hero__name-line">NAVNEET</span>
            <span className="hero__name-line hero__name-line--accent">SINHA</span>
          </h1>

          {/* Typewriter role */}
          <div className="hero__role reveal" aria-live="polite" aria-label="Current role">
            <span className="hero__role-prefix" aria-hidden="true">&gt; </span>
            <span className="hero__role-text">{role}</span>
            <span className="hero__cursor" aria-hidden="true">█</span>
          </div>

          {/* Tagline */}
          <p className="hero__tagline reveal">
            Building scalable, interactive web experiences that live at the intersection
            of thoughtful engineering and beautiful design.
          </p>

          {/* CTA buttons */}
          <div className="hero__actions reveal stagger">
            <a
              href={PERSONAL.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </a>
            <a
              href={PERSONAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a
              href={PERSONAL.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Resume
            </a>
            <button
              className="btn btn-ghost"
              onClick={onTerminalOpen}
              aria-label="Open interactive terminal"
            >
              <span style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>&gt;_</span>
              Terminal
            </button>
          </div>

          {/* Meta bar */}
          <div className="hero__meta reveal" aria-hidden="true">
            <span className="hero__meta-item">
              <span className="hero__meta-label">LOC</span>
              {PERSONAL.location}
            </span>
            <span className="hero__meta-sep">·</span>
            <span className="hero__meta-item">
              <span className="hero__meta-label">STACK</span>
              MERN + Next.js + TypeScript
            </span>
            <span className="hero__meta-sep">·</span>
            <span className="hero__meta-item">
              <span className="hero__meta-label">STATUS</span>
              <span style={{ color: 'var(--green)' }}>● </span>
              {PERSONAL.status}
            </span>
          </div>
        </div>

        {/* RIGHT — Cinematic portrait scene */}
        <div className="hero__portrait-col" aria-hidden="true">
          <div className="hero__portrait-scene">

            {/* Ambient glow behind portrait */}
            <div ref={glowRef} className="hero__portrait-glow" />

            {/* BG depth ring */}
            <div className="hero__portrait-ring" />

            {/* Number 01 — top-left, foreground */}
            <span ref={num01Ref} className="hero__num hero__num--01" aria-hidden="true">01</span>

            {/* Number 02 — bottom-left, background */}
            <span ref={num02Ref} className="hero__num hero__num--02" aria-hidden="true">02</span>

            {/* Number 03 — top-right, foreground */}
            <span ref={num03Ref} className="hero__num hero__num--03" aria-hidden="true">03</span>

            {/* Number 04 — bottom-right, background */}
            <span ref={num04Ref} className="hero__num hero__num--04" aria-hidden="true">04</span>

            {/* Portrait image */}
            <div ref={portraitRef} className="hero__portrait-wrap">
              <img
                src={portraitSrc}
                alt="Navneet Sinha — Full Stack Developer"
                className="hero__portrait-img"
                draggable={false}
              />
              {/* Subtle vignette at base */}
              <div className="hero__portrait-base-fade" />
            </div>

            {/* Floating label */}
            <div className="hero__portrait-label">
              <span className="hero__portrait-label-line" />
              <span className="hero__portrait-label-text">NAVNEET SINHA</span>
              <span className="hero__portrait-label-sub">Full Stack Developer · New Delhi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        className="hero__scroll-cta"
        onClick={scrollToProjects}
        aria-label="Scroll to projects"
      >
        <span className="hero__scroll-text">Scroll</span>
        <span className="hero__scroll-arrow" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </span>
      </button>

      {/* Terminal hint (right column, only on desktop) */}
      <div className="hero__terminal-hint reveal-right" aria-hidden="true">
        <div className="hero__terminal-hint-bar">
          <span className="hero__terminal-hint-dot" style={{ background: '#ff5f57' }} />
          <span className="hero__terminal-hint-dot" style={{ background: '#ffbd2e' }} />
          <span className="hero__terminal-hint-dot" style={{ background: '#28ca41' }} />
        </div>
        <div className="hero__terminal-hint-body">
          <p><span className="ht-green">navneet</span><span className="ht-dim">@</span><span className="ht-cyan">portfolio</span><span className="ht-green"> ~ $</span></p>
          <p><span className="ht-dim">$ </span><span className="ht-white">git log --oneline</span></p>
          <p><span className="ht-violet">a3f9c2b</span><span className="ht-dim"> feat: SyncBoard real-time sync</span></p>
          <p><span className="ht-violet">b7e12d4</span><span className="ht-dim"> feat: Code Theft Auto leaderboard</span></p>
          <p><span className="ht-violet">c5a8f1e</span><span className="ht-dim"> feat: City Waste AI classification</span></p>
          <p><span className="ht-green">▊</span></p>
        </div>
      </div>
    </section>
  );
}

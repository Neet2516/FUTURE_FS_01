import { useEffect, useRef } from 'react';

export function useScrollReveal() {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Keep observing for re-animations on scroll up (optional: unobserve after first)
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
    elements.forEach((el) => observer.current?.observe(el));

    return () => observer.current?.disconnect();
  }, []);
}

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTypewriterOptions {
  strings: string[];
  speed?: number;
  deleteSpeed?: number;
  pause?: number;
}

export function useTypewriter({
  strings,
  speed = 80,
  deleteSpeed = 40,
  pause = 1800,
}: UseTypewriterOptions) {
  const [displayed, setDisplayed] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const tick = useCallback(() => {
    const current = strings[currentIndex];

    if (!isDeleting) {
      // Typing
      if (displayed.length < current.length) {
        setDisplayed(current.slice(0, displayed.length + 1));
        timeoutRef.current = setTimeout(tick, speed);
      } else {
        // Full string shown → pause then delete
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, pause);
      }
    } else {
      // Deleting
      if (displayed.length > 0) {
        setDisplayed(current.slice(0, displayed.length - 1));
        timeoutRef.current = setTimeout(tick, deleteSpeed);
      } else {
        // Empty → move to next string
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % strings.length);
      }
    }
  }, [displayed, currentIndex, isDeleting, strings, speed, deleteSpeed, pause]);

  useEffect(() => {
    timeoutRef.current = setTimeout(tick, speed);
    return () => clearTimeout(timeoutRef.current);
  }, [tick, speed]);

  return displayed;
}

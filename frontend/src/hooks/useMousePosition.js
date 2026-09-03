import { useState, useEffect, useRef } from 'react';

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0, enabled: true });
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const enabledRef = useRef(true);

  const checkEnabled = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const touchDevice = 'ontouchstart' in window;
    const narrowScreen = window.innerWidth < 768;
    const disabled = reducedMotion || coarsePointer || touchDevice || narrowScreen;
    enabledRef.current = !disabled;
    return !disabled;
  };

  const lerp = (start, end, factor) => start + (end - start) * factor;

  const loop = () => {
    if (!enabledRef.current) {
      currentRef.current.x = 0;
      currentRef.current.y = 0;
      setPosition({ x: 0, y: 0, enabled: false });
      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.08);
    currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.08);

    setPosition({
      x: currentRef.current.x,
      y: currentRef.current.y,
      enabled: true
    });

    rafRef.current = requestAnimationFrame(loop);
  };

  const handleMouseMove = (e) => {
    if (!enabledRef.current) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    targetRef.current.x = (e.clientX - w / 2) / (w / 2);
    targetRef.current.y = (e.clientY - h / 2) / (h / 2);
  };

  const handleResize = () => {
    checkEnabled();
  };

  useEffect(() => {
    const enabled = checkEnabled();
    if (!enabled) {
      setPosition({ x: 0, y: 0, enabled: false });
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return position;
};

export default useMousePosition;
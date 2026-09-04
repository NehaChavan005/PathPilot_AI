import React, { useEffect, useRef, useMemo } from 'react';
import './bubble-animation.css';

const BUBBLE_CONFIGS = [
  { id: 0, size: 12, color: 'rgba(255,255,255,0.45)', glow: 'rgba(255,255,255,0.3)', x: 0.05, speed: 0.42, sway: 55, swaySpeed: 0.0008, delay: 0 },
  { id: 1, size: 18, color: 'rgba(255,138,61,0.35)', glow: 'rgba(255,138,61,0.2)', x: 0.15, speed: 0.55, sway: 70, swaySpeed: 0.0006, delay: 2000 },
  { id: 2, size: 25, color: 'rgba(255,178,122,0.4)', glow: 'rgba(255,178,122,0.25)', x: 0.28, speed: 0.35, sway: 90, swaySpeed: 0.0005, delay: 4000 },
  { id: 3, size: 35, color: 'rgba(255,224,71,0.3)', glow: 'rgba(255,224,71,0.2)', x: 0.42, speed: 0.48, sway: 45, swaySpeed: 0.0009, delay: 1000 },
  { id: 4, size: 45, color: 'rgba(255,255,255,0.4)', glow: 'rgba(255,255,255,0.25)', x: 0.55, speed: 0.3, sway: 100, swaySpeed: 0.0004, delay: 6000 },
  { id: 5, size: 60, color: 'rgba(255,160,180,0.25)', glow: 'rgba(255,160,180,0.15)', x: 0.68, speed: 0.6, sway: 60, swaySpeed: 0.0007, delay: 3000 },
  { id: 6, size: 75, color: 'rgba(139,92,246,0.18)', glow: 'rgba(139,92,246,0.1)', x: 0.8, speed: 0.25, sway: 80, swaySpeed: 0.0003, delay: 5000 },
  { id: 7, size: 18, color: 'rgba(255,178,122,0.4)', glow: 'rgba(255,178,122,0.25)', x: 0.92, speed: 0.38, sway: 65, swaySpeed: 0.00065, delay: 7000 },
  { id: 8, size: 25, color: 'rgba(255,138,61,0.35)', glow: 'rgba(255,138,61,0.2)', x: 0.03, speed: 0.5, sway: 50, swaySpeed: 0.0008, delay: 8000 },
  { id: 9, size: 12, color: 'rgba(255,224,71,0.3)', glow: 'rgba(255,224,71,0.2)', x: 0.2, speed: 0.45, sway: 40, swaySpeed: 0.001, delay: 9000 },
  { id: 10, size: 35, color: 'rgba(255,255,255,0.35)', glow: 'rgba(255,255,255,0.2)', x: 0.5, speed: 0.55, sway: 110, swaySpeed: 0.00035, delay: 10000 },
  { id: 11, size: 18, color: 'rgba(255,178,122,0.35)', glow: 'rgba(255,178,122,0.2)', x: 0.75, speed: 0.4, sway: 55, swaySpeed: 0.0007, delay: 11000 },
];

const TOTAL_DURATION = 16000;

const FloatingBubbles = ({ authCardActive = false, authCardRect = null }) => {
  const canvasRef = useRef(null);
  const stateRef = useRef([]);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = mq.matches;
    const handler = (e) => { reducedRef.current = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const bubbles = useMemo(() => {
    return BUBBLE_CONFIGS.map((cfg) => ({
      ...cfg,
      baseX: 0,
      swayOffset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    stateRef.current = bubbles.map((b) => ({
      ...b,
      baseX: b.x * w,
      started: false,
    }));

    const cardCenter = { x: 0, y: 0 };
    let targetCardActive = false;
    let attractionStrength = 0;

    const loop = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      if (reducedRef.current) {
        ctx.clearRect(0, 0, w, h);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (authCardActive && authCardRect) {
        cardCenter.x = authCardRect.left + authCardRect.width / 2;
        cardCenter.y = authCardRect.top + authCardRect.height / 2;
        targetCardActive = true;
        attractionStrength = Math.min(1, attractionStrength + 0.015);
      } else {
        targetCardActive = false;
        attractionStrength = Math.max(0, attractionStrength - 0.01);
      }

      ctx.clearRect(0, 0, w, h);

      stateRef.current.forEach((bubble) => {
        if (bubble.delay > elapsed) return;

        const localTime = elapsed - bubble.delay;
        const cycle = localTime % TOTAL_DURATION;
        const progress = cycle / TOTAL_DURATION;

        let py = h + bubble.size - progress * (h + bubble.size + 80);
        let px = bubble.baseX + Math.sin(localTime * bubble.swaySpeed + bubble.swayOffset) * bubble.sway;

        if (attractionStrength > 0 && bubble.size >= 18) {
          const dx = cardCenter.x - px;
          const dy = cardCenter.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 500 && dist > 0) {
            const pull = (1 - dist / 500) * attractionStrength * 0.15;
            px += dx * pull;
            py += dy * pull;
          }
        }

        let alpha = 0;
        if (progress < 0.08) {
          alpha = progress / 0.08;
        } else if (progress < 0.45) {
          alpha = 1;
        } else if (progress < 0.85) {
          alpha = 1 - (progress - 0.45) / 0.4;
        } else {
          alpha = 0.15 * (1 - (progress - 0.85) / 0.15);
        }

        const maxAlpha = bubble.size > 40 ? 0.35 : bubble.size > 25 ? 0.5 : 0.65;
        alpha *= maxAlpha;

        if (alpha < 0.01) return;

        const r = bubble.size / 2;

        ctx.save();
        ctx.globalAlpha = alpha;

        const grad = ctx.createRadialGradient(px - r * 0.3, py - r * 0.3, 0, px, py, r * 1.2);
        grad.addColorStop(0, 'rgba(255,255,255,0.5)');
        grad.addColorStop(0.3, bubble.color);
        grad.addColorStop(0.7, bubble.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px - r * 0.25, py - r * 0.25, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, r * 1.15, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.shadowColor = bubble.glow;
        ctx.shadowBlur = r * 0.8;
        ctx.beginPath();
        ctx.arc(px, py, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fill();

        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [bubbles, authCardActive, authCardRect]);

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="auth-bubbles-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default FloatingBubbles;
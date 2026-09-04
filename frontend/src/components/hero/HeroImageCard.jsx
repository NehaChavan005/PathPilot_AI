import React, { useRef, useState, useEffect } from 'react';
import useMousePosition from '../../hooks/useMousePosition';
import './hero-image-card.css';

const PHOTO_SRC = 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=900&q=80&auto=format&fit=crop';

const HeroImageCard = () => {
  const cardRef = useRef(null);
  const { x: mx, y: my, enabled } = useMousePosition();
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [entrance, setEntrance] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setEntrance(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const photoParallax = enabled
    ? `translate3d(${mx * 8}px, ${my * 8}px, 0)`
    : 'translate3d(0, 0, 0)';

  const blobAParallax = enabled
    ? `translate3d(${mx * 14}px, ${my * 14}px, 0)`
    : 'translate3d(0, 0, 0)';

  const blobBParallax = enabled
    ? `translate3d(${mx * -10}px, ${my * -10}px, 0)`
    : 'translate3d(0, 0, 0)';

  const handleMouseMove = (e) => {
    if (!enabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rx = -py * 8;
    const ry = px * 8;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const isTilting = tilt.rx !== 0 || tilt.ry !== 0;
  const tiltTransition = isTilting
    ? 'transform 120ms ease-out'
    : 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)';

  const composedTransform = `
    perspective(1000px)
    rotateX(${tilt.rx}deg)
    rotateY(${tilt.ry}deg)
  `.replace(/\s+/g, ' ').trim();

  const entranceStyle = entrance
    ? { opacity: 1, transform: 'scale(1) translateY(0)' }
    : { opacity: 0, transform: 'scale(0.94) translateY(20px)' };

  const entranceTransition = entrance
    ? 'opacity 900ms cubic-bezier(0.22, 1, 0.36, 1), transform 900ms cubic-bezier(0.22, 1, 0.36, 1)'
    : 'none';

  return (
    <div
      ref={cardRef}
      className={`hero-card ${hovered ? 'is-hover' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: composedTransform,
        transition: tiltTransition,
        ...entranceStyle,
        transition: `${entranceTransition}, ${tiltTransition}, box-shadow 600ms cubic-bezier(0.22, 1, 0.36, 1)`
      }}
    >
      <div
        className="hero-blob hero-blob-a"
        aria-hidden="true"
        style={{ transform: blobAParallax }}
      />
      <div
        className="hero-blob hero-blob-b"
        aria-hidden="true"
        style={{ transform: blobBParallax }}
      />
      <div className="hero-glow" aria-hidden="true" />
      <div
        className="hero-photo"
        style={{ transform: photoParallax }}
      >
        <img
          src={PHOTO_SRC}
          alt="Young man in navy jacket standing in a golden grass field with mountains behind"
          draggable={false}
        />
        <div className="hero-sweep" aria-hidden="true" />
        <div className="hero-particles" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} className={`hero-particle p-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroImageCard;
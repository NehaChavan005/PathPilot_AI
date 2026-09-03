import React, { useRef, useEffect, useState } from 'react';
import './auth-hero-card.css';

const AuthHeroCard = ({ isActive = false }) => {
  const cardRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const blobARef = useRef(null);
  const blobBRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);

  const checkReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
           window.matchMedia('(pointer: coarse)').matches ||
           'ontouchstart' in window ||
           window.innerWidth < 768;
  };

  const handleMouseMove = (e) => {
    if (checkReducedMotion() || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rx = -py * 4;
    const ry = px * 4;
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

  const imageParallax = `translate3d(${tilt.ry * 2}px, ${-tilt.rx * 2}px, 0)`;
  const blobAParallax = `translate3d(${tilt.ry * 3}px, ${-tilt.rx * 3}px, 0)`;
  const blobBParallax = `translate3d(${tilt.ry * -2}px, ${-tilt.rx * -2}px, 0)`;

  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.style.transition = 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 600ms cubic-bezier(0.22, 1, 0.36, 1)';
      cardRef.current.style.boxShadow = '0 30px 60px -18px rgba(255, 138, 61, 0.25), 0 6px 18px rgba(37, 34, 92, 0.10)';
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.boxShadow = '0 10px 30px -12px rgba(37, 34, 92, 0.18), 0 2px 6px rgba(37, 34, 92, 0.05)';
        }
      }, 600);
    }
  }, [isActive]);

  return (
    <div className="auth-hero-section" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseEnter={() => setHovered(true)}>
      <div className="auth-hero-content">
        <div className="auth-hero-badge">
          <span className="auth-hero-badge-dot" aria-hidden="true" />
          IT & EDUCATION SERVICES
        </div>
        
        <h1 className="auth-hero-title">
          Accelerate Your <br />
          <span className="auth-hero-title-accent">Career Path</span>
        </h1>
        
        <p className="auth-hero-subtitle">
          Join 17,000+ professionals leveraging AI-driven insights to master new skills, build projects, and land their dream roles.
        </p>

        <div className="auth-hero-card-wrapper">
          <div
            ref={cardRef}
            className="auth-hero-card"
            style={{
              transform: composedTransform,
              transition: tiltTransition,
            }}
          >
            <div className="auth-hero-blobs">
              <div
                ref={blobARef}
                className="auth-hero-blob auth-hero-blob-a"
                aria-hidden="true"
                style={{ transform: blobAParallax }}
              />
              <div
                ref={blobBRef}
                className="auth-hero-blob auth-hero-blob-b"
                aria-hidden="true"
                style={{ transform: blobBParallax }}
              />
              <div className="auth-hero-glow" aria-hidden="true" />
            </div>

            <div
              ref={imageWrapperRef}
              className="auth-hero-image-wrapper"
              style={{ transform: imageParallax }}
            >
              <img
                src="/hero-student.png"
                alt="Young professional in tech career environment"
                draggable={false}
              />
              <div className="auth-hero-sweep" aria-hidden="true" />
              <div className="auth-hero-particles" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <span key={i} className={`auth-hero-particle p-${i}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-hero-copyright">
        © 2026 PathPilot AI Systems. All rights reserved.
      </div>
    </div>
  );
};

export default AuthHeroCard;
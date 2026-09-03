import React, { useRef } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';
import './hero-image-card.css';

export default function HeroImageCard() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  const isHovered = useMousePosition(cardRef, containerRef);

  return (
    <div className="hero-wrapper-outer">
      <div className="hero-entrance-wrapper">
        <div className="hero-float-wrapper">
          <div className="hero-container" ref={containerRef}>

            <div
              className={`hero-card ${isHovered ? 'is-hovered' : ''}`}
              ref={cardRef}
            >
              <div className="hero-blob hero-blob-a" aria-hidden="true" />
              <div className="hero-blob hero-blob-b" aria-hidden="true" />

              <div className="hero-glow" aria-hidden="true" />

              <div className="hero-photo-tile">
                <img
                  src="https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1000&auto=format&fit=crop"
                  alt="Young man in a navy jacket, back to camera, standing in golden grass with mountains in background"
                  className="hero-photo"
                  draggable={false}
                />

                <div className="hero-glass-sweep" aria-hidden="true" />

                <div className="hero-particles" aria-hidden="true">
                  <span className="hero-particle" />
                  <span className="hero-particle" />
                  <span className="hero-particle" />
                  <span className="hero-particle" />
                  <span className="hero-particle" />
                  <span className="hero-particle" />
                  <span className="hero-particle" />
                  <span className="hero-particle" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
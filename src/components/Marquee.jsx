import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  'Web design',
  'Creative development',
  'Motion',
  'Interaction'
];

export default function Marquee() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    let x = 0;
    let dir = -1; // -1 for leftward movement by default
    let boost = 0;
    let halfWidth = track.scrollWidth / 2;

    const updateHalfWidth = () => {
      halfWidth = track.scrollWidth / 2;
    };
    window.addEventListener('resize', updateHalfWidth);

    // ScrollTrigger to detect scroll velocity and direction
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        dir = self.direction === 1 ? -1 : 1;
        const velocity = Math.abs(self.getVelocity());
        boost = Math.min(velocity / 120, 14);
      }
    });

    // Ticker loop
    const tickerCallback = () => {
      x += (1.1 + boost) * dir;
      boost *= 0.92;

      // Wrap at half track width
      if (halfWidth > 0) {
        if (x <= -halfWidth) {
          x += halfWidth;
        } else if (x >= 0) {
          x -= halfWidth;
        }
      }

      track.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    gsap.ticker.add(tickerCallback);

    return () => {
      gsap.ticker.remove(tickerCallback);
      st.kill();
      window.removeEventListener('resize', updateHalfWidth);
    };
  }, []);

  return (
    <div className="marquee-section" ref={containerRef} aria-hidden="true">
      <div className="marquee-track" ref={trackRef}>
        {/* Rendered twice for seamless wrap */}
        {[...ITEMS, ...ITEMS].map((item, idx) => (
          <span key={idx} className="marquee-item">
            {item}
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

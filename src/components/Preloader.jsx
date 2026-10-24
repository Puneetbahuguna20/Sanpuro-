import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useLenis } from '../context/LenisContext';
import useReducedMotion from '../hooks/useReducedMotion';

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    if (lenis) lenis.stop();

    const counterObj = { val: 0 };
    const counterEl = counterRef.current;
    const containerEl = containerRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        if (lenis) lenis.start();
      }
    });

    // 0 -> 100 over 1.4s (power2.inOut)
    tl.to(counterObj, {
      val: 100,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterEl) {
          counterEl.textContent = String(Math.round(counterObj.val)).padStart(3, '0');
        }
      }
    });

    // 0.1s pause
    tl.to({}, { duration: 0.1 });

    // slide up yPercent -100 (0.9s, expo.inOut)
    // Call onComplete 0.35s before slide ends
    tl.to(containerEl, {
      yPercent: -100,
      duration: 0.9,
      ease: 'expo.inOut'
    });

    // Call onComplete 0.35s before slide ends
    tl.add(() => {
      if (onComplete) onComplete();
    }, '-=0.35');

    return () => {
      tl.kill();
      if (lenis) lenis.start();
    };
  }, [lenis, onComplete, reducedMotion]);

  if (reducedMotion) {
    return null;
  }

  return (
    <div className="preloader" ref={containerRef} aria-hidden="true">
      <div className="preloader-label">SanPuRo — Portfolio</div>
      <div className="preloader-counter" ref={counterRef}>
        000
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import useIsTouch from '../hooks/useIsTouch';

export default function FloatingPreview() {
  const isTouch = useIsTouch();
  const elRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (isTouch) return;

    const el = elRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleEnter = (e) => {
      const { color, label } = e.detail || {};
      el.style.backgroundColor = color || '#F5F5F7';
      if (labelRef.current) {
        labelRef.current.textContent = label || '';
      }

      const randomRot = (Math.random() - 0.5) * 12; // random(-6, 6)
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        rotate: randomRot,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        opacity: 0,
        scale: 0.6,
        duration: 0.4,
        ease: 'power3.in',
        overwrite: 'auto'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('floating-preview:enter', handleEnter);
    window.addEventListener('floating-preview:leave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('floating-preview:enter', handleEnter);
      window.removeEventListener('floating-preview:leave', handleLeave);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div className="floating-preview" ref={elRef} aria-hidden="true">
      <div className="floating-preview-label" ref={labelRef}>
        [PROJECT 01 IMAGE]
      </div>
    </div>
  );
}

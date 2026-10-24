import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import useIsTouch from '../hooks/useIsTouch';

export default function Cursor() {
  const isTouch = useIsTouch();
  const cursorRef = useRef(null);
  const [cursorType, setCursorType] = useState('default'); // 'default', 'link', 'view'

  useEffect(() => {
    if (isTouch) return;

    const el = cursorRef.current;
    if (!el) return;

    // Quick setters for smooth follow
    const xTo = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power3' });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    // Event delegation for data-cursor
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const type = target.getAttribute('data-cursor');
        if (type === 'view') {
          setCursorType('view');
        } else if (type === 'link') {
          setCursorType('link');
        } else {
          setCursorType('default');
        }
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isTouch]);

  if (isTouch) return null;

  let modifierClass = '';
  if (cursorType === 'link') modifierClass = 'cursor-link';
  if (cursorType === 'view') modifierClass = 'cursor-view';

  return (
    <div className={`custom-cursor ${modifierClass}`} ref={cursorRef} aria-hidden="true">
      <span className="cursor-text">View</span>
    </div>
  );
}

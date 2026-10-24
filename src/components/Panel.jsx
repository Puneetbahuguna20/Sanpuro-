import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Panel({ children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          clipPath: 'inset(0% 4% 0% 4% round 28px 28px 0 0)'
        },
        {
          clipPath: 'inset(0% 0% 0% 0% round 28px 28px 0 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'top 30%',
            scrub: true
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div className="panel-wrapper" ref={panelRef}>
      {children}
    </div>
  );
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }) {
  const [lenis, setLenis] = useState(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const instance = new Lenis({
      lerp: 0.09,
      smoothWheel: true
    });

    instance.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    // Global interceptor for smooth anchor links: #work, #about, #contact, #name, #top
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            instance.scrollTo(target, { duration: 1.4 });
          }
        } else if (href === '#top') {
          e.preventDefault();
          instance.scrollTo(0, { duration: 1.4 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tickerCallback);
      instance.destroy();
      setLenis(null);
    };
  }, [reducedMotion]);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}

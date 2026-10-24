import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const INTRO_TEXT = "At SANPURO, we turn ideas into digital solutions that help businesses streamline operations, automate repetitive tasks, and grow with confidence.";

export default function Intro() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to('.intro-word', {
        color: '#F5F5F7',
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 45%',
          scrub: true
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const words = INTRO_TEXT.split(' ');

  return (
    <section className="intro-section" id="intro" ref={sectionRef}>
      <div className="container">
        <div className="intro-label">(Hello)</div>

        <p className="intro-text" aria-label={INTRO_TEXT}>
          {words.map((word, i) => (
            <span key={i} className="intro-word" aria-hidden="true">
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Two stacked copies of the letter (normal over inverted); hover rolls to the inverted one
function Roll({ char }) {
  return (
    <span className="name-roll">
      <span className="name-roll-face">{char}</span>
      <span className="name-roll-face name-roll-alt">{char}</span>
    </span>
  );
}

export default function NameHero() {
  const containerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState('');

  // Live Kolkata clock updated every 15s
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });

    const updateClock = () => {
      setCurrentTime(formatter.format(new Date()));
    };

    updateClock();
    const interval = setInterval(updateClock, 15000);
    return () => clearInterval(interval);
  }, []);

  // GSAP ScrollTrigger for letters and rows
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Letters animation at "top 75%"
      gsap.from('.name-letter', {
        yPercent: 110,
        rotate: 6,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.035,
        scrollTrigger: {
          trigger: el,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

      // Top and bottom rows animation at "top 70%"
      gsap.from(['.name-top-row', '.name-bottom-row'], {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: el,
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const firstLetters = "IDEAS".split('');
  // Non-breaking space so the gap survives inside an inline-block letter span
  const lastLetters = "TO REALITY".split('');

  return (
    <section className="name-hero" id="name" ref={containerRef}>
      <div className="container name-hero-inner">
        {/* Top Row */}
        <div className="name-top-row">
          <span>Designer &amp; creative developer</span>
          <span>New Delhi · {currentTime || '12:00'} IST</span>
        </div>

        {/* Big H1 Split Letters */}
        <h1 className="name-title-wrap" aria-label="Ideas to Reality">
          <span className="name-line-block" aria-hidden="true">
            {firstLetters.map((char, i) => (
              <span key={`f-${i}`} className="name-letter">
                <Roll char={char} />
              </span>
            ))}
          </span>
          <span className="name-line-block" aria-hidden="true">
            {lastLetters.map((char, i) => (
              <span key={`l-${i}`} className="name-letter">
                <Roll char={char} />
              </span>
            ))}
          </span>
        </h1>

        {/* Bottom Row */}
        <div className="name-bottom-row">
          <p className="name-desc">
            We build premium websites, custom software, mobile applications, and business automation solutions tailored to your needs.
          </p>

          <a href="#intro" className="name-scroll-cue" data-cursor="link">
            <div className="name-scroll-track" aria-hidden="true">
              <div className="name-scroll-bar" />
            </div>
            <span>Scroll</span>
          </a>
        </div>
      </div>
    </section>
  );
}

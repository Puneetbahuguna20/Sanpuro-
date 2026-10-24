import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  { n: '01', title: '[Project one]', meta: 'Website · Dev', c: '#F5F5F7' },
  { n: '02', title: '[Project two]', meta: 'Brand · Web', c: '#9296A3' },
  { n: '03', title: '[Project three]', meta: 'WebGL · 3D', c: '#F5F5F7' },
  { n: '04', title: '[Project four]', meta: 'E-commerce', c: '#9296A3' },
  { n: '05', title: '[Project five]', meta: 'Motion', c: '#F5F5F7' }
];

export default function Work() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const rows = el.querySelectorAll('.work-row');
      rows.forEach((row) => {
        const title = row.querySelector('.work-row-title');
        if (title) {
          gsap.fromTo(
            title,
            { xPercent: -6 },
            {
              xPercent: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top bottom',
                end: 'top 60%',
                scrub: true
              }
            }
          );
        }
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (p) => {
    window.dispatchEvent(
      new CustomEvent('floating-preview:enter', {
        detail: {
          color: p.c,
          label: `[PROJECT ${p.n} IMAGE]`
        }
      })
    );
  };

  const handleMouseLeave = () => {
    window.dispatchEvent(new CustomEvent('floating-preview:leave'));
  };

  return (
    <section className="work-section" id="work" ref={containerRef}>
      <div className="container">
        {/* Header Row */}
        <div className="work-header">
          <span>Selected work</span>
          <span>[YEAR]–2026</span>
        </div>

        {/* Projects List */}
        <div className="work-list">
          {PROJECTS.map((p) => (
            <a
              key={p.n}
              href={`#project-${p.n}`}
              className="work-row"
              data-cursor="view"
              style={{ '--c': p.c }}
              onMouseEnter={() => handleMouseEnter(p)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="work-row-num">{p.n}</div>
              <h3 className="work-row-title">{p.title}</h3>
              <div className="work-row-meta">
                <span className="work-row-dot" aria-hidden="true" />
                <span>{p.meta}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useIsTouch from '../hooks/useIsTouch';
import smartPhotographyImg from '../assets/smart-photography.jpg';
import vantaOpticsImg from '../assets/vanta-optics.jpg';
import mittiHouseImg from '../assets/mitti-house.jpg';
import astrostarlightImg from '../assets/astrostarlight.jpg';
import shreeMilletsImg from '../assets/shree-millets.jpg';
import charakAyurvedaImg from '../assets/charak-ayurveda.jpg';
import chatwithClientImg from '../assets/chatwithclient.jpg';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    n: '01',
    title: 'Smart Photography',
    meta: 'Wedding Photography · Web',
    c: '#F5F5F7',
    url: 'https://smart-photography-two.vercel.app/',
    img: smartPhotographyImg
  },
  {
    n: '02',
    title: 'Mitti House',
    meta: 'Café · Web',
    c: '#9296A3',
    url: 'https://mitti-house-two.vercel.app/',
    img: mittiHouseImg
  },
  {
    n: '03',
    title: 'Astrostarlight',
    meta: 'Jewellery · E-commerce',
    c: '#F5F5F7',
    url: 'https://astro-ecom-chi.vercel.app/',
    img: astrostarlightImg
  },
  {
    n: '04',
    title: 'Shree Millets',
    meta: 'Food · E-commerce',
    c: '#9296A3',
    url: 'https://shree-millets.vercel.app/',
    img: shreeMilletsImg
  },
  {
    n: '05',
    title: 'Charak Ayurveda',
    meta: 'Ayurveda · Brand Web',
    c: '#F5F5F7',
    url: 'https://charakayurvedademo.vercel.app/',
    img: charakAyurvedaImg
  },
  {
    n: '06',
    title: 'ChatwithClient',
    meta: 'SaaS · Web App',
    c: '#9296A3',
    url: 'https://chatwithclient.in/',
    img: chatwithClientImg
  },
  {
    n: '07',
    title: 'VANTA Optics',
    meta: 'Eyewear · 3D Web',
    c: '#F5F5F7',
    url: 'https://vantooptics.vercel.app/',
    img: vantaOpticsImg
  }
];

export default function Work() {
  const containerRef = useRef(null);
  const isTouch = useIsTouch();

  // Touch screens can't hover: the row crossing the middle of the screen becomes
  // active instead, showing the same highlight plus an inline preview
  useEffect(() => {
    const el = containerRef.current;
    if (!isTouch || !el) return;
    const rows = [...el.querySelectorAll('.work-row')];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => en.target.classList.toggle('is-active', en.isIntersecting));
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    rows.forEach((row) => io.observe(row));
    return () => {
      io.disconnect();
      rows.forEach((row) => row.classList.remove('is-active'));
    };
  }, [isTouch]);

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
          image: p.img,
          label: p.img ? '' : `[PROJECT ${p.n} IMAGE]`
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
              href={p.url || `#project-${p.n}`}
              {...(p.url ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
              {/* Inline preview, shown only on touch screens (desktop uses FloatingPreview) */}
              <span
                className="work-row-preview"
                aria-hidden="true"
                style={p.img ? { backgroundImage: `url(${p.img})` } : undefined}
              >
                {!p.img && (
                  <span className="work-row-preview-label">{`[PROJECT ${p.n} IMAGE]`}</span>
                )}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

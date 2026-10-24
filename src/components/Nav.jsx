import React, { useEffect, useState } from 'react';
import logo from '../assets/sanpuro-logo.png';
import { useLenis } from '../context/LenisContext';

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' }
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  // Freeze page scroll while the phone menu is open; Esc closes it
  useEffect(() => {
    if (!open) return;
    if (lenis) lenis.stop();
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      if (lenis) lenis.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [open, lenis]);

  return (
    <>
      <nav className="nav" aria-label="Main Navigation">
        <div className="container nav-inner">
          <a href="#top" className="nav-brand" data-cursor="link" aria-label="SanPuRo home">
            <img src={logo} alt="SanPuRo" className="nav-logo" />
          </a>

          <div className="nav-links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nav-link" data-cursor="link">
                {l.label}
              </a>
            ))}
          </div>

          {/* Phones: hamburger opens a full-screen menu */}
          <button
            type="button"
            className={`nav-burger${open ? ' is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Outside <nav> so the nav's blend mode doesn't apply to it */}
      <div id="nav-menu" className={`nav-menu${open ? ' is-open' : ''}`} aria-hidden={!open}>
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="nav-menu-link"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}

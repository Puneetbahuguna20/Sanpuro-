import React from 'react';
import logo from '../assets/sanpuro-logo.png';

export default function Nav() {
  return (
    <nav className="nav" aria-label="Main Navigation">
      <div className="container nav-inner">
        <a href="#top" className="nav-brand" data-cursor="link" aria-label="SanPuRo home">
          <img src={logo} alt="SanPuRo" className="nav-logo" />
        </a>

        <div className="nav-links">
          <a href="#work" className="nav-link" data-cursor="link">
            Work
          </a>
          <a href="#about" className="nav-link" data-cursor="link">
            About
          </a>
          <a href="#contact" className="nav-link" data-cursor="link">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}

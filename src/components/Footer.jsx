import React from 'react';

export default function Footer() {
  return (
    <footer className="footer" aria-label="Footer">
      <div>&copy; 2026 SanPuRo</div>

      <div className="footer-links">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          data-cursor="link"
        >
          Instagram
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          data-cursor="link"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          data-cursor="link"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}

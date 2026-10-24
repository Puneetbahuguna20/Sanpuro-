import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from './Footer';
import useIsTouch from '../hooks/useIsTouch';

gsap.registerPlugin(ScrollTrigger);

const EMAIL = '[you@yourmail.com]';

export default function Contact() {
  const [copyStatus, setCopyStatus] = useState(''); // '', ' — copied', ' — selected'
  const isTouch = useIsTouch();

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const emailRef = useRef(null);
  const buttonRef = useRef(null);

  // Scrubbed Scale animation on H2
  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading,
        { scale: 0.86, transformOrigin: 'left bottom' },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 20%',
            scrub: true
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Magnetic Button Effect (Desktop only)
  useEffect(() => {
    if (isTouch) return;
    const btn = buttonRef.current;
    if (!btn) return;

    const onMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.35;
      const deltaY = (e.clientY - centerY) * 0.35;

      gsap.to(btn, {
        x: deltaX,
        y: deltaY,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    };

    const onMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto'
      });
    };

    btn.addEventListener('mousemove', onMouseMove);
    btn.addEventListener('mouseleave', onMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', onMouseMove);
      btn.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isTouch]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopyStatus(' — copied');
      setTimeout(() => setCopyStatus(''), 1800);
    } catch {
      // Fallback: select email text
      if (emailRef.current) {
        const range = document.createRange();
        range.selectNodeContents(emailRef.current);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      setCopyStatus(' — selected');
      setTimeout(() => setCopyStatus(''), 1800);
    }
  };

  return (
    <section className="contact-section" id="contact" ref={sectionRef}>
      <div className="container contact-inner">
        <div>
          <div className="contact-label">Have a project in mind? Let's discuss your ideas and turn them into practical digital solutions.</div>
          <h2 className="contact-h2" ref={headingRef}>
            <div>LET'S BUILD</div>
            <div>GREAT THINGS.</div>
          </h2>
        </div>

        <div className="contact-row">
          <div className="contact-email" ref={emailRef}>
            {EMAIL}
          </div>

          <button
            className="copy-email-btn"
            ref={buttonRef}
            onClick={handleCopyEmail}
            data-cursor="link"
            aria-label="Copy email address"
          >
            Copy email
            <span aria-live="polite">{copyStatus}</span>
          </button>
        </div>

        {/* Footer inside Contact */}
        <Footer />
      </div>
    </section>
  );
}

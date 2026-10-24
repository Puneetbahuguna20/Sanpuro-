import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLenis } from '../../context/LenisContext';
import useReducedMotion from '../../hooks/useReducedMotion';
import './SlideStack.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EMAIL = '[you@yourmail.com]';

// Name split into letters; `serif` marks letters set in the serif face
const NAME_LINES = [
  [...'SanPuRo'].map((ch, i) => ({ ch, serif: i === 0 || i === 3 })),
  [...'Studio'].map(ch => ({ ch, serif: false }))
];

const STEPS = [
  { num: '01', label: 'Discover', lead: 'Understand your', serif: 'business', text: 'We learn your goals, your customers and the tasks that slow your team down.' },
  { num: '02', label: 'Design', lead: 'Plan the', serif: 'solution', text: 'Websites, apps and dashboards you can click through before we build them.' },
  { num: '03', label: 'Build', lead: 'Launch &', serif: 'automate', text: 'Fast, reliable software and automations that keep working after go-live.' }
];

// Timeline layout (in timeline seconds): each slide transition lasts 1
const SLIDE = 1;
const INTRO_HOLD = 0.6; // intro panel stays put for this long after pinning
const LABEL_B = 2.2; // yellow → white
const LABEL_C = LABEL_B + 2.6; // white → contact
const HOLD = 0.4;

export default function SlideStack() {
  const rootRef = useRef(null);
  const tlRef = useRef(null);
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      if (reducedMotion) return;

      const stack = rootRef.current;
      const q = gsap.utils.selector(stack);
      const panels = q('.ss-panel');
      const radius = () => gsap.utils.clamp(16, 28, window.innerWidth * 0.02);

      // ---------- Intro entrance (plays once) ----------
      gsap.set(q('.ss-line-v'), { scaleY: 0, transformOrigin: 'top center' });
      gsap.set(q('.ss-line-h, .ss-bar'), { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(q('.ss-letter'), { yPercent: 110 });
      gsap.set(q('.ss-shape'), { scale: 0 });
      gsap.set(q('.ss-intro-fade'), { opacity: 0, y: 20 });

      const intro = gsap
        .timeline({ paused: true })
        .to(q('.ss-line-v'), { scaleY: 1, duration: 1.1, ease: 'power3.inOut' })
        .to(q('.ss-line-h, .ss-bar'), { scaleX: 1, duration: 1.1, ease: 'power3.inOut', stagger: 0.1 }, '<0.15')
        .to(q('.ss-letter'), { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.03 }, '-=0.6')
        .to(q('.ss-intro-fade'), { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, '-=0.8')
        .to(q('.ss-shape'), { scale: 1, duration: 0.9, ease: 'back.out(1.8)', stagger: 0.08 }, '-=0.7');

      ScrollTrigger.create({
        trigger: stack,
        start: 'top 70%',
        once: true,
        onEnter: () => intro.play()
      });

      // ---------- The stack ----------
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stack,
          start: 'top top',
          // Phones and tablets get a shorter pin so each slide needs less swiping
          end: () => '+=' + tl.duration() * window.innerHeight * (window.innerWidth < 1024 ? 0.45 : 0.9),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
      tlRef.current = tl;

      // fromTo everywhere: invalidateOnRefresh re-records start values, so from()/to()
      // would pick up mid-scroll state after a resize
      const slide = (i, at) => {
        tl.fromTo(
          panels[i],
          { xPercent: 0 },
          { xPercent: -100, duration: SLIDE, immediateRender: false },
          at
        )
          .fromTo(
            panels[i],
            { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
            {
              borderTopRightRadius: radius,
              borderBottomRightRadius: radius,
              duration: SLIDE / 4,
              immediateRender: false
            },
            at
          )
          .fromTo(panels[i + 1], { xPercent: 35 }, { xPercent: 0, duration: SLIDE }, at);
      };

      // a: intro → yellow
      const a = INTRO_HOLD;
      slide(0, a);
      tl.fromTo(
        q('.ss-y-row'),
        { xPercent: 18, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
        a + 0.2
      );
      tl.fromTo(
        q('.ss-y-giant'),
        { x: () => window.innerWidth * 0.25 },
        { x: () => -window.innerWidth * 0.55, duration: LABEL_B + SLIDE - a },
        a
      );

      // b: yellow → white
      const b = a + LABEL_B;
      slide(1, b);
      const headline = q('.ss-w-headline')[0];
      tl.fromTo(headline, { x: () => window.innerWidth * 0.2 }, { x: 0, duration: SLIDE }, b);
      tl.fromTo(
        headline,
        { x: 0 },
        {
          immediateRender: false,
          // Scroll left until the end of the longest line is in view
          x: () => -Math.max(0, headline.scrollWidth - (window.innerWidth - 2 * headline.offsetLeft)),
          duration: LABEL_C - b - SLIDE
        },
        b + SLIDE
      );

      // c: white → contact
      const c = b + (LABEL_C - LABEL_B);
      slide(2, c);
      tl.fromTo(
        q('.ss-c-item'),
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
        c + 0.3
      );
      tl.to({}, { duration: HOLD });
    },
    { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true }
  );

  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll to the moment the yellow panel is fully in
  const readApproach = () => {
    const tl = tlRef.current;
    const st = tl && tl.scrollTrigger;
    if (!st) {
      rootRef.current.querySelector('.ss-yellow').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const pos = st.start + (st.end - st.start) * ((INTRO_HOLD + SLIDE) / tl.duration());
    if (lenis) {
      lenis.scrollTo(pos, { duration: 1.4 });
    } else {
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  };

  const backToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable; the address stays visible below the pills
    }
  };

  return (
    <section
      className={`ss-stack${reducedMotion ? ' ss-static' : ''}`}
      id="stack"
      ref={rootRef}
    >
      {/* 1. Black intro */}
      <div className="ss-panel ss-intro">
        <span className="ss-line ss-line-v" aria-hidden="true" />
        <span className="ss-line ss-line-h" aria-hidden="true" />
        <span className="ss-bar" aria-hidden="true" />

        <div className="ss-intro-aside">
          <h2 className="ss-aside-title ss-intro-fade">
            Ideas into <span className="ss-serif">reality</span>
          </h2>
          {/* A button, not an anchor: the site-wide Lenis anchor handler would hijack "#..." links */}
          <button type="button" className="ss-aside-link ss-intro-fade" onClick={readApproach} data-cursor="link">
            See how we work →
          </button>
        </div>

        <div className="ss-intro-name">
          <p className="ss-kicker ss-intro-fade">Software &amp; Web Studio · New Delhi</p>
          <h1 className="ss-name" aria-label="SanPuRo Studio">
            {NAME_LINES.map((line, li) => (
              <span className="ss-name-line" key={li} aria-hidden="true">
                {line.map(({ ch, serif }, i) => (
                  <span key={i} className={`ss-letter${serif ? ' ss-serif' : ''}`}>
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        <div className="ss-shapes" aria-hidden="true">
          {[1, 2, 3, 4].map(n => (
            <span className={`ss-shape ss-shape-${n}`} key={n}>
              <span className="ss-shape-fill" />
            </span>
          ))}
        </div>
      </div>

      {/* 2. Yellow approach */}
      <div className="ss-panel ss-yellow">
        <div className="ss-y-rows">
          {STEPS.map(step => (
            <div className="ss-y-row" key={step.num}>
              <span className="ss-num">{step.num}</span>
              <span className="ss-y-label">{step.label}</span>
              <div className="ss-y-body">
                <h3 className="ss-y-heading">
                  {step.lead} <span className="ss-serif">{step.serif}</span>
                </h3>
                <p className="ss-y-text">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="ss-y-giant" aria-hidden="true">
          Ideas into reality · Ideas into reality ·
        </div>
      </div>

      {/* 3. White about */}
      <div className="ss-panel ss-white">
        <h2 className="ss-w-headline">
          <span>
            Builder <span className="ss-serif">of</span> Smart Software
          </span>
          <span>And Maker of Bold Websites</span>
        </h2>
        <div className="ss-portrait">[Portrait]</div>
        <div className="ss-w-copy">
          <p className="ss-w-lead">
            We build websites, custom software, mobile apps and automations that help businesses
            work faster.
          </p>
          <p className="ss-w-note">
            CRM, business automation, web development, 3D and digital consulting, all from one team in
            New Delhi.
          </p>
        </div>
      </div>

      {/* 4. White contact */}
      <div className="ss-panel ss-contact">
        <h2 className="ss-c-title ss-c-item">
          Let's build the <span className="ss-serif">next</span>
          <br />
          <span className="ss-serif">big thing</span> together
        </h2>
        <div className="ss-c-pills ss-c-item">
          {['Keep', 'In', 'Touch'].map(word => (
            <button
              type="button"
              className={`ss-c-pill ss-c-pill-${word.toLowerCase()}`}
              key={word}
              onClick={copyEmail}
              data-cursor="link"
              aria-label={`Copy email address (${word})`}
            >
              {word}
            </button>
          ))}
        </div>
        <p className="ss-c-email ss-c-item" aria-live="polite">
          {copied ? 'Copied to clipboard' : EMAIL}
        </p>
        <a href="#contact" className="ss-c-news ss-c-item" data-cursor="link">
          Subscribe to the Newsletter →
        </a>
        <div className="ss-c-footer">
          <span>© 2026 SanPuRo</span>
          <span>New Delhi, India</span>
          <button type="button" onClick={backToTop} data-cursor="link">
            Back to top ↑
          </button>
        </div>
      </div>
    </section>
  );
}

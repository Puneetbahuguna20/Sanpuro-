import { useEffect, useRef, useState } from 'react';
import aboutCards from './aboutCards';
import { useLenis } from '../../context/LenisContext';
import './AboutMap.css';

/*
  About section: a window onto a big collage map.
  Desktop: the map follows the mouse. Touch: drag to pan.
  Click a bubble to open its detail card (texts live in aboutCards.js).
*/

const W = '#F5F5F7';
const G = '#9296A3';
const T = '#24252B';
const B = '#000000';

const NODES = [
  { id: 'who', label: 'Who we are', pos: { left: '24%', top: '16%' } },
  { id: 'build', label: 'What we build', pos: { left: '58%', top: '12%' } },
  { id: 'how', label: 'How we work', pos: { left: '74%', top: '44%' } },
  { id: 'why', label: 'Why Sanpuro', pos: { left: '44%', top: '66%' } },
  { id: 'stack', label: 'Our stack', pos: { left: '8%', top: '52%' } },
  { id: 'values', label: 'Values', pos: { left: '20%', top: '80%' } },
];

function NodeArt({ id }) {
  if (id === 'who') {
    return (
      <span className="am-paper" style={{ left: 40, top: 30, width: 250, height: 170, transform: 'rotate(-4deg)', padding: 12 }}>
        <svg viewBox="0 0 226 146" width="100%" height="100%" fill="none" stroke={B} strokeWidth="2">
          <rect x="10" y="40" width="60" height="96" rx="30" fill={G} stroke="none" />
          <circle cx="40" cy="30" r="18" fill={B} />
          <rect x="84" y="56" width="60" height="80" rx="30" fill={T} stroke="none" />
          <circle cx="114" cy="44" r="16" fill={G} />
          <rect x="158" y="48" width="58" height="88" rx="29" fill={G} stroke="none" />
          <circle cx="187" cy="36" r="17" fill={B} />
          <path d="M0 136h226" />
        </svg>
      </span>
    );
  }
  if (id === 'build') {
    return (
      <>
        <span className="am-term" style={{ left: 70, top: 40, width: 250, transform: 'rotate(5deg)' }}>
          {'const '}<b>sanpuro</b>{' = {\n  websites: '}<b>true</b>{',\n  apps:     '}<b>true</b>{',\n  software: '}<b>true</b>{',\n  automate: '}<b>"everything"</b>{'\n};'}
        </span>
        <svg className="am-spin" style={{ position: 'absolute', left: 0, top: 150, width: 110, height: 110 }} viewBox="0 0 100 100" fill="none" stroke={W} strokeWidth="3">
          <path d="M50 8l6 12 13-4 2 13 13 4-5 12 10 9-11 8 3 13-13 1-4 13-12-6-11 8-6-12-13 0 2-13-12-6 8-11-8-11 12-6-2-13 13 0 6-12z" />
          <circle cx="50" cy="50" r="14" />
        </svg>
      </>
    );
  }
  if (id === 'how') {
    return (
      <span className="am-paper" style={{ left: 20, top: 30, width: 210, height: 220, transform: 'rotate(4deg)', padding: '18px 16px' }}>
        <svg viewBox="0 0 178 184" width="100%" height="100%" fill="none" stroke={B} strokeWidth="2">
          <path d="M0 22h178M0 68h178M0 114h178M0 160h178" stroke={G} />
          <path d="M6 14l5 5 9-11M6 60l5 5 9-11M6 106l5 5 9-11" strokeWidth="3" />
          <rect x="6" y="146" width="12" height="12" />
          <path d="M30 16h96M30 62h120M30 108h80M30 154h106" />
        </svg>
      </span>
    );
  }
  if (id === 'why') {
    return (
      <>
        <span className="am-paper" style={{ left: 30, top: 70, width: 230, height: 150, transform: 'rotate(-3deg)', padding: 10 }}>
          <svg viewBox="0 0 210 130" width="100%" height="100%" fill="none" stroke={B} strokeWidth="2">
            <rect x="18" y="4" width="174" height="108" rx="6" />
            <rect x="28" y="14" width="154" height="88" fill={B} />
            <path d="M38 30h60M38 42h90M38 54h40" stroke={W} />
            <rect x="38" y="68" width="44" height="16" rx="8" fill={G} stroke="none" />
            <path d="M2 118h206l-14 10H16z" fill={B} />
          </svg>
        </span>
        <span className="am-paper" style={{ left: 210, top: 40, width: 86, height: 160, transform: 'rotate(8deg)', padding: 8 }}>
          <svg viewBox="0 0 70 144" width="100%" height="100%" fill="none" stroke={B} strokeWidth="2">
            <rect x="1" y="1" width="68" height="142" rx="12" />
            <rect x="24" y="7" width="22" height="5" rx="2.5" fill={B} />
            <rect x="9" y="22" width="22" height="22" rx="5" fill={G} stroke="none" />
            <rect x="39" y="22" width="22" height="22" rx="5" />
            <rect x="9" y="52" width="22" height="22" rx="5" />
            <rect x="39" y="52" width="22" height="22" rx="5" fill={B} />
            <path d="M9 90h52M9 100h40M9 110h46" />
          </svg>
        </span>
      </>
    );
  }
  if (id === 'stack') {
    return (
      <span className="am-term" style={{ left: 60, top: 40, width: 230, transform: 'rotate(-5deg)' }}>
        {'$ '}<b>npm run build</b>{'\n  ✓ react      ✓ node\n  ✓ next.js    ✓ python\n  ✓ flutter    ✓ cloud\n'}<b>ready in 1.2s</b>
      </span>
    );
  }
  /* values */
  return (
    <svg style={{ position: 'absolute', left: 60, top: 40, width: 220, height: 170, overflow: 'visible' }} viewBox="0 0 220 170" fill="none">
      <path d="M6 80L210 6 150 160 104 108z" fill={W} />
      <path d="M104 108L210 6 78 120z" fill={G} />
      <path d="M78 120l26-12-14 40z" fill={T} />
      <path d="M6 80L210 6 150 160 104 108z" stroke={B} strokeWidth="2" />
      <path d="M-40 150c30-10 60-20 100-46" stroke={W} strokeWidth="3" strokeDasharray="6 8" />
    </svg>
  );
}

const NODE_EXTRAS = {
  who: { bubble: { left: -10, top: 150 }, cap: { left: 230, top: 200 }, capText: ['Small team. Senior people. Built in [CITY], India.'] },
  build: { bubble: { left: 150, top: -30 }, cap: { left: -150, top: 30 }, capText: ['Websites, apps, custom software and automation.'] },
  how: { bubble: { left: 150, top: -10 }, cap: { left: 220, top: 180 }, capText: ['Plan. Design. Build. Launch. Support.'] },
  why: { bubble: { left: 90, top: 240 }, up: true, ping: true, cap: { left: 320, top: 200 }, capText: ['One team from idea to launch, and after.'] },
  stack: { bubble: { left: 20, top: 200 }, cap: { left: 220, top: 220 }, capText: ['Modern, proven tools. Nothing exotic.'] },
  values: { bubble: { left: 40, top: 220 }, up: true, cap: { left: 250, top: 20 }, capText: ['Honest design. Clean code. Real results.'] },
};

export default function AboutMap() {
  const sectionRef = useRef(null);
  const worldRef = useRef(null);
  const bgRef = useRef(null);
  const grainRef = useRef(null);
  const cardRef = useRef(null);
  const openRef = useRef(null);
  const nodeRefs = useRef({});
  const [openId, setOpenId] = useState(null);
  const [isTouch, setIsTouch] = useState(false);

  const lenis = useLenis();
  useEffect(() => { openRef.current = openId; }, [openId]);

  /* Touch screens: while a card is open the page must scroll normally (the map's own
     swipe handling is paused), and the section is brought fully into view so the card,
     which sits at its bottom, is never off-screen */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    el.classList.toggle('am-card-open', !!openId);
    if (!openId) return;
    const r = el.getBoundingClientRect();
    if (r.top < -1 || r.bottom > window.innerHeight + 1) {
      if (lenis) lenis.scrollTo(el, { duration: 0.6 });
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [openId, lenis]);

  /* card pop animation */
  useEffect(() => {
    if (!openId || !cardRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && cardRef.current.animate) {
      cardRef.current.animate(
        [{ transform: 'scale(.85) rotate(-3deg)', opacity: 0 }, { transform: 'scale(1) rotate(0)', opacity: 1 }],
        { duration: 380, easing: 'cubic-bezier(.3,1.5,.4,1)' }
      );
    }
  }, [openId]);

  /* hide the site's own cursor while inside this section */
  useEffect(() => {
    const el = sectionRef.current;
    const on = () => document.body.classList.add('am-cursor-hidden');
    const off = () => document.body.classList.remove('am-cursor-hidden');
    el.addEventListener('mouseenter', on);
    el.addEventListener('mouseleave', off);
    return () => { el.removeEventListener('mouseenter', on); el.removeEventListener('mouseleave', off); off(); };
  }, []);

  /* grain + pan engine */
  useEffect(() => {
    const ab = sectionRef.current, world = worldRef.current, bg = bgRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    setIsTouch(touch);

    try {
      const g = document.createElement('canvas'); g.width = g.height = 220;
      const c = g.getContext('2d'); const img = c.createImageData(220, 220);
      for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      c.putImageData(img, 0, 0);
      grainRef.current.style.backgroundImage = `url(${g.toDataURL()})`;
    } catch (e) { /* ignore */ }

    let tx = 0.5, ty = 0.5, x = 0.5, y = 0.5, maxX = 0, maxY = 0, bmaxX = 0, bmaxY = 0;
    let dragging = false, sx = 0, sy = 0, stx = 0, sty = 0, moved = 0, raf = 0, visible = true;
    /* offset left behind by a drag, so mouse-follow continues from where the drag ended */
    let offX = 0, offY = 0;

    const measure = () => {
      const r = ab.getBoundingClientRect();
      maxX = Math.max(0, world.offsetWidth - r.width); maxY = Math.max(0, world.offsetHeight - r.height);
      bmaxX = Math.max(0, bg.offsetWidth - r.width); bmaxY = Math.max(0, bg.offsetHeight - r.height);
    };
    const render = () => {
      world.style.transform = `translate3d(${-x * maxX}px, ${-y * maxY}px, 0)`;
      bg.style.transform = `translate3d(${-(0.5 + (x - 0.5) * 0.55) * bmaxX}px, ${-(0.5 + (y - 0.5) * 0.55) * bmaxY}px, 0)`;
    };
    const clamp = (v) => Math.min(1, Math.max(0, v));

    const follow = (e) => {
      const r = ab.getBoundingClientRect();
      return [clamp(((e.clientX - r.left) / r.width - 0.08) / 0.84), clamp(((e.clientY - r.top) / r.height - 0.08) / 0.84)];
    };
    const onMove = (e) => {
      if (touch || openRef.current || dragging) return;
      const [fx, fy] = follow(e);
      tx = clamp(fx + offX);
      ty = clamp(fy + offY);
    };
    const onLeave = () => { offX = 0; offY = 0; if (!openRef.current) { tx = 0.5; ty = 0.5; } };
    /* touch screens: the map drifts on its own until the user takes over */
    let lastInteract = -Infinity;
    const onDown = (e) => {
      if (e.pointerType === 'touch') return; /* touch uses the swipe handlers below */
      if (cardRef.current && cardRef.current.contains(e.target)) return;
      lastInteract = performance.now();
      /* start from where the map is drawn right now, not where it was easing to */
      tx = x; ty = y;
      dragging = true; moved = 0; sx = e.clientX; sy = e.clientY; stx = tx; sty = ty;
    };
    const onPMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
      if (moved > 6) {
        ab.classList.add('am-dragging');
        tx = clamp(stx - dx / Math.max(1, maxX));
        ty = clamp(sty - dy / Math.max(1, maxY));
      }
    };
    const onUp = (e) => {
      if (dragging) lastInteract = performance.now();
      if (dragging && moved > 6 && !touch) { const [fx, fy] = follow(e); offX = tx - fx; offY = ty - fy; }
      dragging = false; ab.classList.remove('am-dragging');
    };
    /* Touch swipe: a light flick pans the map in both directions (amplified, with
       momentum). The section takes over touch scrolling (touch-action: none), so when
       the map hits its top or bottom edge the rest of a vertical swipe scrolls the page. */
    const GAIN_X = 2.4, GAIN_Y = 1.8;
    let tLastX = 0, tLastY = 0, tStartX = 0, tStartY = 0, tLastT = 0, velX = 0, velY = 0, glide = 0, glideY = 0, swiping = false;
    /* move the map vertically by `d` (map units); whatever passes an edge scrolls the page */
    const panY = (d) => {
      const want = ty + d;
      ty = clamp(want);
      const over = want - ty;
      if (over !== 0) window.scrollBy(0, (over * Math.max(1, maxY)) / GAIN_Y);
      return over !== 0;
    };
    const onTouchStart = (e) => {
      if (openRef.current || (cardRef.current && cardRef.current.contains(e.target))) return;
      const t = e.touches[0];
      swiping = true; moved = 0; glide = 0; glideY = 0; velX = 0; velY = 0;
      tx = x; ty = y;
      tStartX = tLastX = t.clientX; tStartY = tLastY = t.clientY; tLastT = performance.now();
      lastInteract = tLastT;
    };
    const onTouchMove = (e) => {
      if (!swiping) return;
      const t = e.touches[0];
      const now = performance.now();
      const ddx = t.clientX - tLastX, ddy = t.clientY - tLastY;
      moved = Math.max(moved, Math.abs(t.clientX - tStartX) + Math.abs(t.clientY - tStartY));
      if (moved > 6) e.preventDefault(); /* we handle the scroll ourselves */
      const mx = (-ddx * GAIN_X) / Math.max(1, maxX);
      const my = (-ddy * GAIN_Y) / Math.max(1, maxY);
      tx = clamp(tx + mx);
      panY(my);
      /* velocity in map units per ms, smoothed */
      const dt = Math.max(1, now - tLastT);
      velX = 0.7 * velX + 0.3 * (mx / dt);
      velY = 0.7 * velY + 0.3 * (my / dt);
      tLastX = t.clientX; tLastY = t.clientY; tLastT = now; lastInteract = now;
    };
    const onTouchEnd = () => {
      if (!swiping) return;
      swiping = false;
      if (performance.now() - tLastT < 80) { glide = velX * 16; glideY = velY * 16; } /* per-frame push */
      lastInteract = performance.now();
    };

    /* right-click drags the map, so keep the browser menu out of the way */
    const onContextMenu = (e) => { if (!(cardRef.current && cardRef.current.contains(e.target))) e.preventDefault(); };
    const onClickCapture = (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; } };
    const onDragStart = (e) => e.preventDefault();

    const focusHandlers = [];
    Object.values(nodeRefs.current).forEach((n) => {
      if (!n) return;
      const h = () => {
        const r = ab.getBoundingClientRect();
        tx = clamp((n.offsetLeft + 170 - r.width / 2) / Math.max(1, maxX));
        ty = clamp((n.offsetTop + 150 - r.height / 2) / Math.max(1, maxY));
      };
      n.addEventListener('focus', h); focusHandlers.push([n, h]);
    });

    const loop = () => {
      /* flick momentum after a swipe */
      if (Math.abs(glide) > 0.00005) {
        tx = clamp(tx + glide); glide *= 0.93; lastInteract = performance.now();
        if (tx === 0 || tx === 1) glide = 0;
      }
      if (Math.abs(glideY) > 0.00005) {
        panY(glideY); glideY *= 0.93; lastInteract = performance.now();
      }
      if (touch && visible && !reduce && !dragging && !swiping && !openRef.current && performance.now() - lastInteract > 2500) {
        const t = performance.now() / 1000;
        tx = 0.5 + 0.42 * Math.sin(t * 0.12);
        ty = 0.5 + 0.38 * Math.sin(t * 0.083 + 1.3);
      }
      /* while dragging, the map sticks to the pointer 1:1 instead of easing behind it */
      if (visible) { const k = reduce || (dragging && moved > 6) ? 1 : swiping || Math.abs(glide) > 0.00005 || Math.abs(glideY) > 0.00005 ? 0.35 : 0.055; x += (tx - x) * k; y += (ty - y) * k; render(); }
      raf = requestAnimationFrame(loop);
    };

    measure(); render(); loop();
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((en) => { visible = en[0].isIntersecting; }) : null;
    if (io) io.observe(ab);

    window.addEventListener('resize', measure);
    ab.addEventListener('mousemove', onMove);
    ab.addEventListener('mouseleave', onLeave);
    ab.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onPMove);
    window.addEventListener('pointerup', onUp);
    ab.addEventListener('click', onClickCapture, true);
    ab.addEventListener('dragstart', onDragStart);
    ab.addEventListener('contextmenu', onContextMenu);
    ab.addEventListener('touchstart', onTouchStart, { passive: true });
    ab.addEventListener('touchmove', onTouchMove, { passive: false });
    ab.addEventListener('touchend', onTouchEnd);
    ab.addEventListener('touchcancel', onTouchEnd);

    /* let ScrollTrigger (if used) recalc once fonts are in */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); window.dispatchEvent(new Event('resize')); });

    return () => {
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      window.removeEventListener('resize', measure);
      ab.removeEventListener('mousemove', onMove);
      ab.removeEventListener('mouseleave', onLeave);
      ab.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onPMove);
      window.removeEventListener('pointerup', onUp);
      ab.removeEventListener('click', onClickCapture, true);
      ab.removeEventListener('dragstart', onDragStart);
      ab.removeEventListener('contextmenu', onContextMenu);
      ab.removeEventListener('touchstart', onTouchStart);
      ab.removeEventListener('touchmove', onTouchMove);
      ab.removeEventListener('touchend', onTouchEnd);
      ab.removeEventListener('touchcancel', onTouchEnd);
      focusHandlers.forEach(([n, h]) => n.removeEventListener('focus', h));
    };
  }, []);

  const closeCard = () => {
    const id = openRef.current;
    setOpenId(null);
    if (id && nodeRefs.current[id]) nodeRefs.current[id].focus({ preventScroll: true });
  };
  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));
  const card = openId ? aboutCards[openId] : null;

  return (
    <section className="am" id="about" ref={sectionRef} aria-labelledby="amTitle">
      <div className="am-grain" ref={grainRef} aria-hidden="true" />

      <aside className="am-rail" aria-hidden="true">
        <span className="am-rail__num">(02)</span>
        <span className="am-rail__name">About Sanpuro</span>
        <span className="am-rail__mark">S</span>
      </aside>

      {/* slow background layer */}
      <div className="am-bg" ref={bgRef} aria-hidden="true">
        <div className="am-giant" style={{ left: '4%', top: '6%', fontSize: '34vw' }}>SAN</div>
        <div className="am-giant" style={{ left: '44%', top: '46%', fontSize: '30vw' }}>PURO</div>
        <div className="am-giant" style={{ left: '12%', top: '58%', fontSize: '22vw' }}>{'{ }'}</div>
        <div className="am-giant" style={{ left: '30%', top: '22%', fontSize: '40vw', transform: 'rotate(-8deg)' }}>S</div>
        <div className="am-giant" style={{ left: '62%', top: '2%', fontSize: '26vw', transform: 'rotate(10deg)' }}>{'/>'}</div>
        <div className="am-scrawl" style={{ left: '54%', top: '24%', fontSize: 64 }}>{'GOOD SOFTWARE\nFEELS SIMPLE.\nMAKING IT SIMPLE\nIS THE HARD PART.'}</div>
        <div className="am-scrawl" style={{ right: '6%', top: '5%', fontSize: 56 }}>{'BUILT IN\nINDIA.\nUSED\nEVERYWHERE.'}</div>
        <div className="am-scrawl" style={{ left: '6%', bottom: '6%', fontSize: 46 }}>{'SHIP IT.\nLEARN.\nSHIP IT AGAIN.'}</div>
        <div className="am-tone" style={{ left: '34%', top: '8%', width: 260, height: 300, transform: 'rotate(-6deg)' }} />
        <div className="am-tone" style={{ left: '58%', top: '30%', width: 340, height: 200, transform: 'rotate(5deg)' }} />
        <div className="am-tone" style={{ left: '18%', top: '64%', width: 300, height: 220, transform: 'rotate(3deg)' }} />
        <div className="am-tone" style={{ left: '80%', top: '62%', width: 220, height: 280, transform: 'rotate(-4deg)' }} />
        <div className="am-strip" style={{ left: '38%', top: '80%', width: 420, height: 46, transform: 'rotate(-3deg)' }} />
        <div className="am-strip" style={{ left: '66%', top: '20%', width: 300, height: 38, transform: 'rotate(6deg)' }} />
        <svg className="am-deco" style={{ left: '28%', top: '34%', width: 150, height: 150, opacity: 0.5 }} viewBox="0 0 100 100" fill="none" stroke={W} strokeWidth="1.5">
          <circle cx="50" cy="50" r="46" />
          <circle cx="50" cy="50" r="40" strokeDasharray="1 9.47" />
          <path d="M50 50V22M50 50l18 10" />
        </svg>
      </div>

      {/* main layer */}
      <div className="am-world" ref={worldRef}>
        <div className="am-hub">
          <span className="am-hub__label">(02) About us</span>
          <div className="am-hello" aria-hidden="true">h<b>E</b>llo</div>
          <h2 id="amTitle">We're Sanpuro.</h2>
          <p>
            At SANPURO, we turn ideas into digital solutions that help businesses{' '}
            <span className="am-hl">streamline operations, automate repetitive tasks</span>, and grow with confidence.
          </p>
          <p className="am-mono-line">
            Founded in [YEAR] · [CITY], India.<br />
            Move around to get to know us, or <a href="#contact" className="am-ulink">talk to us</a>.
          </p>
        </div>

        <svg className="am-deco" aria-hidden="true" style={{ left: '36%', top: '60%', width: 120, height: 120 }} viewBox="0 0 100 100" fill="none" stroke={W} strokeWidth="5" strokeLinecap="round">
          <path d="M50 8v18M50 74v18M8 50h18M74 50h18M20 20l12 12M68 68l12 12M80 20L68 32M32 68L20 80" />
        </svg>
        <span className="am-ping" aria-hidden="true" style={{ left: '39.5%', top: '62.5%', fontSize: 56 }}>!</span>
        <svg className="am-deco" aria-hidden="true" style={{ left: '60%', top: '45%', width: 90, height: 60 }} viewBox="0 0 90 60" fill="none" stroke={W} strokeWidth="4" strokeLinecap="round">
          <path d="M10 50L20 8M35 52L42 6M60 50L64 10" />
        </svg>

        {NODES.map((n) => {
          const ex = NODE_EXTRAS[n.id];
          return (
            <button
              key={n.id}
              type="button"
              className="am-node"
              style={n.pos}
              aria-expanded={openId === n.id}
              ref={(el) => { nodeRefs.current[n.id] = el; }}
              onClick={() => toggle(n.id)}
              onKeyDown={(e) => { if (e.key === 'Escape') closeCard(); }}
            >
              <span className="am-node__art" aria-hidden="true"><NodeArt id={n.id} /></span>
              <span className={`am-bubble${ex.up ? ' am-bubble--up' : ''}`} style={ex.bubble}>{n.label}</span>
              {ex.ping && <span className="am-ping" style={{ left: 6, top: 20 }} aria-hidden="true">!!!</span>}
              <span className="am-cap" style={ex.cap}>{ex.capText.map((t) => <span key={t}>{t}</span>)}</span>
            </button>
          );
        })}
      </div>

      {/* detail card */}
      {card && (
        <div className="am-card" ref={cardRef} role="dialog" aria-modal="false" aria-labelledby="amCardTitle" onKeyDown={(e) => { if (e.key === 'Escape') closeCard(); }}>
          <div className="am-card__top">
            <div>
              <span className="am-card__label">{card.label}</span>
              <h3 id="amCardTitle">{card.title}</h3>
            </div>
            <button type="button" className="am-card__close" aria-label="Close" onClick={closeCard}>×</button>
          </div>
          {card.body.map((blk, i) => (blk.list
            ? <ul key={i}>{blk.list.map((li) => <li key={li}>{li}</li>)}</ul>
            : <p key={i}>{blk.p}</p>))}
        </div>
      )}

      <p className="am-tagline" aria-hidden="true">Ideas build. Code ships. Businesses grow.</p>
      <span className="am-hint" aria-hidden="true"><i />{isTouch ? 'Drag to explore · tap a bubble' : 'Move to explore · click a bubble'}</span>
    </section>
  );
}

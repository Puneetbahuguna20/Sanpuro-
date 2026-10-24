import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLenis } from '../context/LenisContext';
import { LayoutGrid, Settings, Globe, Box, ChartNoAxesColumnIncreasing, Users } from 'lucide-react';
import crmDashboard from '../assets/crm-dashboard.jpg';
import automationDashboard from '../assets/automation-dashboard.jpg';
import webDevShowcase from '../assets/web-dev-showcase.jpg';
import studio3d from '../assets/3d-studio.jpg';
import analyticsDashboard from '../assets/analytics-dashboard.jpg';
import consultingShowcase from '../assets/consulting-showcase.jpg';
import './LaptopHero.css';

// Services shown in the pill bar; each one swaps what the laptop screen shows
// Services shown in the pill bar (`label`) and the screen sidebar (`name`);
// each one swaps what the laptop screen shows
const SERVICES = [
  { id: 'crm', label: 'CRM', name: 'CRM', Icon: LayoutGrid, color: '#2563eb', sub: '38 open deals' },
  { id: 'automation', label: 'Automation', name: 'Business Automation', Icon: Settings, color: '#0d9488', sub: '128 tasks this week' },
  { id: 'web', label: 'Web Dev', name: 'Web Development', Icon: Globe, color: '#7c3aed', sub: 'Deployed 2m ago' },
  { id: '3d', label: '3D', name: '3D & Interactive', Icon: Box, color: '#d97706', sub: 'Scene at 60 fps' },
  { id: 'analytics', label: 'Analytics', name: 'Analytics', Icon: ChartNoAxesColumnIncreasing, color: '#0891b2', sub: 'Traffic up 24%' },
  { id: 'consulting', label: 'Consulting', name: 'Digital Consulting', Icon: Users, color: '#059669', sub: 'Roadmap in review' }
];

const SERVICE_CHIPS = {
  crm: ['Pipeline ₹24.6L', 'Win rate 42%'],
  automation: ['Workflows 12', 'Hours saved 46'],
  web: ['Lighthouse 98', 'Live'],
  '3d': ['WebGL', '60 fps'],
  analytics: ['Last 30 days', '+24% traffic'],
  consulting: ['Audit complete', '3 quick wins']
};

// Tabs that show a full-screen screenshot instead of the app window.
// `contain` fits a much wider image whole (letterboxed) instead of cropping its sides;
// `bg` fills the letterbox with the image's edge colour.
const SCREENSHOTS = {
  crm: { src: crmDashboard, alt: 'SanPuRo CRM dashboard with leads, loan value and recent activity' },
  automation: { src: automationDashboard, alt: 'SanPuRo business automation dashboard with workflow builder and stats' },
  web: { src: webDevShowcase, alt: 'SanPuRo web design page: Websites That Make an Impact' },
  '3d': { src: studio3d, alt: '3D studio editor with a sneaker model, scene tree and material controls', contain: true, bg: '#131415' },
  analytics: { src: analyticsDashboard, alt: 'Analytics dashboard with revenue, users, sales by region and traffic sources', contain: true, bg: '#f6f3f0' },
  // Pre-padded to the screen's aspect ratio (edges mirrored + blurred), so it fills without cropping
  consulting: { src: consultingShowcase, alt: 'Consulting page: Strategic Consulting for Real Growth' }
};

const KB_LAYOUT = [
  {
    isFn: true,
    keys: [
      { label: 'esc', grow: 1.3 },
      { label: '🔅', grow: 1 },
      { label: '🔆', grow: 1 },
      { label: '▤', grow: 1 },
      { label: '🔍', grow: 1 },
      { label: '🎙', grow: 1 },
      { label: '🌙', grow: 1 },
      { label: '⏮', grow: 1 },
      { label: '⏯', grow: 1 },
      { label: '⏭', grow: 1 },
      { label: '🔇', grow: 1 },
      { label: '🔉', grow: 1 },
      { label: '🔊', grow: 1 },
      { label: '⏻', grow: 1.3 }
    ]
  },
  {
    keys: [
      { label: '~ `', grow: 1 },
      { label: '1', grow: 1 }, { label: '2', grow: 1 }, { label: '3', grow: 1 },
      { label: '4', grow: 1 }, { label: '5', grow: 1 }, { label: '6', grow: 1 },
      { label: '7', grow: 1 }, { label: '8', grow: 1 }, { label: '9', grow: 1 },
      { label: '0', grow: 1 }, { label: '-', grow: 1 }, { label: '=', grow: 1 },
      { label: 'delete', grow: 1.6 }
    ]
  },
  {
    keys: [
      { label: 'tab', grow: 1.5 },
      { label: 'Q', grow: 1 }, { label: 'W', grow: 1 }, { label: 'E', grow: 1 },
      { label: 'R', grow: 1 }, { label: 'T', grow: 1 }, { label: 'Y', grow: 1 },
      { label: 'U', grow: 1 }, { label: 'I', grow: 1 }, { label: 'O', grow: 1 },
      { label: 'P', grow: 1 }, { label: '[', grow: 1 }, { label: ']', grow: 1 },
      { label: '\\', grow: 1.1 }
    ]
  },
  {
    keys: [
      { label: 'caps lock', grow: 1.8 },
      { label: 'A', grow: 1 }, { label: 'S', grow: 1 }, { label: 'D', grow: 1 },
      { label: 'F', grow: 1 }, { label: 'G', grow: 1 }, { label: 'H', grow: 1 },
      { label: 'J', grow: 1 }, { label: 'K', grow: 1 }, { label: 'L', grow: 1 },
      { label: ';', grow: 1 }, { label: "'", grow: 1 },
      { label: 'return', grow: 1.8 }
    ]
  },
  {
    keys: [
      { label: 'shift', grow: 2.3 },
      { label: 'Z', grow: 1 }, { label: 'X', grow: 1 }, { label: 'C', grow: 1 },
      { label: 'V', grow: 1 }, { label: 'B', grow: 1 }, { label: 'N', grow: 1 },
      { label: 'M', grow: 1 }, { label: ',', grow: 1 }, { label: '.', grow: 1 },
      { label: '/', grow: 1 },
      { label: 'shift', grow: 2.3 }
    ]
  },
  {
    keys: [
      { label: 'fn', grow: 0.9 },
      { label: 'control', grow: 1 },
      { label: 'option', grow: 1.1 },
      { label: 'command', grow: 1.35 },
      { label: '', grow: 5.6 },
      { label: 'command', grow: 1.35 },
      { label: 'option', grow: 1.1 },
      { label: '◀', grow: 0.9 },
      { isArrowSplit: true, grow: 0.9 },
      { label: '▶', grow: 0.9 }
    ]
  }
];

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function LaptopHero({
  title = "Technology That Moves Your Business Forward.",
  subline = "From engaging websites to intelligent business tools, we create tailored digital solutions that simplify workflows and solve real business challenges.",
  allowPageScrollWhenOpen = true,
  className = ""
}) {
  const lenis = useLenis();
  const [activeTab, setActiveTab] = useState('crm');
  const [hudStatusText, setHudStatusText] = useState('Scroll to open');
  const [hudAngleText, setHudAngleText] = useState('8°');
  const [hudBtnText, setHudBtnText] = useState('Open');
  const [isPillVisible, setIsPillVisible] = useState(false);

  const containerRef = useRef(null);
  const laptopRef = useRef(null);
  const laptopLidRef = useRef(null);
  const lidOutRef = useRef(null);
  const lidInRef = useRef(null);
  const heroHeaderRef = useRef(null);
  const crackedGlowRef = useRef(null);
  const hudFillRef = useRef(null);

  // Progressive animation state
  const targetPRef = useRef(0);
  const currentPRef = useRef(0);
  const animFrameIdRef = useRef(null);

  // Once the lid is open, advance to the next service every 2s. activeTab is a
  // dependency, so a manual click restarts the 2s countdown from that tab.
  useEffect(() => {
    if (!isPillVisible) return;
    const id = setTimeout(() => {
      const i = SERVICES.findIndex(svc => svc.id === activeTab);
      setActiveTab(SERVICES[(i + 1) % SERVICES.length].id);
    }, 2000);
    return () => clearTimeout(id);
  }, [isPillVisible, activeTab]);

  // Direct toggle open/close
  // Scrolls to the start/end of the pinned range, which opens/closes the lid
  const toggleOpen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const sectionTop = container.getBoundingClientRect().top + window.scrollY;
    const distance = container.offsetHeight - window.innerHeight;
    const dest = targetPRef.current >= 0.95 ? sectionTop : sectionTop + distance;
    if (lenis) {
      lenis.scrollTo(dest, { duration: 1.2 });
    } else {
      window.scrollTo({ top: dest, behavior: 'smooth' });
    }
  }, [lenis]);

  useEffect(() => {
    const laptop = laptopRef.current;
    const laptopLid = laptopLidRef.current;
    const lidOut = lidOutRef.current;
    const lidIn = lidInRef.current;
    const heroHeader = heroHeaderRef.current;
    const crackedGlow = crackedGlowRef.current;
    const hudFill = hudFillRef.current;
    const container = containerRef.current;

    if (!laptop || !laptopLid || !lidOut || !lidIn) return;

    function renderFrame(p) {
      const o = easeInOutCubic(clamp(p, 0, 1));
      const w = laptop.offsetWidth || 1000;

      // Lid angle: 8deg -> 104deg
      const lidAngle = 8 + (104 - 8) * o;

      // Camera tilt: -34deg -> -14deg
      const tilt = -34 + (-14 - (-34)) * o;

      // Scale: 0.70 -> 0.90
      const scale = 0.70 + (0.90 - 0.70) * o;

      // translateY: 4% -> 20% of laptop width (kept high enough to leave room for the tab pill below)
      const ty = (0.04 + (0.20 - 0.04) * o) * w;

      // Apply 3D transforms
      laptop.style.transform = `translateY(${ty}px) scale(${scale}) rotateX(${tilt}deg)`;
      laptopLid.style.setProperty('--lid', `${lidAngle}deg`);
      laptopLid.style.transform = `translateZ(3px) rotateX(${lidAngle}deg)`;

      // Switch between outer lid shell and inner display:
      // Below 28deg, show outer space-black lid shell.
      // Above 28deg (as lid lifts toward user), show inner display.
      if (lidAngle <= 28) {
        lidOut.style.display = 'block';
        lidOut.style.opacity = '1';
        lidIn.style.display = 'none';
      } else {
        lidOut.style.display = 'none';
        lidIn.style.display = 'flex';
        lidIn.style.opacity = '1';
      }

      // Cracked glow at hinge slit fades as lid opens
      if (crackedGlow) {
        crackedGlow.style.opacity = (1 - clamp(o / 0.12, 0, 1)).toFixed(2);
      }

      // Headline fades out and moves up
      if (heroHeader) {
        const headerP = clamp(o / 0.25, 0, 1);
        heroHeader.style.opacity = (1 - headerP).toFixed(3);
        heroHeader.style.transform = `translateY(${-40 * headerP}px)`;
      }

      // HUD updates
      if (hudFill) {
        hudFill.style.width = `${Math.round(o * 100)}%`;
      }
      setHudAngleText(`${Math.round(lidAngle)}°`);

      if (p >= 0.98) {
        setHudStatusText(allowPageScrollWhenOpen ? 'Scroll for details ↓' : 'Open');
      } else if (p > 0.05) {
        setHudStatusText('Opening...');
      } else {
        setHudStatusText('Scroll to open');
      }

      setHudBtnText(p >= 0.95 ? 'Close' : 'Open');
      setIsPillVisible(p > 0.82);
    }

    function loop() {
      currentPRef.current += (targetPRef.current - currentPRef.current) * 0.18;
      if (Math.abs(targetPRef.current - currentPRef.current) < 0.0003) {
        currentPRef.current = targetPRef.current;
      }

      renderFrame(currentPRef.current);
      animFrameIdRef.current = requestAnimationFrame(loop);
    }
    animFrameIdRef.current = requestAnimationFrame(loop);

    // Scroll-driven progress: the section is taller than the viewport and its
    // stage is sticky, so the laptop opens while the stage is pinned and the
    // page only continues downward once the lid is fully open.
    const updateFromScroll = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const distance = container.offsetHeight - window.innerHeight;
      if (distance <= 0) return;
      targetPRef.current = clamp(-rect.top / distance, 0, 1);
    };

    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', updateFromScroll);
    updateFromScroll();

    renderFrame(0);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('scroll', updateFromScroll);
      window.removeEventListener('resize', updateFromScroll);
    };
  }, [allowPageScrollWhenOpen]);

  return (
    <section className={`laptop-hero-scroller ${className}`} ref={containerRef}>
      {/* Sticky Stage */}
      <div className="laptop-hero-sticky">
        {/* Ambient Glow */}
        <div className="laptop-hero-ambient-glow" aria-hidden="true" />

        {/* Top Headline */}
        <header className="laptop-hero-header" ref={heroHeaderRef}>
          <h1 className="laptop-hero-title">{title}</h1>
          <p className="laptop-hero-subline">{subline}</p>
        </header>

        {/* Interactive HUD & Progress Pill */}
        <div className={`laptop-scroll-hud ${isPillVisible ? 'hidden' : ''}`}>
          <div className="laptop-hud-pill">
            <span>{hudStatusText}</span>
            <div className="laptop-hud-bar">
              <div className="laptop-hud-fill" ref={hudFillRef} />
            </div>
            <span className="laptop-hud-angle">{hudAngleText}</span>
          </div>
          <button
            className="laptop-hud-btn"
            onClick={toggleOpen}
            title="Toggle open/close"
          >
            {hudBtnText}
          </button>
        </div>

        {/* 3D Laptop Viewport */}
        <div className="laptop-viewport">
          <div className="laptop" ref={laptopRef} title="Scroll to open and close">
            
            {/* BASE: Lies flat, rotateX 90deg */}
            <div className="base">
              {/* Metallic Hinge Cylinder Bar */}
              <div className="hinge-joint" />

              {/* Base Sides */}
              <div className="base-side-left" />
              <div className="base-side-right" />

              {/* Keyboard Well */}
              <div className="keyboard-well">
                {KB_LAYOUT.map((rowInfo, rIdx) => (
                  <div key={rIdx} className={`kb-row${rowInfo.isFn ? ' fn-row' : ''}`}>
                    {rowInfo.keys.map((k, kIdx) => {
                      if (k.isArrowSplit) {
                        return (
                          <div key={kIdx} className="kb-key arrow-split" style={{ flex: `${k.grow} 1 0` }}>
                            <div className="kb-key arrow-sub">▲</div>
                            <div className="kb-key arrow-sub">▼</div>
                          </div>
                        );
                      }
                      return (
                        <div key={kIdx} className="kb-key" style={{ flex: `${k.grow} 1 0` }}>
                          {k.label}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Trackpad */}
              <div className="trackpad" />

              {/* Cracked lid backlight aura slit */}
              <div className="cracked-glow" ref={crackedGlowRef} />

              {/* Base Front Edge Strip */}
              <div className="base-front-edge">
                <div className="base-thumb-notch" />
              </div>

              {/* LID */}
              <div className="lid" ref={laptopLidRef}>
                {/* Outer Shell */}
                <div className="lid-out" ref={lidOutRef}>
                  <div className="noise-overlay" />
                </div>

                {/* Inner Screen */}
                <div className="lid-in" ref={lidInRef}>
                  {/* Camera Notch */}
                  <div className="camera-notch">
                    <div className="camera-lens">
                      <div className="camera-indicator" />
                    </div>
                  </div>

                  {/* Display Surface */}
                  <div className="display">
                    <div className="screen-reflection" />
                    <div className="screen-off-overlay" />

                    {/* Some tabs show a full-screen screenshot over the app window */}
                    {Object.entries(SCREENSHOTS).map(([id, { src, alt, contain, bg }]) => (
                      <img
                        key={id}
                        className={`screen-shot ${contain ? 'is-contain' : ''} ${activeTab === id ? 'active' : ''}`}
                        src={src}
                        alt={alt}
                        style={bg ? { backgroundColor: bg } : undefined}
                        draggable="false"
                      />
                    ))}

                    {/* SanPuRo Studio App Window */}
                    <div className="hush-window">
                      {/* Titlebar */}
                      <div className="window-header">
                        <div className="traffic-lights">
                          <div className="traffic-dot close" />
                          <div className="traffic-dot min" />
                          <div className="traffic-dot max" />
                        </div>
                        <div className="window-title">
                          <strong>SanPuRo</strong> <span>— Studio</span>
                        </div>
                        <div className="window-actions">
                          <span>Live</span>
                        </div>
                      </div>

                      {/* Window Body */}
                      <div className="window-body">
                        {/* Sidebar: services list mirrors the pill bar */}
                        <aside className="window-sidebar">
                          <div className="sidebar-badge">Services</div>

                          <div className="conv-list">
                            {SERVICES.map(({ id, name, Icon, color, sub }) => (
                              <div
                                key={id}
                                className={`conv-item ${activeTab === id ? 'active' : ''}`}
                                onClick={() => setActiveTab(id)}
                              >
                                <div className="conv-avatar" style={{ background: color }}>
                                  <Icon size="1.1em" strokeWidth={2} aria-hidden="true" />
                                </div>
                                <div className="conv-details">
                                  <div className="conv-header">
                                    <span className="conv-name">{name}</span>
                                  </div>
                                  <div className="conv-preview">{sub}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="window-main">
                          <div className="main-topbar">
                            <div className="chip-group">
                              <span className="chip">{SERVICE_CHIPS[activeTab][0]}</span>
                              <span
                                className="chip"
                                style={{
                                  background: 'rgba(16, 185, 129, 0.15)',
                                  borderColor: 'rgba(16, 185, 129, 0.3)',
                                  color: '#6ee7b7'
                                }}
                              >
                                {SERVICE_CHIPS[activeTab][1]}
                              </span>
                            </div>
                            <div className="more-btn">···</div>
                          </div>

                          {/* CRM: sales pipeline */}
                          <div className={`tab-panel ${activeTab === 'crm' ? 'active' : ''}`}>
                            <div className="triage-cols">
                              <div className="triage-col">
                                <div className="triage-col-title">
                                  <span>Leads</span>
                                  <span>14</span>
                                </div>
                                <div className="triage-card">
                                  <div className="triage-card-title">Acme Retail</div>
                                  <div className="triage-card-meta">₹3.2L • Follow up today</div>
                                </div>
                                <div className="triage-card">
                                  <div className="triage-card-title">Nova Clinics</div>
                                  <div className="triage-card-meta">₹1.8L • Website enquiry</div>
                                </div>
                              </div>
                              <div className="triage-col">
                                <div className="triage-col-title">
                                  <span>Proposal</span>
                                  <span>9</span>
                                </div>
                                <div className="triage-card">
                                  <div className="triage-card-title">Urban Bites</div>
                                  <div className="triage-card-meta">₹4.5L • Sent yesterday</div>
                                </div>
                                <div className="triage-card">
                                  <div className="triage-card-title">Skyline Realty</div>
                                  <div className="triage-card-meta">₹6.0L • Call at 4 PM</div>
                                </div>
                              </div>
                              <div className="triage-col">
                                <div className="triage-col-title">
                                  <span>Won</span>
                                  <span>15</span>
                                </div>
                                <div className="triage-card">
                                  <div className="triage-card-title">GreenLeaf Foods</div>
                                  <div className="triage-card-meta">₹2.4L • Onboarding</div>
                                </div>
                                <div className="triage-card">
                                  <div className="triage-card-title">Pixel Academy</div>
                                  <div className="triage-card-meta">₹3.1L • Invoice paid</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Business Automation: one workflow, step by step */}
                          <div className={`tab-panel ${activeTab === 'automation' ? 'active' : ''}`}>
                            <div className="flow-list">
                              {[
                                ['Trigger', 'New order placed on website'],
                                ['Action', 'Generate GST invoice automatically'],
                                ['Action', 'Send WhatsApp confirmation to customer'],
                                ['Action', 'Update inventory sheet & notify team']
                              ].map(([kind, text], i) => (
                                <div className="flow-step" key={i}>
                                  <span className={`flow-kind ${kind === 'Trigger' ? 'is-trigger' : ''}`}>{kind}</span>
                                  <span className="flow-text">{text}</span>
                                  <span className="flow-status">✓</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Web Development: live site health */}
                          <div className={`tab-panel ${activeTab === 'web' ? 'active' : ''}`}>
                            <div className="search-box">
                              <Globe size={14} aria-hidden="true" />
                              <span>https://yourbusiness.com</span>
                              <span style={{ marginLeft: 'auto', fontSize: '0.8em', opacity: 0.6 }}>Deployed</span>
                            </div>
                            <div className="metric-grid">
                              {[
                                ['98', 'Performance'],
                                ['100', 'SEO'],
                                ['96', 'Accessibility'],
                                ['0.8s', 'Load time']
                              ].map(([value, name]) => (
                                <div className="metric-card" key={name}>
                                  <div className="metric-value">{value}</div>
                                  <div className="metric-label">{name}</div>
                                </div>
                              ))}
                            </div>
                            <div className="search-results">
                              <div className="result-item">
                                <div className="result-title">Production build passed</div>
                                <div className="result-snippet">main • React + Vite • 2 minutes ago</div>
                              </div>
                            </div>
                          </div>

                          {/* 3D & Interactive Experiences */}
                          <div className={`tab-panel ${activeTab === '3d' ? 'active' : ''}`}>
                            <div className="private-vault">
                              <div className="vault-icon cube-spin" aria-hidden="true">
                                <Box size="1em" strokeWidth={1.5} />
                              </div>
                              <div className="vault-title">Real-time 3D in the browser</div>
                              <div className="vault-desc">
                                Product configurators, scroll-driven scenes and interactive showcases built with WebGL and Three.js, smooth at 60 fps on any device.
                              </div>
                            </div>
                          </div>

                          {/* Analytics: traffic overview */}
                          <div className={`tab-panel ${activeTab === 'analytics' ? 'active' : ''}`}>
                            <div className="metric-grid">
                              {[
                                ['48.2K', 'Visitors'],
                                ['3.8%', 'Conversion'],
                                ['₹9.4L', 'Revenue'],
                                ['32%', 'Bounce rate']
                              ].map(([value, name]) => (
                                <div className="metric-card" key={name}>
                                  <div className="metric-value">{value}</div>
                                  <div className="metric-label">{name}</div>
                                </div>
                              ))}
                            </div>
                            <div className="bar-chart" aria-hidden="true">
                              {[42, 58, 50, 66, 61, 78, 72, 88, 80, 94, 86, 100].map((h, i) => (
                                <span className="bar" key={i} style={{ height: `${h}%` }} />
                              ))}
                            </div>
                          </div>

                          {/* Digital Consulting: roadmap recommendations */}
                          <div className={`tab-panel ${activeTab === 'consulting' ? 'active' : ''}`}>
                            <div className="draft-card">
                              <div className="draft-to">Week 1 • Digital audit</div>
                              <div className="draft-body">
                                "Your checkout loses 38% of mobile users. Fixing the form and page speed is the fastest revenue win."
                              </div>
                              <div className="draft-actions">
                                <button className="draft-btn secondary">View report</button>
                                <button className="draft-btn primary">Approve plan</button>
                              </div>
                            </div>
                            <div className="draft-card">
                              <div className="draft-to">Week 2–6 • Growth roadmap</div>
                              <div className="draft-body">
                                "Automate lead follow-ups with a CRM, then launch the new site with tracking on every key action."
                              </div>
                              <div className="draft-actions">
                                <button className="draft-btn secondary">Discuss</button>
                                <button className="draft-btn primary">Book a call</button>
                              </div>
                            </div>
                          </div>
                        </main>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lid Front Edge Strip */}
                <div className="lid-front-edge">
                  <div className="lid-thumb-notch" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pill Tab Bar */}
        <nav
          className={`pill-tabs ${isPillVisible ? 'visible' : ''}`}
          role="tablist"
          aria-label="Services"
        >
          {SERVICES.map(({ id, label, Icon }) => (
            <button
              key={id}
              className="tab-btn"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
            >
              <Icon className="tab-icon" size={20} strokeWidth={activeTab === id ? 2 : 1.6} aria-hidden="true" />
              <span className="tab-label">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}

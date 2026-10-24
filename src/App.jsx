import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LenisProvider } from './context/LenisContext';

import Preloader from './components/Preloader';
import Cursor from './components/Cursor';
import FloatingPreview from './components/FloatingPreview';
import Nav from './components/Nav';
import ParticleHero from './components/ParticleHero';
import NameHero from './components/NameHero';
import SlideStack from './components/SlideStack/SlideStack';
import Marquee from './components/Marquee';
import Panel from './components/Panel';
import Intro from './components/Intro';
import Work from './components/Work';
import AboutMap from './components/AboutMap/AboutMap';
import LaptopHero from './components/LaptopHero';
import Contact from './components/Contact';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);

  // Call ScrollTrigger.refresh() after preloader finishes and after document.fonts.ready
  useEffect(() => {
    if (loaded) {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      } else {
        ScrollTrigger.refresh();
      }
    }
  }, [loaded]);

  return (
    <LenisProvider>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <Cursor />
      <FloatingPreview />
      <Nav />
      <main>
        <ParticleHero loaded={loaded} />
        <SlideStack />
        <NameHero />
        <Marquee />
        <Panel>
          <Intro />
          <Work />
          <AboutMap />
        </Panel>
        {/* Second-last section: 3D Realistic Laptop Hero component */}
        <LaptopHero />
        <Contact />
      </main>
    </LenisProvider>
  );
}

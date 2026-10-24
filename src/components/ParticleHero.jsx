import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sphere, ribbon, cube, faceFromImage, earthFromMask } from '../lib/particleShapes';
import faceImageUrl from '../assets/face-particles.jpg';
import earthMaskUrl from '../assets/earth-land-mask.png';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

export default function ParticleHero({ loaded }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const headlineLinesRef = useRef([]);
  const introRef = useRef([]);
  const headlineRef = useRef(null);
  const bottomRowRef = useRef(null);
  const hintRef = useRef(null);

  const reducedMotion = useReducedMotion();

  // Three.js Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    let width = section.clientWidth;
    let height = section.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 9;

    const scene = new THREE.Scene();

    const isMobile = window.innerWidth < 700;
    const N = isMobile ? 8000 : 11000;
    const dustCount = isMobile ? 800 : 2200;

    // Generate Shape Positions
    const shapeFuncs = [ribbon, cube];
    const shapePositions = shapeFuncs.map(fn => fn(N));
    // Earth comes first. Its slot holds a copy of a plain sphere until the land
    // mask has loaded; the sphere then morphs into the earth before the cycle starts.
    const EARTH_IDX = 0;
    const introFrom = sphere(N);
    // Face slot shows the sphere until the reference image has loaded
    const FACE_IDX = 1;
    shapePositions.unshift(new Float32Array(introFrom), introFrom);
    const SHAPE_COUNT = shapePositions.length;
    let earthTarget = null;
    let introK = 0;

    let disposed = false;
    const loadPixels = (url, onPixels) => {
      const img = new Image();
      img.onload = () => {
        if (disposed) return;
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const cctx = c.getContext('2d', { willReadFrequently: true });
        cctx.drawImage(img, 0, 0);
        onPixels(cctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
      };
      img.src = url;
    };
    loadPixels(faceImageUrl, (data, w, h) => {
      shapePositions[FACE_IDX] = faceFromImage(N, data, w, h);
    });
    loadPixels(earthMaskUrl, (data, w, h) => {
      earthTarget = earthFromMask(N, data, w, h);
    });

    let currentShapeIdx = 0;
    let nextShapeIdx = 1;

    // Point geometry
    const geometry = new THREE.BufferGeometry();
    const currentPositions = new Float32Array(shapePositions[0]);
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    // Seeds for shimmer & scatter
    const seeds = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      seeds[i] = Math.random() * 1000;
    }

    // Offsets for mouse repel
    const offsets = new Float32Array(N * 3);

    const material = new THREE.PointsMaterial({
      color: 0xF5F5F7,
      size: isMobile ? 0.024 : 0.022,
      opacity: 0.9,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    points.rotation.set(0.35, 0, -0.25);
    scene.add(points);

    // Invisible depth-only sphere inside the earth: hides the far hemisphere so
    // the continents read clearly instead of overlapping front and back.
    const occluderGeom = new THREE.SphereGeometry(1, 48, 32);
    const occluderMat = new THREE.MeshBasicMaterial({ colorWrite: false });
    const occluder = new THREE.Mesh(occluderGeom, occluderMat);
    occluder.renderOrder = -1;
    occluder.visible = false;
    points.add(occluder);

    // Dust particles
    const dustGeom = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 22;     // ±11
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 13; // ±6.5
      dustPos[i * 3 + 2] = -6 + Math.random() * 8;     // -6..2
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));

    const dustMaterial = new THREE.PointsMaterial({
      color: 0x9296A3,
      size: 0.02,
      opacity: 0.35,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const dust = new THREE.Points(dustGeom, dustMaterial);
    scene.add(dust);

    // Initial scale calculation
    const updateScale = () => {
      const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      const halfW = halfH * camera.aspect;

      // Phones: the layout leaves a gap between the headline and the paragraph; the
      // shape is centred in it and sized to fill it
      const headline = headlineRef.current;
      const desc = introRef.current[1];
      if (width < 700 && headline && desc) {
        const top = section.getBoundingClientRect().top;
        const gapTop = headline.getBoundingClientRect().bottom - top;
        const gapBottom = desc.getBoundingClientRect().top - top;
        const gapPx = Math.max(120, gapBottom - gapTop);
        const unitsPerPx = (2 * halfH) / height;
        // the face (tallest shape) is 7.8 units tall in local space and sits 0.55 below
        // its origin, so lift it by that much to centre it in the gap
        const s = (gapPx * unitsPerPx * 0.9) / 7.8;
        points.scale.set(s, s, s);
        points.position.x = 0;
        points.position.y = halfH - ((gapTop + gapBottom) / 2) * unitsPerPx + 0.55 * s;
        return;
      }

      // Tablets: the copy fills the width, so the shape shrinks into the lower half
      const compact = width < 1024;
      const s = (Math.min(1, width / 900) * 0.9 + 0.1) * (compact ? 0.55 : 1);
      points.scale.set(s, s, s);

      // Shift the shape right of center so it clears the headline
      points.position.x = halfW * 0.35;
      points.position.y = compact ? -halfH * 0.4 : 0;
    };
    updateScale();

    // Mouse tracking in NDC — use window-level events for reliability
    const mouse = { x: 0, y: 0, active: false };
    const targetMouse = { x: 0, y: 0 };

    // Touch screens have no hover: a finger drives the effect while it is down, and
    // otherwise a virtual pointer drifts over the shape so the particles keep rippling
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    let lastTouch = -Infinity;

    const setTarget = (clientX, clientY) => {
      // Use window dimensions for consistent NDC regardless of section bounds
      targetMouse.x = (clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(clientY / window.innerHeight) * 2 + 1;
      mouse.active = true;
    };

    const onPointerMove = (e) => {
      if (e.pointerType === 'touch') return; // handled by the touch listeners
      setTarget(e.clientX, e.clientY);
    };

    const onPointerLeave = () => {
      mouse.active = false;
    };

    const onTouch = (e) => {
      const t = e.touches[0];
      if (!t) return;
      lastTouch = performance.now();
      setTarget(t.clientX, t.clientY);
    };
    const onTouchEnd = () => {
      lastTouch = performance.now();
    };

    // Listen on window so mouse works even over overlaid text
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    const shapeNdc = new THREE.Vector3();

    // Animation & Morph State
    let animId = null;
    let isVisible = true;
    let morphTime = 0;
    const HOLD_TIME = 4.2;
    const MORPH_TIME = 1.8;
    const CYCLE_TIME = HOLD_TIME + MORPH_TIME;

    let rotY = 0;
    let rotX = 0.35;
    let clock = new THREE.Clock();

    const worldMouse = new THREE.Vector3();
    const localMouse = new THREE.Vector3();
    const localRay = new THREE.Vector3();
    const invQuat = new THREE.Quaternion();

    const render = () => {
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Touch screens: when no finger is down, wander a virtual pointer over the shape
      if (coarse && performance.now() - lastTouch > 1200) {
        // The camera's view matrix is only filled in by the first render, so update it first
        camera.updateMatrixWorld();
        shapeNdc.copy(points.position).project(camera);
        if (Number.isFinite(shapeNdc.x) && Number.isFinite(shapeNdc.y)) {
          targetMouse.x = shapeNdc.x + Math.cos(elapsed * 0.9) * 0.22;
          targetMouse.y = shapeNdc.y + Math.sin(elapsed * 1.3) * 0.12;
          mouse.active = true;
        }
      }

      // Mouse smoothing (faster lerp for responsiveness)
      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      // Morph logic
      // Hold the cycle on the earth slot until the earth has finished forming
      if (earthTarget && introK < 1) {
        introK = Math.min(1, introK + dt / MORPH_TIME);
        const e = easeInOutCubic(introK);
        const earthSlot = shapePositions[EARTH_IDX];
        for (let j = 0; j < earthSlot.length; j++) {
          earthSlot[j] = introFrom[j] + (earthTarget[j] - introFrom[j]) * e;
        }
      }
      if (introK >= 1) {
        morphTime = (morphTime + dt) % (CYCLE_TIME * SHAPE_COUNT);
      }
      const cycleIdx = Math.floor(morphTime / CYCLE_TIME) % SHAPE_COUNT;
      currentShapeIdx = cycleIdx;
      nextShapeIdx = (cycleIdx + 1) % SHAPE_COUNT;

      const timeInCycle = morphTime % CYCLE_TIME;
      let k = 0;
      if (timeInCycle > HOLD_TIME) {
        const tMorph = (timeInCycle - HOLD_TIME) / MORPH_TIME;
        k = easeInOutCubic(clamp(tMorph, 0, 1));
      }

      const shapeA = shapePositions[currentShapeIdx];
      const shapeB = shapePositions[nextShapeIdx];
      const posAttr = geometry.attributes.position;
      const posArr = posAttr.array;

      // Compute camera world mouse repel position
      const fovRad = (camera.fov * Math.PI) / 180;
      const halfH = Math.tan(fovRad / 2) * camera.position.z;
      const aspect = camera.aspect;

      // Always compute the local mouse position for repulsion
      worldMouse.set(mouse.x * halfH * aspect, mouse.y * halfH, 0);
      localMouse.copy(worldMouse);
      points.worldToLocal(localMouse);
      // Touch screens repel by distance from the finger's line of sight, so deep shapes
      // (face relief, ribbon ring) react across their whole depth, not just near z = 0
      invQuat.copy(points.quaternion).invert();
      localRay.set(0, 0, -1).applyQuaternion(invQuat);

      const scatterAmt = Math.sin(k * Math.PI) * 0.9;

      // How much the face is showing (0..1); drives softer repel and camera-facing
      const faceAmt =
        (currentShapeIdx === FACE_IDX ? 1 - k : 0) + (nextShapeIdx === FACE_IDX ? k : 0);
      // Mouse repel: full strength on other shapes, gentle on the face so it stays readable
      // A real finger repels like the mouse; the idle virtual pointer only nudges
      const gentle = coarse && performance.now() - lastTouch > 1200;
      // The face is softened for the desktop mouse only; on touch screens it reacts
      // like the other shapes
      const faceSoft = coarse ? 0 : faceAmt;
      // Deep shapes (face relief, ribbon ring) use line-of-sight distance on touch;
      // earth and cube keep the normal 3D distance
      const ribbonIdx = FACE_IDX + 1;
      const deepShape = Math.min(1, faceAmt + (currentShapeIdx === ribbonIdx ? 1 - k : 0) + (nextShapeIdx === ribbonIdx ? k : 0));
      const deepAmt = coarse ? deepShape : 0;
      // Touch: earth and cube always use the soft setting (a full-strength finger blows
      // them apart); the deep shapes get full strength under a real finger
      // Desktop: earth and cube scatter a lot at full strength, so they get a milder push
      const soft = gentle ? 1 : coarse ? 1 - deepAmt : (1 - deepShape) * 0.55;
      const repelRadius = (2.0 - 0.8 * faceSoft) * (1 - 0.5 * soft);
      const repelForce = (0.28 - 0.2 * faceSoft) * (1 - 0.92 * soft);

      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const seed = seeds[i];

        // 1. Lerp between shape A and B
        const ax = shapeA[i3];
        const ay = shapeA[i3 + 1];
        const az = shapeA[i3 + 2];

        const bx = shapeB[i3];
        const by = shapeB[i3 + 1];
        const bz = shapeB[i3 + 2];

        const baseX = ax + (bx - ax) * k;
        const baseY = ay + (by - ay) * k;
        const baseZ = az + (bz - az) * k;

        // 2. Scatter
        const scX = Math.sin(seed * 3.1) * scatterAmt;
        const scY = Math.cos(seed * 2.3) * scatterAmt;
        const scZ = Math.sin(seed * 1.7) * scatterAmt;

        // 3. Shimmer
        const shX = Math.sin(elapsed * 0.8 + seed) * 0.025;
        const shY = Math.cos(elapsed * 0.9 + seed * 1.3) * 0.025;

        // 4. Mouse repel
        if (mouse.active) {
          let dx = baseX - localMouse.x;
          let dy = baseY - localMouse.y;
          let dz = baseZ - localMouse.z;
          if (deepAmt > 0) {
            // drop the part along the line of sight
            const along = (dx * localRay.x + dy * localRay.y + dz * localRay.z) * deepAmt;
            dx -= along * localRay.x;
            dy -= along * localRay.y;
            dz -= along * localRay.z;
          }
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (d < repelRadius && d > 0.0001) {
            const force = (1 - d / repelRadius) * repelForce;
            offsets[i3] += (dx / d) * force;
            offsets[i3 + 1] += (dy / d) * force;
            offsets[i3 + 2] += (dz / d) * force;
          }
        }

        // Decay offsets (slower decay = longer trail)
        offsets[i3] *= 0.92;
        offsets[i3 + 1] *= 0.92;
        offsets[i3 + 2] *= 0.92;

        // Final position
        posArr[i3] = baseX + scX + shX + offsets[i3];
        posArr[i3 + 1] = baseY + scY + shY + offsets[i3 + 1];
        posArr[i3 + 2] = baseZ + scZ + offsets[i3 + 2];
      }
      posAttr.needsUpdate = true;

      // Rotation updates — stronger mouse influence
      const earthAmt =
        (currentShapeIdx === EARTH_IDX ? 1 - k : 0) + (nextShapeIdx === EARTH_IDX ? k : 0);
      occluder.visible = earthAmt > 0.01;
      occluder.scale.setScalar(2.22 * earthAmt);

      // While the face is showing, stop spinning and turn it to face the camera
      const TWO_PI = Math.PI * 2;
      rotY += 0.0022 * (1 - faceAmt);
      rotY += (Math.round(rotY / TWO_PI) * TWO_PI - rotY) * 0.06 * faceAmt;
      // Touch screens: a finger (often just scrolling) must not tilt or shift the shape
      const par = coarse ? 0 : 1;
      points.rotation.y = rotY + mouse.x * (0.5 - 0.25 * faceAmt) * par;
      rotX += ((0.35 - mouse.y * 0.3 * par) - rotX) * 0.05;
      points.rotation.x = rotX * (1 - 0.85 * faceAmt);
      points.rotation.z = -0.25 * (1 - faceAmt);

      // Camera parallax — background moves with mouse
      camera.position.x += (-mouse.x * 0.6 * par - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.4 * par - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Dust motion — parallax with mouse
      dust.rotation.y = elapsed * 0.01;
      dust.position.x = -mouse.x * 0.8;
      dust.position.y = -mouse.y * 0.5;

      renderer.render(scene, camera);

      if (!reducedMotion && isVisible) {
        animId = requestAnimationFrame(render);
      }
    };

    // Resize handling
    const onResize = () => {
      width = section.clientWidth;
      height = section.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      updateScale();
      if (reducedMotion) {
        renderer.render(scene, camera);
      }
    };
    window.addEventListener('resize', onResize);

    // The phone layout depends on text height (fonts, wrapping), so re-fit when it changes
    const overlay = section.querySelector('.hero-overlay');
    // On phones the hero can grow taller than the screen, so resize the canvas with it
    const ro = 'ResizeObserver' in window ? new ResizeObserver(() => onResize()) : null;
    if (ro && overlay) {
      ro.observe(overlay);
      ro.observe(section);
    }

    // Pause rendering with IntersectionObserver when off-screen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !reducedMotion && !animId) {
        animId = requestAnimationFrame(render);
      } else if (!isVisible && animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
    observer.observe(section);

    if (reducedMotion) {
      render();
    } else {
      animId = requestAnimationFrame(render);
    }

    return () => {
      disposed = true;
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onTouchEnd);

      geometry.dispose();
      material.dispose();
      occluderGeom.dispose();
      occluderMat.dispose();
      dustGeom.dispose();
      dustMaterial.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  // Headline & Entrance Animations
  useEffect(() => {
    // Hide before load with gsap.set (not CSS) so visible if JS fails
    if (!loaded) {
      gsap.set(headlineLinesRef.current, { yPercent: 105 });
      gsap.set([...introRef.current, bottomRowRef.current, hintRef.current], { opacity: 0, y: 16 });
      return;
    }

    const tl = gsap.timeline();

    tl.to(introRef.current[0], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    tl.to(headlineLinesRef.current, {
      yPercent: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.1
    }, '-=0.5');

    tl.to(introRef.current.slice(1), {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.1
    }, '-=0.8');

    tl.to([bottomRowRef.current, hintRef.current], {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.8');

    return () => {
      tl.kill();
    };
  }, [loaded]);

  // Scrubbed Scroll Animation
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = gsap.context(() => {
      gsap.to(canvas, {
        // Phones: the hero is taller than the screen, so a zoom would shift the shape mid-scroll
        scale: window.innerWidth < 700 ? 1 : 1.25,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      gsap.to('.hero-overlay', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="particle-hero" id="top" ref={sectionRef}>
      {/* 3D WebGL Canvas */}
      <canvas className="particle-canvas" ref={canvasRef} aria-hidden="true" />

      {/* Vertical Hint on right edge */}
      <div className="hero-hint-vertical" ref={hintRef}>
        (Move your mouse)
      </div>

      {/* Overlay Content */}
      <div className="container hero-overlay">
        <div className="hero-main">
          <div className="hero-eyebrow" ref={el => (introRef.current[0] = el)}>
            <span className="hero-eyebrow-line" aria-hidden="true" />
            <span>Creative</span>
            <span className="hero-eyebrow-sep" aria-hidden="true">|</span>
            <span>Technology</span>
            <span className="hero-eyebrow-sep" aria-hidden="true">|</span>
            <span>Strategy</span>
          </div>

          <h2 className="hero-headline" ref={headlineRef} aria-label="Turning Your Ideas Into Digital Experiences That Move.">
            <span className="hero-line-wrap" aria-hidden="true">
              <span className="hero-line-inner" ref={el => (headlineLinesRef.current[0] = el)}>
                Turning Your Ideas
              </span>
            </span>
            <span className="hero-line-wrap" aria-hidden="true">
              <span className="hero-line-inner" ref={el => (headlineLinesRef.current[1] = el)}>
                Into <span className="hero-headline-fade">Digital</span>
              </span>
            </span>
            <span className="hero-line-wrap" aria-hidden="true">
              <span className="hero-line-inner" ref={el => (headlineLinesRef.current[2] = el)}>
                Experiences
              </span>
            </span>
            <span className="hero-line-wrap" aria-hidden="true">
              <span className="hero-line-inner" ref={el => (headlineLinesRef.current[3] = el)}>
                <span>That Move<span className="hero-headline-dot">.</span></span>
                <svg className="hero-globe-svg" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" />
                  <ellipse cx="20" cy="20" rx="8" ry="18" stroke="currentColor" />
                  <ellipse cx="20" cy="20" rx="14" ry="18" stroke="currentColor" />
                  <line x1="2" y1="13" x2="38" y2="13" stroke="currentColor" />
                  <line x1="2" y1="20" x2="38" y2="20" stroke="currentColor" />
                  <line x1="2" y1="27" x2="38" y2="27" stroke="currentColor" />
                </svg>
              </span>
            </span>
          </h2>

          <p className="hero-desc" ref={el => (introRef.current[1] = el)}>
            We design and develop premium digital experiences that blend creativity,
            technology and strategy to help your business grow.
          </p>

          <div className="hero-actions" ref={el => (introRef.current[2] = el)}>
            <a href="#work" className="hero-cta-primary" data-cursor="link">
              Explore Our Work
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            {/* TODO: point this at the showreel video once it exists */}
            <a href="#work" className="hero-cta-reel" data-cursor="link">
              <span className="hero-cta-reel-icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="7 4 20 12 7 20 7 4" />
                </svg>
              </span>
              Watch Showreel
            </a>
          </div>
        </div>

        <div className="hero-bottom-row" ref={bottomRowRef}>
          <a href="#stack" className="hero-scroll-cue" data-cursor="link">
            <span className="hero-scroll-cue-line" aria-hidden="true" />
            <span>Scroll to explore</span>
          </a>

          <div className="hero-meta-group">
            <div className="hero-meta-block">
              <span className="hero-meta-label">Available for</span>
              <span className="hero-meta-value">Freelance projects ('26)</span>
            </div>
            <div className="hero-meta-block">
              <span className="hero-meta-label">Based in</span>
              <span className="hero-meta-value">New Delhi, India</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

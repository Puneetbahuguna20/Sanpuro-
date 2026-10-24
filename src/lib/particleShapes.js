/**
 * Particle Shape Generators for Three.js Points
 * Each function takes N and returns a Float32Array(N * 3)
 */

export function sphere(N) {
  const arr = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * 2.39996;
    const radius = 2.3 + (Math.random() - 0.5) * 0.12; // 2.3 ± 0.06 jitter

    arr[i * 3] = Math.cos(theta) * r * radius;
    arr[i * 3 + 1] = y * radius;
    arr[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return arr;
}

export function ribbon(N) {
  const arr = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const w = (Math.random() - 0.5) * 1.3; // w in [-0.65, 0.65]
    const tw = t * 1.5;

    // x = cos t·(2.4 + w·cos tw), y = w·sin tw·1.2 + sin(2t)·0.35, z = sin t·(2.4 + w·cos tw)
    const factor = 2.4 + w * Math.cos(tw);
    arr[i * 3] = Math.cos(t) * factor;
    arr[i * 3 + 1] = w * Math.sin(tw) * 1.2 + Math.sin(2 * t) * 0.35;
    arr[i * 3 + 2] = Math.sin(t) * factor;
  }
  return arr;
}

export function torus(N) {
  const arr = new Float32Array(N * 3);
  const R = 2.1;
  for (let i = 0; i < N; i++) {
    const r = 0.75 + (Math.random() - 0.5) * 0.1; // 0.75 ± 0.05
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;

    arr[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    arr[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
    arr[i * 3 + 2] = r * Math.sin(v);
  }
  return arr;
}

export function cube(N) {
  const arr = new Float32Array(N * 3);
  const s = 1.65; // half-size 1.65
  for (let i = 0; i < N; i++) {
    const face = Math.floor(Math.random() * 6);
    const u = (Math.random() * 2 - 1) * s;
    const v = (Math.random() * 2 - 1) * s;

    switch (face) {
      case 0: // +X
        arr[i * 3] = s; arr[i * 3 + 1] = u; arr[i * 3 + 2] = v;
        break;
      case 1: // -X
        arr[i * 3] = -s; arr[i * 3 + 1] = u; arr[i * 3 + 2] = v;
        break;
      case 2: // +Y
        arr[i * 3] = u; arr[i * 3 + 1] = s; arr[i * 3 + 2] = v;
        break;
      case 3: // -Y
        arr[i * 3] = u; arr[i * 3 + 1] = -s; arr[i * 3 + 2] = v;
        break;
      case 4: // +Z
        arr[i * 3] = u; arr[i * 3 + 1] = v; arr[i * 3 + 2] = s;
        break;
      case 5: // -Z
        arr[i * 3] = u; arr[i * 3 + 1] = v; arr[i * 3 + 2] = -s;
        break;
    }
  }
  return arr;
}

/**
 * Face: samples points from a greyscale reference image, brighter pixels
 * attract more particles. Depth comes from brightness plus a gentle curve so
 * it reads as a relief rather than a flat sheet.
 * `pixels` is ImageData.data (RGBA) of a w×h image.
 */
export function faceFromImage(N, pixels, w, h) {
  const arr = new Float32Array(N * 3);
  const height = 7.8;
  // Nudge down so the head has headroom and the shoulders bleed off the bottom
  const yOffset = -0.55;
  const scale = height / h;
  const halfW = (w * scale) / 2;
  const halfH = height / 2;

  let i = 0;
  let guard = 0;
  while (i < N && guard < N * 400) {
    guard++;
    const px = Math.floor(Math.random() * w);
    const py = Math.floor(Math.random() * h);
    const lum = pixels[(py * w + px) * 4] / 255;
    // Rejection sampling weighted by brightness; skip near-black background
    if (lum < 0.12 || Math.random() > Math.pow(lum, 1.4)) continue;

    const x = (px + Math.random()) * scale - halfW;
    const y = halfH - (py + Math.random()) * scale + yOffset;
    const nx = x / halfW;
    const z = (lum - 0.5) * 0.5 + Math.cos(nx * Math.PI * 0.5) * 0.7;

    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
    i++;
  }
  // Fallback for any unfilled slots (should not happen with a valid image)
  for (; i < N; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 2;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 2;
    arr[i * 3 + 2] = 0;
  }
  return arr;
}

/**
 * Earth: points spread uniformly over a sphere, kept densely on land and
 * sparsely over the oceans using an equirectangular land mask.
 * `pixels` is ImageData.data (RGBA) of a w×h mask (white = land).
 */
export function earthFromMask(N, pixels, w, h) {
  const arr = new Float32Array(N * 3);
  const R = 2.3;
  const OCEAN_KEEP = 0.05; // fraction of ocean samples kept, so the sphere still reads

  let i = 0;
  let guard = 0;
  while (i < N && guard < N * 200) {
    guard++;
    const lat = Math.asin(Math.random() * 2 - 1);
    const lon = (Math.random() * 2 - 1) * Math.PI;
    const mx = Math.min(w - 1, Math.floor(((lon + Math.PI) / (Math.PI * 2)) * w));
    const my = Math.min(h - 1, Math.floor(((Math.PI / 2 - lat) / Math.PI) * h));
    const land = pixels[(my * w + mx) * 4] > 127;
    if (!land && Math.random() > OCEAN_KEEP) continue;

    const r = R + (land ? Math.random() * 0.05 : 0);
    // lon 0 faces +Z, east to the right, so the map isn't mirrored
    arr[i * 3] = Math.cos(lat) * Math.sin(lon) * r;
    arr[i * 3 + 1] = Math.sin(lat) * r;
    arr[i * 3 + 2] = Math.cos(lat) * Math.cos(lon) * r;
    i++;
  }
  for (; i < N; i++) {
    arr[i * 3] = 0;
    arr[i * 3 + 1] = 0;
    arr[i * 3 + 2] = R;
  }
  return arr;
}

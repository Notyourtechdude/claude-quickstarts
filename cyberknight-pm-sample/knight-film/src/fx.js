// Background world, HUD, post effects and canvas particle helpers.
import { gsap } from "./gsap.js";
import { C, s, h, rng, KNIGHT } from "./brand.js";

export function buildDefs(svg) {
  const defs = s("defs", {}, svg);
  defs.innerHTML = `
    <radialGradient id="bgGlow" cx="960" cy="1250" r="1150" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#3A0309"/><stop offset="0.42" stop-color="#0C0204"/><stop offset="1" stop-color="#000"/>
    </radialGradient>
    <radialGradient id="spot" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${C.red}" stop-opacity="0.55"/><stop offset="1" stop-color="${C.red}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="spotWhite" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#fff" stop-opacity="0.16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="redSweep" x1="0" x2="1">
      <stop offset="0" stop-color="${C.deep}"/><stop offset="0.5" stop-color="${C.red}"/><stop offset="1" stop-color="${C.deep}"/>
    </linearGradient>
    <pattern id="dots" width="48" height="48" patternUnits="userSpaceOnUse">
      <circle cx="24" cy="24" r="1.5" fill="#fff" fill-opacity="0.10"/>
    </pattern>
    <pattern id="hex" width="42" height="72.75" patternUnits="userSpaceOnUse" patternTransform="scale(0.9)">
      <path d="M21 0 L42 12.1 L42 36.4 L21 48.5 L0 36.4 L0 12.1 Z M21 48.5 L21 72.75" fill="none" stroke="${C.core}" stroke-width="1.4"/>
    </pattern>
    <linearGradient id="fadeR" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <mask id="hexMask"><rect x="0" y="0" width="420" height="1080" fill="url(#fadeR)"/></mask>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glowBig" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="18" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
    <linearGradient id="scrimL" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity="0.82"/><stop offset="0.38" stop-color="#000" stop-opacity="0.55"/><stop offset="0.62" stop-color="#000" stop-opacity="0"/></linearGradient>
    <linearGradient id="scrimB" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.75"/></linearGradient>
    <filter id="holo" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="mblurX" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur stdDeviation="0 0"/></filter>
  `;
  return defs;
}

/** Film grain from a few pre-rolled noise tiles, cycled per frame (deterministic). */
export function makeGrain(canvas) {
  const g = canvas.getContext("2d");
  const tiles = [];
  const R = rng(99);
  for (let k = 0; k < 8; k++) {
    const c = document.createElement("canvas"); c.width = 960; c.height = 540;
    const cg = c.getContext("2d");
    const img = cg.createImageData(960, 540);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.floor(R() * 255);
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    cg.putImageData(img, 0, 0);
    tiles.push(c);
  }
  return (t) => { g.drawImage(tiles[Math.floor(t * 30) % tiles.length], 0, 0); };
}

/** Samples N points inside the knight (evenodd), in knight-local coords centred on the mark. */
export function sampleKnight(n, seed = 3) {
  const c = document.createElement("canvas"); c.width = 500; c.height = 500;
  const g = c.getContext("2d");
  g.fillStyle = "#fff"; g.fill(new Path2D(KNIGHT.d), "evenodd");
  return sampleCanvas(c, n, seed, KNIGHT.cx, KNIGHT.cy);
}

/** Samples N points inside a glyph string rendered with `font`. */
export function sampleText(text, font, n, seed = 5, w = 800, h = 800) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d");
  g.fillStyle = "#fff"; g.font = font; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(text, w / 2, h / 2);
  return sampleCanvas(c, n, seed, w / 2, h / 2);
}

function sampleCanvas(c, n, seed, ox, oy) {
  const g = c.getContext("2d");
  const { data, width, height } = g.getImageData(0, 0, c.width, c.height);
  const R = rng(seed);
  const pts = [];
  let guard = 0;
  while (pts.length < n && guard++ < n * 400) {
    const x = Math.floor(R() * width), y = Math.floor(R() * height);
    if (data[(y * width + x) * 4 + 3] > 128) pts.push([x - ox, y - oy]);
  }
  return pts;
}

/** Persistent HUD: corner brackets, running timecode, chapter label and a segmented progress rail. */
export function buildHud(ctx, chapters) {
  const hud = ctx.hud;
  const mk = (txt, style, cls = "m") => h("div", { cls, text: txt, parent: hud, style: { fontSize: "15px", color: C.dim, ...style } });
  const tlbl = mk("CYBERKNIGHT // ACADEMY", { left: "64px", top: "46px" });
  const trbl = mk("MODULE 01 — PRODUCT MANAGEMENT", { right: "64px", top: "46px" });
  const chap = mk("", { left: "64px", bottom: "44px", color: "#fff" });
  const tc = mk("00:00:00", { right: "64px", bottom: "44px" });
  const dotRec = h("div", { parent: hud, style: { left: "40px", top: "50px", width: "10px", height: "10px", borderRadius: "5px", background: C.red } });
  const rail = h("div", { parent: hud, style: { left: "64px", right: "64px", bottom: "30px", height: "3px", display: "flex", gap: "8px" } });
  const segs = chapters.map((c) => {
    const seg = h("div", { parent: rail, style: { flex: `${c.t1 - c.t0}`, height: "3px", background: "rgba(255,255,255,0.14)", position: "relative", overflow: "hidden" } });
    const fill = h("div", { parent: seg, style: { position: "absolute", left: 0, top: 0, bottom: 0, width: "0%", background: C.red } });
    return { ...c, fill };
  });
  // brackets
  const br = s("g", { id: "brackets", stroke: "rgba(255,255,255,0.35)", "stroke-width": 2, fill: "none" }, ctx.svgTop);
  for (const [x, y, sx, sy] of [[36, 36, 1, 1], [1884, 36, -1, 1], [36, 1044, 1, -1], [1884, 1044, -1, -1]]) s("path", { d: `M${x} ${y + sy * 28} V${y} H${x + sx * 28}`, class: "brk" }, br);
  const all = [tlbl, trbl, chap, tc, dotRec, rail];
  gsap.set(all, { autoAlpha: 0 });
  gsap.set(br, { autoAlpha: 0 });
  return {
    els: all, brackets: br,
    update(t) {
      const f = Math.floor(t * 60) % 60, sec = Math.floor(t) % 60;
      tc.textContent = `00:${String(sec).padStart(2, "0")}:${String(f).padStart(2, "0")}  ▸ 60FPS`;
      const cur = segs.find((c) => t >= c.t0 && t < c.t1) || segs[segs.length - 1];
      chap.textContent = `${cur.n}  /  ${cur.label}`;
      for (const c of segs) c.fill.style.width = `${Math.max(0, Math.min(1, (t - c.t0) / (c.t1 - c.t0))) * 100}%`;
      dotRec.style.opacity = Math.floor(t * 2) % 2 ? 0.25 : 1;
    },
  };
}

/** Jitter glitch for an HTML text wrapper: a few frames of offset, skew and red/white channel split. */
export function glitchHTML(tl, wrap, at, { frames = 5, amp = 26, seed = 1 } = {}) {
  const R = rng(seed);
  for (let f = 0; f < frames; f++) {
    const dx = (R() - 0.5) * 2 * amp;
    tl.set(wrap, { x: dx, skewX: (R() - 0.5) * 16, textShadow: `${-dx * 0.5}px 0 ${C.red}, ${dx * 0.4}px 0 rgba(255,255,255,0.6)` }, at + f / 30);
  }
  tl.set(wrap, { x: 0, skewX: 0, textShadow: "none" }, at + frames / 30);
}

let clipId = 0;
/** Slice glitch for an SVG element with an id: <use> clones in horizontal bands jitter for a few frames. */
export function glitchSVG(ctx, tl, target, at, { frames = 6, amp = 34, bands = 7, seed = 2, box = [0, 0, 1920, 1080] } = {}) {
  const R = rng(seed);
  const parent = target.parentNode;
  const uses = [];
  const [bx, by, bw, bh] = box;
  for (let i = 0; i < bands; i++) {
    const id = `gclip${clipId++}`;
    const cp = s("clipPath", { id, clipPathUnits: "userSpaceOnUse" }, ctx.defs);
    const y0 = by + (i / bands) * bh + (R() - 0.5) * 20;
    s("rect", { x: bx - 200, y: y0, width: bw + 400, height: bh / bands + 6 }, cp);
    const wrap = s("g", { "clip-path": `url(#${id})`, opacity: 0 }, parent);
    const u = s("use", { href: `#${target.id}` }, wrap);
    uses.push({ wrap, u });
  }
  for (let f = 0; f < frames; f++) {
    for (const { wrap, u } of uses) {
      const on = R() > 0.25;
      tl.set(wrap, { opacity: on ? 1 : 0 }, at + f / 30);
      tl.set(u, { x: (R() - 0.5) * 2 * amp * (R() > 0.6 ? 2 : 1) }, at + f / 30);
    }
    tl.set(target, { opacity: f % 2 ? 0.0 : 0.35 }, at + f / 30);
  }
  tl.set(uses.map((u) => u.wrap), { opacity: 0 }, at + frames / 30);
  tl.set(target, { opacity: 1 }, at + frames / 30);
}

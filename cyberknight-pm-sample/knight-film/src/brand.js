// CyberKnight brand tokens (from the Bloom brand kit) + small DOM/random helpers shared by every scene.
import { gsap } from "./gsap.js";
import { CustomEase } from "./gsap.js";

gsap.registerPlugin(CustomEase);

export const C = {
  black: "#000000",
  ink: "#040404",       // Armor Wash
  panel: "#0B0B0F",
  line: "#1B1B22",
  gray: "#374151",      // Border Gray
  red: "#DB0923",       // Accent / UI red (graphics)
  redText: "#EE3B52",   // brand red lifted to pass AA as type on black
  core: "#CD0A21",      // Chinese Red, the core mark
  deep: "#50040D",      // Saving Light, burgundy shadow tone
  white: "#FFFFFF",
  dim: "rgba(255,255,255,0.62)",
  faint: "rgba(255,255,255,0.14)",
};

// Knight mark, vectorised from the official vertical logo (500×500 artboard).
// Fill with fill-rule="evenodd"; the red layer is the same shape offset by SHADOW.
export const KNIGHT = {
  outer: "M246 42 L212 89 L145 142 L173 269 L164 271 L145 355 L352 355 L338 272 L320 271 L325 248 L301 200 L327 197 L352 121 L250 83 Z",
  slot: "M182 304 L314 304 L314 322 L183 322 Z",
  inner: "M236 110 L310 141 L299 164 L249 164 L287 250 L278 270 L213 270 L186 155 Z",
  cx: 248.5, cy: 198.5, w: 207, h: 313,
  shadow: [6, -8],
};
KNIGHT.d = `${KNIGHT.outer} ${KNIGHT.slot} ${KNIGHT.inner}`;

export const ease = {
  whip: CustomEase.create("whip", "M0,0 C0.72,0 0.08,1 1,1"),
  snap: CustomEase.create("snap", "M0,0 C0.18,0.9 0.3,1 1,1"),
  slam: CustomEase.create("slam", "M0,0 C0.5,0 0.6,0.04 0.75,0.2 0.86,0.36 0.9,1.12 1,1"),
  land: CustomEase.create("land", "M0,0 C0.4,0 0.7,0.3 1,1"),
};

export const SVGNS = "http://www.w3.org/2000/svg";

/** Create an SVG element. `attrs` may include `text` for textContent. */
export function s(tag, attrs = {}, parent) {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "text") n.textContent = v;
    else if (v !== undefined && v !== null) n.setAttribute(k, v);
  }
  if (parent) parent.appendChild(n);
  return n;
}

/** Create an HTML element positioned absolutely in the 1920×1080 stage. */
export function h(tag, { cls = "", text, html, style = {}, parent } = {}) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  if (html !== undefined) n.innerHTML = html;
  Object.assign(n.style, style);
  if (parent) parent.appendChild(n);
  return n;
}

/** Deterministic PRNG so every render is identical. */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
export const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t)));
export const easeInOutCubic = (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

/** Draws the knight (white + red offset) into `parent`, centred on its own origin. */
export function knightMark(parent, { scale = 1, id, fill = C.white, shadow = C.core } = {}) {
  const g = s("g", { id }, parent);
  const inner = s("g", { transform: `scale(${scale}) translate(${-KNIGHT.cx} ${-KNIGHT.cy})` }, g);
  const red = s("path", { d: KNIGHT.d, fill: shadow, "fill-rule": "evenodd", transform: `translate(${KNIGHT.shadow[0]} ${KNIGHT.shadow[1]})` }, inner);
  const white = s("path", { d: KNIGHT.d, fill, "fill-rule": "evenodd" }, inner);
  return { g, inner, red, white };
}

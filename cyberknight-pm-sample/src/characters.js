// Rigged flat-vector characters. Each rig is a tree of pivot groups (rotation origin = local 0,0)
// so GSAP can pose limbs with plain `rotation` tweens. Feet sit at y = 0; the figure is ~450 units tall.
import { gsap } from "../node_modules/gsap/index.js";
import { C, s, rng } from "./brand.js";

const ROLES = {
  pm: {
    skin: "#E7B48F", skinShade: "#C9906C", hair: "#121216", hairStyle: "bob",
    top: C.core, topShade: "#8E0716", sleeve: C.core, pants: "#16161B", shoes: "#0A0A0C", outfit: "blazer",
  },
  dev: {
    skin: "#8B5A3C", skinShade: "#6E4329", hair: "#141416", hairStyle: "short",
    top: "#26272F", topShade: "#1A1B21", sleeve: "#26272F", pants: "#2B3A55", shoes: "#EDEDED", outfit: "hoodie", beard: true,
  },
  designer: {
    skin: "#B97A4E", skinShade: "#98603A", hair: "#2A1A13", hairStyle: "puff",
    top: "#DCDCE2", topShade: "#B7B7C0", sleeve: "#DCDCE2", pants: "#141418", shoes: C.red, outfit: "jacket", glasses: "round",
  },
  exec: {
    skin: "#EFC6A6", skinShade: "#D3A585", hair: "#A3A8AE", hairStyle: "side",
    top: "#121217", topShade: "#07070A", sleeve: "#121217", pants: "#121217", shoes: "#050506", outfit: "suit", glasses: "rect",
  },
};

function pivot(parent, x, y, cls) {
  const outer = s("g", { transform: `translate(${x} ${y})` }, parent);
  const inner = s("g", { class: cls }, outer);
  return inner;
}

export function makeCharacter(parent, role, { x = 0, y = 0, scale = 1, flip = false, id } = {}) {
  const P = ROLES[role];
  const root = s("g", { id, class: `char char-${role}` }, parent);
  const shadow = s("ellipse", { cx: 0, cy: 0, rx: 70, ry: 12, fill: "#000", opacity: 0.55 }, root);
  const glowRing = s("ellipse", { cx: 0, cy: 0, rx: 92, ry: 18, fill: "none", stroke: C.red, "stroke-width": 3, opacity: 0 }, root);
  const body = s("g", { class: "body" }, root);
  const facing = s("g", { transform: flip ? "scale(-1 1)" : "" }, body);

  // ── legs ──
  const legs = [];
  for (const side of [-1, 1]) {
    const leg = pivot(facing, side * 24, -200, "leg");
    s("rect", { x: -17, y: -6, width: 34, height: 186, rx: 14, fill: P.pants }, leg);
    s("rect", { x: -20 + side * 5, y: 174, width: 44, height: 24, rx: 12, fill: P.shoes }, leg);
    if (role === "dev") s("rect", { x: -18 + side * 5, y: 184, width: 40, height: 4, fill: C.red }, leg);
    legs.push(leg);
  }

  // ── torso (pivot at hips) ──
  const torso = pivot(facing, 0, -200, "torso");
  if (P.outfit === "hoodie") s("ellipse", { cx: 0, cy: -140, rx: 52, ry: 20, fill: P.topShade }, torso); // hood
  const torsoPath = "M-54,-135 C-68,-133 -70,-120 -67,-100 L-52,6 L52,6 L67,-100 C70,-120 68,-133 54,-135 Z";
  s("path", { d: torsoPath, fill: P.top }, torso);
  s("path", { d: "M8,-135 L54,-135 C68,-133 70,-120 67,-100 L52,6 L20,6 Z", fill: P.topShade, opacity: 0.35 }, torso);
  if (P.outfit === "blazer") {
    s("path", { d: "M-22,-136 L0,-88 L22,-136 Z", fill: "#F4F4F6" }, torso);
    s("path", { d: "M-30,-134 L-4,-84 L-20,-96 L-38,-128 Z", fill: P.topShade }, torso);
    s("path", { d: "M30,-134 L4,-84 L20,-96 L38,-128 Z", fill: P.topShade }, torso);
    s("circle", { cx: 0, cy: -62, r: 3.5, fill: "#5B0510" }, torso);
    s("circle", { cx: 0, cy: -40, r: 3.5, fill: "#5B0510" }, torso);
    s("rect", { x: 22, y: -106, width: 18, height: 12, rx: 3, fill: "#F4F4F6", opacity: 0.9 }, torso); // badge
  } else if (P.outfit === "hoodie") {
    s("rect", { x: -38, y: -58, width: 76, height: 40, rx: 12, fill: P.topShade }, torso);
    s("path", { d: "M-10,-132 L-13,-96", stroke: C.red, "stroke-width": 3.5, "stroke-linecap": "round" }, torso);
    s("path", { d: "M10,-132 L13,-96", stroke: C.red, "stroke-width": 3.5, "stroke-linecap": "round" }, torso);
    s("path", { d: "M-40,-136 Q0,-104 40,-136", stroke: "#0E0E12", "stroke-width": 9, fill: "none", "stroke-linecap": "round" }, torso);
    s("rect", { x: -48, y: -146, width: 16, height: 20, rx: 6, fill: C.red }, torso); // headphone cups
    s("rect", { x: 32, y: -146, width: 16, height: 20, rx: 6, fill: C.red }, torso);
  } else if (P.outfit === "jacket") {
    s("path", { d: "M-20,-136 L0,-96 L20,-136 Z", fill: "#15151A" }, torso);
    s("path", { d: "M-3,-96 L-3,6 M3,-96 L3,6", stroke: P.topShade, "stroke-width": 2 }, torso);
  } else if (P.outfit === "suit") {
    s("path", { d: "M-22,-136 L0,-84 L22,-136 Z", fill: "#F4F4F6" }, torso);
    s("path", { d: "M-5,-130 L5,-130 L7,-118 L3,-74 L0,-66 L-3,-74 L-7,-118 Z", fill: C.red }, torso);
    s("path", { d: "M-30,-134 L-3,-80 L-18,-94 L-38,-128 Z", fill: "#050507" }, torso);
    s("path", { d: "M30,-134 L3,-80 L18,-94 L38,-128 Z", fill: "#050507" }, torso);
    s("path", { d: "M-40,-110 L-24,-110", stroke: C.red, "stroke-width": 4, "stroke-linecap": "round" }, torso); // pocket square
  }
  // red rim light down the torso's right side
  s("path", { d: "M58,-130 C66,-126 67,-112 65,-100 L51,4", stroke: C.red, "stroke-width": 3, fill: "none", opacity: 0.85, "stroke-linecap": "round" }, torso);

  // ── head (pivot at the neck) ──
  s("rect", { x: -11, y: -152, width: 22, height: 22, fill: P.skinShade }, torso);
  const head = pivot(torso, 0, -145, "head");
  if (P.hairStyle === "bob") {
    s("path", { d: "M-56,-60 A56,58 0 0 1 56,-60 L56,-16 Q56,-4 44,-4 L-44,-4 Q-56,-4 -56,-16 Z", fill: P.hair }, head);
  } else if (P.hairStyle === "puff") {
    for (const [cx, cy, r] of [[0, -84, 56], [-40, -66, 34], [40, -66, 34], [-26, -110, 30], [26, -110, 30], [0, -122, 28]]) s("circle", { cx, cy, r, fill: P.hair }, head);
  }
  s("circle", { cx: -44, cy: -48, r: 9, fill: P.skinShade }, head);
  s("circle", { cx: 44, cy: -48, r: 9, fill: P.skinShade }, head);
  s("ellipse", { cx: 0, cy: -52, rx: 44, ry: 50, fill: P.skin }, head);
  s("path", { d: "M12,-100 A44,50 0 0 1 12,-4 A52,56 0 0 0 12,-100 Z", fill: P.skinShade, opacity: 0.35 }, head);
  if (P.beard) s("path", { d: "M-42,-52 C-40,2 40,2 42,-52 C34,-30 22,-24 0,-24 C-22,-24 -34,-30 -42,-52 Z", fill: "#1E1511" }, head);
  // cheeks
  s("ellipse", { cx: -24, cy: -34, rx: 8, ry: 5, fill: "#E0708A", opacity: 0.25 }, head);
  s("ellipse", { cx: 24, cy: -34, rx: 8, ry: 5, fill: "#E0708A", opacity: 0.25 }, head);
  // eyes (blink = scaleY on this group)
  const eyes = s("g", { class: "eyes" }, head);
  const pupils = s("g", {}, eyes);
  for (const ex of [-16, 16]) {
    s("ellipse", { cx: ex, cy: -52, rx: 5.5, ry: 7, fill: "#101014" }, pupils);
    s("circle", { cx: ex + 2, cy: -55, r: 1.8, fill: "#fff" }, pupils);
  }
  // brows
  const browL = pivot(head, -16, -68, "brow");
  s("rect", { x: -9, y: -2.5, width: 18, height: 5, rx: 2.5, fill: P.hairStyle === "side" ? "#6D7278" : "#121216" }, browL);
  const browR = pivot(head, 16, -68, "brow");
  s("rect", { x: -9, y: -2.5, width: 18, height: 5, rx: 2.5, fill: P.hairStyle === "side" ? "#6D7278" : "#121216" }, browR);
  // nose
  s("path", { d: "M1,-46 Q6,-36 -1,-34", stroke: P.skinShade, "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, head);
  // mouths
  const mouth = s("g", { class: "mouth" }, head);
  const mouths = {
    smile: s("path", { d: "M-11,-24 Q0,-14 11,-24", stroke: "#3A0A10", "stroke-width": 3.5, fill: "none", "stroke-linecap": "round" }, mouth),
    grin: s("path", { d: "M-13,-26 Q0,-4 13,-26 Z", fill: "#3A0A10" }, mouth),
    open: s("ellipse", { cx: 0, cy: -21, rx: 8, ry: 7, fill: "#3A0A10" }, mouth),
    small: s("ellipse", { cx: 0, cy: -22, rx: 6, ry: 3.5, fill: "#3A0A10" }, mouth),
    flat: s("path", { d: "M-9,-22 L9,-22", stroke: "#3A0A10", "stroke-width": 3.5, "stroke-linecap": "round" }, mouth),
    frown: s("path", { d: "M-10,-18 Q0,-28 10,-18", stroke: "#3A0A10", "stroke-width": 3.5, fill: "none", "stroke-linecap": "round" }, mouth),
  };
  for (const [k, m] of Object.entries(mouths)) m.setAttribute("opacity", k === "smile" ? 1 : 0);
  // front hair
  if (P.hairStyle === "bob") {
    s("path", { d: "M-48,-58 C-52,-100 -22,-110 4,-108 C32,-108 52,-92 48,-58 C40,-78 20,-88 -6,-86 C-24,-82 -36,-72 -48,-58 Z", fill: P.hair }, head);
    s("path", { d: "M-30,-94 C-14,-102 10,-104 28,-96", stroke: C.red, "stroke-width": 3, fill: "none", opacity: 0.8, "stroke-linecap": "round" }, head);
  } else if (P.hairStyle === "short") {
    s("path", { d: "M-46,-62 C-48,-106 48,-106 46,-62 C38,-86 -38,-86 -46,-62 Z", fill: P.hair }, head);
  } else if (P.hairStyle === "side") {
    s("path", { d: "M-46,-60 C-48,-104 48,-106 46,-62 C40,-80 12,-92 -18,-88 C-34,-84 -42,-72 -46,-60 Z", fill: P.hair }, head);
  }
  if (P.glasses === "round") {
    s("circle", { cx: -16, cy: -52, r: 12, stroke: "#101014", "stroke-width": 3, fill: "rgba(255,255,255,0.08)" }, head);
    s("circle", { cx: 16, cy: -52, r: 12, stroke: "#101014", "stroke-width": 3, fill: "rgba(255,255,255,0.08)" }, head);
    s("path", { d: "M-4,-54 L4,-54", stroke: "#101014", "stroke-width": 3 }, head);
  } else if (P.glasses === "rect") {
    s("rect", { x: -29, y: -61, width: 25, height: 17, rx: 4, stroke: "#101014", "stroke-width": 3, fill: "rgba(255,255,255,0.08)" }, head);
    s("rect", { x: 4, y: -61, width: 25, height: 17, rx: 4, stroke: "#101014", "stroke-width": 3, fill: "rgba(255,255,255,0.08)" }, head);
    s("path", { d: "M-4,-54 L4,-54", stroke: "#101014", "stroke-width": 3 }, head);
  }
  // rim light on the head
  s("path", { d: "M25,-93 A44,50 0 0 1 25,-11", stroke: C.red, "stroke-width": 3, fill: "none", opacity: 0.9, "stroke-linecap": "round" }, head);

  // ── props held in front of the body ──
  const props = {};
  if (role === "dev") {
    const lap = s("g", { transform: "translate(0 -46)", opacity: 0 }, torso);
    s("path", { d: "M-58,-62 L58,-62 L54,14 L-54,14 Z", fill: "#2E2F38" }, lap);
    s("path", { d: "M-58,-62 L58,-62 L54,14 L-54,14 Z", fill: "none", stroke: C.red, "stroke-width": 2, opacity: 0.6 }, lap);
    const kn = s("g", { transform: "translate(0 -24) scale(0.11) translate(-248.5 -198.5)" }, lap);
    s("path", { d: "M246 42 L212 89 L145 142 L173 269 L164 271 L145 355 L352 355 L338 272 L320 271 L325 248 L301 200 L327 197 L352 121 L250 83 Z M182 304 L314 304 L314 322 L183 322 Z M236 110 L310 141 L299 164 L249 164 L287 250 L278 270 L213 270 L186 155 Z", fill: C.red, "fill-rule": "evenodd", transform: "translate(6 -8)" }, kn);
    s("path", { d: "M246 42 L212 89 L145 142 L173 269 L164 271 L145 355 L352 355 L338 272 L320 271 L325 248 L301 200 L327 197 L352 121 L250 83 Z M182 304 L314 304 L314 322 L183 322 Z M236 110 L310 141 L299 164 L249 164 L287 250 L278 270 L213 270 L186 155 Z", fill: "#fff", "fill-rule": "evenodd" }, kn);
    props.laptop = lap;
  }

  // ── arms (pivot at shoulders) ──
  const arms = [], fores = [], hands = [];
  for (const side of [-1, 1]) {
    const arm = pivot(torso, side * 58, -124, "arm");
    s("rect", { x: -13, y: -10, width: 26, height: 80, rx: 13, fill: P.sleeve }, arm);
    const fore = pivot(arm, 0, 64, "fore");
    s("rect", { x: -12, y: -6, width: 24, height: 64, rx: 12, fill: P.sleeve }, fore);
    if (P.outfit === "blazer" || P.outfit === "suit") s("rect", { x: -12, y: 48, width: 24, height: 7, rx: 3, fill: "#F4F4F6" }, fore);
    const hand = s("g", { transform: "translate(0 66)" }, fore);
    s("circle", { cx: 0, cy: 0, r: 13, fill: P.skin }, hand);
    arms.push(arm); fores.push(fore); hands.push(hand);
  }
  if (role === "designer") {
    s("path", { d: "M4,-4 L22,-40", stroke: "#fff", "stroke-width": 5, "stroke-linecap": "round" }, hands[1]);
    s("path", { d: "M20,-36 L24,-44", stroke: C.red, "stroke-width": 5, "stroke-linecap": "round" }, hands[1]);
  }
  if (role === "pm") {
    const tab = s("g", { transform: "translate(0 4) rotate(-8)", opacity: 0 }, hands[0]);
    s("rect", { x: -26, y: -40, width: 52, height: 70, rx: 7, fill: "#1B1B22", stroke: "#3A3A44", "stroke-width": 2 }, tab);
    s("rect", { x: -20, y: -33, width: 40, height: 6, rx: 3, fill: C.red }, tab);
    s("rect", { x: -20, y: -21, width: 30, height: 4, rx: 2, fill: "#fff", opacity: 0.6 }, tab);
    s("rect", { x: -20, y: -12, width: 36, height: 4, rx: 2, fill: "#fff", opacity: 0.4 }, tab);
    s("rect", { x: -20, y: -3, width: 24, height: 4, rx: 2, fill: "#fff", opacity: 0.4 }, tab);
    props.tablet = tab;
  }

  // ── GSAP pivots ──
  gsap.set([...legs, torso, head, ...arms, ...fores, browL, browR], { svgOrigin: "0 0" });
  gsap.set(body, { svgOrigin: "0 0" });
  gsap.set(eyes, { svgOrigin: "0 -52" });
  gsap.set(root, { svgOrigin: "0 0" });
  gsap.set(root, { x, y, scale });
  gsap.set(arms[0], { rotation: 7 });
  gsap.set(arms[1], { rotation: -7 });

  const rig = { root, body, legs, torso, head, eyes, pupils, browL, browR, arms, fores, hands, mouths, shadow, glowRing, props };
  return new Character(role, rig);
}

export class Character {
  constructor(role, rig) {
    this.role = role;
    Object.assign(this, rig);
    this.rand = rng(role.length * 977 + 13);
  }

  /** Tween named joints to target angles. keys: armL armR foreL foreR head torso legL legR */
  pose(tl, at, p, dur = 0.35, ease = "back.out(1.6)") {
    const map = { armL: this.arms[0], armR: this.arms[1], foreL: this.fores[0], foreR: this.fores[1], head: this.head, torso: this.torso, legL: this.legs[0], legR: this.legs[1] };
    for (const [k, v] of Object.entries(p)) tl.to(map[k], { rotation: v, duration: dur, ease }, at);
    return this;
  }

  mouth(tl, at, state) {
    for (const [k, m] of Object.entries(this.mouths)) tl.set(m, { opacity: k === state ? 1 : 0 }, at);
    return this;
  }

  talk(tl, t0, t1, rest = "smile") {
    let t = t0;
    const shapes = ["open", "small", "open", "grin", "small", "flat"];
    while (t < t1) {
      this.mouth(tl, t, shapes[Math.floor(this.rand() * shapes.length)]);
      t += 0.075 + this.rand() * 0.07;
    }
    this.mouth(tl, t1, rest);
    return this;
  }

  blink(tl, at) {
    tl.to(this.eyes, { scaleY: 0.08, duration: 0.06, ease: "power2.in" }, at);
    tl.to(this.eyes, { scaleY: 1, duration: 0.09, ease: "power2.out" }, at + 0.07);
    return this;
  }

  blinks(tl, t0, t1, every = 1.9) {
    for (let t = t0 + this.rand() * 0.8; t < t1 - 0.2; t += every * (0.7 + this.rand() * 0.6)) this.blink(tl, t);
    return this;
  }

  brows(tl, at, mood = "neutral", dur = 0.2) {
    const m = { neutral: [0, 0, 0], angry: [16, -16, 3], up: [-6, 6, -5], worried: [-14, 14, -2] }[mood];
    tl.to(this.browL, { rotation: m[0], y: m[2], duration: dur, ease: "power2.out" }, at);
    tl.to(this.browR, { rotation: m[1], y: m[2], duration: dur, ease: "power2.out" }, at);
    return this;
  }

  look(tl, at, dx = 0, dur = 0.25) {
    tl.to(this.pupils, { x: dx * 5, duration: dur, ease: "power3.out" }, at);
    tl.to(this.head, { rotation: dx * 6, duration: dur * 1.6, ease: "power3.out" }, at);
    return this;
  }

  breathe(tl, t0, t1, amp = 0.018, period = 1.6) {
    const n = Math.max(1, Math.floor((t1 - t0) / (period / 2)));
    tl.fromTo(this.torso, { scaleY: 1 }, { scaleY: 1 + amp, duration: period / 2, ease: "sine.inOut", repeat: n - 1, yoyo: true, immediateRender: false }, t0);
    tl.to(this.torso, { scaleY: 1, duration: 0.2 }, t0 + n * period / 2);
    return this;
  }

  /** Instantly place + reset to the rest pose (used when a character enters a new scene). */
  place(tl, at, { x, y, scale, show = true } = {}) {
    const v = { autoAlpha: show ? 1 : 0 };
    if (x !== undefined) v.x = x;
    if (y !== undefined) v.y = y;
    if (scale !== undefined) v.scale = scale;
    tl.set(this.root, v, at);
    tl.set([...this.legs, this.torso, this.head, ...this.fores], { rotation: 0 }, at);
    tl.set(this.arms[0], { rotation: 7 }, at);
    tl.set(this.arms[1], { rotation: -7 }, at);
    tl.set(this.body, { scaleX: 1, scaleY: 1, y: 0 }, at);
    tl.set(this.torso, { scaleY: 1 }, at);
    tl.set([this.browL, this.browR], { rotation: 0, y: 0 }, at);
    tl.set(this.pupils, { x: 0 }, at);
    this.mouth(tl, at, "smile");
    return this;
  }

  hide(tl, at) { tl.set(this.root, { autoAlpha: 0 }, at); return this; }

  /** Drop in from above with anticipation, stretch, squash and settle. `landAt` is the impact time. */
  dropIn(tl, landAt, { x, y, scale, fromY = -900, fall = 0.34 } = {}) {
    const r = this.root, b = this.body;
    this.place(tl, landAt - fall - 0.002, { x, y: y + fromY, scale });
    tl.set(b, { scaleY: 1.16, scaleX: 0.9 }, landAt - fall - 0.001);
    tl.to(r, { y, duration: fall, ease: "power3.in" }, landAt - fall);
    tl.to(b, { scaleY: 0.82, scaleX: 1.14, duration: 0.07, ease: "power2.out" }, landAt);
    tl.to(b, { scaleY: 1.05, scaleX: 0.97, duration: 0.14, ease: "power2.inOut" }, landAt + 0.07);
    tl.to(b, { scaleY: 1, scaleX: 1, duration: 0.3, ease: "elastic.out(1, 0.45)" }, landAt + 0.21);
    this.pose(tl, landAt - 0.001, { armL: 60, armR: -60, foreL: -30, foreR: 30 }, 0.08, "power2.out");
    this.pose(tl, landAt + 0.12, { armL: 7, armR: -7, foreL: 0, foreR: 0 }, 0.45, "elastic.out(1, 0.5)");
    tl.fromTo(this.shadow, { attr: { rx: 20 }, opacity: 0.2 }, { attr: { rx: 70 }, opacity: 0.55, duration: fall, ease: "power3.in", immediateRender: false }, landAt - fall);
    return this;
  }

  /** Pop up from below (scale from the feet) — used for quick entrances. */
  popIn(tl, at, { x, y, scale, dur = 0.5 } = {}) {
    this.place(tl, at - 0.001, { x, y, scale });
    tl.set(this.body, { scaleY: 0, scaleX: 0.6 }, at - 0.001);
    tl.to(this.body, { scaleY: 1, scaleX: 1, duration: dur, ease: "back.out(2.2)" }, at);
    return this;
  }

  wave(tl, at, cycles = 3, arm = 1) {
    const sgn = arm === 1 ? -1 : 1;
    const A = this.arms[arm], F = this.fores[arm];
    tl.to(A, { rotation: sgn * 150, duration: 0.22, ease: "back.out(2)" }, at);
    tl.fromTo(F, { rotation: sgn * -10 }, { rotation: sgn * 35, duration: 0.14, ease: "sine.inOut", repeat: cycles * 2 - 1, yoyo: true, immediateRender: false }, at + 0.1);
    tl.to(F, { rotation: 0, duration: 0.2 }, at + 0.1 + cycles * 0.28);
    tl.to(A, { rotation: sgn * 7, duration: 0.35, ease: "power3.inOut" }, at + 0.12 + cycles * 0.28);
    return this;
  }

  point(tl, at, arm = 1, angle = 95, hold = 0.6) {
    const sgn = arm === 1 ? -1 : 1;
    tl.to(this.arms[arm], { rotation: sgn * angle, duration: 0.2, ease: "back.out(2.5)" }, at);
    tl.to(this.fores[arm], { rotation: sgn * 8, duration: 0.2 }, at);
    if (hold > 0) {
      tl.to(this.arms[arm], { rotation: sgn * 7, duration: 0.3, ease: "power2.inOut" }, at + hold);
      tl.to(this.fores[arm], { rotation: 0, duration: 0.3 }, at + hold);
    }
    return this;
  }

  gesture(tl, t0, t1, arm = 1) {
    const sgn = arm === 1 ? -1 : 1;
    let t = t0, i = 0;
    while (t < t1 - 0.2) {
      const up = i % 2 === 0;
      tl.to(this.arms[arm], { rotation: sgn * (up ? 48 + this.rand() * 20 : 28), duration: 0.18, ease: "power2.out" }, t);
      tl.to(this.fores[arm], { rotation: sgn * (up ? 70 + this.rand() * 25 : 40), duration: 0.18, ease: "power2.out" }, t);
      t += 0.2 + this.rand() * 0.14; i++;
    }
    tl.to(this.arms[arm], { rotation: sgn * 7, duration: 0.3 }, t1);
    tl.to(this.fores[arm], { rotation: 0, duration: 0.3 }, t1);
    return this;
  }

  celebrate(tl, at, dur = 1.2) {
    this.pose(tl, at, { armL: 155, armR: -155, foreL: 25, foreR: -25 }, 0.22, "back.out(2)");
    tl.to(this.body, { y: -40, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1 }, at);
    this.mouth(tl, at, "grin");
    this.pose(tl, at + dur, { armL: 7, armR: -7, foreL: 0, foreR: 0 }, 0.4, "power3.inOut");
    return this;
  }

  walk(tl, t0, t1, step = 0.28) {
    const n = Math.max(2, Math.round((t1 - t0) / step));
    const d = (t1 - t0) / n;
    tl.fromTo(this.legs[0], { rotation: 20 }, { rotation: -20, duration: d, ease: "sine.inOut", repeat: n - 1, yoyo: true, immediateRender: false }, t0);
    tl.fromTo(this.legs[1], { rotation: -20 }, { rotation: 20, duration: d, ease: "sine.inOut", repeat: n - 1, yoyo: true, immediateRender: false }, t0);
    tl.fromTo(this.arms[0], { rotation: -12 }, { rotation: 22, duration: d, ease: "sine.inOut", repeat: n - 1, yoyo: true, immediateRender: false }, t0);
    tl.fromTo(this.arms[1], { rotation: -22 }, { rotation: 12, duration: d, ease: "sine.inOut", repeat: n - 1, yoyo: true, immediateRender: false }, t0);
    tl.fromTo(this.body, { y: 0 }, { y: -9, duration: d / 2, ease: "sine.inOut", repeat: n * 2 - 1, yoyo: true, immediateRender: false }, t0);
    tl.to([...this.legs], { rotation: 0, duration: 0.18, ease: "power2.out" }, t1);
    tl.to(this.arms[0], { rotation: 7, duration: 0.25 }, t1);
    tl.to(this.arms[1], { rotation: -7, duration: 0.25 }, t1);
    tl.to(this.body, { y: 0, duration: 0.18 }, t1);
    return this;
  }
}

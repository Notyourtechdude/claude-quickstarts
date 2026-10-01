// The cast: every character is CyberKnight's armoured knight, built from cut-outs of the client's own
// reference renders (tools/prep_knights.py). A cut-out can't bend its limbs, so the v1 rig's acting maps
// onto what a lit, solid figure can do:
//   · pose swaps between the reference poses, hidden by a 2-frame glitch (arms crossed ⟷ hand on chest)
//   · the visor's neon carries speech and blinks; the armour's seams carry mood ("heat")
//   · lean, hop, squash, breath and the beam-in materialise carry the body language
// The public API matches the v1 vector rig, so the scenes drive it unchanged.
import { gsap } from "../node_modules/gsap/index.js";
import { C, s, rng } from "./brand.js";
import POSES from "../assets/knight/poses.js";

const UNITS = 470;                       // figure height in stage units (the v1 cast stood ~455)
const HEAT = { idle: 0.5, warm: 0.75, hot: 1 };
const VISOR = { smile: 0.75, small: 0.85, open: 1, grin: 1, flat: 0.55, frown: 0.45 };
let uid = 0;

export function makeKnight(parent, { id, pose = "A", flip = false } = {}) {
  const n = uid++;
  const root = s("g", { id, class: "char char-knight" }, parent);
  const shadow = s("ellipse", { cx: 0, cy: 0, rx: 92, ry: 14, fill: "#000", opacity: 0.6 }, root);
  const glowRing = s("ellipse", { cx: 0, cy: 0, rx: 110, ry: 20, fill: "none", stroke: C.red, "stroke-width": 3, opacity: 0 }, root);
  const pool = s("ellipse", { cx: 0, cy: 2, rx: 120, ry: 22, fill: "url(#spot)", opacity: 0.35 }, root);   // red floor bounce
  const body = s("g", { class: "body" }, root);
  const lean = s("g", {}, body);
  const breath = s("g", {}, lean);
  const facing = s("g", { transform: flip ? "scale(-1 1)" : "" }, breath);

  // beam-in clip: a rect that grows up from the feet (kept full-size when not materialising)
  const cp = s("clipPath", { id: `kclip${n}`, clipPathUnits: "userSpaceOnUse" }, document.querySelector("#svg defs"));
  const clipRect = s("rect", { x: -700, y: -1400, width: 1400, height: 1500 }, cp);
  const clipped = s("g", { "clip-path": `url(#kclip${n})` }, facing);

  const poses = {};
  for (const [key, P] of Object.entries(POSES)) {
    const k = UNITS / P.figH;
    const geo = { x: -P.ax * k, y: -P.ay * k, width: P.w * k, height: P.h * k, preserveAspectRatio: "none" };
    const g = s("g", { class: `pose pose-${key}` }, clipped);
    s("image", { href: `assets/knight/${key}.png`, ...geo }, g);
    const glow = s("image", { href: `assets/knight/${key}_glow.png`, ...geo, style: "mix-blend-mode:screen", opacity: HEAT.idle }, g);
    const visor = s("image", { href: `assets/knight/${key}_visor.png`, ...geo, style: "mix-blend-mode:screen", opacity: VISOR.smile }, g);
    gsap.set(g, { autoAlpha: key === pose ? 1 : 0 });
    poses[key] = { g, glow, visor, chestY: -(P.ay - (P.top + P.figH * 0.3)) * k };
  }

  // the materialise scan line and the chest pulse used for gestures
  const scan = s("rect", { x: -150, y: -2, width: 300, height: 4, fill: "#ff5a6e", filter: "url(#glow)", opacity: 0 }, body);
  const pulse = s("ellipse", { cx: 0, cy: -UNITS * 0.68, rx: 30, ry: 30, fill: "none", stroke: "#ff5a6e", "stroke-width": 4, opacity: 0 }, lean);

  // holographic props (the v1 tablet / laptop), floating in front of the armour
  const props = {
    tablet: holoPanel(lean, { x: flip ? -150 : 40, y: -UNITS * 0.62, w: 110, h: 74 }),
    laptop: holoPanel(lean, { x: -70, y: -UNITS * 0.44, w: 140, h: 82 }),
  };

  // stand-ins for rig parts some scenes touch directly (head / pupils / legs had joints in v1)
  const dummy = () => s("g", {}, root);
  gsap.set([root, body, lean, breath], { svgOrigin: "0 0" });
  gsap.set(pulse, { svgOrigin: `0 ${-UNITS * 0.68}` });

  return new Knight({
    root, body, lean, breath, shadow, glowRing, pool, poses, clipRect, scan, pulse, props, home: pose,
    head: dummy(), pupils: dummy(), eyes: dummy(), browL: dummy(), browR: dummy(),
    legs: [dummy(), dummy()], arms: [dummy(), dummy()], fores: [dummy(), dummy()], hands: [dummy(), dummy()],
  }, n);
}

function holoPanel(parent, { x, y, w, h }) {
  const g = s("g", { opacity: 0, style: "mix-blend-mode:screen" }, parent);
  s("rect", { x, y, width: w, height: h, rx: 8, fill: C.red, "fill-opacity": 0.16, stroke: "#ff5a6e", "stroke-width": 2.5, filter: "url(#glow)" }, g);
  for (let i = 0; i < 3; i++) s("rect", { x: x + 12, y: y + 14 + i * 18, width: (w - 24) * [0.8, 0.55, 0.68][i], height: 6, rx: 3, fill: "#ffb3bd", opacity: 0.8 }, g);
  s("path", { d: `M${x + w / 2 - 22} ${y + h} L${x + w / 2} ${y + h + 26} L${x + w / 2 + 22} ${y + h} Z`, fill: "#ff5a6e", opacity: 0.25 }, g);
  return g;
}

export class Knight {
  constructor(rig, seed) {
    Object.assign(this, rig);
    this.role = "knight";
    this.rand = rng(seed * 977 + 13);
  }

  get all() { return Object.values(this.poses); }

  /** Swap reference pose; a 2-frame glitch with a visor flash hides the cut. */
  showPose(tl, at, key, glitch = true) {
    this.cur = key;   // build-time pose tracking (scenes add their tweens in story order)
    const to = this.poses[key];
    const others = this.all.filter((p) => p !== to).map((p) => p.g);
    if (glitch) {
      tl.set(to.g, { autoAlpha: 1, x: 10 }, at);
      tl.set(others, { autoAlpha: 0.45, x: -8 }, at);
      tl.set(others, { autoAlpha: 0, x: 0 }, at + 1 / 30);
      tl.set(to.g, { x: -5 }, at + 1 / 30);
      tl.set(to.g, { x: 0 }, at + 2 / 30);
      this.all.forEach((p) => tl.fromTo(p.visor, { opacity: 1 }, { opacity: VISOR.smile, duration: 0.25, immediateRender: false }, at));
    } else {
      tl.set(to.g, { autoAlpha: 1, x: 0 }, at);
      tl.set(others, { autoAlpha: 0, x: 0 }, at);
    }
    return this;
  }

  heat(tl, at, v, dur = 0.2) {
    tl.to(this.all.map((p) => p.glow), { opacity: v, duration: dur, ease: "power2.out" }, at);
    return this;
  }

  flare(tl, at, hold = 0.25) {
    tl.to(this.all.map((p) => p.glow), { opacity: HEAT.hot, duration: 0.06 }, at);
    tl.to(this.all.map((p) => p.glow), { opacity: HEAT.idle, duration: 0.45, ease: "power2.inOut" }, at + hold);
    tl.fromTo(this.pulse, { scale: 0.6, opacity: 0.9 }, { scale: 3.2, opacity: 0, duration: 0.5, ease: "expo.out", immediateRender: false }, at);
    return this;
  }

  /** v1 joint poses: big arm raises become a power-up flare, a "head" key becomes a nod/lean. */
  pose(tl, at, p, dur = 0.35) {
    const arms = ["armL", "armR"].filter((k) => k in p).map((k) => Math.abs(p[k]));
    if (arms.length && Math.max(...arms) >= 60) this.flare(tl, at, Math.max(0.3, dur));
    if ("head" in p) tl.to(this.lean, { rotation: p.head * 0.35, duration: dur, ease: "sine.inOut" }, at);
    return this;
  }

  mouth(tl, at, state) {
    tl.set(this.all.map((p) => p.visor), { opacity: VISOR[state] ?? VISOR.smile }, at);
    return this;
  }

  talk(tl, t0, t1, rest = "smile") {
    const v = this.all.map((p) => p.visor);
    for (let t = t0; t < t1; t += 0.06 + this.rand() * 0.07) tl.set(v, { opacity: 0.45 + this.rand() * 0.55 }, t);
    return this.mouth(tl, t1, rest);
  }

  blink(tl, at) {
    const v = this.all.map((p) => p.visor);
    tl.to(v, { opacity: 0.08, duration: 0.05, ease: "power2.in" }, at);
    tl.to(v, { opacity: VISOR.smile, duration: 0.1, ease: "power2.out" }, at + 0.07);
    return this;
  }

  blinks(tl, t0, t1, every = 1.9) {
    for (let t = t0 + this.rand() * 0.8; t < t1 - 0.2; t += every * (0.7 + this.rand() * 0.6)) this.blink(tl, t);
    return this;
  }

  brows(tl, at, mood = "neutral", dur = 0.2) {
    const v = { neutral: HEAT.idle, angry: HEAT.hot, up: HEAT.warm, worried: 0.32 }[mood] ?? HEAT.idle;
    return this.heat(tl, at, v, dur);
  }

  look(tl, at, dx = 0, dur = 0.25) {
    tl.to(this.lean, { rotation: dx * 1.6, duration: dur * 1.6, ease: "power3.out" }, at);
    return this;
  }

  breathe(tl, t0, t1, amp = 0.018, period = 1.6) {
    const n = Math.max(1, Math.floor((t1 - t0) / (period / 2)));
    tl.fromTo(this.breath, { scaleY: 1 }, { scaleY: 1 + amp * 0.45, duration: period / 2, ease: "sine.inOut", repeat: n - 1, yoyo: true, immediateRender: false }, t0);
    tl.to(this.breath, { scaleY: 1, duration: 0.2 }, t0 + n * period / 2);
    return this;
  }

  /** Instantly place + reset to the rest pose (used when a knight enters a new scene). */
  place(tl, at, { x, y, scale, show = true } = {}) {
    const v = { autoAlpha: show ? 1 : 0 };
    if (x !== undefined) v.x = x;
    if (y !== undefined) v.y = y;
    if (scale !== undefined) v.scale = scale;
    tl.set(this.root, v, at);
    tl.set(this.body, { scaleX: 1, scaleY: 1, y: 0 }, at);
    tl.set(this.lean, { rotation: 0 }, at);
    tl.set(this.breath, { scaleY: 1 }, at);
    tl.set(this.clipRect, { attr: { y: -1400, height: 1500 } }, at);
    this.showPose(tl, at, this.home, false);
    tl.set(this.all.map((p) => p.glow), { opacity: HEAT.idle }, at);
    this.mouth(tl, at, "smile");
    return this;
  }

  hide(tl, at) { tl.set(this.root, { autoAlpha: 0 }, at); return this; }

  /** Drop in from above and land heavy: stretch on the fall, squash + shockwave + seam flare on impact. */
  dropIn(tl, landAt, { x, y, scale, fromY = -900, fall = 0.34 } = {}) {
    const b = this.body;
    this.place(tl, landAt - fall - 0.002, { x, y: y + fromY, scale });
    tl.set(b, { scaleY: 1.07, scaleX: 0.96 }, landAt - fall - 0.001);
    tl.to(this.root, { y, duration: fall, ease: "power3.in" }, landAt - fall);
    tl.to(b, { scaleY: 0.92, scaleX: 1.05, duration: 0.07, ease: "power2.out" }, landAt);
    tl.to(b, { scaleY: 1.02, scaleX: 0.99, duration: 0.14, ease: "power2.inOut" }, landAt + 0.07);
    tl.to(b, { scaleY: 1, scaleX: 1, duration: 0.3, ease: "elastic.out(1, 0.45)" }, landAt + 0.21);
    tl.fromTo(this.shadow, { attr: { rx: 24 }, opacity: 0.2 }, { attr: { rx: 92 }, opacity: 0.6, duration: fall, ease: "power3.in", immediateRender: false }, landAt - fall);
    tl.fromTo(this.glowRing, { opacity: 1, attr: { rx: 50, ry: 10 } }, { opacity: 0, attr: { rx: 240, ry: 46 }, duration: 0.6, ease: "expo.out", immediateRender: false }, landAt);
    this.flare(tl, landAt, 0.2);
    return this;
  }

  /** Beam in: the armour materialises from the boots up behind a red scan line. */
  popIn(tl, at, { x, y, scale, dur = 0.5 } = {}) {
    this.place(tl, at - 0.001, { x, y, scale });
    const H = UNITS + 60;
    tl.set(this.clipRect, { attr: { y: 20, height: 0 } }, at - 0.001);
    tl.to(this.clipRect, { attr: { y: -H, height: H + 20 }, duration: dur, ease: "power2.out" }, at);
    tl.set(this.scan, { opacity: 1, attr: { y: -2 } }, at);
    tl.to(this.scan, { attr: { y: -H }, duration: dur, ease: "power2.out" }, at);
    tl.to(this.scan, { opacity: 0, duration: 0.12 }, at + dur - 0.06);
    tl.set(this.clipRect, { attr: { y: -1400, height: 1500 } }, at + dur + 0.02);
    tl.fromTo(this.all.map((p) => p.glow), { opacity: HEAT.hot }, { opacity: HEAT.idle, duration: 0.6, immediateRender: false }, at + dur * 0.6);
    return this;
  }

  /** Greeting: arms-crossed knights drop to a hand-on-heart salute; others nod with a seam pulse. */
  wave(tl, at, cycles = 3, arm = 1) {
    const hold = 0.35 + cycles * 0.28;
    if (this.cur === "A") {
      this.showPose(tl, at, "B");
      this.showPose(tl, at + hold + 0.2, "A");
    }
    tl.to(this.lean, { rotation: arm === 1 ? 2.5 : -2.5, duration: 0.2, ease: "power2.out" }, at);
    tl.to(this.lean, { rotation: 0, duration: 0.4, ease: "power2.inOut" }, at + hold);
    for (let i = 0; i < cycles; i++) this.flare(tl, at + 0.05 + i * 0.28, 0.08);
    return this;
  }

  point(tl, at, arm = 1, angle = 95, hold = 0.6) {
    const dir = arm === 1 ? 1 : -1;
    tl.to(this.lean, { rotation: dir * 2.4, duration: 0.18, ease: "back.out(2.5)" }, at);
    this.flare(tl, at, Math.max(0.15, hold * 0.6));
    if (hold > 0) tl.to(this.lean, { rotation: 0, duration: 0.3, ease: "power2.inOut" }, at + hold);
    return this;
  }

  gesture(tl, t0, t1, arm = 1) {
    const dir = arm === 1 ? 1 : -1;
    let t = t0, i = 0;
    while (t < t1 - 0.2) {
      tl.to(this.lean, { rotation: dir * (i % 2 ? 0.4 : 1.6 + this.rand()), duration: 0.18, ease: "power2.out" }, t);
      tl.to(this.all.map((p) => p.glow), { opacity: i % 2 ? HEAT.warm : HEAT.hot, duration: 0.1 }, t);
      t += 0.2 + this.rand() * 0.14; i++;
    }
    tl.to(this.lean, { rotation: 0, duration: 0.3 }, t1);
    return this.heat(tl, t1, HEAT.idle, 0.3);
  }

  celebrate(tl, at, dur = 1.2) {
    tl.to(this.body, { y: -40, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1 }, at);
    tl.to(this.body, { scaleY: 1.03, scaleX: 0.985, duration: 0.2, yoyo: true, repeat: 1 }, at);
    this.heat(tl, at, HEAT.hot, 0.08);
    this.mouth(tl, at, "grin");
    tl.fromTo(this.glowRing, { opacity: 1, attr: { rx: 50, ry: 10 } }, { opacity: 0, attr: { rx: 200, ry: 40 }, duration: 0.6, ease: "expo.out", immediateRender: false }, at + 0.4);
    return this.heat(tl, at + dur, HEAT.idle, 0.4);
  }

  /** Heavy-footed march: step bob and shoulder sway, the seams pulsing on each footfall. */
  walk(tl, t0, t1, step = 0.28) {
    const n = Math.max(2, Math.round((t1 - t0) / step));
    const d = (t1 - t0) / n;
    tl.fromTo(this.body, { y: 0 }, { y: -8, duration: d / 2, ease: "sine.inOut", repeat: n * 2 - 1, yoyo: true, immediateRender: false }, t0);
    tl.fromTo(this.lean, { rotation: -1.1 }, { rotation: 1.1, duration: d, ease: "sine.inOut", repeat: n - 1, yoyo: true, immediateRender: false }, t0);
    tl.fromTo(this.all.map((p) => p.glow), { opacity: HEAT.warm }, { opacity: HEAT.idle, duration: d, ease: "power2.out", repeat: n - 1, immediateRender: false }, t0);
    tl.to(this.body, { y: 0, duration: 0.18 }, t1);
    tl.to(this.lean, { rotation: 0, duration: 0.25 }, t1);
    return this;
  }

  crossArms(tl, at) { return this.showPose(tl, at, "A"); }

  uncross(tl, at) { return this.showPose(tl, at, "B"); }
}

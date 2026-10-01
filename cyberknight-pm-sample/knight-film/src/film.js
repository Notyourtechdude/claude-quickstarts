// HyperFrames entry: builds the hologram / type / HUD layers over the knight footage on ONE paused GSAP
// timeline. index.html registers it as window.__timelines.main once this async build resolves.
import { gsap, DrawSVGPlugin } from "./gsap.js";
import cues from "./cues.js";
import { s, h } from "./brand.js";
import { buildDefs, buildHud, makeGrain } from "./fx.js";
import s1 from "./scenes/s1_open.js";
import s2 from "./scenes/s2_role.js";
import s3 from "./scenes/s3_fundamentals.js";
import s4 from "./scenes/s4_soft.js";
import s5 from "./scenes/s5_ship.js";
import s6 from "./scenes/s6_end.js";

gsap.registerPlugin(DrawSVGPlugin);

const DURATION = 36;
const CHAPTERS = [
  { n: "00", label: "THE QUESTION", t0: 0, t1: 4 },
  { n: "01", label: "THE ROLE", t0: 4, t1: 9 },
  { n: "02", label: "FUNDAMENTALS", t0: 9, t1: 17 },
  { n: "03", label: "SOFT SKILLS", t0: 17, t1: 26 },
  { n: "04", label: "SHIP IT", t0: 26, t1: 31 },
  { n: "05", label: "MODULE 01", t0: 31, t1: 36 },
];

export async function buildFilm() {
  const fonts = ["900 100px Inter", "800 100px Inter", "700 100px Inter", "600 100px Inter", "400 100px Inter",
    "300 40px Poppins", "400 40px Poppins", "500 40px Poppins", "600 40px Poppins", "400 20px JBMono", "700 20px JBMono"];
  // bounded waits: text is measured at build time, but a stalled FontFaceSet must never block registration
  const settle = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);
  await settle(Promise.all(fonts.map((f) => document.fonts.load(f))), 3000);
  await settle(document.fonts.ready, 3000);

  const svg = document.getElementById("svg");
  const tl = gsap.timeline({ paused: true });
  const defs = buildDefs(svg);
  const ctx = {
    tl, svg, defs, cues,
    type: document.getElementById("type"),
    hud: document.getElementById("hud"),
    flashEl: document.getElementById("flash"),
    fx: document.getElementById("fx").getContext("2d"),
    drawers: [],
    vo: (id) => cues.vo[id],
  };
  ctx.scrimL = s("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "url(#scrimL)", opacity: 0 }, svg);
  ctx.scrimB = s("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "url(#scrimB)", opacity: 0 }, svg);
  ctx.world = s("g", { id: "world" }, svg);
  ctx.back = s("g", { id: "back" }, ctx.world);
  ctx.front = s("g", { id: "front" }, ctx.world);
  ctx.svgTop = s("g", { id: "svgTop" }, svg);
  ctx.flash = (at, color = "#fff", peak = 0.85, dur = 0.28) => {
    tl.set(ctx.flashEl, { backgroundColor: color, opacity: peak }, at);
    tl.to(ctx.flashEl, { opacity: 0, duration: dur, ease: "power2.out" }, at + 1 / 60);
  };
  ctx.shake = (target, at, dur = 0.35, amp = 14, seed = 1) => {
    let t = at, k = seed;
    const n = Math.round(dur / (1 / 30));
    for (let i = 0; i < n; i++) {
      const decay = 1 - i / n;
      k = (k * 9301 + 49297) % 233280;
      const r1 = k / 233280 - 0.5;
      k = (k * 9301 + 49297) % 233280;
      const r2 = k / 233280 - 0.5;
      tl.set(target, { x: r1 * 2 * amp * decay, y: r2 * 2 * amp * decay }, t);
      t += 1 / 30;
    }
    tl.set(target, { x: 0, y: 0 }, t);
  };
  ctx.hudApi = buildHud(ctx, CHAPTERS);

  // each scene's type lives in its own timed clip layer, so the framework hides it outside its window
  // (masked/off-stage text from other scenes never sits in the layout audit or the frame)
  const typeRoot = ctx.type;
  const WINDOWS = [[s1, 0, 4.0], [s2, 3.9, 9.05], [s3, 8.95, 17.0], [s4, 16.7, 26.0], [s5, 26.12, 31.0], [s6, 30.95, 36]];
  WINDOWS.forEach(([scene, a, b], i) => {
    const layer = h("div", { cls: "clip", parent: typeRoot, style: { position: "absolute", inset: "0" } });
    layer.id = `type-s${i + 1}`;
    layer.dataset.start = String(a);
    layer.dataset.duration = String(+(b - a).toFixed(2));
    layer.dataset.trackIndex = String(2 + i);
    ctx.type = layer;
    scene(ctx);
  });
  ctx.type = typeRoot;

  // footage treatment: a slow push on each shot (non-timed wrappers) + a glitch hit on every cut
  for (const sh of cues.shots) {
    tl.fromTo(`#w-${sh.id}`, { scale: 1 }, { scale: 1.035, duration: sh.t1 - sh.t0, ease: "none", immediateRender: false }, sh.t0);
  }
  const footage = document.getElementById("footage");
  for (const sh of cues.shots.slice(1)) {
    const jit = [18, -26, 12, -8, 0];
    jit.forEach((dx, f) => tl.set(footage, { x: dx, filter: f < 4 ? "saturate(2.2) contrast(1.25) hue-rotate(-12deg)" : "none" }, sh.t0 + f / 30));
  }

  // canvas layers (particles, confetti, grain) and the HUD timecode are pure functions of time:
  // a full-length driver tween repaints them on every seek.
  const grain = makeGrain(document.getElementById("grain"));
  const paint = (t) => {
    ctx.fx.clearRect(0, 0, 1920, 1080);
    for (const d of ctx.drawers) if (t >= d.t0 && t <= d.t1) d.draw(ctx.fx, t);
    ctx.hudApi.update(t);
    grain(t);
  };
  const clock = { t: 0 };
  tl.fromTo(clock, { t: 0 }, { t: DURATION, duration: DURATION, ease: "none", immediateRender: true, onUpdate: () => paint(clock.t) }, 0);
  paint(0);
  // wrapped on purpose: a GSAP timeline is a thenable, so resolving the async function with it directly
  // would make the promise wait for the (paused) timeline to finish, i.e. forever.
  return { tl };
}

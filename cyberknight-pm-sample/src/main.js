// Builds one paused master timeline for the whole 36s piece and exposes a frame-accurate seek for capture.
import { gsap } from "../node_modules/gsap/index.js";
import { DrawSVGPlugin } from "../node_modules/gsap/DrawSVGPlugin.js";
import { MorphSVGPlugin } from "../node_modules/gsap/MorphSVGPlugin.js";
import { C, s } from "./brand.js";
import { makeCharacter, makeKnight } from "./characters.js";
import { buildDefs, buildBackground, buildHud, makeGrain } from "./fx.js";
import s1 from "./scenes/s1_open.js";
import s2 from "./scenes/s2_role.js";
import s3 from "./scenes/s3_fundamentals.js";
import s4 from "./scenes/s4_soft.js";
import s5 from "./scenes/s5_ship.js";
import s6 from "./scenes/s6_end.js";

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin);
gsap.ticker.lagSmoothing(0);

const DURATION = 36;
const CHAPTERS = [
  { n: "00", label: "THE QUESTION", t0: 0, t1: 4 },
  { n: "01", label: "THE ROLE", t0: 4, t1: 9 },
  { n: "02", label: "FUNDAMENTALS", t0: 9, t1: 17 },
  { n: "03", label: "SOFT SKILLS", t0: 17, t1: 26 },
  { n: "04", label: "SHIP IT", t0: 26, t1: 31 },
  { n: "05", label: "MODULE 01", t0: 31, t1: 36 },
];

async function boot() {
  const cues = await (await fetch("audio/cues.json")).json();
  const fonts = ["900 100px Inter", "800 100px Inter", "700 100px Inter", "600 100px Inter", "400 100px Inter",
    "300 40px Poppins", "400 40px Poppins", "500 40px Poppins", "600 40px Poppins", "400 20px JBMono", "700 20px JBMono"];
  await Promise.all(fonts.map((f) => document.fonts.load(f)));
  await document.fonts.ready;

  const svg = document.getElementById("svg");
  const tl = gsap.timeline({ paused: true });
  const defs = buildDefs(svg);
  const fxCanvas = document.getElementById("fx");
  const ctx = {
    tl, svg, defs, cues,
    type: document.getElementById("type"),
    hud: document.getElementById("hud"),
    flashEl: document.getElementById("flash"),
    fx: fxCanvas.getContext("2d"),
    drawers: [],
    vo: (id) => cues.vo[id],
  };
  ctx.bgw = buildBackground(ctx);
  ctx.world = s("g", { id: "world" }, svg);
  ctx.back = s("g", { id: "back" }, ctx.world);      // scene sets
  ctx.actors = s("g", { id: "actors" }, ctx.world);  // characters that persist across scenes
  ctx.front = s("g", { id: "front" }, ctx.world);    // props that pass in front of characters
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
  ctx.cast = {
    dev: makeCharacter(ctx.actors, "dev", { id: "dev" }),
    designer: makeCharacter(ctx.actors, "designer", { id: "designer" }),
    exec: makeKnight(ctx.actors, { id: "exec" }),   // the stakeholder is CyberKnight's armoured knight
    pm: makeCharacter(ctx.actors, "pm", { id: "pm" }),
  };
  for (const c of Object.values(ctx.cast)) gsap.set(c.root, { autoAlpha: 0 });

  for (const scene of [s1, s2, s3, s4, s5, s6]) scene(ctx);
  tl.set({}, {}, DURATION);

  const grain = makeGrain(document.getElementById("grain"));
  const seek = (t) => {
    tl.seek(t, false);
    ctx.fx.clearRect(0, 0, 1920, 1080);
    for (const d of ctx.drawers) if (t >= d.t0 && t <= d.t1) d.draw(ctx.fx, t);
    ctx.hudApi.update(t);
    grain(t);
  };
  window.__duration = DURATION;
  window.__seek = (t) => { seek(t); return new Promise((r) => requestAnimationFrame(() => r(true))); };

  const q = new URLSearchParams(location.search);
  if (q.has("t")) seek(parseFloat(q.get("t")));
  else if (q.has("play")) {
    const start = performance.now() - parseFloat(q.get("play") || 0) * 1000;
    const loop = () => { seek(((performance.now() - start) / 1000) % DURATION); requestAnimationFrame(loop); };
    loop();
  } else seek(0);
  window.__ready = true;
}

boot().catch((e) => { window.__error = String(e && e.stack || e); console.error(e); });

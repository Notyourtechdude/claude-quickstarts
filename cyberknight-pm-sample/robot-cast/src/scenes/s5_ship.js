// 26–31s · SHIP IT — a roadmap that never ships glitches and falls away; "PEOPLE DO." — the team
// pops in and a knight-badged rocket launches behind them. Its trail becomes the end-card's first stroke.
import { gsap } from "../../node_modules/gsap/index.js";
import { C, s, rng, KNIGHT, clamp } from "../brand.js";
import { text, reveal, conceal } from "../type.js";
import { glitchHTML, glitchSVG } from "../fx.js";

export default function s5(ctx) {
  const { tl, back, front, type, cast } = ctx;
  const { pm, dev, designer, exec } = cast;
  const g = s("g", { id: "s5" }, back);
  const fg = s("g", { id: "s5fg" }, front);
  gsap.set([g, fg], { autoAlpha: 0 });
  tl.set([g, fg], { autoAlpha: 1 }, 26.0);
  tl.set(ctx.bgw.floor, { opacity: 0.6 }, 26.0);

  // ── roadmap board ──
  const BX = 260, BY = 380, QW = 350, LH = 76;
  const board = s("g", { id: "s5board" }, g);
  gsap.set(board, { svgOrigin: "960 620" });
  s("rect", { x: BX - 20, y: BY - 50, width: QW * 4 + 40, height: LH * 5 + 90, rx: 18, fill: "rgba(255,255,255,0.02)", stroke: "rgba(255,255,255,0.1)", "stroke-width": 1.5 }, board);
  for (let q = 0; q < 4; q++) {
    s("text", { x: BX + q * QW + 16, y: BY - 16, fill: C.dim, "font-family": "JBMono", "font-size": 18, "letter-spacing": 5, text: `Q${q + 1} · 2027` }, board);
    if (q) s("line", { x1: BX + q * QW, y1: BY - 40, x2: BX + q * QW, y2: BY + LH * 5 + 20, stroke: "rgba(255,255,255,0.1)", "stroke-width": 1.5, "stroke-dasharray": "4 8" }, board);
  }
  const BARS = [
    [0, 0.0, 1.6, "AUTH HARDENING", C.red, "#fff"],
    [1, 0.3, 1.25, "AUDIT LOGS", "#E9E9EE", "#111"],
    [2, 1.1, 3.6, "AI THREAT TRIAGE", C.red, "#fff"],
    [3, 1.45, 2.4, "SSO", "#3A3A45", "#fff"],
  ];
  const barEls = [];
  BARS.forEach(([lane, a, b, label, fill, ink], i) => {
    const y = BY + 10 + lane * LH;
    const bg = s("g", {}, board);
    const r = s("rect", { x: BX + a * QW, y, width: (b - a) * QW, height: 48, rx: 11, fill }, bg);
    s("text", { x: BX + a * QW + 18, y: y + 31, fill: ink, "font-family": "JBMono", "font-weight": 700, "font-size": 18, "letter-spacing": 2, text: label }, bg);
    gsap.set(bg, { svgOrigin: `${BX + a * QW} ${y + 24}`, scaleX: 0 });
    tl.to(bg, { scaleX: 1, duration: 0.45, ease: "expo.out" }, 26.2 + i * 0.12);
    barEls.push(r);
  });
  const ms = s("g", {}, board);
  const mx = BX + 3.7 * QW, my = BY + 10 + 4 * LH + 24;
  s("path", { d: `M${mx} ${my - 22} L${mx + 22} ${my} L${mx} ${my + 22} L${mx - 22} ${my} Z`, fill: "#fff" }, ms);
  s("text", { x: mx - 36, y: my + 7, "text-anchor": "end", fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 18, "letter-spacing": 2, text: "v1.0 LAUNCH" }, ms);
  gsap.set(ms, { svgOrigin: `${mx} ${my}`, scale: 0 });
  tl.to(ms, { scale: 1, duration: 0.4, ease: "back.out(3)" }, 26.75);
  // "today" marker sweeps, but nothing ships
  const today = s("g", {}, board);
  s("line", { x1: 0, y1: BY - 44, x2: 0, y2: BY + LH * 5 + 24, stroke: C.red, "stroke-width": 3 }, today);
  s("rect", { x: -38, y: BY - 72, width: 76, height: 26, rx: 5, fill: C.red }, today);
  s("text", { x: 0, y: BY - 53, "text-anchor": "middle", fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 14, letter: 2, text: "TODAY" }, today);
  tl.fromTo(today, { x: BX + 20 }, { x: BX + 3.55 * QW, duration: 1.5, ease: "power1.inOut", immediateRender: true }, 26.3);
  // stall → glitch → fall away
  const STALL = 27.75;
  tl.to(barEls, { attr: { fill: "#24242C" }, duration: 0.1, stagger: 0.03 }, STALL);
  const blocked = s("text", { x: 960, y: BY + LH * 2 + 40, "text-anchor": "middle", fill: C.red, "font-family": "JBMono", "font-weight": 700, "font-size": 40, "letter-spacing": 10, opacity: 0, text: "STATUS: NOT SHIPPED" }, board);
  for (let f = 0; f < 8; f++) tl.set(blocked, { opacity: f % 2 ? 0.2 : 1 }, STALL + 0.05 + f / 30);
  glitchSVG(ctx, tl, board, STALL + 0.15, { frames: 5, amp: 40, seed: 19, box: [BX - 40, BY - 80, QW * 4 + 80, LH * 5 + 140] });
  tl.to(board, { y: 900, rotation: 7, opacity: 0, duration: 0.45, ease: "power3.in" }, 27.98);

  // headline
  const H1 = text(type, "ROADMAPS DON'T", { x: 256, y: 176, size: 84, cls: "h", split: "chars" });
  const H2 = text(type, "SHIP PRODUCTS.", { x: 256, y: 262, size: 84, cls: "h", split: "chars" });
  H2.inner.style.color = "transparent"; H2.inner.style.webkitTextStroke = "2.5px #fff";
  const v5 = ctx.vo("l5a");
  reveal(tl, H1.units, v5 + 0.25, { dur: 0.45, stagger: 0.02 });
  reveal(tl, H2.units, v5 + 1.3, { dur: 0.4, stagger: 0.018 });
  conceal(tl, [...H1.units, ...H2.units], 28.0, { stagger: 0.01 });

  // ── "PEOPLE DO." ──
  const PD = ctx.vo("l5b");
  const people = text(type, "PEOPLE DO.", { x: 960, y: 470, size: 230, cls: "h ko", anchor: "center" });
  people.inner.style.letterSpacing = "-0.04em";
  gsap.set(people.inner, { opacity: 0 });
  tl.fromTo(people.inner, { opacity: 1, scale: 1.8, filter: "blur(16px)" }, { scale: 1, filter: "blur(0px)", duration: 0.18, ease: "power4.in", immediateRender: false }, PD - 0.02);
  ctx.shake(people.wrap, PD + 0.16, 0.3, 16, 12);
  tl.to(people.inner, { y: -300, scale: 0.42, duration: 0.5, ease: "expo.inOut" }, PD + 0.55);

  // rocket + launch pad (behind the team)
  const PADY = 900;
  const rocket = s("g", {}, g);
  const rk = s("g", {}, rocket);
  const flame = s("g", {}, rk);
  s("path", { d: "M-30 0 Q0 150 30 0 Z", fill: C.red, filter: "url(#glow)" }, flame);
  s("path", { d: "M-16 0 Q0 90 16 0 Z", fill: "#fff" }, flame);
  gsap.set(flame, { svgOrigin: "0 0", scaleY: 0 });
  s("path", { d: "M-46 -40 L-86 10 L-86 30 L-40 4 Z", fill: C.core }, rk);
  s("path", { d: "M46 -40 L86 10 L86 30 L40 4 Z", fill: C.core }, rk);
  s("path", { d: "M-46 0 L-46 -210 C-46 -270 -20 -310 0 -330 C20 -310 46 -270 46 -210 L46 0 Z", fill: "#F2F2F5" }, rk);
  s("path", { d: "M0 -330 C20 -310 46 -270 46 -210 L46 0 L20 0 L20 -230 C20 -280 12 -305 0 -330 Z", fill: "#C9C9D2" }, rk);
  s("path", { d: "M-46 -236 C-40 -284 -20 -312 0 -330 C20 -312 40 -284 46 -236 Z", fill: C.red }, rk);
  s("rect", { x: -46, y: -40, width: 92, height: 14, fill: C.red }, rk);
  s("path", { d: "M-10 0 L-10 -40 L10 -40 L10 0 Z", fill: C.core }, rk);
  s("circle", { cx: 0, cy: -150, r: 30, fill: "#0B0B0F", stroke: C.red, "stroke-width": 5 }, rk);
  const kn = s("g", { transform: `translate(0 -150) scale(0.13) translate(${-KNIGHT.cx} ${-KNIGHT.cy})` }, rk);
  s("path", { d: KNIGHT.d, fill: C.core, "fill-rule": "evenodd", transform: "translate(6 -8)" }, kn);
  s("path", { d: KNIGHT.d, fill: "#fff", "fill-rule": "evenodd" }, kn);
  const trail = s("rect", { x: -3, y: 0, width: 6, height: 0, fill: C.red, filter: "url(#glow)" }, rocket);
  gsap.set(rocket, { x: 960, y: PADY + 520 });
  tl.to(rocket, { y: PADY - 40, duration: 0.5, ease: "back.out(1.4)" }, 28.4);
  const IGN = 29.0, LIFT = 29.3;
  tl.to(flame, { scaleY: 0.6, duration: 0.15 }, IGN);
  const FR = rng(3);
  for (let f = 0; f < 60; f++) tl.set(flame, { scaleY: 0.8 + FR() * 0.9, scaleX: 0.85 + FR() * 0.3 }, IGN + 0.15 + f / 30);
  tl.to(rocket, { y: -900, duration: 1.35, ease: "power2.in" }, LIFT);
  tl.to(trail, { attr: { height: 2400 }, duration: 1.35, ease: "power2.in" }, LIFT);
  ctx.shake(ctx.world, LIFT, 0.6, 9, 21);
  ctx.flash(LIFT, "#fff", 0.12, 0.25);
  // smoke puffs (canvas)
  const SR = rng(12);
  const puffs = Array.from({ length: 46 }, () => ({ t: IGN + SR() * 1.1, vx: (SR() - 0.5) * 380, vy: -10 - SR() * 50, r: 16 + SR() * 26, g: 150 + Math.floor(SR() * 70) }));
  ctx.drawers.push({
    t0: IGN, t1: 31.0,
    draw(gx, t) {
      for (const p of puffs) {
        const dt = t - p.t;
        if (dt < 0) continue;
        const k = 1 - Math.exp(-dt * 2.4);
        const a = clamp(0.2 * (1 - dt / 1.6));
        if (a <= 0) continue;
        gx.globalAlpha = a;
        gx.fillStyle = `rgb(${p.g},${p.g - 20},${p.g - 20})`;
        gx.beginPath(); gx.arc(960 + p.vx * k * 0.5, PADY - 6 + p.vy * k, p.r * (0.5 + k * 1.6), 0, 6.283); gx.fill();
      }
      gx.globalAlpha = 1;
    },
  });

  // team pops in front of the pad and celebrates
  const TY = 985, TS = 0.6;
  const team = [[dev, 500], [designer, 740], [pm, 1180], [exec, 1420]];
  team.forEach(([c, x], i) => {
    c.popIn(tl, PD + 0.1 + i * 0.07, { x, y: TY, scale: TS, dur: 0.4 });
    c.mouth(tl, PD + 0.1, "grin");
    c.blinks(tl, PD + 0.4, 30.6, 1.3);
    c.look(tl, LIFT + 0.1, 0);
    tl.to(c.head, { rotation: 0, duration: 0.3 }, LIFT + 0.1);
    tl.to(c.pupils, { y: -4, duration: 0.3 }, LIFT + 0.1);
  });
  team.forEach(([c], i) => c.celebrate(tl, LIFT + 0.05 + i * 0.07, 1.1));

  // metric chips
  const chips = [
    [330, 470, "▲ +38% ACTIVATION", C.red],
    [1600, 430, "0 CRITICAL VULNS", "#fff"],
    [1560, 620, "v1.0 SHIPPED ✓", C.red],
    [360, 660, "NPS 72 ↑", "#fff"],
  ];
  chips.forEach(([x, y, str, col], i) => {
    const cg = s("g", {}, fg);
    const t = s("text", { x, y: y + 9, "text-anchor": "middle", fill: col === "#fff" ? "#111" : "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 24, "letter-spacing": 2, text: str }, cg);
    const w = t.getComputedTextLength() + 48;
    cg.insertBefore(s("rect", { x: x - w / 2, y: y - 26, width: w, height: 52, rx: 26, fill: col }), t);
    gsap.set(cg, { svgOrigin: `${x} ${y}`, scale: 0 });
    tl.to(cg, { scale: 1, duration: 0.35, ease: "back.out(2.6)" }, LIFT + 0.15 + i * 0.16);
    tl.to(cg, { y: -40, duration: 1.4, ease: "none" }, LIFT + 0.15 + i * 0.16);
  });

  // tilt-up transition: everything drops out of frame, the trail stays
  const OUT = 30.35;
  tl.to([fg], { y: 1000, duration: 0.55, ease: "power3.in" }, OUT);
  for (const [c, x] of team) tl.to(c.root, { y: TY + 900, duration: 0.55, ease: "power3.in" }, OUT);
  tl.to(people.inner, { y: 600, opacity: 0, duration: 0.5, ease: "power3.in" }, OUT);
  tl.to(ctx.bgw.floor, { opacity: 0, duration: 0.4 }, OUT);
  tl.set(fg, { autoAlpha: 0 }, 31.0);
  for (const [c] of team) c.hide(tl, 31.0);
  ctx.s5trail = trail;
  ctx.s5rocket = rocket;
  tl.to(trail, { opacity: 0, duration: 0.3 }, 31.05);
  tl.set(g, { autoAlpha: 0 }, 31.4);
}

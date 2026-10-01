// 26–31s · SHIP IT — the knight watches the launch. A roadmap hologram that "never ships" glitches out;
// "PEOPLE DO." slams; launch metrics pop around the trail.
import { gsap } from "../../node_modules/gsap/index.js";
import { C, s } from "../brand.js";
import { text, reveal, conceal } from "../type.js";
import { glitchSVG } from "../fx.js";

export default function s5(ctx) {
  const { tl, back, front, type } = ctx;
  const g = s("g", { id: "s5", style: "mix-blend-mode:screen" }, back);
  const fg = s("g", { id: "s5fg" }, front);
  gsap.set([g, fg], { autoAlpha: 0 });
  tl.set([g, fg], { autoAlpha: 1 }, 26.0);
  tl.to(ctx.scrimL, { opacity: 0.85, duration: 0.4 }, 26.0);

  // roadmap hologram, lower-left
  const BX = 110, BY = 520, QW = 170, LH = 58;
  const board = s("g", { id: "s5board", filter: "url(#holo)" }, g);
  s("rect", { x: BX - 16, y: BY - 46, width: QW * 4 + 32, height: LH * 4 + 70, rx: 14, fill: C.red, "fill-opacity": 0.06, stroke: "#ff9aa6", "stroke-width": 1.5 }, board);
  for (let q = 0; q < 4; q++) {
    s("text", { x: BX + q * QW + 10, y: BY - 16, fill: "#ffc2ca", "font-family": "JBMono", "font-size": 15, "letter-spacing": 4, text: `Q${q + 1}` }, board);
    if (q) s("line", { x1: BX + q * QW, y1: BY - 36, x2: BX + q * QW, y2: BY + LH * 4 + 12, stroke: "#ff9aa6", "stroke-opacity": 0.35, "stroke-width": 1.5, "stroke-dasharray": "4 8" }, board);
  }
  const BARS = [[0, 0.0, 1.6, "AUTH HARDENING"], [1, 0.3, 1.3, "AUDIT LOGS"], [2, 1.1, 3.6, "AI THREAT TRIAGE"], [3, 1.5, 2.5, "SSO"]];
  const bars = BARS.map(([lane, a, b, label], i) => {
    const y = BY + 6 + lane * LH;
    const bg = s("g", {}, board);
    const r = s("rect", { x: BX + a * QW, y, width: (b - a) * QW, height: 40, rx: 9, fill: C.red, "fill-opacity": 0.75 }, bg);
    s("text", { x: BX + a * QW + 14, y: y + 26, fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 15, "letter-spacing": 1, text: label }, bg);
    gsap.set(bg, { svgOrigin: `${BX + a * QW} ${y + 20}`, scaleX: 0 });
    tl.to(bg, { scaleX: 1, duration: 0.45, ease: "expo.out" }, 26.2 + i * 0.12);
    return r;
  });
  const STALL = 27.75;
  tl.to(bars, { attr: { "fill-opacity": 0.15 }, duration: 0.1, stagger: 0.03 }, STALL);
  const stalled = s("text", { x: BX + QW * 2, y: BY + LH * 2 + 14, "text-anchor": "middle", fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 30, "letter-spacing": 8, opacity: 0, text: "STATUS: NOT SHIPPED" }, board);
  for (let f = 0; f < 8; f++) tl.set(stalled, { opacity: f % 2 ? 0.2 : 1 }, STALL + 0.05 + f / 30);
  glitchSVG(ctx, tl, board, STALL + 0.15, { frames: 5, amp: 40, seed: 19, box: [BX - 40, BY - 70, QW * 4 + 80, LH * 4 + 110] });
  tl.to(board, { y: 600, opacity: 0, duration: 0.4, ease: "power3.in" }, 27.98);

  // headline
  const v5 = ctx.vo("l5a");
  const H1 = text(type, "ROADMAPS DON'T", { x: 108, y: 230, size: 78, cls: "h", split: "chars" });
  const H2 = text(type, "SHIP PRODUCTS.", { x: 108, y: 312, size: 78, cls: "h", split: "chars" });
  H2.inner.style.color = "transparent"; H2.inner.style.webkitTextStroke = "2.5px #fff";
  const w = ctx.cues.words?.l5a || { roadmaps: 0.45, ship: 1.35 };
  reveal(tl, H1.units, v5 + w.roadmaps - 0.05, { dur: 0.45, stagger: 0.02 });
  reveal(tl, H2.units, v5 + w.ship - 0.05, { dur: 0.4, stagger: 0.018 });
  conceal(tl, [...H1.units, ...H2.units], 28.3, { stagger: 0.01 });

  // PEOPLE DO.
  const PD = ctx.vo("l5b");
  const people = text(type, "PEOPLE DO.", { x: 620, y: 540, size: 190, cls: "h ko", anchor: "center" });
  people.inner.style.letterSpacing = "-0.04em";
  gsap.set(people.inner, { opacity: 0 });
  tl.fromTo(people.inner, { opacity: 1, scale: 1.8, filter: "blur(16px)" }, { scale: 1, filter: "blur(0px)", duration: 0.18, ease: "power4.in", immediateRender: false }, PD - 0.02);
  ctx.shake(people.wrap, PD + 0.16, 0.3, 16, 12);
  ctx.flash(PD + 0.16, "#fff", 0.14, 0.2);

  // launch metrics around the trail
  const chips = [[1230, 300, "▲ +38% ACTIVATION", C.red], [1640, 420, "0 CRITICAL VULNS", "#fff"], [1290, 560, "v1.0 SHIPPED ✓", C.red]];
  chips.forEach(([x, y, str, col], i) => {
    const cg = s("g", {}, fg);
    const t = s("text", { x, y: y + 9, "text-anchor": "middle", fill: col === "#fff" ? "#111" : "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 24, "letter-spacing": 2, text: str }, cg);
    const wd = t.getComputedTextLength() + 48;
    cg.insertBefore(s("rect", { x: x - wd / 2, y: y - 26, width: wd, height: 52, rx: 26, fill: col }), t);
    gsap.set(cg, { svgOrigin: `${x} ${y}`, scale: 0 });
    tl.to(cg, { scale: 1, duration: 0.35, ease: "back.out(2.6)" }, PD + 0.6 + i * 0.18);
    tl.to(cg, { y: -40, duration: 1.4, ease: "none" }, PD + 0.6 + i * 0.18);
  });

  // out: flash-cut to the end card
  const OUT = 30.6;
  tl.to(people.inner, { scale: 0.9, opacity: 0, duration: 0.3, ease: "power3.in" }, OUT);
  tl.to(fg, { opacity: 0, duration: 0.3 }, OUT);
  tl.to(ctx.scrimL, { opacity: 0, duration: 0.3 }, OUT);
  ctx.flash(30.98, "#fff", 0.35, 0.3);
  tl.set([g, fg], { autoAlpha: 0 }, 31.0);
}

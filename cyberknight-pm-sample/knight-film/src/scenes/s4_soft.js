// 17–26s · SOFT SKILLS — the knight, hand on heart, lifts his gaze. On the left: "BUT THE REAL EDGE?" →
// SOFT SKILLS slam → the three skills stack up, each with its own hologram widget:
// OWNERSHIP (assignee chip) · TRUST (shared roadmap) · NEGOTIATION (scope ⟷ time slider + DEAL stamp).
import { gsap } from "../gsap.js";
import { C, s } from "../brand.js";
import { text, reveal, conceal } from "../type.js";
import { glitchHTML } from "../fx.js";

export default function s4(ctx) {
  const { tl, back, front, type } = ctx;
  const g = s("g", { id: "s4" }, front);
  gsap.set(g, { autoAlpha: 0 });
  tl.set(g, { autoAlpha: 1 }, 16.95);
  tl.to(ctx.scrimL, { opacity: 1, duration: 0.5 }, 16.95);

  // ── "BUT THE REAL EDGE?" → SOFT / SKILLS ──
  const qA = ctx.vo("l4a"), qB = ctx.vo("l4b");
  const edge = text(type, "BUT THE REAL EDGE?", { x: 110, y: 470, size: 60, cls: "h", split: "chars" });
  reveal(tl, edge.units, qA - 0.05, { dur: 0.4, stagger: 0.015 });
  conceal(tl, edge.units, qB - 0.2, { stagger: 0.008 });
  tl.set(edge.wrap, { opacity: 0 }, qB + 0.1);

  const soft1 = text(type, "SOFT", { x: 100, y: 430, size: 210, cls: "h ko" });
  const soft2 = text(type, "SKILLS", { x: 100, y: 620, size: 210, cls: "h ko" });
  for (const el of [soft1.inner, soft2.inner]) { el.style.letterSpacing = "-0.04em"; gsap.set(el, { opacity: 0 }); }
  tl.fromTo([soft1.inner, soft2.inner], { opacity: 1, scale: 1.8, filter: "blur(16px)", transformOrigin: "0% 50%" }, { scale: 1, filter: "blur(0px)", duration: 0.18, ease: "power4.in", stagger: 0.06, immediateRender: false }, qB - 0.05);
  ctx.flash(qB + 0.15, "#fff", 0.15, 0.18);
  ctx.shake(soft1.wrap, qB + 0.15, 0.3, 16, 9);
  ctx.shake(soft2.wrap, qB + 0.2, 0.3, 16, 11);
  glitchHTML(tl, soft2.wrap, qB + 0.6, { frames: 3, seed: 13, amp: 22 });
  tl.to([soft1.inner, soft2.inner], { x: -900, opacity: 0, filter: "blur(10px)", duration: 0.32, ease: "power3.in", stagger: 0.05 }, 20.05);

  // ── the three skills ──
  const OWN = ctx.vo("l4c"), TR = ctx.vo("l4d"), NG = ctx.vo("l4e");
  const rows = [
    { at: OWN, word: "OWNERSHIP", y: 270 },
    { at: TR, word: "TRUST", y: 500 },
    { at: NG, word: "NEGOTIATION", y: 730 },
  ];
  const nums = [];
  const words = rows.map((r) => {
    const tx = text(type, r.word, { x: 110, y: r.y, size: 78, cls: "h", split: "chars" });
    const num = text(type, `0${rows.indexOf(r) + 1} //`, { x: 114, y: r.y - 62, size: 18, cls: "m" });
    nums.push(num.inner);
    num.inner.style.color = C.redText;
    reveal(tl, tx.units, r.at - 0.02, { dur: 0.4, stagger: 0.018, ease: "power4.out" });
    tl.fromTo(num.inner, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: true }, r.at);
    glitchHTML(tl, tx.wrap, r.at + 0.05, { frames: 3, seed: 30 + r.y, amp: 14 });
    return tx;
  });
  // earlier skills dim when the next one lands
  tl.to(words[0].inner, { opacity: 0.35, duration: 0.3 }, TR);
  tl.to(words[1].inner, { opacity: 0.35, duration: 0.3 }, NG);

  // OWNERSHIP widget: assignee chip
  const chip = s("g", {}, g);
  s("rect", { x: 110, y: 312, width: 330, height: 52, rx: 26, fill: C.red }, chip);
  s("circle", { cx: 138, cy: 338, r: 17, fill: "#fff" }, chip);
  s("path", { d: "M130 338 l6 6 l12 -13", stroke: C.red, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, chip);
  s("text", { x: 166, y: 346, fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 21, "letter-spacing": 2, text: "ASSIGNEE: YOU" }, chip);
  gsap.set(chip, { svgOrigin: "110 338", scale: 0 });
  tl.to(chip, { scale: 1, duration: 0.35, ease: "back.out(2.5)" }, OWN + 0.35);
  tl.to(chip, { opacity: 0.4, duration: 0.3 }, TR);

  // TRUST widget: shared roadmap checklist
  const card = s("g", {}, g);
  const items = ["REFACTOR → SPRINT 2", "UX POLISH → SPRINT 3", "SHIP → Q3"];
  s("rect", { x: 110, y: 540, width: 470, height: 128, rx: 12, fill: "rgba(10,10,14,0.85)", stroke: C.red, "stroke-width": 2 }, card);
  const ticks = items.map((it, i) => {
    const y = 576 + i * 36;
    s("rect", { x: 130, y: y - 17, width: 22, height: 22, rx: 5, fill: "none", stroke: "#fff", "stroke-width": 2 }, card);
    const tk = s("path", { d: `M134 ${y - 6} l5 6 l10 -12`, stroke: C.red, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, card);
    s("text", { x: 168, y: y + 1, fill: "#fff", "font-family": "JBMono", "font-size": 18, "xml:space": "preserve", text: it }, card);
    return tk;
  });
  gsap.set(card, { opacity: 0, y: 14 });
  tl.to(card, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, TR + 0.3);
  ticks.forEach((tk, i) => tl.fromTo(tk, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.2, ease: "power2.out", immediateRender: true }, TR + 0.6 + i * 0.22));
  tl.to(card, { opacity: 0.4, duration: 0.3 }, NG);

  // NEGOTIATION widget: scope ⟷ time slider, then the DEAL stamp
  const sl = s("g", {}, g);
  const X0 = 112, X1 = 600, SY = 836;
  s("text", { x: X0, y: SY - 18, fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 18, "letter-spacing": 4, text: "SCOPE" }, sl);
  s("text", { x: X1, y: SY - 18, "text-anchor": "end", fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 18, "letter-spacing": 4, text: "TIME" }, sl);
  s("rect", { x: X0, y: SY - 4, width: X1 - X0, height: 8, rx: 4, fill: "#2A2A33" }, sl);
  const fill = s("rect", { x: X0, y: SY - 4, width: (X1 - X0) / 2, height: 8, rx: 4, fill: C.red }, sl);
  const knob = s("circle", { cx: (X0 + X1) / 2, cy: SY, r: 16, fill: "#fff", stroke: C.red, "stroke-width": 5 }, sl);
  gsap.set(sl, { opacity: 0 });
  tl.to(sl, { opacity: 1, duration: 0.3 }, NG + 0.2);
  for (const [at, x] of [[NG + 0.35, X0 + 60], [NG + 0.75, X1 - 50], [NG + 1.15, (X0 + X1) / 2 + 40]]) {
    tl.to(knob, { attr: { cx: x }, duration: 0.33, ease: "power3.inOut" }, at);
    tl.to(fill, { attr: { width: x - X0 }, duration: 0.33, ease: "power3.inOut" }, at);
  }
  const DEAL = NG + 1.55;
  const stamp = s("g", {}, g);
  s("rect", { x: 640, y: 740, width: 230, height: 72, rx: 10, fill: "rgba(0,0,0,0.3)", stroke: C.red, "stroke-width": 6 }, stamp);
  s("text", { x: 755, y: 792, "text-anchor": "middle", fill: C.red, "font-family": "Inter", "font-weight": 900, "font-size": 44, "letter-spacing": 4, text: "✓ DEAL" }, stamp);
  gsap.set(stamp, { svgOrigin: "755 776", rotation: -8, scale: 3, opacity: 0 });
  tl.to(stamp, { scale: 1, opacity: 1, duration: 0.16, ease: "power4.in" }, DEAL);
  ctx.shake(g, DEAL + 0.16, 0.25, 10, 4);
  ctx.flash(DEAL + 0.16, C.red, 0.15, 0.2);

  // iris wipe (red disc from the knight's chest) → scene 5
  const iris = s("circle", { cx: 1340, cy: 560, r: 0, fill: C.red }, ctx.svgTop);
  tl.to(iris, { attr: { r: 2300 }, duration: 0.4, ease: "power3.in" }, 25.6);
  tl.set(g, { autoAlpha: 0 }, 26.0);
  tl.set([...nums, ...words.map((w) => w.inner)], { opacity: 0 }, 26.0);
  tl.set(ctx.scrimL, { opacity: 0 }, 26.0);
  tl.to(iris, { attr: { cy: -2400 }, duration: 0.45, ease: "power3.inOut" }, 26.0);
  tl.set(iris, { attr: { r: 0 } }, 26.5);
}

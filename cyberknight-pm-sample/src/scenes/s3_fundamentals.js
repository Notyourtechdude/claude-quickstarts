// 9–17s · FUNDAMENTALS — over the skybridge tracking shot: holographic stage words (Discover → Define →
// Prioritize) drift past in parallax, then a floating Impact × Effort matrix sorts the backlog and cuts the time sinks.
import { gsap } from "../../node_modules/gsap/index.js";
import { C, s, rng } from "../brand.js";
import { text, reveal } from "../type.js";
import { glitchHTML } from "../fx.js";

export default function s3(ctx) {
  const { tl, back, front, type } = ctx;
  const g = s("g", { id: "s3", style: "mix-blend-mode:screen" }, back);
  gsap.set(g, { autoAlpha: 0 });
  tl.set(g, { autoAlpha: 1 }, 8.95);

  // ── stage words: anchored "in the world", so they drift left as the camera tracks right ──
  const NODES = [
    { at: ctx.vo("l3a"), word: "DISCOVER", sub: "THE REAL NEED", icon: "M-5 -5 m-13 0 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0 M5 5 L17 17" },
    { at: ctx.vo("l3b"), word: "DEFINE", sub: "WHAT MATTERS", icon: "M0 0 m-17 0 a17 17 0 1 0 34 0 a17 17 0 1 0 -34 0 M0 0 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0" },
    { at: ctx.vo("l3c"), word: "PRIORITIZE", sub: "RUTHLESSLY", icon: "M-16 -12 H16 M-16 0 H8 M-16 12 H-2" },
  ];
  const DRIFT = 520;   // px per second of apparent parallax
  NODES.forEach((n, i) => {
    const ng = s("g", { filter: "url(#holo)" }, g);
    const X = 1240, Y = 300 + (i % 2) * 40;
    const word = s("text", { x: X, y: Y, "text-anchor": "middle", "font-family": "Inter", "font-weight": 900, "font-size": 118, "letter-spacing": -3, fill: C.red, "fill-opacity": 0.25, stroke: "#ff9aa6", "stroke-width": 2, text: n.word }, ng);
    const sub = s("text", { x: X, y: Y + 54, "text-anchor": "middle", "font-family": "JBMono", "font-size": 22, "letter-spacing": 8, fill: "#ffd0d6", text: `// ${n.sub}` }, ng);
    s("line", { x1: X, y1: Y + 74, x2: X, y2: 780, stroke: "#ff9aa6", "stroke-width": 2, "stroke-dasharray": "4 7", opacity: 0.7 }, ng);
    const node = s("g", { transform: `translate(${X} 820)` }, ng);
    s("circle", { r: 38, fill: C.red, "fill-opacity": 0.25, stroke: "#ff9aa6", "stroke-width": 3 }, node);
    s("path", { d: n.icon, stroke: "#fff", "stroke-width": 3.5, fill: "none", "stroke-linecap": "round" }, node);
    const pulse = s("circle", { cx: X, cy: 820, r: 38, fill: "none", stroke: "#fff", "stroke-width": 3, opacity: 0 }, ng);
    gsap.set(ng, { autoAlpha: 0, x: 260 });
    const life = (NODES[i + 1]?.at ?? 12.3) - n.at + 0.6;
    tl.set(ng, { autoAlpha: 1 }, n.at - 0.05);
    for (let f = 0; f < 5; f++) tl.set(ng, { opacity: f % 2 ? 0.4 : 1 }, n.at - 0.05 + f / 30);
    tl.to(ng, { x: 260 - DRIFT * life, duration: life, ease: "none" }, n.at - 0.05);
    tl.fromTo(word, { attr: { "fill-opacity": 0.25 } }, { attr: { "fill-opacity": 0.95 }, duration: 0.3, ease: "power2.out", immediateRender: false }, n.at + 0.05);
    tl.fromTo(sub, { attr: { "letter-spacing": 26 }, opacity: 0 }, { attr: { "letter-spacing": 8 }, opacity: 1, duration: 0.5, ease: "expo.out", immediateRender: false }, n.at + 0.1);
    tl.fromTo(pulse, { attr: { r: 38 }, opacity: 1 }, { attr: { r: 140 }, opacity: 0, duration: 0.7, ease: "expo.out", immediateRender: false }, n.at);
    tl.to(ng, { autoAlpha: 0, duration: 0.25 }, n.at - 0.05 + life - 0.25);
  });

  // ── the matrix hologram ──
  const B0 = 12.75;
  const MX = 960, MY = 250, MW = 820, MH = 520;
  const mg = s("g", { filter: "url(#holo)" }, g);
  const frame = s("rect", { x: MX - 30, y: MY - 80, width: MW + 60, height: MH + 140, rx: 18, fill: C.red, "fill-opacity": 0.06, stroke: "#ff9aa6", "stroke-width": 2 }, mg);
  const q = [
    { k: "QW", label: "QUICK WINS", x: MX, y: MY },
    { k: "BB", label: "BIG BETS", x: MX + MW / 2, y: MY },
    { k: "FI", label: "FILL-INS", x: MX, y: MY + MH / 2 },
    { k: "TS", label: "TIME SINKS", x: MX + MW / 2, y: MY + MH / 2 },
  ];
  const panels = {};
  q.forEach((Q, i) => {
    const p = s("rect", { x: Q.x + 6, y: Q.y + 6, width: MW / 2 - 12, height: MH / 2 - 12, rx: 10, fill: C.red, "fill-opacity": Q.k === "TS" ? 0.16 : 0.05, stroke: "#ff9aa6", "stroke-opacity": 0.5, "stroke-width": 1.5 }, mg);
    const l = s("text", { x: Q.x + 24, y: Q.y + 38, fill: Q.k === "TS" ? "#fff" : "#ffc2ca", "font-family": "JBMono", "font-size": 17, "letter-spacing": 4, text: Q.label }, mg);
    gsap.set([p, l], { opacity: 0 });
    tl.to(p, { opacity: 1, duration: 0.25 }, B0 + 0.2 + i * 0.06);
    tl.to(l, { opacity: 1, duration: 0.25 }, B0 + 0.35 + i * 0.06);
    panels[Q.k] = { p, cx: Q.x + MW / 4, cy: Q.y + MH / 4 + 18 };
  });
  s("text", { x: MX - 6, y: MY - 34, fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 20, "letter-spacing": 6, text: "BACKLOG // IMPACT × EFFORT" }, mg);
  gsap.set(mg, { autoAlpha: 0, svgOrigin: `${MX + MW / 2} ${MY + MH / 2}` });
  tl.set(mg, { autoAlpha: 1 }, B0);
  tl.fromTo(mg, { scaleY: 0.02, scaleX: 1.15 }, { scaleY: 1, scaleX: 1, duration: 0.45, ease: "expo.out", immediateRender: false }, B0);
  tl.fromTo(frame, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, ease: "power2.inOut", immediateRender: false }, B0);

  // tickets (solid cards, normal blend, so they read on top of the hologram)
  const TICKETS = [
    { id: "CK-101", t: "MFA ROLLOUT", rice: 92, q: "QW", s: 0 },
    { id: "CK-332", t: "AI THREAT TRIAGE", rice: 76, q: "BB", s: 0 },
    { id: "CK-277", t: "CUSTOM EMOJI", rice: 9, q: "TS", s: 0 },
    { id: "CK-150", t: "CSV EXPORT", rice: 45, q: "FI", s: 0 },
    { id: "CK-214", t: "SSO LOGIN", rice: 88, q: "QW", s: 1 },
    { id: "CK-512", t: "3D LOGO SPIN", rice: 4, q: "TS", s: 1 },
    { id: "CK-087", t: "AUDIT LOGS", rice: 71, q: "BB", s: 1 },
    { id: "CK-409", t: "DARK MODE", rice: 38, q: "FI", s: 1 },
  ];
  const cards = s("g", {}, front);
  gsap.set(cards, { autoAlpha: 0 });
  tl.set(cards, { autoAlpha: 1 }, B0 + 0.4);
  const RR = rng(17);
  const RAIN = B0 + 0.3, SORT = 13.9, CUT = ctx.vo("l3d");
  TICKETS.forEach((T, i) => {
    const cg = s("g", {}, cards);
    const W = 340, Hh = 56;
    s("rect", { x: -W / 2, y: -Hh / 2, width: W, height: Hh, rx: 9, fill: "rgba(12,12,16,0.92)", stroke: "#ff9aa6", "stroke-opacity": 0.6, "stroke-width": 1.5 }, cg);
    s("rect", { x: -W / 2, y: -Hh / 2, width: 6, height: Hh, rx: 3, fill: T.rice > 60 ? C.red : T.rice > 20 ? "#fff" : "#555" }, cg);
    s("text", { x: -W / 2 + 20, y: 6, fill: "rgba(255,255,255,0.6)", "font-family": "JBMono", "font-size": 15, text: T.id }, cg);
    s("text", { x: -W / 2 + 92, y: 6, fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 15, text: T.t }, cg);
    s("rect", { x: W / 2 - 60, y: -15, width: 48, height: 30, rx: 7, fill: T.rice > 60 ? C.red : "#26262E" }, cg);
    const num = s("text", { x: W / 2 - 36, y: 6, "text-anchor": "middle", fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 15, text: "00" }, cg);
    const strike = s("path", { d: `M${-W / 2 + 14} 0 H${W / 2 - 14}`, stroke: C.red, "stroke-width": 5, "stroke-linecap": "round", opacity: 0 }, cg);
    const px = MX + MW / 2 + (RR() - 0.5) * 300, py = MY + MH / 2 + (RR() - 0.5) * 200, pr = (RR() - 0.5) * 24;
    gsap.set(cg, { x: px, y: -120, rotation: pr * 3, svgOrigin: "0 0" });
    tl.to(cg, { y: py, rotation: pr, duration: 0.42, ease: "bounce.out" }, RAIN + i * 0.06);
    const P = panels[T.q];
    const at = SORT + i * 0.17;
    tl.to(cg, { x: P.cx, y: P.cy + (T.s ? 44 : -26), rotation: 0, duration: 0.34, ease: "back.out(1.5)" }, at);
    const box = { v: 0 };
    tl.to(box, { v: T.rice, duration: 0.4, ease: "power2.out", onUpdate: () => { num.textContent = String(Math.round(box.v)).padStart(2, "0"); } }, at);
    if (T.q === "TS") {
      tl.fromTo(strike, { opacity: 1, drawSVG: "0%" }, { drawSVG: "100%", duration: 0.18, ease: "power2.out", immediateRender: false }, CUT + (T.s ? 0.1 : 0));
      tl.to(cg, { y: 1300, rotation: T.s ? 38 : -30, x: `+=${T.s ? 120 : -60}`, duration: 0.6, ease: "power3.in" }, CUT + 0.3 + (T.s ? 0.08 : 0));
    }
  });

  // heading, bottom-left under the walking knight's eye line
  tl.to(ctx.scrimB, { opacity: 1, duration: 0.4 }, B0);
  const H1 = text(type, "PRIORITIZE", { x: 110, y: 900, size: 76, cls: "h", split: "chars" });
  const H2 = text(type, "RUTHLESSLY.", { x: 560, y: 900, size: 76, cls: "h", split: "chars" });
  H2.inner.style.color = C.red;
  reveal(tl, H1.units, B0 + 0.05, { dur: 0.5, stagger: 0.02 });
  reveal(tl, H2.units, CUT, { dur: 0.35, stagger: 0.018, ease: "power4.out" });
  glitchHTML(tl, H2.wrap, CUT + 0.02, { frames: 4, seed: 7 });
  tl.to(panels.TS.p, { attr: { "fill-opacity": 0.45 }, duration: 0.05, yoyo: true, repeat: 1 }, CUT);
  ctx.shake(mg, CUT + 0.3, 0.3, 12, 5);

  // out: matrix collapses to a line, everything clears for the cut
  const OUT = 16.55;
  tl.to(mg, { scaleY: 0.02, duration: 0.3, ease: "power3.in" }, OUT);
  tl.to(cards, { autoAlpha: 0, duration: 0.2 }, OUT);
  tl.to([H1.inner, H2.inner], { x: -600, opacity: 0, duration: 0.35, ease: "power3.in" }, OUT);
  tl.to(ctx.scrimB, { opacity: 0, duration: 0.3 }, OUT + 0.1);
  tl.set(g, { autoAlpha: 0 }, 17.0);
}

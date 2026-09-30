// 17–26s · SOFT SKILLS — "SOFT SKILLS" slam, then a stakeholder standoff the PM resolves:
// OWNERSHIP (she steps up) → TRUST (bubbles merge into one shared roadmap) → NEGOTIATION (scope/time deal).
import { gsap } from "../../node_modules/gsap/index.js";
import { C, s, rng } from "../brand.js";
import { text, reveal, conceal } from "../type.js";
import { glitchHTML } from "../fx.js";

export default function s4(ctx) {
  const { tl, back, front, type, cast } = ctx;
  const { pm, dev, designer, exec } = cast;
  const g = s("g", { id: "s4" }, back);
  const fg = s("g", { id: "s4fg" }, front);
  gsap.set([g, fg], { autoAlpha: 0 });
  tl.set([g, fg], { autoAlpha: 1 }, 16.95);
  tl.set(ctx.bgw.dots, { x: 0 }, 17.0);

  // ── "BUT THE REAL EDGE?" → "SOFT SKILLS" ──
  const qA = ctx.vo("l4a"), qB = ctx.vo("l4b");
  const edge = text(type, "BUT THE REAL EDGE?", { x: 960, y: 540, size: 92, cls: "h", anchor: "center", split: "chars" });
  tl.fromTo(edge.inner, { x: 900, filter: "blur(12px)" }, { x: 0, filter: "blur(0px)", duration: 0.45, ease: "expo.out", immediateRender: true }, 16.72);
  reveal(tl, edge.units, qA - 0.05, { dur: 0.4, stagger: 0.015 });
  tl.to(edge.inner, { scale: 0.92, opacity: 0, duration: 0.18, ease: "power2.in" }, qB - 0.12);

  const soft = text(type, "SOFT SKILLS", { x: 960, y: 530, size: 250, cls: "h ko", anchor: "center" });
  soft.inner.style.letterSpacing = "-0.04em";
  gsap.set(soft.inner, { opacity: 0 });
  tl.fromTo(soft.inner, { opacity: 1, scale: 1.9, filter: "blur(18px)" }, { scale: 1, filter: "blur(0px)", duration: 0.2, ease: "power4.in", immediateRender: false }, qB - 0.08);
  ctx.flash(qB + 0.12, "#fff", 0.18, 0.18);
  ctx.shake(soft.wrap, qB + 0.12, 0.35, 18, 9);
  tl.to(soft.inner, { scale: 1.06, duration: 0.6, ease: "none" }, qB + 0.14);
  glitchHTML(tl, soft.wrap, qB + 0.55, { frames: 3, seed: 13, amp: 22 });
  tl.to(soft.inner, { scale: 7, opacity: 0, filter: "blur(10px)", duration: 0.32, ease: "power3.in" }, 18.78);

  // ── giant background words ──
  const WORDS = {};
  for (const [k, w] of [["own", "OWNERSHIP"], ["trust", "TRUST"], ["neg", "NEGOTIATION"]]) {
    const wg = s("g", {}, g);
    s("text", { x: 960, y: 300, "text-anchor": "middle", "font-family": "Inter", "font-weight": 900, "font-size": 200, "letter-spacing": -6, fill: "none", stroke: "rgba(255,255,255,0.18)", "stroke-width": 2, text: w }, wg);
    const id = `gw_${k}`;
    const cp = s("clipPath", { id }, ctx.defs);
    const r = s("rect", { x: 160, y: 120, width: 0, height: 220 }, cp);
    const solid = s("g", { "clip-path": `url(#${id})` }, wg);
    s("text", { x: 970, y: 288, "text-anchor": "middle", "font-family": "Inter", "font-weight": 900, "font-size": 200, "letter-spacing": -6, fill: C.core, text: w }, solid);
    s("text", { x: 960, y: 300, "text-anchor": "middle", "font-family": "Inter", "font-weight": 900, "font-size": 200, "letter-spacing": -6, fill: "#fff", text: w }, solid);
    gsap.set(wg, { autoAlpha: 0 });
    WORDS[k] = { wg, r };
  }
  const wordIn = (k, at) => {
    tl.set(WORDS[k].wg, { autoAlpha: 1, y: 0 }, at - 0.05);
    tl.fromTo(WORDS[k].r, { attr: { x: 160, width: 0 } }, { attr: { width: 1600 }, duration: 0.4, ease: "expo.out", immediateRender: false }, at);
  };
  const wordOut = (k, at) => {
    tl.to(WORDS[k].r, { attr: { x: 1760, width: 0 }, duration: 0.3, ease: "power3.in" }, at);
    tl.to(WORDS[k].wg, { y: -30, autoAlpha: 0, duration: 0.3, ease: "power3.in" }, at);
  };

  // ── the team ──
  const Y = 910, SC = 0.72;
  const POS = { dev: 420, designer: 780, pm: 1140, exec: 1500 };
  const T0 = 18.9;
  dev.popIn(tl, T0, { x: POS.dev, y: Y, scale: SC });
  designer.popIn(tl, T0 + 0.1, { x: POS.designer, y: Y, scale: SC });
  exec.popIn(tl, T0 + 0.2, { x: POS.exec, y: Y, scale: SC });
  tl.set(dev.props.laptop, { opacity: 1 }, T0);
  dev.pose(tl, T0, { armL: -25, armR: 25, foreL: -40, foreR: 40 }, 0.01);
  pm.dropIn(tl, T0 + 0.35, { x: POS.pm, y: Y, scale: SC, fall: 0.3 });
  const spot = s("ellipse", { cx: POS.pm, cy: Y + 4, rx: 150, ry: 30, fill: "url(#spot)", opacity: 0 }, g);
  tl.to(spot, { opacity: 0.9, duration: 0.2 }, T0 + 0.35);
  for (const c of [dev, designer, exec, pm]) { c.blinks(tl, T0 + 0.3, 25.9, 1.7); c.breathe(tl, T0 + 0.5, 25.9, 0.015, 1.4); }

  // ── conflict: three competing asks ──
  const R = rng(44);
  const bubble = (x, str, accent) => {
    const bg = s("g", {}, fg);
    const t = s("text", { x, y: 468, "text-anchor": "middle", fill: accent ? C.red : "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 24, "letter-spacing": 1, text: str }, bg);
    const w = t.getComputedTextLength() + 56;
    bg.insertBefore(s("path", { d: `M${x - w / 2} 424 h${w} a12 12 0 0 1 12 12 v44 a12 12 0 0 1 -12 12 H${x + 18} l-18 22 l-4 -22 H${x - w / 2} a12 12 0 0 1 -12 -12 v-44 a12 12 0 0 1 12 -12 Z`, fill: "#101015", stroke: accent ? C.red : "rgba(255,255,255,0.5)", "stroke-width": 2.5 }), t);
    gsap.set(bg, { svgOrigin: `${x} 514`, scale: 0 });
    return { bg, x, w };
  };
  const bD = bubble(POS.dev, "{ refactor first }");
  const bG = bubble(POS.designer, "pixel-perfect UX");
  const bE = bubble(POS.exec, "$ ship by Q3", true);
  const B = [bD, bG, bE];
  const C0 = 19.45;
  B.forEach((b, i) => tl.to(b.bg, { scale: 1, duration: 0.35, ease: "back.out(2.4)" }, C0 + i * 0.15));
  dev.brows(tl, C0, "angry"); designer.brows(tl, C0 + 0.15, "angry"); exec.brows(tl, C0 + 0.3, "angry");
  dev.talk(tl, C0, 20.2, "frown"); designer.talk(tl, C0 + 0.15, 20.2, "frown"); exec.talk(tl, C0 + 0.3, 20.2, "frown");
  designer.gesture(tl, C0 + 0.15, 20.15, 1); exec.gesture(tl, C0 + 0.3, 20.15, 0);
  for (const b of B) for (let f = 0; f < 10; f++) tl.set(b.bg, { x: (R() - 0.5) * 10, y: (R() - 0.5) * 6 }, 19.9 + f / 30);
  for (const b of B) tl.set(b.bg, { x: 0, y: 0 }, 20.24);
  // lightning between the asks
  const bolt = (x1, x2) => {
    let d = `M${x1} 452`;
    const n = 7;
    for (let i = 1; i <= n; i++) d += ` L${x1 + ((x2 - x1) * i) / n} ${452 + (i === n ? 0 : (R() - 0.5) * 60)}`;
    return s("path", { d, stroke: C.red, "stroke-width": 4, fill: "none", filter: "url(#glow)", "stroke-linejoin": "round", opacity: 0 }, fg);
  };
  const bolts = [bolt(bD.x + bD.w / 2 + 14, bG.x - bG.w / 2 - 14), bolt(bG.x + bG.w / 2 + 14, bE.x - bE.w / 2 - 14)];
  for (let f = 0; f < 9; f++) tl.set(bolts, { opacity: f % 3 === 2 ? 0 : 1, scaleY: f % 2 ? -1 : 1, svgOrigin: "960 452" }, 19.9 + f / 30);
  tl.set(bolts, { opacity: 0 }, 20.2);
  pm.brows(tl, C0 + 0.1, "worried"); pm.mouth(tl, C0 + 0.1, "flat");
  pm.look(tl, C0 + 0.2, -1); pm.look(tl, C0 + 0.55, 1); pm.look(tl, C0 + 0.8, -0.5);

  // ── OWNERSHIP: she steps up ──
  const OWN = ctx.vo("l4c");
  wordIn("own", OWN);
  tl.to(pm.root, { scale: 0.8, y: Y + 30, duration: 0.3, ease: "back.out(2)" }, OWN);
  pm.brows(tl, OWN, "neutral"); pm.mouth(tl, OWN, "smile"); pm.look(tl, OWN, 0);
  pm.pose(tl, OWN, { armR: -165, foreR: -8 }, 0.22, "back.out(2.5)");
  pm.pose(tl, OWN + 0.7, { armR: -7, foreR: 0 }, 0.35, "power2.inOut");
  for (const c of [dev, designer]) { c.look(tl, OWN + 0.05, 1); c.brows(tl, OWN + 0.05, "up"); c.mouth(tl, OWN + 0.05, "small"); }
  exec.look(tl, OWN + 0.05, -1); exec.brows(tl, OWN + 0.05, "up"); exec.mouth(tl, OWN + 0.05, "small");
  tl.fromTo(pm.glowRing, { opacity: 1, attr: { rx: 60, ry: 12 } }, { opacity: 0, attr: { rx: 260, ry: 56 }, duration: 0.8, ease: "expo.out", immediateRender: false }, OWN);
  // assignee chip
  const chip = s("g", {}, fg);
  s("rect", { x: POS.pm - 150, y: 470, width: 300, height: 54, rx: 27, fill: C.red }, chip);
  s("circle", { cx: POS.pm - 122, cy: 497, r: 17, fill: "#fff" }, chip);
  s("path", { d: `M${POS.pm - 130} 497 l6 6 l12 -13`, stroke: C.red, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, chip);
  s("text", { x: POS.pm - 96, y: 505, fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 21, "letter-spacing": 2, text: "ASSIGNEE: YOU" }, chip);
  gsap.set(chip, { svgOrigin: `${POS.pm} 524`, scale: 0 });
  tl.to(chip, { scale: 1, duration: 0.35, ease: "back.out(2.5)" }, OWN + 0.1);
  // listening: dotted lines from her to each ask + a voice meter
  const links = B.map((b) => s("path", { d: `M${POS.pm} 540 Q${(POS.pm + b.x) / 2} 640 ${b.x} 520`, stroke: "rgba(255,255,255,0.55)", "stroke-width": 2.5, "stroke-dasharray": "3 9", fill: "none", "stroke-linecap": "round" }, fg));
  links.forEach((l, i) => tl.fromTo(l, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.45, ease: "power2.out", immediateRender: true }, OWN + 0.8 + i * 0.12));
  const meter = s("g", {}, fg);
  const bars = [];
  for (let i = 0; i < 5; i++) bars.push(s("rect", { x: POS.pm + 170 + i * 12, y: 480, width: 7, height: 34, rx: 3.5, fill: C.red }, meter));
  gsap.set(bars, { scaleY: 0.2, svgOrigin: `0 514` });
  tl.set(meter, { opacity: 0 }, 0);
  tl.set(meter, { opacity: 1 }, OWN + 0.8);
  for (let f = 0; f < 36; f++) bars.forEach((b, i) => tl.set(b, { scaleY: 0.25 + Math.abs(Math.sin(f * 0.9 + i * 1.7)) * 0.75 }, OWN + 0.8 + f / 30));
  tl.set(meter, { opacity: 0 }, OWN + 2.0);
  pm.pose(tl, OWN + 1.0, { head: 7 }, 0.2, "sine.inOut"); pm.pose(tl, OWN + 1.25, { head: -2 }, 0.2, "sine.inOut");
  pm.pose(tl, OWN + 1.5, { head: 7 }, 0.2, "sine.inOut"); pm.pose(tl, OWN + 1.75, { head: 0 }, 0.2, "sine.inOut");

  // ── TRUST: the asks merge into one shared roadmap ──
  const TR = ctx.vo("l4d");
  wordOut("own", TR - 0.1); wordIn("trust", TR);
  tl.to(chip, { scale: 0, duration: 0.2, ease: "back.in(2)" }, TR - 0.1);
  tl.to(links, { opacity: 0, duration: 0.2 }, TR + 0.1);
  B.forEach((b, i) => {
    tl.to(b.bg, { x: POS.pm - b.x, y: -30, scale: 0.4, opacity: 0, duration: 0.4, ease: "power3.in" }, TR + 0.05 + i * 0.06);
  });
  const card = s("g", {}, fg);
  const CW = 470, CH = 200, CX = POS.pm, CY = 448;
  s("rect", { x: CX - CW / 2, y: CY - CH / 2, width: CW, height: CH, rx: 16, fill: "#0E0E13", stroke: C.red, "stroke-width": 2.5 }, card);
  s("rect", { x: CX - CW / 2, y: CY - CH / 2, width: CW, height: 44, rx: 16, fill: C.red }, card);
  s("rect", { x: CX - CW / 2, y: CY - CH / 2 + 28, width: CW, height: 16, fill: C.red }, card);
  s("text", { x: CX - CW / 2 + 22, y: CY - CH / 2 + 30, fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 19, "letter-spacing": 3, text: "SHARED ROADMAP" }, card);
  const rows = ["REFACTOR  → SPRINT 2", "UX POLISH → SPRINT 3", "SHIP      → Q3"];
  const checks = [];
  rows.forEach((r, i) => {
    const y = CY - CH / 2 + 82 + i * 40;
    const ck = s("g", {}, card);
    s("rect", { x: CX - CW / 2 + 22, y: y - 18, width: 24, height: 24, rx: 6, fill: "none", stroke: "#fff", "stroke-width": 2 }, ck);
    const tick = s("path", { d: `M${CX - CW / 2 + 27} ${y - 6} l5 6 l10 -12`, stroke: C.red, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, ck);
    s("text", { x: CX - CW / 2 + 62, y, fill: "#fff", "font-family": "JBMono", "font-size": 19, "xml:space": "preserve", text: r }, ck);
    checks.push(tick);
  });
  gsap.set(card, { svgOrigin: `${CX} ${CY + CH / 2}`, scale: 0 });
  tl.to(card, { scale: 1, duration: 0.45, ease: "back.out(1.8)" }, TR + 0.4);
  checks.forEach((c, i) => tl.fromTo(c, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.2, ease: "power2.out", immediateRender: true }, TR + 0.75 + i * 0.22));
  pm.point(tl, TR + 0.3, 0, 150, 0.8);
  for (const [c, dt] of [[dev, 0], [designer, 0.1], [exec, 0.2]]) {
    c.look(tl, TR + 0.4 + dt, c === exec ? -0.5 : 0.5);
    c.brows(tl, TR + 0.8 + dt, "neutral");
    c.mouth(tl, TR + 0.8 + dt, "grin");
    tl.to(c.body, { y: -22, duration: 0.14, ease: "power2.out", yoyo: true, repeat: 1 }, TR + 0.8 + dt);
  }
  pm.mouth(tl, TR + 0.8, "grin");

  // ── NEGOTIATION: scope ⟷ time, then the deal ──
  const NG = ctx.vo("l4e");
  const S0 = NG - 0.8;
  tl.to(card, { scale: 0, duration: 0.25, ease: "back.in(1.6)" }, S0 - 0.25);
  const slider = s("g", {}, fg);
  const SX0 = CX - 260, SX1 = CX + 260, SY = 430;
  s("text", { x: SX0, y: SY - 34, fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 20, "letter-spacing": 4, text: "SCOPE" }, slider);
  s("text", { x: SX1, y: SY - 34, "text-anchor": "end", fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 20, "letter-spacing": 4, text: "TIME" }, slider);
  s("rect", { x: SX0, y: SY - 4, width: SX1 - SX0, height: 8, rx: 4, fill: "#2A2A33" }, slider);
  const fillBar = s("rect", { x: SX0, y: SY - 4, width: (SX1 - SX0) / 2, height: 8, rx: 4, fill: C.red }, slider);
  const knob = s("circle", { cx: CX, cy: SY, r: 20, fill: "#fff", stroke: C.red, "stroke-width": 5 }, slider);
  gsap.set(slider, { opacity: 0, y: 20 });
  tl.to(slider, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, S0);
  const kx = [[S0 + 0.3, SX0 + 70], [S0 + 0.75, SX1 - 60], [S0 + 1.2, CX + 40]];
  for (const [at, x] of kx) {
    tl.to(knob, { attr: { cx: x }, duration: 0.35, ease: "power3.inOut" }, at);
    tl.to(fillBar, { attr: { width: x - SX0 }, duration: 0.35, ease: "power3.inOut" }, at);
  }
  exec.mouth(tl, S0 + 0.35, "frown"); exec.brows(tl, S0 + 0.35, "angry");
  dev.mouth(tl, S0 + 0.8, "frown"); dev.brows(tl, S0 + 0.8, "angry"); exec.brows(tl, S0 + 0.8, "neutral"); exec.mouth(tl, S0 + 0.8, "smile");
  dev.brows(tl, S0 + 1.25, "neutral"); dev.mouth(tl, S0 + 1.25, "smile");
  pm.gesture(tl, S0 + 0.3, S0 + 1.5, 1);
  wordOut("trust", NG - 0.1); wordIn("neg", NG);
  const DEAL = NG + 0.55;
  tl.fromTo(knob, { attr: { r: 20 } }, { attr: { r: 30 }, duration: 0.12, yoyo: true, repeat: 1, immediateRender: false }, DEAL - 0.2);
  const stamp = s("g", {}, fg);
  s("rect", { x: CX - 118, y: 488, width: 236, height: 72, rx: 10, fill: "none", stroke: C.red, "stroke-width": 6 }, stamp);
  s("text", { x: CX, y: 540, "text-anchor": "middle", fill: C.red, "font-family": "Inter", "font-weight": 900, "font-size": 46, "letter-spacing": 4, text: "✓ DEAL" }, stamp);
  gsap.set(stamp, { svgOrigin: `${CX} 524`, rotation: -8, scale: 3, opacity: 0 });
  tl.to(stamp, { scale: 1, opacity: 1, duration: 0.16, ease: "power4.in" }, DEAL);
  ctx.shake(fg, DEAL + 0.16, 0.25, 10, 4);
  ctx.flash(DEAL + 0.16, C.red, 0.15, 0.2);

  // everyone celebrates + confetti
  const PARTY = 25.05;
  [dev, designer, exec, pm].forEach((c, i) => c.celebrate(tl, PARTY + i * 0.06, 0.55));
  tl.set(dev.props.laptop, { opacity: 0 }, PARTY);
  const CR = rng(8);
  const conf = Array.from({ length: 160 }, () => ({ x: 380 + CR() * 1160, vx: (CR() - 0.5) * 500, vy: -500 - CR() * 700, r: CR() * 6.28, vr: (CR() - 0.5) * 18, c: CR() > 0.5 ? C.red : CR() > 0.3 ? "#fff" : C.core, w: 8 + CR() * 10 }));
  ctx.drawers.push({
    t0: PARTY, t1: 26.0,
    draw(gx, t) {
      const dt = t - PARTY;
      for (const p of conf) {
        const x = p.x + p.vx * dt, y = 700 + p.vy * dt + 1400 * dt * dt;
        gx.save(); gx.translate(x, y); gx.rotate(p.r + p.vr * dt); gx.fillStyle = p.c; gx.fillRect(-p.w / 2, -3, p.w, 6); gx.restore();
      }
    },
  });

  // iris wipe out (red disc from the PM) → scene 5
  const iris = s("circle", { cx: POS.pm, cy: 700, r: 0, fill: C.red }, ctx.svgTop);
  tl.to(iris, { attr: { r: 2300 }, duration: 0.4, ease: "power3.in" }, 25.6);
  tl.set([g, fg], { autoAlpha: 0 }, 26.0);
  for (const c of [dev, designer, exec, pm]) c.hide(tl, 26.0);
  tl.to(iris, { attr: { cy: -2400 }, duration: 0.45, ease: "power3.inOut" }, 26.0);
  tl.set(iris, { attr: { r: 0 } }, 26.5);
  tl.set(WORDS.neg.wg, { autoAlpha: 0 }, 26.0);
}

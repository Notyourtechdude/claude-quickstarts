// 4–9s · THE ROLE — the "?" dot becomes a Venn (Business × Tech × Users); the PM drops into the overlap.
import { gsap } from "../../node_modules/gsap/index.js";
import { C, s } from "../brand.js";
import { text, reveal, conceal } from "../type.js";
import { glitchHTML } from "../fx.js";

export default function s2(ctx) {
  const { tl, back, type, cast } = ctx;
  const pm = cast.pm;
  const g = s("g", { id: "s2" }, back);
  gsap.set(g, { autoAlpha: 0 });
  tl.set(g, { autoAlpha: 1 }, 3.9);

  const CX = 1060, R = 250;
  const P = { A: [CX - 180, 400], B: [CX + 180, 400], C: [CX, 712] };
  const venn = s("g", {}, g);
  gsap.set(venn, { svgOrigin: `${CX} 504` });

  // triple-overlap glow (C clipped by A and B)
  const cpA = s("clipPath", { id: "vA" }, ctx.defs); s("circle", { cx: P.A[0], cy: P.A[1], r: R }, cpA);
  const cpB = s("clipPath", { id: "vB" }, ctx.defs); s("circle", { cx: P.B[0], cy: P.B[1], r: R }, cpB);
  const tri = s("g", { "clip-path": "url(#vA)", opacity: 0 }, venn);
  const tri2 = s("g", { "clip-path": "url(#vB)" }, tri);
  s("circle", { cx: P.C[0], cy: P.C[1], r: R, fill: C.red, opacity: 0.55 }, tri2);

  const mkCircle = (k, stroke, dash) => {
    const c = s("circle", { cx: P[k][0], cy: P[k][1], r: R, fill: C.red, "fill-opacity": 0.07, stroke, "stroke-width": 3, "stroke-dasharray": dash }, venn);
    return c;
  };
  const cA = mkCircle("A", C.red);
  const cB = mkCircle("B", "#fff");
  const cC = mkCircle("C", "#fff", "10 10");

  // A: grows out of the "?" dot left by scene 1
  const q = ctx.qDot || { x: 1610, y: 720 };
  tl.fromTo(cA, { attr: { cx: q.x, cy: q.y, r: 18 }, fillOpacity: 1 }, { attr: { cx: P.A[0], cy: P.A[1], r: R }, fillOpacity: 0.07, duration: 0.7, ease: "expo.out", immediateRender: true }, 3.92);
  tl.fromTo(cB, { x: 1000, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "back.out(1.3)", immediateRender: true }, 4.12);
  tl.fromTo(cC, { y: 700, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.3)", immediateRender: true }, 4.28);
  tl.fromTo(venn, { rotation: -4 }, { rotation: 3, duration: 4.4, ease: "sine.inOut", immediateRender: false }, 4.2);
  ctx.flash(3.92, C.red, 0.18, 0.2);

  // lobe icons + labels
  const lobes = [
    { k: "A", label: "BUSINESS", at: [CX - 300, 330] },
    { k: "B", label: "TECH", at: [CX + 300, 330] },
    { k: "C", label: "USERS", at: [CX, 850] },
  ];
  const icons = {};
  for (const L of lobes) {
    const ig = s("g", { transform: `translate(${L.at[0]} ${L.at[1]})` }, venn);
    const icon = s("g", { stroke: "#fff", "stroke-width": 3.5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, ig);
    if (L.k === "A") { s("path", { d: "M-26 16 V4 M-8 16 V-6 M10 16 V-14 M-30 -4 L-8 -22 L6 -12 L28 -30 M16 -30 H28 V-18" }, icon); }
    if (L.k === "B") { s("path", { d: "M-14 -22 L-32 0 L-14 22 M14 -22 L32 0 L14 22 M6 -28 L-6 28" }, icon); }
    if (L.k === "C") { s("circle", { cx: 0, cy: -12, r: 12 }, icon); s("path", { d: "M-24 26 C-24 6 24 6 24 26" }, icon); }
    const lbl = s("text", { x: 0, y: 58, "text-anchor": "middle", fill: C.dim, "font-family": "JBMono", "font-size": 20, "letter-spacing": 5, text: L.label }, ig);
    gsap.set(icon, { svgOrigin: "0 0" });
    tl.fromTo(ig, { opacity: 0, scale: 0.4, svgOrigin: `${L.at[0]} ${L.at[1]}` }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", immediateRender: true }, 4.55 + lobes.indexOf(L) * 0.08);
    icons[L.k] = { icon, lbl };
  }

  // title block
  const kick = text(type, "ROLE // 01", { x: 112, y: 392, size: 20, cls: "m", split: "chars" });
  kick.inner.style.color = C.red;
  const t1 = text(type, "THE PRODUCT", { x: 108, y: 462, size: 74, cls: "h", split: "chars" });
  const t2 = text(type, "MANAGER", { x: 108, y: 540, size: 74, cls: "h ko", split: "chars" });
  const sub = text(type, "lives where business, tech<br>&amp; users meet.", { x: 112, y: 640, size: 28, cls: "b" });
  sub.inner.style.fontWeight = 300; sub.inner.style.color = C.dim; sub.inner.style.lineHeight = "1.35"; sub.inner.style.whiteSpace = "nowrap";
  const vo = ctx.vo("l2");
  reveal(tl, kick.units, vo - 0.05, { dur: 0.3, stagger: 0.015 });
  reveal(tl, t1.units, vo + 0.05, { dur: 0.55, stagger: 0.025 });
  reveal(tl, t2.units, vo + 0.25, { dur: 0.55, stagger: 0.03 });
  glitchHTML(tl, t2.wrap, vo + 0.7, { frames: 3, seed: 21, amp: 16 });
  tl.fromTo(sub.inner, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: true }, vo + 1.3);

  // PM lands in the overlap
  const platform = s("g", {}, g);
  const plat1 = s("ellipse", { cx: CX, cy: 660, rx: 110, ry: 24, fill: "none", stroke: C.red, "stroke-width": 3, filter: "url(#glow)", opacity: 0 }, platform);
  const plat2 = s("ellipse", { cx: CX, cy: 660, rx: 110, ry: 24, fill: "none", stroke: C.red, "stroke-width": 2, opacity: 0 }, platform);
  gsap.set([plat1, plat2], { svgOrigin: `${CX} 660` });
  const LAND = 5.5;
  pm.dropIn(tl, LAND, { x: CX, y: 660, scale: 0.6 });
  tl.to(plat1, { opacity: 1, duration: 0.05 }, LAND);
  tl.fromTo(plat2, { opacity: 1, scale: 0.6 }, { opacity: 0, scale: 2.6, duration: 0.7, ease: "expo.out", immediateRender: false }, LAND);
  ctx.shake(venn, LAND, 0.3, 10, 3);
  pm.blinks(tl, 5.8, 8.4, 1.3);
  pm.wave(tl, 5.85, 3, 1);
  pm.breathe(tl, 5.9, 8.4);

  // VO-synced lobe highlights (business / tech / users → meet)
  const hi = [["A", 6.26, -1], ["B", 7.0, 1], ["C", 7.35, 0]];   // measured word onsets in the l2 VO clip
  for (const [k, at, dir] of hi) {
    const circ = { A: cA, B: cB, C: cC }[k];
    tl.to(icons[k].lbl, { attr: { fill: "#fff" }, duration: 0.05 }, at);
    tl.fromTo(icons[k].icon, { scale: 1 }, { scale: 1.35, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, at);
    tl.to(icons[k].icon, { attr: { stroke: C.red }, duration: 0.05 }, at);
    tl.to(circ, { attr: { "stroke-width": 7 }, fillOpacity: 0.16, duration: 0.1, yoyo: true, repeat: 1 }, at);
    pm.look(tl, at, dir);
  }
  const MEET = 7.72;
  tl.to(tri, { opacity: 1, duration: 0.12 }, MEET);
  tl.fromTo(tri, { opacity: 1 }, { opacity: 0.55, duration: 0.8, ease: "power2.out", immediateRender: false }, MEET + 0.12);
  pm.pose(tl, MEET, { armL: 70, armR: -70, foreL: -25, foreR: 25 }, 0.25, "back.out(2.5)");
  pm.mouth(tl, MEET, "grin");
  tl.fromTo(pm.glowRing, { opacity: 1, attr: { rx: 60, ry: 12 } }, { opacity: 0, attr: { rx: 220, ry: 48 }, duration: 0.7, ease: "expo.out", immediateRender: false }, MEET);
  ctx.flash(MEET, C.red, 0.12, 0.3);
  pm.pose(tl, 8.2, { armL: 7, armR: -7, foreL: 0, foreR: 0 }, 0.3, "power2.inOut");
  pm.mouth(tl, 8.2, "smile");

  // exit → circles fly past camera, PM slides to scene 3's start mark
  const OUT = 8.45;
  conceal(tl, [...kick.units, ...t1.units, ...t2.units], OUT, { stagger: 0.008 });
  tl.to(sub.inner, { opacity: 0, duration: 0.2 }, OUT);
  tl.to(venn, { scale: 3.2, opacity: 0, duration: 0.5, ease: "power3.in" }, OUT);
  tl.to([plat1], { opacity: 0, duration: 0.2 }, OUT);
  tl.to(pm.root, { x: 620, y: 830, scale: 0.55, duration: 0.55, ease: "power3.inOut" }, OUT);
  tl.to(ctx.bgw.floor, { opacity: 1, duration: 0.5 }, OUT);
  tl.set(g, { autoAlpha: 0 }, 9.05);
}

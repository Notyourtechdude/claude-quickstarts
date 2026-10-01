// 4–9s · THE ROLE — the "?" dot flies left and blooms into a holographic Venn
// (Business × Tech × Users) projected from the knight's raised palm.
import { gsap } from "../gsap.js";
import { C, s } from "../brand.js";
import { text, reveal, conceal } from "../type.js";
import { glitchHTML } from "../fx.js";

export default function s2(ctx) {
  const { tl, back, type } = ctx;
  const g = s("g", { id: "s2", style: "mix-blend-mode:screen" }, back);
  gsap.set(g, { autoAlpha: 0 });
  tl.set(g, { autoAlpha: 1 }, 3.9);
  tl.to(ctx.scrimL, { opacity: 0.9, duration: 0.5 }, 3.95);

  const CX = 560, CY = 520, R = 170;
  const P = { A: [CX - 125, CY - 72], B: [CX + 125, CY - 72], C: [CX, CY + 145] };
  const venn = s("g", { filter: "url(#holo)" }, g);
  gsap.set(venn, { svgOrigin: `${CX} ${CY}` });

  const cpA = s("clipPath", { id: "vA" }, ctx.defs); s("circle", { cx: P.A[0], cy: P.A[1], r: R }, cpA);
  const cpB = s("clipPath", { id: "vB" }, ctx.defs); s("circle", { cx: P.B[0], cy: P.B[1], r: R }, cpB);
  const tri = s("g", { "clip-path": "url(#vA)", opacity: 0 }, venn);
  s("circle", { cx: P.C[0], cy: P.C[1], r: R, fill: C.red, opacity: 0.6, "clip-path": "url(#vB)" }, tri);

  const mk = (k, dash) => s("circle", { cx: P[k][0], cy: P[k][1], r: R, fill: C.red, "fill-opacity": 0.08, stroke: C.red, "stroke-width": 3, "stroke-dasharray": dash }, venn);
  const cA = mk("A"), cB = mk("B"), cC = mk("C", "10 9");
  // scanline sweep through the hologram
  const sweep = s("rect", { x: CX - 330, y: CY - 260, width: 660, height: 6, fill: "#ff8a98", opacity: 0.0 }, venn);
  tl.fromTo(sweep, { attr: { y: CY - 260 }, opacity: 0.55 }, { attr: { y: CY + 330 }, opacity: 0, duration: 1.1, ease: "power1.in", immediateRender: false }, 4.6);

  const q = ctx.qDot || { x: 1600, y: 720 };
  tl.fromTo(cA, { attr: { cx: q.x, cy: q.y, r: 14 }, fillOpacity: 1 }, { attr: { cx: P.A[0], cy: P.A[1], r: R }, fillOpacity: 0.08, duration: 0.7, ease: "expo.out", immediateRender: true }, 3.92);
  tl.fromTo(cB, { attr: { r: 0 }, opacity: 0 }, { attr: { r: R }, opacity: 1, duration: 0.6, ease: "back.out(1.4)", immediateRender: true }, 4.12);
  tl.fromTo(cC, { attr: { r: 0 }, opacity: 0 }, { attr: { r: R }, opacity: 1, duration: 0.6, ease: "back.out(1.4)", immediateRender: true }, 4.28);
  tl.fromTo(venn, { rotation: -5 }, { rotation: 3, duration: 4.4, ease: "sine.inOut", immediateRender: false }, 4.2);
  for (let f = 0; f < 6; f++) tl.set(venn, { opacity: f % 2 ? 0.55 : 1 }, 4.0 + f / 30);   // hologram power-on flicker

  const lobes = [
    { k: "A", label: "BUSINESS", at: [CX - 210, CY - 120] },
    { k: "B", label: "TECH", at: [CX + 210, CY - 120] },
    { k: "C", label: "USERS", at: [CX, CY + 225] },
  ];
  const icons = {};
  lobes.forEach((L, i) => {
    const ig = s("g", { transform: `translate(${L.at[0]} ${L.at[1]})` }, venn);
    const icon = s("g", { stroke: "#fff", "stroke-width": 3.5, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, ig);
    if (L.k === "A") s("path", { d: "M-26 16 V4 M-8 16 V-6 M10 16 V-14 M-30 -4 L-8 -22 L6 -12 L28 -30 M16 -30 H28 V-18" }, icon);
    if (L.k === "B") s("path", { d: "M-14 -22 L-32 0 L-14 22 M14 -22 L32 0 L14 22 M6 -28 L-6 28" }, icon);
    if (L.k === "C") { s("circle", { cx: 0, cy: -12, r: 12 }, icon); s("path", { d: "M-24 26 C-24 6 24 6 24 26" }, icon); }
    const lbl = s("text", { x: 0, y: 56, "text-anchor": "middle", fill: "#ffb3bd", "font-family": "JBMono", "font-size": 19, "letter-spacing": 5, text: L.label }, ig);
    gsap.set(icon, { svgOrigin: "0 0" });
    tl.fromTo(ig, { opacity: 0, scale: 0.4, svgOrigin: `${L.at[0]} ${L.at[1]}` }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", immediateRender: true }, 4.55 + i * 0.08);
    icons[L.k] = { icon, lbl };
  });

  // title + subtitle
  const kick = text(type, "ROLE // 01", { x: 112, y: 122, size: 20, cls: "m", split: "chars" });
  kick.inner.style.color = C.redText;
  const t1 = text(type, "THE PRODUCT MANAGER", { x: 108, y: 180, size: 60, cls: "h ko", split: "chars" });
  const sub = text(type, "lives where business, tech &amp; users meet.", { x: 112, y: 950, size: 28, cls: "b" });
  sub.inner.style.fontWeight = 300; sub.inner.style.color = "rgba(255,255,255,0.8)";
  const vo = ctx.vo("l2");
  reveal(tl, kick.units, vo - 0.1, { dur: 0.3, stagger: 0.015 });
  reveal(tl, t1.units, vo + 0.0, { dur: 0.5, stagger: 0.02 });
  glitchHTML(tl, t1.wrap, vo + 0.6, { frames: 3, seed: 21, amp: 14 });
  tl.fromTo(sub.inner, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: true }, vo + 1.2);

  // VO-synced lobe highlights (measured word onsets in the l2 clip)
  const w = ctx.cues.words?.l2 || { business: 1.45, tech: 2.15, users: 2.55, meet: 2.95 };
  for (const [k, word] of [["A", "business"], ["B", "tech"], ["C", "users"]]) {
    const at = vo + w[word];
    const circ = { A: cA, B: cB, C: cC }[k];
    tl.to(icons[k].lbl, { attr: { fill: "#fff" }, duration: 0.05 }, at);
    tl.fromTo(icons[k].icon, { scale: 1 }, { scale: 1.35, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, at);
    tl.to(circ, { attr: { "stroke-width": 7 }, fillOpacity: 0.2, duration: 0.1, yoyo: true, repeat: 1 }, at);
  }
  const MEET = vo + w.meet;
  tl.to(tri, { opacity: 1, duration: 0.12 }, MEET);
  tl.fromTo(tri, { opacity: 1 }, { opacity: 0.6, duration: 0.8, ease: "power2.out", immediateRender: false }, MEET + 0.12);
  const ring = s("circle", { cx: CX, cy: CY + 10, r: 30, fill: "none", stroke: "#fff", "stroke-width": 3, opacity: 0 }, venn);
  tl.fromTo(ring, { attr: { r: 20 }, opacity: 1 }, { attr: { r: 300 }, opacity: 0, duration: 0.8, ease: "expo.out", immediateRender: false }, MEET);
  ctx.flash(MEET, C.red, 0.1, 0.3);

  // exit: the Venn folds into a horizontal line (scene 3's guide rail)
  const OUT = 8.6;
  conceal(tl, [...kick.units, ...t1.units], OUT - 0.1, { stagger: 0.006 });
  tl.to(sub.inner, { opacity: 0, duration: 0.2 }, OUT - 0.1);
  tl.to(venn, { scaleY: 0.02, scaleX: 1.6, duration: 0.35, ease: "power3.in" }, OUT);
  tl.to(venn, { opacity: 0, duration: 0.1 }, OUT + 0.35);
  tl.to(ctx.scrimL, { opacity: 0, duration: 0.4 }, OUT + 0.1);
  tl.set(g, { autoAlpha: 0 }, 9.05);
}

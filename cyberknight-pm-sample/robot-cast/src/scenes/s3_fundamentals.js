// 9–17s · FUNDAMENTALS — tracking shot along a lit circuit path (Discover → Define → Prioritize),
// then the last node unfolds into an Impact × Effort matrix where backlog tickets get sorted and cut.
import { gsap } from "../../node_modules/gsap/index.js";
import { C, s, rng } from "../brand.js";
import { text, reveal, conceal } from "../type.js";
import { glitchHTML } from "../fx.js";

export default function s3(ctx) {
  const { tl, back, front, type, cast } = ctx;
  const pm = cast.pm;
  const g = s("g", { id: "s3" }, back);
  gsap.set(g, { autoAlpha: 0 });
  tl.set(g, { autoAlpha: 1 }, 8.5);

  // ───────────────────────── Part A · the path ─────────────────────────
  const Y = 830;
  const track = s("g", {}, g);
  s("line", { x1: -200, y1: Y, x2: 3800, y2: Y, stroke: C.deep, "stroke-width": 4 }, track);
  const lit = s("rect", { x: -200, y: Y - 2.5, width: 0, height: 5, fill: C.red, filter: "url(#glow)" }, track);
  for (let x = 0; x < 3600; x += 50) s("line", { x1: x, y1: Y + 14, x2: x, y2: Y + (x % 250 === 0 ? 34 : 22), stroke: "rgba(255,255,255,0.18)", "stroke-width": 2 }, track);
  for (let k = 0; k < 14; k++) s("text", { x: k * 250 + 6, y: Y + 60, fill: "rgba(255,255,255,0.28)", "font-family": "JBMono", "font-size": 14, "letter-spacing": 3, text: `SPRINT_${String(k + 1).padStart(2, "0")}` }, track);

  const NODES = [
    { x: 900, at: ctx.vo("l3a"), word: "DISCOVER", sub: "THE REAL NEED" },
    { x: 1650, at: ctx.vo("l3b"), word: "DEFINE", sub: "WHAT MATTERS" },
    { x: 2450, at: ctx.vo("l3c"), word: "PRIORITIZE", sub: "RUTHLESSLY" },
  ];
  NODES.forEach((n, i) => {
    const ng = s("g", {}, track);
    const ghost = s("text", { x: n.x, y: 470, "text-anchor": "middle", "font-family": "Inter", "font-weight": 900, "font-size": 132, "letter-spacing": -3, fill: "none", stroke: "rgba(255,255,255,0.22)", "stroke-width": 1.6, text: n.word }, ng);
    const cid = `wipe${i}`;
    const cp = s("clipPath", { id: cid }, ctx.defs);
    const cr = s("rect", { x: n.x - 520, y: 320, width: 0, height: 200 }, cp);
    const solid = s("g", { "clip-path": `url(#${cid})` }, ng);
    s("text", { x: n.x + 8, y: 460, "text-anchor": "middle", "font-family": "Inter", "font-weight": 900, "font-size": 132, "letter-spacing": -3, fill: C.core, text: n.word }, solid);
    s("text", { x: n.x, y: 470, "text-anchor": "middle", "font-family": "Inter", "font-weight": 900, "font-size": 132, "letter-spacing": -3, fill: "#fff", text: n.word }, solid);
    const sub = s("text", { x: n.x, y: 530, "text-anchor": "middle", "font-family": "JBMono", "font-size": 22, "letter-spacing": 8, fill: C.red, opacity: 0, text: `// ${n.sub}` }, ng);
    s("line", { x1: n.x, y1: 552, x2: n.x, y2: Y - 44, stroke: "rgba(255,255,255,0.25)", "stroke-width": 2, "stroke-dasharray": "4 6" }, ng);
    const pulse = s("circle", { cx: n.x, cy: Y, r: 40, fill: "none", stroke: C.red, "stroke-width": 3, opacity: 0 }, ng);
    const node = s("g", {}, ng);
    const disk = s("circle", { cx: n.x, cy: Y, r: 40, fill: "#0B0B0F", stroke: C.red, "stroke-width": 3 }, node);
    const ic = s("g", { transform: `translate(${n.x} ${Y})`, stroke: "#fff", "stroke-width": 3.5, fill: "none", "stroke-linecap": "round" }, node);
    if (i === 0) { s("circle", { cx: -5, cy: -5, r: 13 }, ic); s("path", { d: "M5 5 L17 17" }, ic); }
    if (i === 1) { s("circle", { cx: 0, cy: 0, r: 17 }, ic); s("circle", { cx: 0, cy: 0, r: 8 }, ic); s("circle", { cx: 0, cy: 0, r: 1.5, fill: "#fff" }, ic); }
    if (i === 2) { s("path", { d: "M-16 -12 H16 M-16 0 H8 M-16 12 H-2" }, ic); }
    gsap.set([node, pulse], { svgOrigin: `${n.x} ${Y}` });
    // light it
    tl.to(cr, { attr: { width: 1040 }, duration: 0.45, ease: "expo.out" }, n.at);
    tl.to(ghost, { attr: { stroke: "rgba(255,255,255,0)" }, duration: 0.3 }, n.at + 0.2);
    tl.to(disk, { attr: { fill: C.red }, duration: 0.05 }, n.at);
    tl.fromTo(node, { scale: 1 }, { scale: 1.4, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out", immediateRender: false }, n.at);
    tl.fromTo(pulse, { opacity: 1, scale: 1 }, { opacity: 0, scale: 3.6, duration: 0.7, ease: "expo.out", immediateRender: false }, n.at);
    tl.fromTo(sub, { opacity: 0, attr: { "letter-spacing": 24 } }, { opacity: 1, attr: { "letter-spacing": 8 }, duration: 0.5, ease: "expo.out", immediateRender: false }, n.at + 0.12);
    n.el = ng;
  });

  // camera: the world scrolls so each node lights ~x=800 as its VO line lands
  const cam = [[8.95, 0, "none"], [9.25, -100, "power2.in"], [10.75, -850, "none"], [12.15, -1650, "none"], [12.5, -1770, "power2.out"]];
  gsap.set(track, { x: 0 });
  for (let i = 1; i < cam.length; i++) tl.to(track, { x: cam[i][1], duration: cam[i][0] - cam[i - 1][0], ease: cam[i][2] }, cam[i - 1][0]);
  tl.fromTo(lit, { attr: { width: 0 } }, { attr: { width: 2500 }, duration: 3.55, ease: "none", immediateRender: false }, 8.95);
  tl.fromTo(ctx.bgw.dots, { x: 0 }, { x: -420, duration: 3.55, ease: "none", immediateRender: false }, 8.95);

  // foreground bokeh drifting faster than the track (parallax depth)
  const bokeh = s("g", { opacity: 0 }, front);
  const R = rng(31);
  for (let i = 0; i < 14; i++) s("circle", { cx: 200 + R() * 3400, cy: 120 + R() * 900, r: 8 + R() * 26, fill: R() > 0.6 ? C.red : "#fff", opacity: 0.08 + R() * 0.12, filter: "url(#soft)" }, bokeh);
  tl.to(bokeh, { opacity: 1, duration: 0.3 }, 9.0);
  tl.fromTo(bokeh, { x: 0 }, { x: -2700, duration: 3.55, ease: "none", immediateRender: false }, 8.95);
  tl.to(bokeh, { opacity: 0, duration: 0.3 }, 12.3);

  // PM walks the path (steps on eighth notes), holding a holo-tablet
  pm.place(tl, 8.999, { x: 620, y: Y, scale: 0.55 });
  tl.set(pm.props.tablet, { opacity: 1 }, 9.0);
  pm.walk(tl, 9.0, 12.5, 0.25);
  pm.blinks(tl, 9.1, 12.5, 1.4);
  pm.look(tl, 9.3, 0.6); pm.look(tl, 10.8, 0.6); pm.look(tl, 12.2, 0.6);

  // ───────────────────────── Part B · the matrix ─────────────────────────
  const B0 = 12.4;
  tl.to(track, { y: 200, opacity: 0, duration: 0.3, ease: "power2.in" }, B0 - 0.05);
  tl.set(pm.props.tablet, { opacity: 0 }, B0 + 0.3);
  tl.to(pm.root, { x: 360, y: 900, scale: 0.62, duration: 0.55, ease: "power2.inOut" }, B0);
  pm.walk(tl, B0, B0 + 0.55, 0.14);
  pm.look(tl, B0 + 0.5, 1);

  const MX = 740, MY = 280, MW = 820, MH = 560;
  const mg = s("g", {}, g);
  const q = [
    { k: "QW", label: "QUICK WINS", x: MX, y: MY },
    { k: "BB", label: "BIG BETS", x: MX + MW / 2, y: MY },
    { k: "FI", label: "FILL-INS", x: MX, y: MY + MH / 2 },
    { k: "TS", label: "TIME SINKS", x: MX + MW / 2, y: MY + MH / 2 },
  ];
  const panels = {};
  q.forEach((Q, i) => {
    const p = s("rect", { x: Q.x + 6, y: Q.y + 6, width: MW / 2 - 12, height: MH / 2 - 12, rx: 10, fill: Q.k === "TS" ? "rgba(219,9,35,0.07)" : "rgba(255,255,255,0.025)", stroke: Q.k === "TS" ? "rgba(219,9,35,0.35)" : "rgba(255,255,255,0.08)", "stroke-width": 1.5, opacity: 0 }, mg);
    const l = s("text", { x: Q.x + 26, y: Q.y + 40, fill: Q.k === "TS" ? C.red : C.dim, "font-family": "JBMono", "font-size": 17, "letter-spacing": 4, opacity: 0, text: Q.label }, mg);
    tl.fromTo(p, { opacity: 0, scale: 0.9, svgOrigin: `${Q.x + MW / 4} ${Q.y + MH / 4}` }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)", immediateRender: true }, B0 + 0.3 + i * 0.06);
    tl.to(l, { opacity: 1, duration: 0.2 }, B0 + 0.5 + i * 0.06);
    panels[Q.k] = { p, l, cx: Q.x + MW / 4, cy: Q.y + MH / 4 + 18 };
  });
  const axes = s("path", { d: `M${MX - 20} ${MY + MH} V${MY - 30} M${MX - 30} ${MY - 14} L${MX - 20} ${MY - 30} L${MX - 10} ${MY - 14} M${MX - 20} ${MY + MH + 20} H${MX + MW + 30} M${MX + MW + 14} ${MY + MH + 10} L${MX + MW + 30} ${MY + MH + 20} L${MX + MW + 14} ${MY + MH + 30}`, stroke: "#fff", "stroke-width": 3, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, mg);
  tl.fromTo(axes, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.55, ease: "power2.inOut", immediateRender: true }, B0 + 0.2);
  const ax1 = s("text", { x: MX - 44, y: MY + MH / 2, "text-anchor": "middle", transform: `rotate(-90 ${MX - 44} ${MY + MH / 2})`, fill: "#fff", "font-family": "JBMono", "font-size": 18, "letter-spacing": 6, opacity: 0, text: "IMPACT" }, mg);
  const ax2 = s("text", { x: MX + MW / 2, y: MY + MH + 60, "text-anchor": "middle", fill: "#fff", "font-family": "JBMono", "font-size": 18, "letter-spacing": 6, opacity: 0, text: "EFFORT" }, mg);
  tl.to([ax1, ax2], { opacity: 1, duration: 0.25 }, B0 + 0.6);

  // heading
  const H1 = text(type, "PRIORITIZE", { x: 108, y: 150, size: 88, cls: "h", split: "chars" });
  const H2 = text(type, "RUTHLESSLY.", { x: 108, y: 238, size: 88, cls: "h", split: "chars" });
  H2.inner.style.color = C.red;
  reveal(tl, H1.units, B0 + 0.1, { dur: 0.5, stagger: 0.02 });

  // backlog tickets
  const TICKETS = [
    { id: "CK-101", t: "MFA ROLLOUT", rice: 92, q: "QW", s: 0 },
    { id: "CK-332", t: "AI THREAT TRIAGE", rice: 76, q: "BB", s: 0 },
    { id: "CK-150", t: "CSV EXPORT", rice: 45, q: "FI", s: 0 },
    { id: "CK-277", t: "CUSTOM EMOJI", rice: 9, q: "TS", s: 0 },
    { id: "CK-214", t: "SSO LOGIN", rice: 88, q: "QW", s: 1 },
    { id: "CK-087", t: "AUDIT LOGS", rice: 71, q: "BB", s: 1 },
    { id: "CK-409", t: "DARK MODE", rice: 38, q: "FI", s: 1 },
    { id: "CK-512", t: "3D LOGO SPIN", rice: 4, q: "TS", s: 1 },
  ];
  const cards = s("g", {}, front);
  gsap.set(cards, { autoAlpha: 0 });
  tl.set(cards, { autoAlpha: 1 }, B0 + 0.4);
  const RR = rng(17);
  const RAIN = B0 + 0.5, SORT = 13.8, CUT = ctx.vo("l3d");
  TICKETS.forEach((T, i) => {
    const cg = s("g", {}, cards);
    const W = 356, Hh = 58;
    s("rect", { x: -W / 2, y: -Hh / 2, width: W, height: Hh, rx: 9, fill: "#121218", stroke: "#2B2B36", "stroke-width": 1.5 }, cg);
    s("rect", { x: -W / 2, y: -Hh / 2, width: 6, height: Hh, rx: 3, fill: T.rice > 60 ? C.red : T.rice > 20 ? "#fff" : "#555" }, cg);
    s("text", { x: -W / 2 + 22, y: 6, fill: C.dim, "font-family": "JBMono", "font-size": 16, "letter-spacing": 1, text: T.id }, cg);
    s("text", { x: -W / 2 + 98, y: 6, fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 16, "letter-spacing": 1, text: T.t }, cg);
    s("rect", { x: W / 2 - 62, y: -15, width: 50, height: 30, rx: 7, fill: T.rice > 60 ? C.red : "#23232C" }, cg);
    const num = s("text", { x: W / 2 - 37, y: 6, "text-anchor": "middle", fill: "#fff", "font-family": "JBMono", "font-weight": 700, "font-size": 15, text: "00" }, cg);
    const strike = s("path", { d: `M${-W / 2 + 14} 0 H${W / 2 - 14}`, stroke: C.red, "stroke-width": 5, "stroke-linecap": "round", opacity: 0 }, cg);
    // messy inbox pile
    const px = 1150 + (RR() - 0.5) * 320, py = 520 + (RR() - 0.5) * 220, pr = (RR() - 0.5) * 24;
    gsap.set(cg, { x: px, y: -120, rotation: pr * 3, svgOrigin: "0 0" });
    tl.to(cg, { y: py, rotation: pr, duration: 0.42, ease: "bounce.out" }, RAIN + i * 0.07);
    // sort into its quadrant
    const P = panels[T.q];
    const at = SORT + i * 0.2;
    tl.to(cg, { x: P.cx, y: P.cy + (T.s ? 44 : -26), rotation: 0, duration: 0.34, ease: "back.out(1.5)" }, at);
    tl.fromTo(cg, { scale: 1 }, { scale: 1.08, duration: 0.1, yoyo: true, repeat: 1, immediateRender: false }, at + 0.28);
    const box = { v: 0 };
    tl.to(box, { v: T.rice, duration: 0.4, ease: "power2.out", onUpdate: () => { num.textContent = String(Math.round(box.v)).padStart(2, "0"); } }, at);
    if (T.q === "TS") {
      tl.fromTo(strike, { opacity: 1, drawSVG: "0%" }, { drawSVG: "100%", duration: 0.18, ease: "power2.out", immediateRender: false }, CUT + (T.s ? 0.1 : 0));
      tl.to(cg, { y: 1300, rotation: T.s ? 38 : -30, x: `+=${T.s ? 120 : -60}`, duration: 0.6, ease: "power3.in" }, CUT + 0.3 + (T.s ? 0.08 : 0));
    }
    T.el = cg;
  });
  // PM directs the sort: alternating points at the matrix
  for (let i = 0; i < 4; i++) pm.point(tl, SORT - 0.05 + i * 0.4, 1, 75 + (i % 2) * 30, 0.3);
  pm.blinks(tl, 13.0, 16.4, 1.2);

  // "RUTHLESSLY." — cut the time sinks
  reveal(tl, H2.units, CUT, { dur: 0.35, stagger: 0.018, ease: "power4.out" });
  glitchHTML(tl, H2.wrap, CUT + 0.02, { frames: 4, seed: 7 });
  tl.to(panels.TS.p, { attr: { fill: "rgba(219,9,35,0.28)" }, duration: 0.05, yoyo: true, repeat: 1 }, CUT);
  pm.brows(tl, CUT, "angry", 0.1);
  pm.pose(tl, CUT, { armR: -120, foreR: -10 }, 0.08, "power4.out");
  pm.pose(tl, CUT + 0.1, { armR: -40, foreR: -20 }, 0.14, "power4.in");
  pm.mouth(tl, CUT + 0.1, "grin");
  ctx.shake(mg, CUT + 0.3, 0.3, 12, 5);
  pm.brows(tl, CUT + 0.8, "neutral");
  pm.pose(tl, CUT + 0.8, { armR: -7, foreR: 0 }, 0.3, "power2.inOut");

  // whip-pan out to scene 4
  const W0 = 16.5;
  const blur = ctx.defs.querySelector("#mblurX feGaussianBlur");
  tl.to([g, cards], { x: -2300, duration: 0.42, ease: "power3.in" }, W0);
  tl.to(pm.root, { x: 360 - 2300, duration: 0.42, ease: "power3.in" }, W0);
  tl.set(ctx.world, { attr: { filter: "url(#mblurX)" } }, W0);
  tl.fromTo(blur, { attr: { stdDeviation: "0 0" } }, { attr: { stdDeviation: "60 0" }, duration: 0.42, ease: "power3.in", immediateRender: false }, W0);
  tl.to([H1.inner, H2.inner], { x: -1500, filter: "blur(10px)", duration: 0.42, ease: "power3.in" }, W0);
  tl.to(ctx.bgw.dots, { x: -900, duration: 0.5, ease: "power3.in" }, W0);
  tl.set(ctx.world, { attr: { filter: "none" } }, 17.0);
  tl.set(blur, { attr: { stdDeviation: "0 0" } }, 17.0);
  tl.set([g, cards], { autoAlpha: 0 }, 17.0);
  pm.hide(tl, 17.0);
}

// 31–36s · END CARD — the rocket trail draws the knight; radar rings orbit Vendors · Partners · Customers;
// "MODULE 01 · Product Management · Fundamentals & Soft Skills" lockup; the PM peeks in to wave; CRT-off.
import { gsap } from "../../node_modules/gsap/index.js";
import { C, s, KNIGHT } from "../brand.js";
import { text, reveal } from "../type.js";
import { glitchSVG, glitchHTML } from "../fx.js";

export default function s6(ctx) {
  const { tl, back, type, cast } = ctx;
  const pm = cast.pm;
  const g = s("g", { id: "s6" }, back);
  gsap.set(g, { autoAlpha: 0 });
  tl.set(g, { autoAlpha: 1 }, 30.95);

  const KX = 960, KY = 420, KS = 1.05;
  // radar rings (brand motion motif) — drawn first so they sit behind the mark
  const rings = s("g", {}, g);
  gsap.set(rings, { svgOrigin: `${KX} ${KY}` });
  const ringEls = [240, 340, 450].map((r, i) => s("circle", { cx: KX, cy: KY, r, fill: "none", stroke: i === 1 ? "rgba(219,9,35,0.55)" : "rgba(255,255,255,0.22)", "stroke-width": 2, "stroke-dasharray": i === 1 ? "2 10" : "14 12" }, rings));
  const orbit = s("g", {}, rings);
  gsap.set(orbit, { svgOrigin: `${KX} ${KY}` });
  const nodes = [["VENDORS", 205], ["PARTNERS", -25], ["CUSTOMERS", 25]].map(([label, deg]) => {
    const a = (deg * Math.PI) / 180, r = 340;
    const x = KX + Math.cos(a) * r, y = KY + Math.sin(a) * r;
    const left = Math.cos(a) < 0;
    const ng = s("g", {}, orbit);
    s("circle", { cx: x, cy: y, r: 9, fill: C.red }, ng);
    s("circle", { cx: x, cy: y, r: 18, fill: "none", stroke: C.red, "stroke-width": 2, opacity: 0.6 }, ng);
    s("text", { x: left ? x - 30 : x + 30, y: y + 7, "text-anchor": left ? "end" : "start", fill: "#fff", "font-family": "JBMono", "font-size": 18, "letter-spacing": 5, text: label }, ng);
    gsap.set(ng, { opacity: 0 });
    return ng;
  });

  // the mark
  const ko = s("g", { id: "s6knight" }, g);
  const ki = s("g", { transform: `translate(${KX} ${KY}) scale(${KS}) translate(${-KNIGHT.cx} ${-KNIGHT.cy})` }, ko);
  const red = s("path", { d: KNIGHT.d, fill: C.core, "fill-rule": "evenodd", opacity: 0 }, ki);
  const white = s("path", { d: KNIGHT.d, fill: "#fff", "fill-rule": "evenodd", opacity: 0 }, ki);
  const outline = [KNIGHT.outer, KNIGHT.inner, KNIGHT.slot].map((d) => s("path", { d, fill: "none", stroke: C.red, "stroke-width": 4, "stroke-linejoin": "round", filter: "url(#glow)" }, ki));
  gsap.set(ko, { svgOrigin: `${KX} ${KY}` });

  const D0 = 31.0, FILL = ctx.vo("l6a");
  tl.fromTo(outline, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, stagger: 0.08, ease: "power2.inOut", immediateRender: true }, D0);
  tl.set([white, red], { opacity: 1 }, FILL);
  tl.fromTo(red, { x: 0, y: 0 }, { x: 26, y: -34, duration: 0.08, ease: "power4.out", immediateRender: false }, FILL);
  tl.to(red, { x: KNIGHT.shadow[0], y: KNIGHT.shadow[1], duration: 0.55, ease: "elastic.out(1, 0.4)" }, FILL + 0.08);
  tl.to(outline, { opacity: 0, duration: 0.2 }, FILL + 0.05);
  ctx.flash(FILL, "#fff", 0.2, 0.22);
  glitchSVG(ctx, tl, ko, FILL + 0.02, { frames: 5, amp: 36, seed: 29, box: [KX - 250, KY - 230, 500, 460] });
  ringEls.forEach((r, i) => tl.fromTo(r, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.7, ease: "expo.out", immediateRender: true }, FILL + 0.05 + i * 0.08));
  tl.fromTo(rings, { scale: 0.7 }, { scale: 1, duration: 0.9, ease: "expo.out", immediateRender: false }, FILL);
  tl.fromTo(orbit, { rotation: -14 }, { rotation: 12, duration: 4.1, ease: "power1.out", immediateRender: false }, FILL);
  nodes.forEach((n, i) => tl.to(n, { opacity: 1, duration: 0.2 }, FILL + 0.35 + i * 0.1));

  // settle up into the lockup
  const UP = 32.5;
  tl.to(ko, { y: -150, scale: 0.72, duration: 0.7, ease: "expo.inOut" }, UP);
  tl.to(rings, { y: -150, scale: 0.8, opacity: 0.45, duration: 0.7, ease: "expo.inOut" }, UP);

  const kick = text(type, "MODULE 01", { x: 960, y: 560, size: 24, cls: "m", anchor: "center", split: "chars" });
  kick.inner.style.color = C.red; kick.inner.style.letterSpacing = "0.6em";
  const title = text(type, "PRODUCT MANAGEMENT", { x: 960, y: 650, size: 108, cls: "h", anchor: "center", split: "chars" });
  const subt = text(type, "Fundamentals &amp; Soft Skills", { x: 960, y: 744, size: 42, cls: "b", anchor: "center" });
  subt.inner.style.fontWeight = 300;
  const rule = text(type, "", { x: 960, y: 808, anchor: "center" });
  Object.assign(rule.inner.style, { width: "520px", height: "2px", background: "rgba(255,255,255,0.25)" });
  const url = text(type, "CYBERKNIGHT.TECH", { x: 960, y: 858, size: 24, cls: "m", anchor: "center", split: "chars" });
  url.inner.style.letterSpacing = "0.42em";
  const ul = text(type, "", { x: 960, y: 884, anchor: "center" });
  Object.assign(ul.inner.style, { width: "380px", height: "3px", background: C.red });

  reveal(tl, kick.units, UP + 0.25, { dur: 0.4, stagger: 0.03 });
  const v6 = ctx.vo("l6b");
  reveal(tl, title.units, v6 - 0.05, { dur: 0.6, stagger: 0.025 });
  glitchHTML(tl, title.wrap, v6 + 0.55, { frames: 3, seed: 5, amp: 14 });
  tl.fromTo(subt.inner, { opacity: 0, y: 24, letterSpacing: "0.3em" }, { opacity: 1, y: 0, letterSpacing: "0.02em", duration: 0.8, ease: "expo.out", immediateRender: true }, v6 + 0.55);
  tl.fromTo(rule.inner, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "expo.inOut", immediateRender: true }, v6 + 0.7);
  reveal(tl, url.units, v6 + 1.25, { dur: 0.4, stagger: 0.02 });
  tl.fromTo(ul.inner, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.5, ease: "expo.out", immediateRender: true }, v6 + 1.55);

  // the PM rises into the bottom-right corner in the palm-up reference pose, presenting the lockup
  // (pose C is a three-quarter shot, so the feet sit far below frame and the crop edge stays hidden)
  const PK = 34.15;
  pm.place(tl, PK - 0.01, { x: 1745, y: 1700, scale: 0.9 });
  pm.showPose(tl, PK - 0.01, "C", false);
  tl.to(pm.root, { y: 1250, duration: 0.45, ease: "back.out(1.8)" }, PK);
  pm.mouth(tl, PK, "grin");
  pm.wave(tl, PK + 0.35, 3, 0);
  pm.look(tl, PK + 0.2, -0.7);
  pm.blink(tl, PK + 0.9);
  pm.blink(tl, 35.3);

  // CRT-off outro
  const OFF = 35.55;
  const top = s("rect", { x: 0, y: -1080, width: 1920, height: 1080, fill: "#000" }, ctx.svgTop);
  const bot = s("rect", { x: 0, y: 1080, width: 1920, height: 1080, fill: "#000" }, ctx.svgTop);
  const line = s("rect", { x: 0, y: 537, width: 1920, height: 6, fill: "#fff", opacity: 0, filter: "url(#glow)" }, ctx.svgTop);
  gsap.set(line, { svgOrigin: "960 540" });
  tl.to(top, { y: 540, duration: 0.22, ease: "power4.in" }, OFF);
  tl.to(bot, { y: -540, duration: 0.22, ease: "power4.in" }, OFF);
  tl.to([ctx.type, ctx.hud], { opacity: 0, duration: 0.2, ease: "power4.in" }, OFF);
  tl.set(line, { opacity: 1 }, OFF + 0.22);
  tl.to(line, { scaleX: 0.002, scaleY: 0.4, duration: 0.18, ease: "power3.in" }, OFF + 0.22);
  tl.set(line, { opacity: 0 }, OFF + 0.42);
}

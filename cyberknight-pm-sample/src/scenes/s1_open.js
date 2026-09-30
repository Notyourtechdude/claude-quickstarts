// 0–4s · THE QUESTION — CRT boot, knight line-draw → fill + glitch, shatter into a particle "?".
import { gsap } from "../../node_modules/gsap/index.js";
import { C, s, KNIGHT, rng, clamp, lerp, easeOutExpo, easeInOutCubic, smooth } from "../brand.js";
import { sampleKnight, sampleText, glitchSVG, glitchHTML } from "../fx.js";
import { text, reveal } from "../type.js";

export default function s1(ctx) {
  const { tl, back, type } = ctx;
  const T_END = 4;
  const g = s("g", { id: "s1" }, back);

  // ── boot: a red line opens like a CRT, then splits into two bars that sweep off ──
  const boot = s("g", {}, ctx.svgTop);
  const cover = s("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "#000" }, boot);
  const lineA = s("rect", { x: 0, y: 538, width: 1920, height: 4, fill: C.red, filter: "url(#glow)" }, boot);
  const topBar = s("rect", { x: 0, y: -1080, width: 1920, height: 1080 + 540, fill: "#000" }, boot);
  const botBar = s("rect", { x: 0, y: 540, width: 1920, height: 1080, fill: "#000" }, boot);
  gsap.set(lineA, { scaleX: 0, svgOrigin: "960 540" });
  gsap.set([topBar, botBar], { autoAlpha: 0 });
  tl.to(lineA, { scaleX: 1, duration: 0.3, ease: "expo.out" }, 0.02);
  tl.set(cover, { autoAlpha: 0 }, 0.3);
  tl.set([topBar, botBar], { autoAlpha: 1 }, 0.3);
  tl.to(topBar, { y: -560, duration: 0.45, ease: "expo.inOut" }, 0.3);
  tl.to(botBar, { y: 560, duration: 0.45, ease: "expo.inOut" }, 0.3);
  tl.to(lineA, { scaleY: 0, opacity: 0, duration: 0.25, ease: "power2.in" }, 0.36);
  tl.set(boot, { autoAlpha: 0 }, 0.8);

  // HUD comes online
  tl.to(ctx.hudApi.els, { autoAlpha: 1, duration: 0.05, stagger: 0.06 }, 0.55);
  tl.to(ctx.hudApi.brackets, { autoAlpha: 1, duration: 0.05 }, 0.5);
  tl.fromTo(ctx.hudApi.brackets.querySelectorAll(".brk"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.4, ease: "power2.out", immediateRender: false }, 0.5);

  // ── knight line-draw → fill ──
  const KX = 960, KY = 470, KS = 1.55;
  const kgo = s("g", { id: "s1knight" }, g);
  const kg = s("g", { transform: `translate(${KX} ${KY}) scale(${KS}) translate(${-KNIGHT.cx} ${-KNIGHT.cy})` }, kgo);
  const halo = s("circle", { cx: KNIGHT.cx, cy: KNIGHT.cy + 10, r: 260, fill: "url(#spot)", opacity: 0 }, kg);
  const red = s("path", { d: KNIGHT.d, fill: C.core, "fill-rule": "evenodd", opacity: 0 }, kg);
  const fill = s("path", { d: KNIGHT.d, fill: "#fff", "fill-rule": "evenodd", opacity: 0 }, kg);
  const strokes = [KNIGHT.outer, KNIGHT.inner, KNIGHT.slot].map((d) => s("path", { d, fill: "none", stroke: "#fff", "stroke-width": 2.4, "stroke-linejoin": "round" }, kg));
  const ticks = s("g", { stroke: C.red, "stroke-width": 2, fill: "none", opacity: 0 }, kg);
  for (const [x, y] of [[120, 20], [378, 20], [120, 380], [378, 380]]) s("path", { d: `M${x - 10} ${y} H${x + 10} M${x} ${y - 10} V${y + 10}` }, ticks);
  tl.fromTo(strokes, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.85, stagger: 0.12, ease: "power2.inOut" }, 0.5);
  tl.to(ticks, { opacity: 1, duration: 0.1 }, 0.6);
  tl.to(halo, { opacity: 0.8, duration: 0.8 }, 0.6);
  // fill + red offset overshoot (the logo's glitch shadow, exaggerated then settled)
  tl.set(fill, { opacity: 1 }, 1.5);
  tl.set(red, { opacity: 1, x: 0, y: 0 }, 1.5);
  tl.to(red, { x: 22, y: -30, duration: 0.09, ease: "power4.out" }, 1.5);
  tl.to(red, { x: KNIGHT.shadow[0], y: KNIGHT.shadow[1], duration: 0.5, ease: "elastic.out(1, 0.4)" }, 1.59);
  tl.to(strokes, { opacity: 0, duration: 0.2 }, 1.52);
  ctx.flash(1.5, "#fff", 0.22, 0.2);
  glitchSVG(ctx, tl, kgo, 1.52, { frames: 4, amp: 30, seed: 11, box: [KX - 330, KY - 300, 660, 600] });
  gsap.set(kgo, { svgOrigin: `${KX} ${KY}` });
  tl.to(kgo, { scale: 1.035, duration: 0.45, ease: "sine.inOut" }, 1.55);

  // VO l1a caption words under the mark
  const cap = text(type, "EVERY GREAT PRODUCT STARTS WITH ONE QUESTION.", { x: 960, y: 860, size: 30, cls: "m", anchor: "center", split: "words", style: {} });
  cap.inner.style.letterSpacing = "0.28em";
  const words = cap.units;
  const t1a = ctx.vo("l1a");
  const wordTimes = [0.0, 0.25, 0.64, 1.1, 1.38, 1.58, 1.9];   // measured word onsets in the l1a VO clip
  words.forEach((w, i) => reveal(tl, [w], t1a + wordTimes[i] + 0.03, { dur: 0.4 }));
  tl.to(words[5], { color: C.red, duration: 0.01 }, t1a + 1.61);
  tl.to(words[6], { color: C.red, duration: 0.01 }, t1a + 1.93);
  tl.to(cap.inner, { opacity: 0, y: 20, duration: 0.25, ease: "power2.in" }, 2.3);

  // ── shatter → particle "?" (canvas) ──
  tl.set(kgo, { autoAlpha: 0 }, 2.0);
  ctx.flash(2.0, C.red, 0.35, 0.25);
  const N = 1100;
  const src = sampleKnight(N, 21).map(([x, y]) => [KX + x * KS * 1.035, KY + y * KS * 1.035]);
  const QX = 1610, QY = 470;
  const dst = sampleText("?", "900 620px Inter", N, 8, 700, 800).map(([x, y]) => [QX + x, QY + y]);
  // the dot of the "?" = lowest points; they become the seed of scene 2's first circle
  const maxY = Math.max(...dst.map((p) => p[1]));
  const isDot = dst.map((p) => p[1] > maxY - 105);
  const dotC = dst.filter((_, i) => isDot[i]).reduce((a, p, _, arr) => [a[0] + p[0] / arr.length, a[1] + p[1] / arr.length], [0, 0]);
  ctx.qDot = { x: dotC[0], y: dotC[1] };
  const R = rng(4);
  const P = src.map(([x, y], i) => {
    const ang = Math.atan2(y - KY, x - KX) + (R() - 0.5) * 1.4;
    const sp = 180 + R() * 520;
    return {
      sx: x, sy: y, ex: x + Math.cos(ang) * sp, ey: y + Math.sin(ang) * sp * 0.8,
      tx: dst[i][0], ty: dst[i][1], d: R() * 0.22, size: 3 + R() * 4.5, red: R() < 0.18, ph: R() * 6.28, dot: isDot[i],
    };
  });
  ctx.drawers.push({
    t0: 2.0, t1: 3.98,
    draw(g2, t) {
      const pa = easeOutExpo((t - 2.0) / 0.5);
      for (const p of P) {
        let x, y, a = 1;
        if (t < 2.42) { x = lerp(p.sx, p.ex, pa); y = lerp(p.sy, p.ey, pa); }
        else {
          const q = easeInOutCubic((t - 2.42 - p.d) / 0.5);
          const ex = lerp(p.sx, p.ex, pa), ey = lerp(p.sy, p.ey, pa);
          x = lerp(ex, p.tx, q); y = lerp(ey, p.ty, q);
          if (t > 3.0) { x += Math.sin(t * 18 + p.ph) * 1.2; y += Math.cos(t * 15 + p.ph) * 1.2; }
          if (t > 3.62) {
            const c = easeInOutCubic((t - 3.62) / 0.3);
            x = lerp(x, ctx.qDot.x, c); y = lerp(y, ctx.qDot.y, c);
            a = p.dot ? 1 : 1 - c;
          }
        }
        const sz = t > 3.0 ? p.size * 1.1 : p.size;
        g2.globalAlpha = a;
        g2.fillStyle = C.core; g2.fillRect(x + 7, y - 9, sz, sz);
        g2.fillStyle = p.red ? C.red : "#fff"; g2.fillRect(x, y, sz, sz);
      }
      g2.globalAlpha = 1;
    },
  });

  // ── "WHAT PROBLEM / ARE WE SOLVING" slams ──
  const t1b = ctx.vo("l1b");
  const L1 = text(type, "WHAT PROBLEM", { x: 140, y: 400, size: 138, cls: "h ko", split: "chars" });
  const L2 = text(type, "ARE WE SOLVING", { x: 140, y: 548, size: 138, cls: "h", split: "chars" });
  L2.inner.style.color = "transparent";
  L2.inner.style.webkitTextStroke = "3px #fff";
  const sub = text(type, "// PROBLEM FIRST. SOLUTION SECOND.", { x: 146, y: 670, size: 22, cls: "m" });
  sub.inner.style.color = C.red;
  reveal(tl, L1.units, t1b + 0.02, { dur: 0.5, stagger: 0.022 });
  reveal(tl, L2.units, t1b + 0.5, { dur: 0.5, stagger: 0.022 });
  tl.fromTo(sub.inner, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, ease: "expo.out", immediateRender: true }, t1b + 0.3);
  glitchHTML(tl, L1.wrap, t1b + 0.02, { frames: 3, seed: 3 });
  // exit: whip left
  tl.to([L1.inner, L2.inner, sub.inner], { x: -700, opacity: 0, duration: 0.35, ease: "power3.in", stagger: 0.04 }, 3.62);

  tl.set(g, { autoAlpha: 0 }, T_END);
}

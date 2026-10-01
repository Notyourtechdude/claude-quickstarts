// 0–4s · THE QUESTION — CRT boot over the knight hero shot; red particles stream off his chest and
// assemble a holographic "?"; WHAT PROBLEM / ARE WE SOLVING slams in on the left.
import { gsap } from "../gsap.js";
import { C, s, rng, lerp, easeOutExpo, easeInOutCubic } from "../brand.js";
import { sampleText, glitchHTML } from "../fx.js";
import { text, reveal } from "../type.js";

export default function s1(ctx) {
  const { tl, type } = ctx;

  // ── boot: a red line opens like a CRT onto the footage ──
  const boot = s("g", {}, ctx.svgTop);
  const cover = s("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: "#000" }, boot);
  const lineA = s("rect", { x: 0, y: 538, width: 1920, height: 4, fill: C.red, filter: "url(#glow)" }, boot);
  const topBar = s("rect", { x: 0, y: -1080, width: 1920, height: 1620, fill: "#000" }, boot);
  const botBar = s("rect", { x: 0, y: 540, width: 1920, height: 1080, fill: "#000" }, boot);
  gsap.set(lineA, { scaleX: 0, svgOrigin: "960 540" });
  gsap.set([topBar, botBar], { autoAlpha: 0 });
  tl.to(lineA, { scaleX: 1, duration: 0.3, ease: "expo.out" }, 0.02);
  tl.set(cover, { autoAlpha: 0 }, 0.3);
  tl.set([topBar, botBar], { autoAlpha: 1 }, 0.3);
  tl.to(topBar, { y: -560, duration: 0.5, ease: "expo.inOut" }, 0.3);
  tl.to(botBar, { y: 560, duration: 0.5, ease: "expo.inOut" }, 0.3);
  tl.to(lineA, { scaleY: 0, opacity: 0, duration: 0.25, ease: "power2.in" }, 0.36);
  tl.set(boot, { autoAlpha: 0 }, 0.85);
  ctx.flash(0.32, C.red, 0.25, 0.3);

  tl.to(ctx.hudApi.els, { autoAlpha: 1, duration: 0.05, stagger: 0.06 }, 0.55);
  tl.to(ctx.hudApi.brackets, { autoAlpha: 1, duration: 0.05 }, 0.5);
  tl.fromTo(ctx.hudApi.brackets.querySelectorAll(".brk"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.4, ease: "power2.out", immediateRender: false }, 0.5);

  // caption for the first line, word by word
  tl.to(ctx.scrimB, { opacity: 1, duration: 0.6 }, 0.4);
  const t1a = ctx.vo("l1a");
  const cap = text(type, "EVERY GREAT PRODUCT STARTS WITH ONE QUESTION.", { x: 960, y: 950, size: 30, cls: "m", anchor: "center", split: "words" });
  cap.inner.style.letterSpacing = "0.28em";
  const wordTimes = ctx.cues.words?.l1a || [0.0, 0.3, 0.62, 1.12, 1.42, 1.62, 1.95];
  cap.units.forEach((w, i) => reveal(tl, [w], t1a + wordTimes[i] + 0.03, { dur: 0.4 }));
  tl.to(cap.units[5], { color: C.redText, duration: 0.01 }, t1a + wordTimes[5] + 0.05);
  tl.to(cap.units[6], { color: C.redText, duration: 0.01 }, t1a + wordTimes[6] + 0.05);
  tl.to(cap.inner, { opacity: 0, y: 20, duration: 0.25, ease: "power2.in" }, 2.75);
  tl.to(ctx.scrimB, { opacity: 0, duration: 0.4 }, 2.8);

  // ── particles stream off the knight's chest and build a holographic "?" ──
  const N = 900, P0 = 2.25;
  const SX = 960, SY = 470;           // knight's chest in the hero shot
  const QX = 1600, QY = 470;
  const dst = sampleText("?", "900 560px Inter", N, 8, 700, 760).map(([x, y]) => [QX + x, QY + y]);
  const maxY = Math.max(...dst.map((p) => p[1]));
  const isDot = dst.map((p) => p[1] > maxY - 95);
  const dotC = dst.filter((_, i) => isDot[i]).reduce((a, p, _, arr) => [a[0] + p[0] / arr.length, a[1] + p[1] / arr.length], [0, 0]);
  ctx.qDot = { x: dotC[0], y: dotC[1] };
  const R = rng(4);
  const P = dst.map(([tx, ty], i) => {
    const ang = (R() - 0.5) * 2.4;
    return { sx: SX + (R() - 0.5) * 60, sy: SY + (R() - 0.5) * 80, mx: SX + 180 + R() * 260, my: SY + Math.sin(ang) * 260, tx, ty, d: R() * 0.3, size: 2.5 + R() * 4, red: R() < 0.7, ph: R() * 6.28, dot: isDot[i] };
  });
  ctx.drawers.push({
    t0: P0, t1: 3.98,
    draw(g, t) {
      g.save();
      g.globalCompositeOperation = "lighter";
      for (const p of P) {
        const q = easeInOutCubic((t - P0 - p.d) / 0.55);
        if (q <= 0) continue;
        // quadratic path: chest → swirl control point → target
        const u = q, iu = 1 - u;
        let x = iu * iu * p.sx + 2 * iu * u * p.mx + u * u * p.tx;
        let y = iu * iu * p.sy + 2 * iu * u * p.my + u * u * p.ty;
        let a = Math.min(1, q * 3);
        if (t > 3.0) { x += Math.sin(t * 18 + p.ph) * 1.1; y += Math.cos(t * 15 + p.ph) * 1.1; }
        if (t > 3.62) {
          const c = easeInOutCubic((t - 3.62) / 0.3);
          x = lerp(x, ctx.qDot.x, c); y = lerp(y, ctx.qDot.y, c);
          a *= p.dot ? 1 : 1 - c;
        }
        g.globalAlpha = a;
        g.fillStyle = p.red ? C.red : "#ffd9de";
        g.fillRect(x, y, p.size, p.size);
      }
      g.restore();
    },
  });
  ctx.flash(P0 + 0.6, C.red, 0.12, 0.25);

  // ── WHAT PROBLEM / ARE WE SOLVING ──
  const t1b = ctx.vo("l1b");
  tl.to(ctx.scrimL, { opacity: 1, duration: 0.4 }, t1b - 0.2);
  const L1 = text(type, "WHAT PROBLEM", { x: 110, y: 430, size: 92, cls: "h ko", split: "chars" });
  const L2 = text(type, "ARE WE SOLVING", { x: 110, y: 530, size: 92, cls: "h", split: "chars" });
  L2.inner.style.color = C.redText;
  const sub = text(type, "// PROBLEM FIRST. SOLUTION SECOND.", { x: 116, y: 630, size: 22, cls: "m" });
  sub.inner.style.color = C.redText;
  reveal(tl, L1.units, t1b + 0.02, { dur: 0.5, stagger: 0.022 });
  reveal(tl, L2.units, t1b + 0.55, { dur: 0.5, stagger: 0.022 });
  tl.fromTo(sub.inner, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, ease: "expo.out", immediateRender: true }, t1b + 0.4);
  glitchHTML(tl, L1.wrap, t1b + 0.02, { frames: 3, seed: 3 });
  tl.to([L1.inner, L2.inner, sub.inner], { x: -700, opacity: 0, duration: 0.33, ease: "power3.in", stagger: 0.04 }, 3.62);
  tl.to(ctx.scrimL, { opacity: 0, duration: 0.3 }, 3.7);
}

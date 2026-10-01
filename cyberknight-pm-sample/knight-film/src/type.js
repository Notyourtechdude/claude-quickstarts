// Kinetic-type helpers: absolutely positioned text blocks with optional per-word / per-char masks.
import { gsap } from "./gsap.js";
import { h } from "./brand.js";

/**
 * Creates a text block. Returns { wrap, inner, units } where `units` are the per-word (or per-char)
 * spans sitting inside overflow-hidden masks, ready for yPercent reveals.
 * The glitch helpers animate `wrap`; entrance/exit tweens should animate `inner` or `units`.
 */
export function text(parent, str, {
  x = 960, y = 540, size = 96, cls = "h", anchor = "left", color, weight, ls, lh, split = null, mask = true, style = {},
} = {}) {
  const wrap = h("div", { parent, style: { left: `${x}px`, top: `${y}px`, ...style } });
  const inner = h("div", { cls, parent: wrap, style: { fontSize: `${size}px`, color, fontWeight: weight, letterSpacing: ls, lineHeight: lh, textAlign: anchor === "center" ? "center" : anchor } });
  const units = [];
  if (!split) {
    inner.innerHTML = str;
  } else {
    const lines = str.split("\n");
    lines.forEach((line, li) => {
      const parts = split === "chars" ? [...line] : line.split(" ");
      parts.forEach((p, i) => {
        const m = h("span", { parent: inner, style: { display: "inline-block", overflow: mask ? "hidden" : "visible", verticalAlign: "top", paddingBottom: "0.06em", marginBottom: "-0.06em" } });
        const u = h("span", { parent: m, html: p === " " ? "&nbsp;" : p, style: { display: "inline-block" } });
        units.push(u);
        if (split === "words" && i < parts.length - 1) inner.appendChild(document.createTextNode(" "));
      });
      if (li < lines.length - 1) inner.appendChild(document.createElement("br"));
    });
  }
  const xp = anchor === "center" ? -50 : anchor === "right" ? -100 : 0;
  gsap.set(wrap, { xPercent: xp, yPercent: -50 });
  return { wrap, inner, units };
}

/** Mask reveal: units slide up from below their mask. */
export function reveal(tl, units, at, { dur = 0.55, stagger = 0.05, ease = "expo.out", from = 110 } = {}) {
  tl.fromTo(units, { yPercent: from }, { yPercent: 0, duration: dur, stagger, ease, immediateRender: true }, at);
}

/** Mask exit: units slide up and out. */
export function conceal(tl, units, at, { dur = 0.35, stagger = 0.025, ease = "power3.in", to = -110 } = {}) {
  tl.to(units, { yPercent: to, duration: dur, stagger, ease }, at);
}

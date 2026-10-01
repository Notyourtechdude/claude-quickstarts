// Live-action layer: the Higgsfield knight shots, played frame-accurately from JPEG sequences
// (headless Chromium can't decode H.264, so tools/import_shots.mjs explodes each MP4 into frames).
// Each shot lives in footage/<id>/ with a manifest.json { fps, frames, width, height }.
import { rng } from "./brand.js";

export async function loadFootage(shots) {
  const out = [];
  for (const s of shots) {
    let man = null;
    try {
      const r = await fetch(`footage/${s.id}/manifest.json`);
      if (r.ok) man = await r.json();
    } catch { /* missing shot → placeholder */ }
    out.push({ ...s, man });
  }
  return out;
}

export function makeFootageLayer(canvas, shots) {
  const g = canvas.getContext("2d");
  const cache = new Map();
  const R = rng(77);
  const jitter = Array.from({ length: 64 }, () => [(R() - 0.5) * 2, R()]);

  const frameImage = (shot, idx) => {
    const key = `${shot.id}/${idx}`;
    if (cache.has(key)) return cache.get(key);
    const img = new Image();
    img.src = `footage/${shot.id}/f_${String(idx + 1).padStart(5, "0")}.jpg`;
    const p = img.decode().then(() => img).catch(() => null);
    cache.set(key, p);
    if (cache.size > 48) cache.delete(cache.keys().next().value);
    return p;
  };

  const placeholder = (shot, lt) => {
    const gr = g.createRadialGradient(1300, 500, 50, 960, 540, 1100);
    gr.addColorStop(0, "#2a2f38"); gr.addColorStop(1, "#050507");
    g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080);
    g.fillStyle = "rgba(255,255,255,0.25)"; g.font = "700 28px JBMono";
    g.fillText(`SHOT ${shot.id.toUpperCase()} · ${shot.note} · ${lt.toFixed(2)}s`, 80, 1000);
  };

  return async (t) => {
    const shot = shots.find((s) => t >= s.t0 && t < s.t1) || shots[shots.length - 1];
    const lt = t - shot.t0;
    g.globalCompositeOperation = "source-over";
    g.globalAlpha = 1;
    if (!shot.man) { placeholder(shot, lt); return; }
    const { fps, frames } = shot.man;
    const idx = Math.min(frames - 1, Math.max(0, Math.floor(lt * fps + 1e-6)));
    const img = await frameImage(shot, idx);
    // prefetch the next frame so sequential capture rarely waits
    frameImage(shot, Math.min(frames - 1, idx + 1));
    if (!img) { placeholder(shot, lt); return; }
    // grade: slight push for extra life + crush blacks toward the brand ink
    const k = 1 + 0.025 * (lt / (shot.t1 - shot.t0));
    g.setTransform(k, 0, 0, k, 960 * (1 - k), 540 * (1 - k));
    g.drawImage(img, 0, 0, 1920, 1080);
    g.setTransform(1, 0, 0, 1, 0, 0);
    // cut glitch: 5 frames of slice displacement + red channel ghost right after each cut
    const since = lt;
    if (shot.t0 > 0 && since < 5 / 30) {
      const f = Math.floor(since * 30);
      for (let i = 0; i < 9; i++) {
        const [dx, h] = jitter[(f * 9 + i) % 64];
        const y = Math.floor(((i + h) / 9) * 1080), hh = 40 + Math.floor(h * 90);
        g.drawImage(canvas, 0, y, 1920, hh, dx * 60, y, 1920, hh);
      }
      g.globalCompositeOperation = "screen";
      g.globalAlpha = 0.45;
      g.filter = "sepia(1) saturate(8) hue-rotate(-50deg)";
      g.drawImage(img, 14, -6, 1920, 1080);
      g.filter = "none";
      g.globalAlpha = 1;
      g.globalCompositeOperation = "source-over";
    }
  };
}

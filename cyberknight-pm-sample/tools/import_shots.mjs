// Explodes the knight shots (MP4 from Higgsfield) into 1920×1080 JPEG sequences + manifest.json.
//   node tools/import_shots.mjs k1=/path/to/clip1.mp4 k2=/path/to/clip2.mp4 …
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

for (const arg of process.argv.slice(2)) {
  const [id, src] = arg.split("=");
  const dir = path.join("footage", id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const info = spawnSync(ffmpeg, ["-hide_banner", "-i", src], { encoding: "utf8" }).stderr;
  const fps = parseFloat((info.match(/(\d+(?:\.\d+)?) fps/) || [0, 24])[1]);
  execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-i", src, "-an",
    "-vf", "scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,unsharp=5:5:0.4",
    "-q:v", "3", path.join(dir, "f_%05d.jpg")]);
  const frames = fs.readdirSync(dir).filter((f) => f.endsWith(".jpg")).length;
  fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify({ fps, frames, source: path.basename(src) }, null, 1));
  console.log(`${id}: ${frames} frames @ ${fps} fps (${(frames / fps).toFixed(2)}s) ← ${src}`);
}

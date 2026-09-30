// Frame-accurate render: N headless Chromium workers seek the paused GSAP timeline, capture JPEG frames via CDP,
// and pipe them into per-worker ffmpeg segments at RENDER_FPS. Segments are concatenated, frame pairs are blended
// for a 180° shutter motion blur (120 → 60 fps), and the loudness-normalised soundtrack is muxed in.
//
//   node render.mjs                     → out/cyberknight_pm_module1_sample.mp4
//   RENDER_FPS=60 WORKERS=4 node render.mjs   (faster, no motion blur)
//   FROM=9 TO=17 node render.mjs        (render a range only, for review)
import { chromium } from "playwright-core";
import { spawn, spawnSync, execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import ffmpeg from "ffmpeg-static";
import { serve } from "./serve.mjs";

const CHROME = process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const RENDER_FPS = +(process.env.RENDER_FPS || 120);
const OUT_FPS = 60;
const WORKERS = +(process.env.WORKERS || Math.max(1, Math.min(4, os.cpus().length - 1)));
const FROM = +(process.env.FROM || 0), TO = +(process.env.TO || 36);
const OUT = process.env.OUT || "out/cyberknight_pm_module1_sample.mp4";
const SEG = "out/segments";

fs.mkdirSync(SEG, { recursive: true });
const first = Math.round(FROM * RENDER_FPS), last = Math.round(TO * RENDER_FPS); // [first, last)
const total = last - first;
const per = Math.ceil(total / WORKERS);
const t0 = Date.now();
let done = 0;

const { srv, url } = await serve();

async function worker(w) {
  const a = first + w * per, b = Math.min(last, a + per);
  if (a >= b) return null;
  const browser = await chromium.launch({ executablePath: CHROME, args: ["--force-color-profile=srgb", "--disable-lcd-text", "--hide-scrollbars"] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error(`[w${w}]`, e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
  const err = await page.evaluate(() => window.__error);
  if (err) throw new Error(err);
  const cdp = await page.context().newCDPSession(page);
  const file = `${SEG}/seg_${String(w).padStart(2, "0")}.mkv`;
  const ff = spawn(ffmpeg, ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(RENDER_FPS), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "8", "-pix_fmt", "yuv444p", file], { stdio: ["pipe", "inherit", "inherit"] });
  const closed = new Promise((r) => ff.on("close", r));
  for (let f = a; f < b; f++) {
    await page.evaluate((t) => window.__seek(t), f / RENDER_FPS);
    const { data } = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 95, optimizeForSpeed: true, captureBeyondViewport: false });
    if (!ff.stdin.write(Buffer.from(data, "base64"))) await new Promise((r) => ff.stdin.once("drain", r));
    done++;
    if (done % 120 === 0) {
      const el = (Date.now() - t0) / 1000;
      process.stdout.write(`\r${done}/${total} frames  ${(done / el).toFixed(1)} fps  eta ${Math.round((total - done) / (done / el))}s   `);
    }
  }
  ff.stdin.end();
  await closed;
  await browser.close();
  return file;
}

const files = (await Promise.all(Array.from({ length: WORKERS }, (_, w) => worker(w)))).filter(Boolean);
srv.close();
console.log(`\ncaptured ${total} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

// loudness: measure the mix and normalise to -14 LUFS integrated (static gain, transparent)
const meas = spawnSync(ffmpeg, ["-hide_banner", "-i", "audio/mix.wav", "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const I = parseFloat(meas.slice(meas.lastIndexOf("Summary")).split("I:")[1]);
const gain = (-14 - I).toFixed(2);

fs.writeFileSync(`${SEG}/list.txt`, files.map((f) => `file '${process.cwd()}/${f}'`).join("\n"));
const blur = RENDER_FPS === OUT_FPS * 2 ? "tmix=frames=2:weights='1 1',framestep=2," : RENDER_FPS !== OUT_FPS ? `fps=${OUT_FPS},` : "";
const args = ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", `${SEG}/list.txt`];
const withAudio = FROM === 0 && TO === 36;
if (withAudio) args.push("-i", "audio/mix.wav");
args.push("-filter_complex", `[0:v]${blur}format=yuv420p[v]${withAudio ? `;[1:a]volume=${gain}dB,atrim=0:36[a]` : ""}`, "-map", "[v]");
if (withAudio) args.push("-map", "[a]", "-c:a", "aac", "-b:a", "320k", "-ar", "48000");
args.push("-c:v", "libx264", "-preset", "slow", "-crf", process.env.CRF || "16", "-profile:v", "high", "-level", "4.2", "-r", String(OUT_FPS),
  "-movflags", "+faststart", "-metadata", "title=CyberKnight — Module 01: Product Management (sample)", OUT);
execFileSync(ffmpeg, args, { stdio: "inherit" });
console.log(`wrote ${OUT}  (mix ${I} LUFS → gain ${gain} dB)  total ${((Date.now() - t0) / 1000).toFixed(0)}s`);

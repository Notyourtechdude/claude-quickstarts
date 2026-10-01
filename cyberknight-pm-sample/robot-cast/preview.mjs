// Renders stills at given times (default: every 1.5s) and tiles them into out/contact_sheet.jpg.
//   node preview.mjs            → contact sheet
//   node preview.mjs 3.2 12 20  → individual stills in out/preview/
import { chromium } from "playwright-core";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import ffmpeg from "ffmpeg-static";
import { serve } from "./serve.mjs";

const CHROME = process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const args = process.argv.slice(2).map(Number);
const times = args.length ? args : Array.from({ length: 24 }, (_, i) => +(0.75 + i * 1.5).toFixed(2));
const dir = "out/preview";
fs.mkdirSync(dir, { recursive: true });

const { srv, url } = await serve();
const browser = await chromium.launch({ executablePath: CHROME, args: ["--force-color-profile=srgb", "--disable-lcd-text"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on("console", (m) => { if (m.type() === "error") console.error("[page]", m.text()); });
page.on("pageerror", (e) => console.error("[pageerror]", e.message));
await page.goto(url);
await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 60000 });
const err = await page.evaluate(() => window.__error);
if (err) { console.error(err); process.exit(1); }
const files = [];
for (const t of times) {
  await page.evaluate((t) => window.__seek(t), t);
  const f = `${dir}/t_${t.toFixed(2).padStart(5, "0")}.png`;
  await page.screenshot({ path: f });
  files.push(f);
}
await browser.close(); srv.close();
if (!args.length) {
  const list = files.map((f) => `file '${process.cwd()}/${f}'`).join("\n");
  fs.writeFileSync(`${dir}/list.txt`, list);
  execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", `${dir}/list.txt`,
    "-vf", "scale=480:-1,tile=4x6:padding=4:color=0x222222", "-frames:v", "1", "-q:v", "3", "out/contact_sheet.jpg"]);
  console.log("wrote out/contact_sheet.jpg");
} else console.log(files.join("\n"));

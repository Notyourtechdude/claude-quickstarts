// Post-render checks: stream specs, duration, loudness, and a contact sheet pulled from the encoded MP4.
import { spawnSync, execFileSync } from "node:child_process";
import fs from "node:fs";
import ffmpeg from "ffmpeg-static";

const f = process.argv[2] || "out/cyberknight_pm_module1_sample.mp4";
const info = spawnSync(ffmpeg, ["-hide_banner", "-i", f], { encoding: "utf8" }).stderr;
console.log(info.split("\n").filter((l) => /Duration|Stream/.test(l)).join("\n"));
const loud = spawnSync(ffmpeg, ["-hide_banner", "-i", f, "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const sum = loud.slice(loud.lastIndexOf("Summary"));
console.log(sum.split("\n").filter((l) => /I:|LRA:|Peak:/.test(l)).map((l) => l.trim()).join("  "));
const n = spawnSync(ffmpeg, ["-hide_banner", "-i", f, "-map", "0:v", "-c", "copy", "-f", "null", "-"], { encoding: "utf8" }).stderr.match(/frame=\s*(\d+)/g);
console.log("video frames:", n ? n[n.length - 1] : "?");
console.log("size:", (fs.statSync(f).size / 1e6).toFixed(1), "MB");
execFileSync(ffmpeg, ["-y", "-loglevel", "error", "-i", f, "-vf", "fps=2/3,scale=480:-1,tile=4x6:padding=4:color=0x222222", "-frames:v", "1", "-q:v", "3", "out/contact_sheet.jpg"]);
console.log("wrote out/contact_sheet.jpg (from the encoded MP4)");

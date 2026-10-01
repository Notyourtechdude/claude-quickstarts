# CyberKnight: Module 01 PM sample (36s motion graphics)

A 36-second, 1080p60 motion-graphics sample for **CyberKnight's** training video *Module 1: Product Management Fundamentals & Soft Skills*. The audience is the tech team. The piece doubles as a showreel: rigged characters, kinetic type, a tracking camera, particles, glitch transitions, and a soundtrack cut to the beat.

**Deliverable:** `out/cyberknight_pm_module1_sample.mp4`. This is H.264 High 1920×1080 at 60 fps, with 320 kbps AAC audio normalised to -14 LUFS. For a quick visual overview, see `out/contact_sheet.jpg`, which has one frame every 1.5 s.

## Storyboard (120 BPM · 1 bar = 2 s)

| Time | Chapter | What happens | VO |
|---|---|---|---|
| 0–4 | 00 The Question | A CRT-style boot, then the knight mark line-draws, fills with its red glitch offset and shatters into a particle "?" | "Every great product starts with one question. What problem are we solving?" |
| 4–9 | 01 The Role | The "?" dot grows into a Venn of Business × Tech × Users. The PM drops into the overlap (squash and stretch), waves, and the lobes light on each word | "A product manager lives where business, tech, and users meet." |
| 9–17 | 02 Fundamentals | A tracking shot follows a circuit path. The PM walks on eighth notes while the nodes Discover, Define and Prioritize light up. The path then unfolds into an Impact × Effort matrix: backlog tickets rain in, get RICE-scored and sorted, and the time sinks get cut | "Discover the real need. Define what matters. Prioritize… ruthlessly." |
| 17–26 | 03 Soft Skills | A "SOFT SKILLS" slam, then a stakeholder standoff (Dev / Designer / the armoured CyberKnight) with lightning; the knight lands hard and folds his arms until trust is earned. The PM steps up (OWNERSHIP), the asks merge into a shared roadmap (TRUST), and a scope ⟷ time slider ends in a deal stamp (NEGOTIATION). Confetti, then an iris wipe | "But the real edge? Soft skills. Ownership. Trust. Negotiation." |
| 26–31 | 04 Ship It | A roadmap that never ships glitches and falls away. "PEOPLE DO." Then the team pops in and a knight-badged rocket launches | "Because roadmaps don't ship products. People do." |
| 31–36 | 05 End card | The rocket trail draws the knight, and radar rings orbit Vendors · Partners · Customers. The Module 01 lockup and cyberknight.tech appear, the PM waves goodbye, and it ends on a CRT-off | "Module one. Product management, by CyberKnight." |

## Brand

The brand tokens come from CyberKnight's brand kit:
- Colours: black `#000`/`#040404`, Chinese Red `#CD0A21`, UI red `#DB0923`, burgundy `#50040D`, white.
- Typography: Helvetica headings (Inter is used as the open substitute) and Poppins body. JetBrains Mono is used for the UI/HUD details.
- The knight mark was vectorised from the official logo (`src/brand.js`), including its red offset "glitch" shadow. The same offset is reused as a type treatment (`.ko`).

## How it's built

- **Animation:** `index.html` + `src/`. A single paused [GSAP](https://gsap.com) timeline drives SVG/HTML layers, and particles and confetti are drawn on a canvas as pure functions of time. `window.__seek(t)` renders any frame deterministically.
  - `src/characters.js`: vector character rigs (pivoted limbs, blinks, lip flaps, walk/wave/drop-in/celebrate actions). `makeKnight` builds the armoured CyberKnight stakeholder: gunmetal plates, red neon seams and an eared helmet whose visor carries his expression (`crossArms`, a narrowing slit for sternness, visor heat for speech).
  - `src/scenes/s1…s6`: one file per chapter.
  - `src/fx.js`: background world, HUD, grain, glitch helpers and point sampling.
- **Audio:** `audio/music.py` synthesises the music and all sound design with numpy/scipy (no samples). Every hit is locked to the same cue times the visuals use (`audio/cues.json`). The narrator VO is ducked on top.
- **VO:** `audio/make_vo.py` uses [Kokoro](https://github.com/thewh1teagle/kokoro-onnx) (offline neural TTS, voice `af_heart`), one clip per line, placed by `cues.json`. The rendered clips are committed in `audio/vo/`.
- **Render:** `render.mjs` runs headless Chromium workers that capture 120 fps via CDP. ffmpeg then blends frame pairs into a 60 fps 180° shutter motion blur, applies H.264 encoding and muxes the audio.

## Commands

```bash
npm install
pip install numpy scipy            # audio synthesis
python3 audio/music.py             # → audio/mix.wav
node serve.mjs                     # open http://127.0.0.1:8123/index.html?play  (or ?t=12.5)
node preview.mjs                   # → out/contact_sheet.jpg   (node preview.mjs 3.2 18 → single stills)
node render.mjs                    # → out/cyberknight_pm_module1_sample.mp4  (~8 min on 4 cores)
RENDER_FPS=60 node render.mjs      # faster, no motion blur
```

To regenerate the VO, install `kokoro-onnx soundfile`, download the two model files listed at the top of `audio/make_vo.py`, then run `KOKORO_DIR=<dir> python3 audio/make_vo.py`. To change the script, edit `audio/vo_lines.json`, then adjust the timings in `audio/cues.json`.

Set `CHROME=/path/to/chrome` if Chromium isn't at the Playwright default path.

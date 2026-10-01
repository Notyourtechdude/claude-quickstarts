# CyberKnight: Module 01 PM sample (36s)

A 36-second sample for **CyberKnight's** training video *Module 1: Product Management Fundamentals & Soft Skills*. The audience is the tech team, and the piece doubles as a motion-design showreel.

The film is built with **[HyperFrames](https://github.com/heygen-com/hyperframes)** (HeyGen's HTML-to-video framework) in [`knight-film/`](knight-film/). The only character on screen is CyberKnight's armoured knight, in six cinematic AI shots (Higgsfield, Kling 3.0 Pro). He also narrates. Every teaching beat is a red hologram or a piece of kinetic type laid over the footage.

| Time | Chapter | Shot | Overlay | VO |
|---|---|---|---|---|
| 0–4 | 00 The Question | Knight, arms crossed, push-in | CRT boot. Particles stream off his chest into a holographic "?", then WHAT PROBLEM / ARE WE SOLVING | "Every great product starts with one question. What problem are we solving?" |
| 4–9 | 01 The Role | Palm raised | Business × Tech × Users Venn projected beside the palm. Each lobe lights on its spoken word | "A product manager lives where business, tech, and users meet." |
| 9–17 | 02 Fundamentals | Skybridge tracking walk | Discover / Define / Prioritize drift past in parallax. A ticket matrix sorts the backlog and cuts the time sinks | "Discover the real need. Define what matters. Prioritize… ruthlessly." |
| 17–26 | 03 Soft Skills | Hand on chest, nod | SOFT SKILLS slam, then three widgets: Ownership (assignee chip), Trust (shared roadmap), Negotiation (scope ⟷ time slider + DEAL stamp) | "But the real edge? Soft skills. Ownership. Trust. Negotiation." |
| 26–31 | 04 Ship It | At the window, rocket trail | A roadmap hologram glitches out, then PEOPLE DO. and the launch metrics | "Because roadmaps don't ship products. People do." |
| 31–36 | 05 End card | Final power pose | Knight mark and radar rings (Vendors · Partners · Customers), Module 01 lockup, CRT-off | "Module one. Product management, by CyberKnight." |

## Layout

- **`knight-film/`** is the HyperFrames project and the source of truth for the film. See [`knight-film/BRIEF.md`](knight-film/BRIEF.md).
  - `index.html` is the root composition. The six knight shots are framework-owned `<video>` clips, and the pre-mixed soundtrack is an `<audio>` track.
  - `src/film.js` builds every overlay on one paused GSAP timeline, registered as `window.__timelines.main`. Each scene's type sits in its own timed clip layer.
  - `src/scenes/s1…s6`, `src/fx.js` (HUD, grain, glitch helpers) and `src/brand.js` (brand tokens and the vectorised knight mark).
  - `assets/` holds the footage, fonts and GSAP, all bundled locally so a render never touches the network.
- **`audio/`** is shared by both versions:
  - `make_vo.py` voices the script offline with Kokoro (`am_michael`).
  - `music.py` synthesises the score and sound design on the same cue sheet (`cues.json`) and ducks the VO on top. Its output is `audio/mix.wav`.
- **`out/`** holds the v1 deliverable: an earlier flat-vector cut with cartoon characters. It was replaced by the knight edit; its renderer lives in git history.

## Brand

The tokens come from CyberKnight's brand kit:
- Colours: black, Chinese Red `#CD0A21`, UI red `#DB0923`, burgundy `#50040D` and white. Text red is lifted to `#EE3B52` so it passes WCAG AA on black.
- Typography: Inter stands in for Helvetica, with Poppins and JetBrains Mono.

## Commands

```bash
# one-time: Node ≥ 22, ffmpeg + ffprobe on PATH, Chrome headless shell
export HYPERFRAMES_BROWSER_PATH=/path/to/chrome-headless-shell   # if not using `npx hyperframes browser ensure`
pip install numpy scipy

cd knight-film
npm run prep:audio     # synthesise audio/mix.wav and copy it into assets/audio/
npm run check          # lint + runtime + layout + motion + contrast (must pass with 0 errors)
npm run snapshot       # stills at every scene midpoint → snapshots/contact-sheet-*.jpg
npx hyperframes render --fps 60 --quality delivery -o renders/cyberknight_pm_module1.mp4
```

To swap in new footage, drop the clips into `knight-film/assets/footage/` as `k1.mp4` to `k6.mp4`, using the same lengths as the `data-start`/`data-duration` slots in `index.html`.

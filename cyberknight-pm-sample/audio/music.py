"""Synthesises the 36s soundtrack (120 BPM, A minor) + sound design locked to the visual cues,
then mixes the narrator VO on top with side-chain ducking.  Output: audio/mix.wav (48 kHz stereo).

Everything is generated from code: no samples, fully deterministic (seeded noise).
"""
import json, os, subprocess, sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000
DUR = 36.0
N = int(SR * DUR)
BEAT = 0.5
CUES = json.load(open(os.path.join(HERE, "cues.json")))
VO = CUES["vo"]
rng = np.random.default_rng(7)


def T(sec):
    return np.arange(int(sec * SR)) / SR


def noise(sec):
    return rng.standard_normal(int(sec * SR))


def lp(x, f, order=2):
    return sosfilt(butter(order, min(f, SR / 2 - 100) / (SR / 2), "low", output="sos"), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f / (SR / 2), "high", output="sos"), x)


def bp(x, f1, f2, order=2):
    return sosfilt(butter(order, [f1 / (SR / 2), f2 / (SR / 2)], "band", output="sos"), x)


def env(n, a=0.002, d=0.2, shape=1.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d) ** shape
    return e


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


class Bus:
    def __init__(self):
        self.x = np.zeros((2, N))

    def add(self, sig, t, g=1.0, pan=0.0):
        i = int(round(t * SR))
        if i >= N or len(sig) == 0:
            return
        if sig.ndim == 1:
            l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
            sig = np.vstack([sig * l * 1.414, sig * r * 1.414])
        j = min(N, i + sig.shape[1])
        if i < 0:
            sig = sig[:, -i:]; j = min(N, sig.shape[1]); i = 0
        self.x[:, i:j] += g * sig[:, : j - i]


drums, bass, music, sfx = Bus(), Bus(), Bus(), Bus()

# ───────────────────────── instruments ─────────────────────────

def kick(dec=0.32, punch=1.0):
    t = T(0.6)
    f = 44 + 120 * np.exp(-t / 0.035) * punch
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / dec)
    click = hp(noise(0.6), 3000) * np.exp(-t / 0.004) * 0.35
    return np.tanh(1.6 * (body + click))


def clap():
    n = noise(0.4)
    e = np.zeros_like(n)
    for k, off in enumerate([0, 0.011, 0.022, 0.034]):
        i = int(off * SR)
        e[i:] += np.exp(-np.arange(len(e) - i) / SR / (0.012 if k < 3 else 0.16))
    return bp(n * e, 900, 4500) * 1.2


def hat(open_=False):
    n = hp(noise(0.3), 7000, 4)
    return n * env(len(n), 0.001, 0.12 if open_ else 0.028)


def boom(sec=2.2, f0=48):
    t = T(sec)
    f = f0 + 70 * np.exp(-t / 0.08)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.7)
    s += lp(noise(sec), 400) * np.exp(-t / 0.25) * 0.8
    s += hp(noise(sec), 2000) * np.exp(-t / 0.03) * 0.5
    return np.tanh(1.8 * s)


def riser(sec, f0=300, f1=6000):
    t = T(sec)
    n = noise(sec)
    out = np.zeros_like(n)
    seg = int(0.05 * SR)
    for i in range(0, len(n), seg):
        p = i / len(n)
        fc = f0 * (f1 / f0) ** p
        out[i:i + seg] = bp(n[i:i + seg + 0], fc * 0.8, min(fc * 1.25, SR / 2 - 200), 1)[: len(out[i:i + seg])]
    sweep = np.sin(2 * np.pi * np.cumsum(200 * (8 ** (t / sec))) / SR) * 0.25
    a = (t / sec) ** 2.2
    return (out * 0.9 + sweep) * a


def whoosh(sec=0.5, f0=400, f1=3000, rev=False):
    t = T(sec)
    n = noise(sec)
    fc = f0 * (f1 / f0) ** (t / sec)
    out = np.zeros_like(n)
    seg = int(0.02 * SR)
    for i in range(0, len(n), seg):
        out[i:i + seg] = bp(n[i:i + seg], fc[i] * 0.7, min(fc[i] * 1.4, SR / 2 - 200), 1)[: len(out[i:i + seg])]
    shape = np.sin(np.pi * np.clip(t / sec, 0, 1)) ** 1.5
    if rev:
        shape = (t / sec) ** 2.5 * (t < sec)
    return out * shape * 2.2


def blip(f=1600, sec=0.09, harm=True):
    t = T(sec)
    s = np.sin(2 * np.pi * f * t) + (0.35 * np.sin(2 * np.pi * f * 2 * t) if harm else 0)
    return s * env(len(t), 0.001, sec / 3)


def glitch(sec=0.22, seed=1):
    r = np.random.default_rng(seed)
    out = np.zeros(int(sec * SR))
    i = 0
    while i < len(out):
        L = int(r.uniform(0.008, 0.03) * SR)
        f = r.choice([220, 440, 880, 1760, 3520]) * r.uniform(0.9, 1.1)
        tt = np.arange(L) / SR
        seg = np.sign(np.sin(2 * np.pi * f * tt)) * 0.5 if r.random() < 0.5 else r.standard_normal(L) * 0.6
        seg = np.round(seg * 6) / 6
        out[i:i + L] = seg[: len(out[i:i + L])] * (r.random() > 0.2)
        i += L
    return hp(out, 200)


def zap(sec=0.3):
    t = T(sec)
    s = np.sign(np.sin(2 * np.pi * (90 + 40 * np.sin(2 * np.pi * 31 * t)) * t)) * 0.5
    s += hp(noise(sec), 1500) * 0.6 * (np.random.default_rng(3).random(len(t)) > 0.6)
    return lp(s, 6000) * env(len(t), 0.005, sec)


def thud():
    t = T(0.35)
    s = np.sin(2 * np.pi * np.cumsum(60 + 90 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.09)
    return np.tanh(2 * s) + lp(noise(0.35), 900) * np.exp(-t / 0.03) * 0.4


def supersaw(freq, sec, voices=7, detune=0.18, seed=0):
    r = np.random.default_rng(seed)
    t = T(sec)
    out = np.zeros((2, len(t)))
    for v in range(voices):
        d = (v - (voices - 1) / 2) / ((voices - 1) / 2) * detune
        f = freq * 2 ** (d / 12)
        ph = r.random()
        saw = 2 * ((f * t + ph) % 1) - 1
        pan = (v / (voices - 1)) * 2 - 1
        out[0] += saw * (1 - pan) / 2
        out[1] += saw * (1 + pan) / 2
    return out / voices


def pluck(freq, sec=0.35, bright=4000):
    t = T(sec)
    saw = 2 * ((freq * t) % 1) - 1 + 0.5 * (2 * ((freq * 1.005 * t) % 1) - 1)
    e = np.exp(-t / 0.12)
    return lp(saw * e, bright) * 0.8


def bell(freq, sec=1.6):
    t = T(sec)
    s = sum(a * np.sin(2 * np.pi * freq * m * t) * np.exp(-t / (d)) for m, a, d in [(1, 1, 0.9), (2.76, 0.4, 0.4), (5.4, 0.2, 0.15)])
    return s * env(len(t), 0.002, 10)


# ───────────────────────── arrangement ─────────────────────────
CHORDS = [  # (bass midi, chord midi) per 2s bar: Am  F  C  G
    (33, [57, 60, 64]), (29, [53, 57, 60]), (36, [55, 60, 64]), (31, [55, 59, 62]),
]
ARP = [0, 1, 2, 1, 2, 0, 2, 1]


def bar_chord(t):
    return CHORDS[int(t // 2) % 4]


def between(t, a, b):
    return a <= t < b


# drums
for k in range(int(DUR / BEAT)):
    t = k * BEAT
    groove = between(t, 4.0, 16.5) or between(t, 18.9, 25.6) or between(t, 28.25, 30.5)
    tension = between(t, 26.0, 27.75)
    if groove:
        drums.add(kick(), t, 0.95)
    if tension:
        drums.add(lp(kick(0.2), 900), t, 0.7)
    if (groove and (between(t, 9.0, 16.5) or t >= 20.25)) and k % 2 == 1:
        drums.add(clap(), t, 0.55, 0.05)
    if groove or tension:
        steps = 4 if (between(t, 9.0, 16.5) or between(t, 28.25, 30.5) or tension) else 2
        for sidx in range(steps):
            tt = t + sidx * BEAT / steps
            op = steps == 2 and sidx == 1
            drums.add(hat(op), tt, (0.22 if sidx % 2 else 0.14) * (1.3 if op else 1), 0.25 if sidx % 2 else -0.2)
# snare roll into the whip (16.0–16.5) and into the drop (27.75–28.25)
for a, b in [(15.9, 16.5), (27.8, 28.25)]:
    n = 12
    for i in range(n):
        drums.add(clap(), a + (b - a) * (i / n) ** 0.8, 0.12 + 0.4 * i / n)

# side-chain envelope from kick times
duck = np.ones(N)
for k in range(int(DUR / BEAT)):
    t = k * BEAT
    if between(t, 4.0, 16.5) or between(t, 18.9, 25.6) or between(t, 28.25, 30.5):
        i = int(t * SR)
        L = int(0.3 * SR)
        e = 1 - 0.7 * np.exp(-np.arange(L) / SR / 0.09)
        duck[i:i + L] = np.minimum(duck[i:i + L], e[: len(duck[i:i + L])])

# bass (eighths during groove, long notes elsewhere)
for k in range(int(DUR / (BEAT / 2))):
    t = k * BEAT / 2
    b, _ = bar_chord(t)
    if between(t, 4.0, 16.5) or between(t, 18.9, 25.6) or between(t, 28.25, 30.5):
        f = midi(b + (12 if k % 4 == 3 else 0))
        tt = T(0.24)
        saw = 2 * ((f * tt) % 1) - 1
        sub = np.sin(2 * np.pi * f / 2 * tt)
        fe = np.exp(-tt / 0.06)   # filter "pluck": crossfade a bright and a dark copy
        s = (lp(saw, 1800) * fe + lp(saw, 650) * (1 - fe)) * 0.5 + sub * 0.7
        bass.add(s * env(len(tt), 0.004, 0.16), t, 0.55)
for a, b_ in [(0.3, 4.0), (17.0, 18.1), (26.0, 28.2), (31.9, 36.0)]:
    tt = T(b_ - a)
    root = midi(33 if a in (0.3, 31.9) else 29)
    s = np.sin(2 * np.pi * root * tt) * np.minimum(1, tt / 0.6) * np.minimum(1, (b_ - a - tt) / 0.5)
    bass.add(s, a, 0.45)

# pad (supersaw chords, whole piece, filtered by section)
for bar in range(18):
    t0 = bar * 2.0
    _, ch = CHORDS[bar % 4]
    pad = np.zeros((2, int(2.3 * SR)))
    for m in ch:
        pad += supersaw(midi(m), 2.3, seed=m + bar)
    cutoff = 900 if t0 < 4 else 1400 if t0 < 9 else 2600 if t0 < 16 else 1100 if t0 < 18 else 2200 if t0 < 26 else 800 if t0 < 28 else 3000 if t0 < 31 else 1800
    pad = np.vstack([lp(pad[0], cutoff), lp(pad[1], cutoff)])
    e = np.minimum(1, T(2.3) / 0.25) * np.minimum(1, (2.3 - T(2.3)) / 0.3)
    music.add(pad * e, t0, 0.32)

# arp plucks (16ths)
for k in range(int(DUR / (BEAT / 4))):
    t = k * BEAT / 4
    if not (between(t, 4.5, 16.5) or between(t, 17.0, 18.0) or between(t, 18.9, 25.6) or between(t, 26.0, 30.5)):
        continue
    _, ch = bar_chord(t)
    m = ch[ARP[k % 8] % 3] + 12 + (12 if k % 16 >= 12 else 0)
    bright = 1800 if between(t, 17.0, 18.0) or between(t, 26.0, 28.25) else 5200
    music.add(pluck(midi(m), bright=bright), t, 0.16 if t < 9 else 0.2, 0.35 if k % 2 else -0.35)

# outro bells: the motif on the end card
for t, m in [(31.95, 81), (32.45, 76), (32.95, 79), (33.45, 84), (34.2, 81)]:
    music.add(bell(midi(m)), t, 0.16, 0.2)

# ───────────────────────── sound design ─────────────────────────
S = sfx.add
S(whoosh(0.35, 3000, 9000), 0.0, 0.25)                                   # CRT on
S(thud(), 0.3, 0.5)
S(riser(1.0, 200, 3000), 0.5, 0.25)                                       # line-draw
S(boom(1.8, 50), 1.5, 0.6)                                                # knight fills
S(glitch(0.14, 1), 1.52, 0.3)
S(boom(1.2, 60) * 0.7, 2.0, 0.5); S(whoosh(0.45, 600, 5000), 2.0, 0.4)    # shatter
S(whoosh(0.5, 5000, 500), 2.45, 0.3)                                      # particles converge
S(boom(1.4, 55), 2.97, 0.55); S(glitch(0.1, 2), 2.97, 0.25)                # WHAT PROBLEM
S(whoosh(0.35, 800, 4000), 3.6, 0.4)                                      # whip text
S(blip(900, 0.12), 3.92, 0.25); S(whoosh(0.5, 300, 2400), 3.92, 0.35)     # dot → circle
S(whoosh(0.4, 2400, 600), 4.12, 0.3, 0.6); S(whoosh(0.4, 2400, 600), 4.28, 0.3, -0.3)
S(riser(0.5, 800, 6000), 5.0, 0.2); S(thud(), 5.5, 0.9); S(boom(0.8, 70) * 0.5, 5.5, 0.4)  # PM lands
for t, f in [(6.26, 1320), (7.0, 1568), (7.35, 1760)]:
    S(blip(f), t, 0.22)
S(bell(midi(88), 1.0), 7.72, 0.18)                                        # "meet"
S(whoosh(0.55, 400, 5000), 8.45, 0.45)                                    # venn fly-through
S(riser(0.9, 300, 7000), 8.1, 0.25); S(boom(1.6, 45), 9.0, 0.5)            # drop into S3
for t in (ctx_t for ctx_t in (VO["l3a"], VO["l3b"], VO["l3c"])):
    S(blip(2093, 0.14), t, 0.25); S(whoosh(0.3, 3000, 900), t, 0.18)
S(whoosh(0.45, 500, 3000), 12.4, 0.35)
for i in range(8):                                                        # tickets rain / land
    S(thud() * 0.5, 12.9 + i * 0.07 + 0.28, 0.25, (i % 3 - 1) * 0.4)
for i in range(8):                                                        # sorted, ascending
    S(blip(midi(76 + [0, 3, 5, 7, 10, 12, 15, 17][i]), 0.08), 13.8 + i * 0.2 + 0.3, 0.2, (i % 2) * 0.6 - 0.3)
S(glitch(0.13, 5), VO["l3d"], 0.3); S(whoosh(0.3, 5000, 300), VO["l3d"] + 0.05, 0.3)
S(boom(1.0, 60) * 0.6, VO["l3d"] + 0.3, 0.45); S(whoosh(0.6, 1800, 200, True), VO["l3d"] + 0.3, 0.3)
S(whoosh(0.5, 300, 6000), 16.45, 0.6)                                     # whip pan
S(riser(1.1, 200, 8000), 17.0, 0.3)
S(boom(2.4, 42), VO["l4b"] + 0.1, 0.8); S(glitch(0.1, 8), VO["l4b"] + 0.55, 0.25)   # SOFT SKILLS
S(whoosh(0.4, 500, 7000), 18.75, 0.5)                                     # zoom-through
for t in (18.9, 19.0):
    S(blip(700, 0.1, False), t, 0.25)
S(boom(1.4, 46), 19.05, 0.7); S(thud(), 19.05, 1.0)                       # the knight lands
S(thud(), 19.25, 0.8)
for t, f in [(19.45, 1046), (19.6, 1175), (19.75, 1318)]:
    S(blip(f, 0.1), t, 0.25)
S(zap(0.32), 19.9, 0.45)
S(boom(1.2, 55) * 0.8, VO["l4c"], 0.5); S(blip(1568, 0.16), VO["l4c"] + 0.15, 0.2)   # OWNERSHIP
S(boom(1.2, 55) * 0.8, VO["l4d"], 0.5); S(whoosh(0.4, 3000, 600), VO["l4d"] + 0.05, 0.3)   # TRUST
for i in range(3):
    S(blip(midi(79 + i * 3), 0.1), VO["l4d"] + 0.75 + i * 0.22, 0.22)
for i, t in enumerate([VO["l4e"] - 0.5, VO["l4e"] - 0.05, VO["l4e"] + 0.4]):
    S(whoosh(0.3, 800 + i * 300, 2000), t, 0.2)
S(boom(1.2, 55) * 0.8, VO["l4e"], 0.5)                                    # NEGOTIATION
S(thud(), VO["l4e"] + 0.71, 0.9); S(clap(), VO["l4e"] + 0.71, 0.4)         # DEAL stamp
S(hp(noise(0.25), 3000) * env(int(0.25 * SR), 0.001, 0.05), 25.05, 0.5); S(bell(midi(91), 0.8), 25.05, 0.15)  # confetti
S(whoosh(0.45, 300, 5000), 25.6, 0.5)                                     # iris
S(glitch(0.2, 11), 27.9, 0.35); S(whoosh(0.5, 2000, 150), 27.98, 0.35)    # roadmap falls
S(boom(2.2, 40), VO["l5b"], 0.85); S(riser(0.6, 400, 8000), VO["l5b"] - 0.6, 0.2)  # PEOPLE DO
for i in range(4):
    S(blip(880, 0.08, False), VO["l5b"] + 0.1 + i * 0.07, 0.2)
rumble = lp(noise(2.4), 180) * np.minimum(1, T(2.4) / 0.3) * np.exp(-np.maximum(0, T(2.4) - 1.4) / 0.4)
S(np.tanh(rumble * 3) * 0.8, 29.0, 0.55)                                  # ignition
S(whoosh(1.4, 150, 3000), 29.3, 0.45)                                     # lift-off
for i in range(4):
    S(blip(midi(84 + [0, 4, 7, 12][i]), 0.1), 29.45 + i * 0.16, 0.18)
S(whoosh(0.6, 3000, 200), 30.35, 0.4)                                     # tilt
S(riser(1.1, 300, 5000), 30.8, 0.2)
S(boom(2.8, 38), VO["l6a"], 0.85); S(glitch(0.16, 17), VO["l6a"] + 0.02, 0.3)       # END CARD
S(whoosh(0.7, 300, 1500), 32.5, 0.25)
t_off = 35.55
S(whoosh(0.3, 6000, 200), t_off, 0.35); S(blip(120, 0.25, False), t_off + 0.22, 0.4)  # CRT off

# ───────────────────────── VO ─────────────────────────
vo = Bus()
vo_mask = np.zeros(N)
ffmpeg = os.environ.get("FFMPEG") or os.path.join(HERE, "..", "node_modules", "ffmpeg-static", "ffmpeg")
room = np.random.default_rng(5).standard_normal(int(0.5 * SR)) * np.exp(-np.arange(int(0.5 * SR)) / SR / 0.09)
room = lp(room, 5000) * 0.02
for vid, t in VO.items():
    path = os.path.join(HERE, "vo", f"{vid}.wav")
    raw = subprocess.run([ffmpeg, "-loglevel", "error", "-i", path, "-ar", str(SR), "-ac", "1", "-f", "f32le", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    x = hp(x, 90)
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    x = np.tanh(x * 1.6) / np.tanh(1.6)            # gentle saturation / level control
    wet = fftconvolve(x, room)[: len(x) + int(0.4 * SR)]
    y = np.concatenate([x, np.zeros(len(wet) - len(x))]) + wet
    vo.add(y, t, 1.0)
    i = int(t * SR)
    vo_mask[i:i + len(x)] = 1

# ducking envelope (attack 40ms, release 300ms)
def smooth_env(mask, att=0.04, rel=0.3):
    out = np.zeros_like(mask)
    a, r = np.exp(-1 / (att * SR)), np.exp(-1 / (rel * SR))
    v = 0.0
    step = 64
    for i in range(0, len(mask), step):
        m = mask[i:i + step].max()
        c = a if m > v else r
        v = m + (v - m) * c ** step
        out[i:i + step] = v
    return out

d = smooth_env(vo_mask)
music_gain = 1 - 0.62 * d
sc = duck
mix = (drums.x * 0.5 + bass.x * sc * 0.6 + music.x * sc * 0.9) * music_gain + sfx.x * (1 - 0.45 * d) * 0.65 + vo.x
if os.environ.get("STATS"):
    bed = (drums.x * 0.5 + bass.x * sc * 0.6 + music.x * sc * 0.9) * music_gain + sfx.x * (1 - 0.45 * d) * 0.65
    m = vo_mask > 0
    db = lambda x: 20 * np.log10(np.sqrt(np.mean(x[:, m] ** 2)) + 1e-9)
    print(f"under VO: vo {db(vo.x):.1f} dB  bed {db(bed):.1f} dB  drums {db(drums.x*0.85):.1f}  music {db(music.x*0.9):.1f}  bass {db(bass.x*0.9):.1f}  sfx {db(sfx.x*0.9):.1f}", file=sys.stderr)

# fade tail
fade = np.ones(N)
fs, fe = int(35.75 * SR), int(36.0 * SR)
fade[fs:fe] = np.linspace(1, 0, fe - fs)
mix *= fade
mix = np.tanh(mix * 0.9) / np.tanh(0.9) * 0.85
peak = np.max(np.abs(mix))
mix = mix / peak * 0.89
out = os.path.join(HERE, "mix.wav")
import wave
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix.T, -1, 1) * 32767).astype("<i2").tobytes())
print(f"wrote {out}  peak={peak:.2f}", file=sys.stderr)

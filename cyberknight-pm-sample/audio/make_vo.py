"""Generate the narrator VO line-by-line with Kokoro (offline neural TTS).

Model files are not committed (≈350 MB). Download them with:
  curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
  curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
and point KOKORO_DIR at the folder that holds them.
"""
import json, os, sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))
KDIR = os.environ.get("KOKORO_DIR", os.path.join(HERE, "..", ".kokoro"))
VOICE = os.environ.get("VO_VOICE", "af_heart")
SPEED = float(os.environ.get("VO_SPEED", "1.0"))

LINES = json.load(open(os.path.join(HERE, "vo_lines.json")))

k = Kokoro(os.path.join(KDIR, "kokoro-v1.0.onnx"), os.path.join(KDIR, "voices-v1.0.bin"))
out = {}
for line in LINES:
    samples, sr = k.create(line["tts"], voice=line.get("voice", VOICE), speed=line.get("speed", SPEED), lang="en-us")
    samples = np.asarray(samples, dtype=np.float32)
    # trim leading/trailing silence so placement is exact
    thr = 0.01 * np.max(np.abs(samples))
    nz = np.where(np.abs(samples) > thr)[0]
    a, b = max(nz[0] - int(0.01 * sr), 0), min(nz[-1] + int(0.06 * sr), len(samples))
    samples = samples[a:b]
    path = os.path.join(HERE, "vo", f"{line['id']}.wav")
    sf.write(path, samples, sr)
    out[line["id"]] = round(len(samples) / sr, 3)
    print(f"{line['id']:>4}  {out[line['id']]:.2f}s  {line['tts']}", file=sys.stderr)
json.dump(out, open(os.path.join(HERE, "vo", "durations.json"), "w"), indent=1)

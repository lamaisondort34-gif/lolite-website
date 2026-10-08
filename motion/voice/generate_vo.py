"""Voix off du film (Kokoro TTS, voix française ff_siwis, licence Apache 2.0).

    python3 -m venv .venv && . .venv/bin/activate && pip install kokoro-onnx soundfile
    python motion/voice/generate_vo.py

Chaque groupe est synthétisé d'une traite (intonation naturelle), puis découpé
aux silences et posé sur ses timecodes. Si une phrase déborde de sa fenêtre,
le groupe est régénéré un peu plus vite. Sortie : motion/out/vo/*.wav + manifest.json
"""
import json
import os
import urllib.request
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

HERE = Path(__file__).resolve().parent
MODELS = HERE / "models"
OUT = HERE.parent / "out" / "vo"
VOICE = "ff_siwis"
BASE = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"

# texte tel qu'il doit être prononcé (graphies phonétiques : Gougueul, Mapse, lolite point F R)
GROUPS = [
    {"parts": ["Quelqu'un cherche un artisan… près de chez vous."], "at": [0.45], "end": 2.95, "style": "intime", "speed": 0.95},
    {"parts": ["S'il ne vous trouve pas…", "il appelle quelqu'un d'autre."], "at": [2.95, 3.9], "end": 5.75, "style": "intime", "speed": 0.98},
    {"parts": ["Avec Lolite, il vous trouve."], "at": [6.55], "end": 8.5, "style": "echo", "speed": 1.0},
    {"parts": ["On crée la vitrine digitale de votre entreprise."], "at": [8.55], "end": 11.45, "style": "normal", "speed": 1.0},
    {"parts": ["Un site sur-mesure…", "moderne…", "à votre image."], "at": [12.4, 14.4, 15.7], "end": 17.2, "style": "normal", "speed": 1.0},
    {"parts": ["Visible sur Gougueul…", "sur Mapse…", "et sur mobile."], "at": [18.3, 20.0, 21.6], "end": 23.2, "style": "normal", "speed": 1.0},
    {"parts": ["Comme Tout neuf trente-quatre, à Montpellier."], "at": [24.05], "end": 26.2, "style": "normal", "speed": 1.0},
    {"parts": ["Son site travaille jour et nuit."], "at": [26.25], "end": 27.85, "style": "normal", "speed": 1.0},
    {"parts": ["Vos visiteurs deviennent des clients."], "at": [27.95], "end": 29.85, "style": "normal", "speed": 1.0},
    {"parts": ["Un bouton…", "et le téléphone sonne."], "at": [29.95, 30.55], "end": 31.85, "style": "normal", "speed": 1.0},
    {"parts": ["On s'occupe de tout :", "création, photos, mise en ligne, fiche Gougueul."], "at": [31.95, 33.0], "end": 35.4, "style": "normal", "speed": 1.03},
    {"parts": ["Livré en…", "quatorze jours."], "at": [36.05, 37.25], "end": 38.05, "style": "echo", "speed": 1.0},
    {"parts": ["Dès quatre cent cinquante euros."], "at": [38.08], "end": 39.75, "style": "normal", "speed": 1.0},
    {"parts": ["Envie d'en faire autant ?"], "at": [40.25], "end": 41.85, "style": "intime", "speed": 0.97},
    {"parts": ["Réservez votre devis gratuit sur lolite point F R."], "at": [42.05], "end": 44.97, "style": "echo", "speed": 1.0},
]


def ensure_models():
    MODELS.mkdir(parents=True, exist_ok=True)
    for f in ("kokoro-v1.0.onnx", "voices-v1.0.bin"):
        p = MODELS / f
        if not p.exists():
            print("téléchargement", f)
            urllib.request.urlretrieve(BASE + f, p)
    return Kokoro(str(MODELS / "kokoro-v1.0.onnx"), str(MODELS / "voices-v1.0.bin"))


def frames_rms(x, sr, hop=0.01):
    n = int(sr * hop)
    m = len(x) // n
    return np.sqrt(np.mean(x[: m * n].reshape(m, n) ** 2, axis=1) + 1e-12), n


def split(x, sr, parts):
    """Découpe aux (parts-1) plus longs silences internes ; renvoie [(début, fin)] en échantillons."""
    rms, hop = frames_rms(x, sr)
    voiced = rms > rms.max() * 0.025
    idx = np.where(voiced)[0]
    a, b = idx[0], idx[-1] + 1
    gaps, i = [], a
    while i < b:
        if not voiced[i]:
            j = i
            while j < b and not voiced[j]:
                j += 1
            gaps.append((j - i, i, j))
            i = j
        else:
            i += 1
    gaps = sorted(sorted(gaps, reverse=True)[: parts - 1], key=lambda g: g[1])
    if len(gaps) < parts - 1:
        return None
    bounds, start = [], a
    for _, g0, g1 in gaps:
        bounds.append((start, g0))
        start = g1
    bounds.append((start, b))
    pre, post = int(0.02 * sr / hop), int(0.14 * sr / hop)
    return [(max(0, (s - pre)) * hop, min(len(x), (e + post) * hop)) for s, e in bounds]


def main():
    k = ensure_models()
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    for gi, g in enumerate(GROUPS):
        speed = g["speed"]
        for attempt in range(8):
            audio, sr = k.create(" ".join(g["parts"]), voice=VOICE, speed=speed, lang="fr-fr")
            audio = audio.astype(np.float32)
            segs = None if g.get("separate") else split(audio, sr, len(g["parts"]))
            if segs is None:
                # repli : chaque morceau synthétisé seul, mis bout à bout avec un court silence
                pieces, segs, pos = [], [], 0
                for part in g["parts"]:
                    a2, sr = k.create(part, voice=VOICE, speed=speed, lang="fr-fr")
                    (s0, e0), = split(a2.astype(np.float32), sr, 1)
                    pieces.append(a2[s0:e0].astype(np.float32))
                    segs.append((pos, pos + e0 - s0))
                    pos += e0 - s0
                audio = np.concatenate(pieces)
            ends = g["at"][1:] + [g["end"]]
            ratio = max(((e - s) / sr - 0.12) / (end - at - 0.04) for (s, e), at, end in zip(segs, g["at"], ends))
            if ratio <= 1 or speed >= 1.3:
                break
            speed = round(min(1.3, speed * ratio * 1.02), 3)
        for si, ((s, e), at) in enumerate(zip(segs, g["at"])):
            name = f"vo{gi:02d}{chr(97 + si)}"
            sf.write(OUT / f"{name}.wav", audio[s:e], sr, subtype="FLOAT")
            manifest.append({"id": name, "at": at, "dur": round((e - s) / sr, 3), "style": g["style"], "speed": speed,
                             "text": g["parts"][si]})
            print(f"{name}  {at:5.2f}s → {at + (e - s) / sr:5.2f}s  (vitesse {speed})  {g['parts'][si]}")
    (OUT / "manifest.json").write_text(json.dumps({"sr": int(sr), "voice": VOICE, "clips": manifest}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    os.chdir(HERE)
    main()

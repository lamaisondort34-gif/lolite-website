# LOLITE — film motion 45 s (9:16)

Film publicitaire vertical 1080×1920, 30 i/s, 45 s, entièrement généré par code :
animation pilotée par le temps (HTML/SVG/Canvas rendus image par image dans Chromium),
vrai flou de mouvement (5 sous-images par image, obturateur 180°) et bande-son
100 % synthétisée (musique 120 BPM + bruitages calés à l'image).

## Fabriquer la vidéo

```bash
npm install                      # polices de la marque (déjà dans le site)
node motion/render.mjs           # rendu final → motion/out/lolite-motion-45s.mp4  (~25 min sur 4 cœurs)
node motion/render.mjs --sub 1 --out preview   # aperçu rapide sans flou (~7 min)
node motion/snap.mjs --range 6 12 0.25          # planche contact d'un passage → motion/out/snaps/
```

Prérequis : Node 20+, ffmpeg, Playwright + Chromium (`npm i -D playwright && npx playwright install chromium`).

### Voix off

Voix française neuronale (Kokoro, voix `ff_siwis`, licence Apache 2.0), générée en local :

```bash
python3 -m venv .venv && . .venv/bin/activate && pip install kokoro-onnx soundfile
python motion/voice/generate_vo.py   # répliques calées sur les timecodes → motion/out/vo/
node motion/mux.mjs                  # remixe le son (la musique s'efface sous la voix) sans re-rendre l'image
```

Le texte est dans `voice/generate_vo.py` (graphies phonétiques : « Gougueul », « Mapse », « lolite point F R » ;
« Lolite » se prononce « lo-lit »). `NO_VO=1 node motion/mux.mjs --out sans-voix` produit la version sans voix.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html`, `main.js` | Scène 1080×1920, caméra, habillage (HUD), grain, vignette |
| `lib.js`, `ui.js`, `fx.js` | Courbes (dont celles du site), images clés, ressorts, titres cinétiques, particules |
| `acts/a1…a9` | Les 9 actes (voir ci-dessous) |
| `timeline.js` | Chapitres, secousses caméra, cadence |
| `audio.mjs` | Synthèse musique + bruitages → `out/soundtrack-raw.wav` |
| `render.mjs` | Rendu parallèle, flou de mouvement, normalisation -14 LUFS, encodage H.264 |
| `voice/generate_vo.py` | Voix off : synthèse, découpage aux silences, ajustement aux fenêtres |
| `mux.mjs` | Remixage son + voix et assemblage avec la vidéo existante |

## Découpage

| Temps | Acte | Idée |
|---|---|---|
| 0–6 s | L'ombre | Recherche « artisan montpellier », « Votre entreprise ? » introuvable, les clients filent chez le concurrent, implosion |
| 6–12 s | La lumière | Explosion, le ruban du logo se dessine, l'étoile tombe, « On crée la vitrine digitale » |
| 12–18 s | Le produit | Contour → maquette filaire → vrai site Toutneuf34, annotations, morphing mobile → ordinateur |
| 18–24 s | Visible | « Visible sur Google / Maps / mobile » : recherche, carte avec épingle, la carte devient téléphone |
| 23,5–28 s | La preuve | Réalisation Toutneuf34 en 3D |
| 28–32 s | La conversion | Visiteurs → clients (particules), bouton « Appeler » → appel entrant |
| 32–36 s | Clé en main | 4 tuiles de services, les coches fusionnent |
| 36–40 s | L'offre | Anneau 14 jours, compteur « Dès 450 € » |
| 40–45 s | L'appel à l'action | « Envie d'en faire autant ? », logo, bouton devis, lolite.fr |

Tout ce qui s'anime est une fonction du temps `t` : une image donnée est toujours identique,
ce qui permet de rendre en parallèle et de recalculer n'importe quel instant.

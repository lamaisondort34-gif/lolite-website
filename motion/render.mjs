// Rendu final : Chromium headless → PNG → ffmpeg (flou de mouvement par sous-images) → MP4 + son.
//   node render.mjs                       (qualité finale : 5 sous-images, obturateur 180°)
//   node render.mjs --sub 1 --out preview (aperçu rapide sans flou de mouvement)
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { startServer, ROOT, loadChromium } from "./server.mjs";
const chromium = await loadChromium();
import { FPS, DURATION } from "./timeline.js";

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const SUB = +arg("sub", 5), SHUTTER = +arg("shutter", 0.5), WORKERS = +arg("workers", 4);
const FROM = +arg("from", 0), TO = +arg("to", DURATION), NAME = arg("out", "lolite-motion-45s");
const OUT = path.join(ROOT, "motion/out");
const TMP = path.join(OUT, `.chunks-${NAME}`);
fs.rmSync(TMP, { recursive: true, force: true });
fs.mkdirSync(TMP, { recursive: true });

const f0 = Math.round(FROM * FPS), f1 = Math.round(TO * FPS), total = f1 - f0;
const per = Math.ceil(total / WORKERS);
const { srv, url } = await startServer();
const t0 = Date.now();
let done = 0;

async function worker(w) {
  const a = f0 + w * per, b = Math.min(f1, a + per);
  if (a >= b) return null;
  const file = path.join(TMP, `c${w}.mkv`);
  const vf = SUB > 1 ? `format=gbrp,tmix=frames=${SUB},select='eq(mod(n\\,${SUB})\\,${SUB - 1})',setpts=N/(${FPS}*TB)` : "format=gbrp";
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS * SUB), "-c:v", "png", "-i", "-",
    "-vf", vf, "-r", String(FPS), "-c:v", "libx264", "-preset", "fast", "-crf", "8", "-pix_fmt", "yuv444p", file], { stdio: ["pipe", "inherit", "inherit"] });
  const browser = await chromium.launch({ args: ["--disable-gpu-vsync", "--force-color-profile=srgb"] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error(`[w${w}] PAGE ERROR`, e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  const cdp = await page.context().newCDPSession(page);
  for (let f = a; f < b; f++) {
    const T = f / FPS;
    for (let k = 0; k < SUB; k++) {
      const t = SUB > 1 ? T + (k / (SUB - 1) - 0.5) * (SHUTTER / FPS) : T;
      await page.evaluate(([t, tf]) => window.renderFrame(Math.max(0, t), tf), [t, T]);
      const { data } = await cdp.send("Page.captureScreenshot", { format: "png", optimizeForSpeed: true });
      const buf = Buffer.from(data, "base64");
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    }
    done++;
    if (done % 60 === 0) {
      const el = (Date.now() - t0) / 1000;
      console.log(`${done}/${total} images · ${el.toFixed(0)} s · reste ~${((el / done) * (total - done)).toFixed(0)} s`);
    }
  }
  await browser.close();
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  return file;
}

const files = (await Promise.all(Array.from({ length: WORKERS }, (_, w) => worker(w)))).filter(Boolean);
srv.close();
fs.writeFileSync(path.join(TMP, "list.txt"), files.map((f) => `file '${f}'`).join("\n"));
console.log(`vidéo rendue en ${((Date.now() - t0) / 1000).toFixed(0)} s — encodage final…`);

// son : génération + normalisation EBU R128 en deux passes (-14 LUFS, -1 dBTP)
const raw = path.join(OUT, "soundtrack-raw.wav");
execFileSync("node", [path.join(ROOT, "motion/audio.mjs")], { stdio: "inherit" });
let ln = "loudnorm=I=-14:TP=-1.2:LRA=11";
try {
  const log = execFileSync("sh", ["-c", `ffmpeg -hide_banner -i "${raw}" -af loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json -f null - 2>&1`], { encoding: "utf8" });
  const j = JSON.parse(log.slice(log.lastIndexOf("{"), log.lastIndexOf("}") + 1));
  ln += `:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;
} catch (e) { console.warn("mesure loudnorm impossible, passe simple", e.message); }

const final = path.join(OUT, `${NAME}.mp4`);
const aStart = FROM, aDur = TO - FROM;
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", path.join(TMP, "list.txt"),
  "-ss", String(aStart), "-t", String(aDur), "-i", raw,
  "-map", "0:v", "-map", "1:a",
  "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p",
  "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-maxrate", "14M", "-bufsize", "28M", "-profile:v", "high", "-level", "4.2",
  "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
  "-af", `${ln},aresample=48000`, "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
  "-movflags", "+faststart", "-shortest", final], { stdio: "inherit" });
fs.rmSync(TMP, { recursive: true, force: true });
console.log("✔", final, `(${(fs.statSync(final).size / 1e6).toFixed(1)} Mo) en ${((Date.now() - t0) / 1000).toFixed(0)} s`);

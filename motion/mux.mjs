// Remixe le son (musique + bruitages + voix off) et le pose sur la vidéo déjà rendue, sans re-rendre l'image.
//   node motion/mux.mjs                       → out/lolite-motion-45s-vo.mp4 (+ copie web < 30 Mo)
//   NO_VO=1 node motion/mux.mjs --out sans-voix
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "out");
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const VIDEO = arg("video", path.join(OUT, "lolite-motion-45s.mp4"));
const NAME = arg("out", "lolite-motion-45s-vo");
if (!fs.existsSync(VIDEO)) throw new Error(`vidéo introuvable : ${VIDEO} (lancer d'abord node motion/render.mjs)`);

execFileSync("node", [path.join(HERE, "audio.mjs")], { stdio: "inherit" });
const raw = path.join(OUT, "soundtrack-raw.wav");
const log = execFileSync("sh", ["-c", `ffmpeg -hide_banner -i "${raw}" -af loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json -f null - 2>&1`], { encoding: "utf8" });
const j = JSON.parse(log.slice(log.lastIndexOf("{"), log.lastIndexOf("}") + 1));
const ln = `loudnorm=I=-14:TP=-1.2:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;

const master = path.join(OUT, `${NAME}.mp4`);
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", VIDEO, "-i", raw, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
  "-af", `${ln},aresample=48000`, "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-movflags", "+faststart", "-shortest", master], { stdio: "inherit" });

// copie de diffusion légère (messageries, envoi) : 2 passes à ~4,3 Mb/s
const web = path.join(OUT, `${NAME}-web.mp4`);
const plog = path.join(OUT, `.x264-${NAME}`);
const common = ["-c:v", "libx264", "-preset", "slow", "-b:v", "4300k", "-passlogfile", plog];
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", master, ...common, "-pass", "1", "-an", "-f", "null", "/dev/null"]);
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", master, ...common, "-maxrate", "7M", "-bufsize", "12M", "-pass", "2",
  "-profile:v", "high", "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
  "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", web]);
for (const f of fs.readdirSync(OUT)) if (f.startsWith(`.x264-${NAME}`)) fs.rmSync(path.join(OUT, f));
for (const f of [master, web]) console.log("✔", f, `${(fs.statSync(f).size / 1e6).toFixed(1)} Mo`);

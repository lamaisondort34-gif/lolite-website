// Aperçus : node snap.mjs --range 0 6 0.25 [--cols 6] [--out nom]   ou   node snap.mjs 1.2 3.4 ...
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { startServer, ROOT, loadChromium } from "./server.mjs";
const chromium = await loadChromium();

const args = process.argv.slice(2);
let times = [], cols = 6, name = "sheet", scale = 0.3, single = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--range") { const [a, b, s] = args.slice(i + 1, i + 4).map(Number); for (let t = a; t <= b + 1e-9; t += s) times.push(+t.toFixed(4)); i += 3; }
  else if (args[i] === "--cols") cols = +args[++i];
  else if (args[i] === "--out") name = args[++i];
  else if (args[i] === "--scale") scale = +args[++i];
  else if (args[i] === "--single") single = true;
  else times.push(+args[i]);
}
const outDir = process.env.SNAP_DIR || path.join(ROOT, "motion/out/snaps");
fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(outDir, ".tmp-"));
const { srv, url } = await startServer();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on("pageerror", (e) => console.error("PAGE ERROR", e.message));
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.error("console:", m.text()); });
await page.goto(url);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });
const files = [];
for (const [i, t] of times.entries()) {
  await page.evaluate((t) => window.renderFrame(t, t), t);
  const f = path.join(tmp, `f${String(i).padStart(4, "0")}.png`);
  await page.screenshot({ path: f });
  files.push(f);
}
await browser.close(); srv.close();
if (single) {
  for (const [i, f] of files.entries()) fs.renameSync(f, path.join(outDir, `${name}-${times[i]}.png`));
  console.log("saved", files.length, "frames to", outDir);
} else {
  const w = Math.round(1080 * scale), h = Math.round(1920 * scale), rows = Math.ceil(files.length / cols);
  const label = times.map((t) => t.toFixed(2));
  execFileSync("ffmpeg", ["-v", "error", "-y", "-framerate", "1", "-i", path.join(tmp, "f%04d.png"),
    "-vf", `scale=${w}:${h},drawtext=text='%{eif\\:n\\:d}':x=8:y=8:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6,tile=${cols}x${rows}:padding=4:color=gray`,
    "-frames:v", "1", path.join(outDir, `${name}.png`)]);
  console.log(path.join(outDir, `${name}.png`), "\n" + label.map((l, i) => `${i}:${l}`).join("  "));
}
fs.rmSync(tmp, { recursive: true, force: true });

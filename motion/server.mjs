// Serveur statique minimal (racine = dépôt) pour charger polices et images en http://
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".woff2": "font/woff2", ".woff": "font/woff", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".json": "application/json" };

export function startServer() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const p = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream", "cache-control": "no-store" });
      fs.createReadStream(p).pipe(res);
    });
    srv.listen(0, "127.0.0.1", () => resolve({ srv, url: `http://127.0.0.1:${srv.address().port}/motion/index.html` }));
  });
}

/** Playwright : dépendance locale si présente, sinon installation globale (environnement cloud). */
export async function loadChromium() {
  for (const spec of ["playwright", "/opt/node22/lib/node_modules/playwright/index.mjs"]) {
    try { return (await import(spec)).chromium; } catch { /* essai suivant */ }
  }
  throw new Error("Playwright introuvable : npm i -D playwright && npx playwright install chromium");
}

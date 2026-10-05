// Extrait les tracés Lucide (déjà en dépendance du site) vers motion/icons.js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(here, "../../node_modules/lucide-react/dist/esm/icons");
const names = [
  "phone", "phone-call", "map-pin", "search", "pen-tool", "image", "rocket", "check",
  "star", "arrow-right", "mouse-pointer-2", "zap", "sparkles", "smartphone", "monitor",
  "palette", "globe", "cloud-upload", "phone-off", "user", "wand-sparkles", "navigation",
];
const out = {};
for (const n of names) {
  const { __iconData } = await import(path.join(dir, `${n}.mjs`));
  const node = __iconData.node;
  out[n] = node.map(([tag, attrs]) => {
    const a = Object.entries(attrs).filter(([k]) => k !== "key").map(([k, v]) => `${k}="${v}"`).join(" ");
    return `<${tag} ${a} pathLength="1"/>`;
  }).join("");
}
fs.writeFileSync(path.resolve(here, "../icons.js"),
  `// Généré par tools/build-icons.mjs — tracés Lucide (ISC)\nexport const ICONS = ${JSON.stringify(out, null, 2)};\n`);
console.log("icons:", Object.keys(out).length);

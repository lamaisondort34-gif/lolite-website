/**
 * Étape post-build :
 *  1. génère une page HTML statique par route (dist/cgu.html servie sur /cgu) (title, description, canonical, OG propres
 *     même pour les robots qui n'exécutent pas JavaScript : Facebook, LinkedIn, WhatsApp…) ;
 *  2. génère 404.html (servie par Netlify avec un vrai code 404) ;
 *  3. génère sitemap.xml ;
 *  4. vérifie les liens internes du code source (build en échec si un lien est cassé).
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://lolite-agency.fr";
const routes = JSON.parse(readFileSync(join(root, "src/lib/routes.json"), "utf8"));
const template = readFileSync(join(dist, "index.html"), "utf8");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function render({ title, description, url, robots }) {
  const t = esc(title);
  const d = esc(description);
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${d}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${t}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${d}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${t}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${d}`);
  if (url) {
    html = html
      .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
      .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`);
  } else {
    html = html
      .replace(/\s*<link rel="canonical"[^>]*>/, "")
      .replace(/\s*<meta property="og:url"[^>]*>/, "");
  }
  if (robots) html = html.replace(/(<meta name="robots" content=")[^"]*/, `$1${robots}`);
  return html;
}

// 1. Pages statiques
for (const [path, meta] of Object.entries(routes)) {
  const url = SITE + path;
  const html = render({ ...meta, url });
  const out = path === "/" ? join(dist, "index.html") : join(dist, `${path.slice(1)}.html`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}

// 2. Page 404
writeFileSync(
  join(dist, "404.html"),
  render({
    title: "Page introuvable — LOLITE Studio Web",
    description: "Cette page n'existe pas ou a été déplacée. Retrouvez nos sites vitrines sur-mesure sur la page d'accueil.",
    url: null,
    robots: "noindex, follow",
  }),
);

// 3. Sitemap
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.entries(routes)
  .map(
    ([path, m]) =>
      `  <url><loc>${SITE}${path}</loc><lastmod>${today}</lastmod><changefreq>${m.changefreq}</changefreq><priority>${m.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);

// 4. Vérification des liens internes
const srcFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|json)$/.test(e.name)) srcFiles.push(p);
  }
})(join(root, "src"));

const allSource = srcFiles.map((f) => readFileSync(f, "utf8")).join("\n");
const anchors = new Set([...allSource.matchAll(/\bid="([\w-]+)"/g)].map((m) => m[1]));
const broken = [];

for (const file of srcFiles) {
  const code = readFileSync(file, "utf8");
  // liens de page : "/cgu", "/#brief", "/images/x.webp"…
  for (const [, link] of code.matchAll(/["'`](\/[\w\-./]*(?:#[\w-]+)?)["'`]/g)) {
    const [path, hash] = link.split("#");
    const okPath =
      path === "/" || routes[path] || existsSync(join(root, "public", path)) || existsSync(join(dist, path));
    if (!okPath || (hash && !anchors.has(hash))) broken.push(`${file.replace(root + "/", "")} → ${link}`);
  }
  // ancres de section : scrollTo("#x"), href: "#x"
  for (const [, id] of code.matchAll(/["'`]#([a-z][\w-]*)["'`]/g)) {
    if (/^[0-9a-f]{3,8}$/.test(id)) continue; // couleur hexadécimale, pas une ancre
    if (!anchors.has(id)) broken.push(`${file.replace(root + "/", "")} → #${id}`);
  }
}

if (broken.length) {
  console.error("\n✖ Liens internes cassés :\n  " + [...new Set(broken)].join("\n  "));
  process.exit(1);
}
console.log(`✓ postbuild : ${Object.keys(routes).length} pages, 404.html, sitemap.xml, liens internes OK`);

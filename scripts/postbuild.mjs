/**
 * Étape post-build :
 *  1. prérendu : chaque route reçoit un HTML complet (tout le texte visible), plus ses propres
 *     title / description / canonical / Open Graph — lisible par Google, les IA (GPTBot,
 *     ClaudeBot, PerplexityBot…) et les aperçus de liens, sans exécuter JavaScript.
 *     dist/cgu.html est servie sur /cgu ; le navigateur hydrate ensuite le HTML (src/main.tsx).
 *     Les polices du hero y sont préchargées ;
 *  2. génère 404.html (servie par Netlify avec un vrai code 404) ;
 *  3. vérifie le contenu prérendu (build en échec si un texte clé manque ou est masqué) ;
 *  4. génère sitemap.xml à partir de toutes les routes (lastmod = dernier commit de chaque page) ;
 *  5. vérifie les liens internes du code source (build en échec si un lien est cassé).
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssrDir = join(root, "dist-ssr");
const SITE = "https://lolite.fr";
const routes = JSON.parse(readFileSync(join(root, "src/lib/routes.json"), "utf8"));
// Polices du hero (titre, accent italique, texte) préchargées : le contenu est visible dès le
// 1er affichage, elles doivent être là tout de suite pour éviter un saut de mise en page.
const HERO_FONTS = [/^bricolage-grotesque-latin-opsz-normal-.*\.woff2$/, /^instrument-serif-latin-400-italic-.*\.woff2$/, /^outfit-latin-wght-normal-.*\.woff2$/];
const assets = readdirSync(join(dist, "assets"));
const fontLinks = HERO_FONTS.map((re) => {
  const file = assets.find((f) => re.test(f));
  if (!file) throw new Error(`Police du hero introuvable dans dist/assets : ${re}`);
  return `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin>`;
});
const template = readFileSync(join(dist, "index.html"), "utf8").replace("</head>", `  ${fontLinks.join("\n    ")}\n  </head>`);
const ROOT_TAG = '<div id="root"></div>';
if (!template.includes(ROOT_TAG)) throw new Error(`${ROOT_TAG} introuvable dans dist/index.html`);
const { render: renderApp } = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);

const fail = (msg) => {
  console.error(`\n✖ ${msg}`);
  process.exit(1);
};

// Toutes les pages du site (App.tsx) doivent figurer dans routes.json : prérendu + sitemap.
const appRoutes = [...readFileSync(join(root, "src/App.tsx"), "utf8").matchAll(/^\s*"(\/[\w-]+)": \(\) => import\(/gm)].map(
  (m) => m[1],
);
const missing = ["/", ...appRoutes].filter((p) => !routes[p]);
const orphans = Object.keys(routes).filter((p) => p !== "/" && !appRoutes.includes(p));
if (missing.length || orphans.length)
  fail(`routes.json et App.tsx divergent — manquantes : ${missing.join(", ") || "∅"} ; en trop : ${orphans.join(", ") || "∅"}`);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

async function page({ path, title, description, url, robots }) {
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
  const appHtml = await renderApp(path);
  return html.replace(ROOT_TAG, `<div id="root">${appHtml}</div>`);
}

// 1. Pages prérendues
for (const [path, meta] of Object.entries(routes)) {
  const out = path === "/" ? join(dist, "index.html") : join(dist, `${path.slice(1)}.html`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, await page({ ...meta, path, url: SITE + path }));
}

// 2. Page 404 (chemin inconnu → composant NotFound, comme dans le navigateur)
writeFileSync(
  join(dist, "404.html"),
  await page({
    path: "/__page-introuvable__",
    title: "Page introuvable — LOLITE Studio Web",
    description: "Cette page n'existe pas ou a été déplacée. Retrouvez nos sites vitrines sur-mesure sur la page d'accueil.",
    url: null,
    robots: "noindex, follow",
  }),
);
rmSync(ssrDir, { recursive: true, force: true });

// 3. Contrôle du texte réellement présent dans le HTML (ce que lit un robot sans JavaScript)
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
function visibleText(html) {
  return html
    .replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) =>
      e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENTITIES[e] ?? m,
    )
    .replace(/\s+/g, " ");
}
const EXPECTED = {
  "index.html": [
    // titres
    "Des sites web", "d'exception,", "livrés en", "14 jours",
    "Un seul métier", "De l'idée au site", "Pensé pour votre", "Des projets qui", "Des prix clairs", "Lancez votre projet", "Les questions",
    // services (y compris ceux repliés)
    "Site Vitrine", "Portfolio & Book Créatif", "Prise de RDV & Réservation", "SEO & Référencement Google", "Refonte & Modernisation", "Forfait Maintenance LOLITE",
    "Présentez votre activité, vos réalisations", "Votre site reste en ligne, à jour et sécurisé",
    // tarifs
    "Formule Standard", "450 €", "Formule Premium", "800 €", "25 €", "250 € par an", "Hébergement offert pendant un an",
    // FAQ (questions et réponses, y compris repliées)
    "En combien de temps mon site sera-t-il en ligne ?", "Entre 1 et 2 semaines",
    "Le devis est-il vraiment gratuit ?", "Mon site sera-t-il visible sur Google ?", "Chaque site est livré avec les fondations SEO",
    "Que comprend le Forfait Maintenance LOLITE ?", "1 petite modification par mois",
  ],
  "cgu.html": ["Conditions générales d'utilisation", "Droit applicable et litiges"],
  "cgv.html": ["Conditions générales de vente", "acompte de 50 %", "Forfait Maintenance LOLITE", "Droit de rétractation", "Formulaire de rétractation"],
  "mentions-legales.html": ["Mentions légales", "Ikrame Rachidi", "34090 Montpellier"],
  "confidentialite.html": ["Politique de confidentialité", "Vos droits"],
  "cookies.html": ["Politique cookies", "Google Analytics", "Consent Mode v2", "_ga_Y6Y5L2TN5N"],
  "remboursement.html": ["Annulation et remboursement"],
  "404.html": ["Page introuvable"],
};
// L'écran de chargement et l'ancien message « JavaScript requis » ne doivent jamais être indexés.
const FORBIDDEN = ["Chargement de l'expérience", "EST. 2026", "Ce site nécessite JavaScript"];
const problems = [];
for (const [file, phrases] of Object.entries(EXPECTED)) {
  const html = readFileSync(join(dist, file), "utf8");
  // Un script en ligne serait bloqué par la Content-Security-Policy (netlify.toml).
  if (/<script(?![^>]*\b(?:src|type)=)[^>]*>/i.test(html)) problems.push(`${file} : script en ligne (bloqué par la CSP)`);
  // Tout le texte doit être visible sans attendre le JavaScript : aucun élément masqué
  // (opacity:0, ligne sortie de son cadre), hormis le contenu replié des accordéons (height:0).
  const hidden = [...html.matchAll(/\sstyle="([^"]*)"/g)]
    .map((m) => m[1])
    .filter((s) => /opacity:0(?![.\d])|translateY\(110%\)/.test(s) && !/^height:0px/.test(s));
  if (hidden.length) problems.push(`${file} : ${hidden.length} élément(s) masqué(s) dans le HTML, ex. style="${hidden[0]}"`);
  const text = visibleText(html);
  for (const p of phrases) if (!text.includes(p)) problems.push(`${file} : texte manquant « ${p} »`);
  for (const p of FORBIDDEN) if (text.includes(p)) problems.push(`${file} : texte interdit « ${p} »`);
}
if (problems.length) fail("Contenu prérendu incomplet :\n  " + problems.join("\n  "));

// 4. Sitemap — toutes les routes, lastmod = date du dernier commit touchant la page
const today = new Date().toISOString().slice(0, 10);
function lastmod(sources = []) {
  try {
    const d = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...sources], { cwd: root, encoding: "utf8" }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : today;
  } catch {
    return today; // pas d'historique git disponible
  }
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.entries(routes)
  .map(
    ([path, m]) =>
      `  <url><loc>${SITE}${path}</loc><lastmod>${lastmod(m.sources)}</lastmod><changefreq>${m.changefreq}</changefreq><priority>${m.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);

// 5. Vérification des liens internes
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
console.log(`✓ postbuild : ${Object.keys(routes).length} pages prérendues + 404.html, contenu vérifié, sitemap.xml, liens internes OK`);

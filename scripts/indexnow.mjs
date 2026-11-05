/**
 * IndexNow : après le build, envoie toutes les URL du sitemap à https://api.indexnow.org/indexnow
 * (Bing et les moteurs partenaires), pour qu'elles soient recrawlées sans attendre.
 * Protocole : https://www.indexnow.org/documentation
 *
 *  - la clé est servie à https://lolite.fr/<clé>.txt (public/<clé>.txt ne contient que la clé) ;
 *  - envoi seulement lors d'un build de production Netlify (CONTEXT=production) : rien en local
 *    ni pour les aperçus de déploiement ;
 *  - ne fait JAMAIS échouer le build : toute erreur est seulement affichée.
 *
 * Lancé automatiquement par npm après « npm run build » (script « postbuild » de package.json).
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KEY = "310c1fc058ff08e467f9a61b4e7c309b";
const HOST = "lolite.fr";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const TIMEOUT_MS = 10_000;

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

async function main() {
  if (process.env.CONTEXT !== "production") {
    console.log("IndexNow : ignoré (envoi seulement lors d'un build de production Netlify)");
    return;
  }

  // Le fichier de clé doit être publié, sinon les moteurs refusent l'envoi.
  if (readFileSync(join(dist, `${KEY}.txt`), "utf8") !== KEY) {
    console.warn(`⚠ IndexNow : dist/${KEY}.txt ne contient pas la clé, rien envoyé`);
    return;
  }

  const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
  const urlList = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (!urlList.length) {
    console.warn("⚠ IndexNow : aucune URL dans dist/sitemap.xml, rien envoyé");
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (res.ok) {
    console.log(`✓ IndexNow : ${urlList.length} URL envoyées (HTTP ${res.status})`);
  } else {
    const detail = (await res.text().catch(() => "")).trim().slice(0, 200);
    console.warn(`⚠ IndexNow : réponse HTTP ${res.status}${detail ? ` — ${detail}` : ""} (build non bloqué)`);
  }
}

try {
  await main();
} catch (err) {
  console.warn(`⚠ IndexNow : envoi impossible — ${err?.message ?? err} (build non bloqué)`);
}

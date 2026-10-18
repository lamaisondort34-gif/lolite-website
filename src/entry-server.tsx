/**
 * Point d'entrée du prérendu (build serveur, cf. scripts/postbuild.mjs) : produit le HTML
 * complet d'une route pour que Google, les IA et les aperçus de liens lisent tout le contenu
 * sans exécuter JavaScript. Le navigateur « hydrate » ensuite ce HTML (src/main.tsx).
 */
import { StrictMode } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import App, { loadPage } from "./App";

// Contenus réutilisés au build (données structurées, /llms.txt) : la même source que la page,
// pour que ces fichiers ne puissent jamais contredire ce qui est affiché.
export { FAQS } from "./components/Faq";
export { PLANS } from "./components/Pricing";
export { SERVICES } from "./components/Services";
export { SECTORS } from "./components/Sectors";
export { FACEBOOK_URL, INSTAGRAM_URL, LEGAL, SITE_URL, WA_DISPLAY, WA_NUMBER } from "./lib/site";

export async function render(path: string): Promise<string> {
  // La page est chargée avant le rendu (pas de <Suspense>) : HTML complet, sans script en ligne.
  const page = await loadPage(path);
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <App path={path} page={page} />
    </StrictMode>,
  );
  const chunks: Buffer[] = [];
  for await (const chunk of prelude) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

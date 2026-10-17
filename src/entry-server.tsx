/**
 * Point d'entrée du prérendu (build serveur, cf. scripts/postbuild.mjs) : produit le HTML
 * complet d'une route pour que Google, les IA et les aperçus de liens lisent tout le contenu
 * sans exécuter JavaScript. Le navigateur « hydrate » ensuite ce HTML (src/main.tsx).
 */
import { StrictMode } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import App, { loadPage } from "./App";

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

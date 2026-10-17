import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
// Polices auto-hébergées : pas d'appel à Google Fonts (plus rapide, et aucune IP transmise à Google).
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/outfit/index.css";
import "@fontsource/instrument-serif/400-italic.css"; // seule la version italique est utilisée
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./index.css";
import App, { currentPath, loadPage } from "./App";

const container = document.getElementById("root")!;
const path = currentPath();

// La page est chargée avant le rendu, exactement comme au prérendu (src/entry-server.tsx).
loadPage(path).then((page) => {
  const app = (
    <StrictMode>
      <App path={path} page={page} />
    </StrictMode>
  );
  // En production, chaque page est prérendue au build (HTML complet) : React s'y « branche ».
  // En développement, la page est vide : rendu classique.
  if (container.hasChildNodes()) hydrateRoot(container, app);
  else createRoot(container).render(app);
});

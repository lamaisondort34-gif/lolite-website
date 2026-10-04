import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Polices auto-hébergées : pas d'appel à Google Fonts (plus rapide, et aucune IP transmise à Google).
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/outfit/index.css";
import "@fontsource/instrument-serif/400-italic.css"; // seule la version italique est utilisée
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

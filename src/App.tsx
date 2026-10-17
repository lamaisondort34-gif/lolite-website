import { useEffect, type ComponentType } from "react";
import { initLenis, scrollTo } from "./lib/site";
import routes from "./lib/routes.json";
import { Cursor } from "./components/Cursor";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Services } from "./components/Services";
import { Process } from "./components/Process";
import { Sectors } from "./components/Sectors";
import { Portfolio } from "./components/Portfolio";
import { Pricing } from "./components/Pricing";
import { About } from "./components/About";
import { Brief } from "./components/Brief";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { CookieBanner } from "./components/CookieBanner";

type PageModule = Promise<{ default: ComponentType }>;

// Pages secondaires dans des fichiers séparés : elles n'alourdissent pas l'accueil.
// Chargées AVANT le rendu (src/main.tsx, src/entry-server.tsx) plutôt qu'avec React.lazy :
// pas de <Suspense>, donc un HTML prérendu complet, sans script en ligne (interdit par la CSP).
const PAGE_LOADERS: Record<string, () => PageModule> = {
  "/mentions-legales": () => import("./components/MentionsLegales").then((m) => ({ default: m.MentionsLegales })),
  "/confidentialite": () => import("./components/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy })),
  "/cgu": () => import("./components/TermsOfService").then((m) => ({ default: m.TermsOfService })),
  "/cgv": () => import("./components/SalesTerms").then((m) => ({ default: m.SalesTerms })),
  "/cookies": () => import("./components/CookiePolicy").then((m) => ({ default: m.CookiePolicy })),
  "/remboursement": () => import("./components/RefundPolicy").then((m) => ({ default: m.RefundPolicy })),
};
const loadNotFound = (): PageModule => import("./components/NotFound").then((m) => ({ default: m.NotFound }));

/** Composant de la page à afficher (rien pour l'accueil, NotFound pour une adresse inconnue). */
export async function loadPage(path: string): Promise<ComponentType | undefined> {
  if (path === "/") return undefined;
  return (await (PAGE_LOADERS[path] ?? loadNotFound)()).default;
}

// Anciennes URLs « ?page=xxx » → nouvelles URLs propres (aussi gérées en 301 côté Netlify).
const LEGACY: Record<string, string> = {
  privacy: "/confidentialite",
  terms: "/cgu",
  cookies: "/cookies",
  refund: "/remboursement",
};

/** Route demandée par le navigateur (les anciennes URLs « ?page= » sont réécrites). */
export function currentPath() {
  const legacy = LEGACY[new URLSearchParams(window.location.search).get("page") ?? ""];
  if (legacy) {
    window.history.replaceState(null, "", legacy);
    return legacy;
  }
  const p = window.location.pathname.replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

/** `path` : route affichée ; `page` : son composant, déjà chargé (cf. loadPage). */
export default function App({ path, page: Page }: { path: string; page?: ComponentType }) {
  const isHome = path === "/";
  // L'intro de la 1re visite (rideau + entrée du hero) est jouée en CSS par-dessus la page
  // déjà affichée, cf. public/boot.js : React n'attend rien, le contenu est visible d'emblée.

  useEffect(() => {
    initLenis();
  }, []);

  // Arrivée sur /#brief (depuis une autre page) : on scrolle une fois la page prête.
  useEffect(() => {
    if (isHome && window.location.hash.length > 1) {
      const id = window.location.hash;
      const t = setTimeout(() => scrollTo(id), 150);
      return () => clearTimeout(t);
    }
  }, [isHome]);

  // Titre de l'onglet (les balises meta sont aussi pré-générées au build, cf. scripts/postbuild.mjs).
  useEffect(() => {
    const meta = (routes as Record<string, { title: string }>)[path];
    document.title = meta ? meta.title : "Page introuvable — LOLITE Studio Web";
  }, [path]);

  return (
    <div className="noise relative min-h-screen bg-ink font-sans text-milk">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[500] focus:rounded-full focus:bg-milk focus:px-5 focus:py-3 focus:text-sm focus:text-white"
      >
        Aller au contenu
      </a>
      <Cursor />
      <Nav />

      {isHome ? (
        <main id="contenu">
          <Hero />
          <Marquee />
          <Services />
          <Process />
          <Marquee reverse slow className="border-y-0" />
          <Sectors />
          <Portfolio />
          <Pricing />
          <About />
          <Brief />
          <Faq />
        </main>
      ) : (
        Page && <Page />
      )}

      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
    </div>
  );
}

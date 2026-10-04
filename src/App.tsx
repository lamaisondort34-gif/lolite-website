import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { initLenis, scrollTo } from "./lib/site";
import routes from "./lib/routes.json";
import { Preloader } from "./components/Preloader";
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

// Pages secondaires chargées à la demande : elles n'alourdissent pas l'accueil.
const PAGES: Record<string, React.LazyExoticComponent<() => React.JSX.Element>> = {
  "/mentions-legales": lazy(() => import("./components/MentionsLegales").then((m) => ({ default: m.MentionsLegales }))),
  "/confidentialite": lazy(() => import("./components/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy }))),
  "/cgu": lazy(() => import("./components/TermsOfService").then((m) => ({ default: m.TermsOfService }))),
  "/cookies": lazy(() => import("./components/CookiePolicy").then((m) => ({ default: m.CookiePolicy }))),
  "/remboursement": lazy(() => import("./components/RefundPolicy").then((m) => ({ default: m.RefundPolicy }))),
};
const NotFound = lazy(() => import("./components/NotFound").then((m) => ({ default: m.NotFound })));

// Anciennes URLs « ?page=xxx » → nouvelles URLs propres (aussi gérées en 301 côté Netlify).
const LEGACY: Record<string, string> = {
  privacy: "/confidentialite",
  terms: "/cgu",
  cookies: "/cookies",
  refund: "/remboursement",
};

function currentPath() {
  const legacy = LEGACY[new URLSearchParams(window.location.search).get("page") ?? ""];
  if (legacy) {
    window.history.replaceState(null, "", legacy);
    return legacy;
  }
  const p = window.location.pathname.replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

function shouldShowPreloader(isHome: boolean) {
  if (!isHome || window.location.hash) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    // Une seule fois par session : on ne fait pas attendre un visiteur qui revient.
    if (sessionStorage.getItem("lolite-preloaded")) return false;
    sessionStorage.setItem("lolite-preloaded", "1");
  } catch {
    /* stockage indisponible */
  }
  return true;
}

export default function App() {
  const [path] = useState(currentPath);
  const isHome = path === "/";
  const Page = isHome ? null : PAGES[path] ?? NotFound;
  const [loading, setLoading] = useState(() => shouldShowPreloader(isHome));

  useEffect(() => {
    initLenis();
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
  }, [loading]);

  // Arrivée sur /#brief (depuis une autre page) : on scrolle une fois la page prête.
  useEffect(() => {
    if (!loading && isHome && window.location.hash.length > 1) {
      const id = window.location.hash;
      const t = setTimeout(() => scrollTo(id), 150);
      return () => clearTimeout(t);
    }
  }, [loading, isHome]);

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

      <AnimatePresence>
        {loading && <Preloader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Nav ready={!loading} />

      {isHome ? (
        <main id="contenu">
          <Hero ready={!loading} />
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
        <Suspense fallback={<div className="min-h-svh" />}>{Page && <Page />}</Suspense>
      )}

      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
    </div>
  );
}

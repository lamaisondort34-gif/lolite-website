import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { initLenis } from "./lib/site";
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
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TermsOfService } from "./components/TermsOfService";
import { CookiePolicy } from "./components/CookiePolicy";
import { RefundPolicy } from "./components/RefundPolicy";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    initLenis();
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
  }, [loading]);

  // Vérifier la page à afficher via query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
    if (page) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentPage("home");
    }
  }, []);

  return (
    <div className="noise relative min-h-screen bg-ink font-sans text-milk">
      <Cursor />

      <AnimatePresence>
        {loading && <Preloader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <Nav ready={!loading} />

      {currentPage === "home" && (
        <main>
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
      )}

      {currentPage === "privacy" && <PrivacyPolicy />}
      {currentPage === "terms" && <TermsOfService />}
      {currentPage === "cookies" && <CookiePolicy />}
      {currentPage === "refund" && <RefundPolicy />}

      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { EASE_OUT } from "../lib/site";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté ou refusé
    const cookieConsent = localStorage.getItem("lolite-cookie-consent");
    if (!cookieConsent) {
      setShow(true);
    } else {
      setAccepted(cookieConsent === "accepted");
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("lolite-cookie-consent", "accepted");
    setAccepted(true);
    setShow(false);
    // Charger Google Analytics si pas déjà chargé
    loadGoogleAnalytics();
  };

  const handleRefuse = () => {
    localStorage.setItem("lolite-cookie-consent", "refused");
    setAccepted(false);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="fixed bottom-5 left-5 right-5 z-50 max-w-md rounded-2xl border border-line bg-coal/95 p-6 backdrop-blur-md md:bottom-8 md:left-8 md:right-auto"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold text-milk mb-2">
                🍪 Cookies
              </h3>
              <p className="text-sm text-fog leading-relaxed mb-4">
                Nous utilisons des cookies pour améliorer votre expérience.
                Acceptez-vous l'analyse Google Analytics pour nous aider à progresser ?
              </p>
              <p className="text-xs text-fog/60">
                Consultez notre{" "}
                <a
                  href="#cookies"
                  className="text-lime hover:underline"
                >
                  politique de cookies
                </a>
              </p>
            </div>
            <button
              onClick={handleRefuse}
              className="shrink-0 text-milk/50 hover:text-milk transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleRefuse}
              className="flex-1 rounded-full border border-line px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-milk/70 transition-colors hover:text-milk"
            >
              Refuser
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 rounded-full bg-lime px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-lime-deep"
            >
              Accepter
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Fonction pour charger Google Analytics
function loadGoogleAnalytics() {
  if (window.gtag) return; // Déjà chargé

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"; // À remplacer par ton ID
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX"); // À remplacer par ton ID
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_OUT } from "../lib/site";
import {
  ANALYTICS_ENABLED,
  getConsent,
  loadAnalytics,
  setConsent,
  type Consent,
} from "../lib/analytics";

/**
 * Bandeau de consentement conforme aux recommandations CNIL :
 * - aucun traceur avant le choix,
 * - « Refuser » aussi visible et aussi simple que « Accepter »,
 * - choix réversible à tout moment (lien « Gérer les cookies » du footer),
 * - choix redemandé au bout de 6 mois.
 */
export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ANALYTICS_ENABLED) return;
    const consent = getConsent();
    if (consent === "accepted") loadAnalytics();
    if (!consent) setShow(true);

    const reopen = () => setShow(true);
    window.addEventListener("lolite:cookies", reopen);
    return () => window.removeEventListener("lolite:cookies", reopen);
  }, []);

  const choose = (value: Consent) => {
    setConsent(value);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-labelledby="cookie-title"
          aria-describedby="cookie-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="fixed inset-x-4 bottom-4 z-[160] rounded-2xl border border-line bg-coal p-5 shadow-[0_20px_60px_rgba(22,16,43,0.18)] sm:inset-x-auto sm:left-6 sm:max-w-md md:bottom-8 md:left-8 md:p-6"
        >
          <h2 id="cookie-title" className="mb-2 font-display text-lg font-bold text-milk">
            Vos cookies, votre choix
          </h2>
          <p id="cookie-desc" className="text-sm leading-relaxed text-fog">
            Avec votre accord, nous utilisons Google Analytics pour mesurer
            l'audience du site de façon anonyme. Aucun cookie publicitaire.
            Vous pouvez changer d'avis à tout moment.{" "}
            <a href="/cookies" className="text-lime underline underline-offset-2">
              En savoir plus
            </a>
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => choose("refused")}
              className="rounded-full border border-milk/30 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-milk transition-colors hover:border-milk"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="rounded-full border border-lime bg-lime px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-lime-deep"
            >
              Accepter
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

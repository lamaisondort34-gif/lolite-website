import { ArrowUp, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  CONTACT_EMAIL,
  CTA_LABEL,
  EASE_OUT,
  goToBrief,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  scrollTo,
  WA,
  WA_DISPLAY,
} from "../lib/site";
import { ANALYTICS_ENABLED, openCookieSettings } from "../lib/analytics";
import { Magnetic } from "./Magnetic";
import { Logo } from "./Logo";

const LINKS = [
  { label: "Expertises", href: "#services" },
  { label: "Méthode", href: "#methode" },
  { label: "Pour qui", href: "#pour-qui" },
  { label: "Réalisations", href: "#realisations" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Brief", href: "#brief" },
  { label: "FAQ", href: "#faq" },
];

const LEGAL_LINKS = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Confidentialité", href: "/confidentialite" },
  { label: "CGU", href: "/cgu" },
  { label: "Cookies", href: "/cookies" },
  { label: "Remboursement", href: "/remboursement" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-coal">
      <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-20 md:px-10 md:pt-28">
        {/* CTA row */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-line pb-14 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-lime">
              Prêt à vous démarquer ?
            </p>
            <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-milk md:text-6xl">
              Votre site en 14 jours.
              <br />
              <span className="serif-accent text-lime">On commence quand ?</span>
            </h2>
          </div>
          <Magnetic strength={0.3}>
            <button
              type="button"
              onClick={() => goToBrief()}
              className="group flex items-center gap-3 rounded-full bg-lime px-8 py-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-lime-deep"
            >
              {CTA_LABEL}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
            </button>
          </Magnetic>
        </div>

        {/* middle */}
        <div className="grid gap-10 py-14 md:grid-cols-3">
          <div>
            <Logo variant="full" size={36} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-fog">
              Studio web indépendant. Sites vitrines d'exception, sur-mesure,
              livrés en 1 à 2 semaines.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
              Montpellier · France & DOM-TOM · 100% à distance
            </p>
          </div>

          <div className="md:justify-self-center">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.24em] text-fog">
              Navigation
            </p>
            <nav aria-label="Navigation du pied de page" className="grid grid-cols-2 gap-x-10 gap-y-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={`/${l.href}`}
                  onClick={(e) => {
                    if (window.location.pathname !== "/") return;
                    e.preventDefault();
                    scrollTo(l.href);
                  }}
                  className="link-underline w-fit text-sm text-milk/80 transition-colors hover:text-lime-deep"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="md:justify-self-end">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.24em] text-fog">
              Contact direct
            </p>
            <a
              href={WA.devis}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 font-display text-xl font-bold text-milk transition-colors hover:text-lime"
            >
              {WA_DISPLAY}
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <p className="mt-3 text-sm text-fog">Réponse sous 24–48h, 7j/7.</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-3 block text-sm text-milk/80 underline-offset-4 hover:text-lime-deep hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 text-sm text-milk/80 underline-offset-4 hover:text-lime-deep hover:underline"
            >
              <InstagramIcon className="h-4 w-4" />@{INSTAGRAM_HANDLE}
            </a>
            <Magnetic strength={0.3} className="mt-8">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex items-center gap-3 rounded-full border border-line px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-milk transition-all duration-300 hover:border-lime hover:text-lime"
              >
                Retour en haut
                <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
              </button>
            </Magnetic>
          </div>
        </div>

        {/* giant wordmark */}
        <div className="relative select-none overflow-hidden border-t border-line pt-8">
          <motion.p
            initial={{ y: 80, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE_OUT }}
            className="text-center font-display text-[20vw] font-extrabold leading-[0.85] tracking-tight text-milk/[0.07] md:text-[17vw]"
          >
            Lolite
          </motion.p>
        </div>

        {/* Legal links */}
        <nav
          aria-label="Informations légales"
          className="flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-line py-6 font-mono text-[11px] uppercase tracking-[0.2em] text-fog"
        >
          {LEGAL_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-lime-deep">
              {l.label}
            </a>
          ))}
          {ANALYTICS_ENABLED && (
            <button type="button" onClick={openCookieSettings} className="uppercase transition-colors hover:text-lime-deep">
              Gérer les cookies
            </button>
          )}
        </nav>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-fog md:flex-row">
          <p>© 2026 LOLITE — Tous droits réservés</p>
          <p>
            Conçu & développé à Montpellier<span className="text-lime">.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

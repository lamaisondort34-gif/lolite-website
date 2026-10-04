import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, Plus } from "lucide-react";
import { EASE, WA } from "../lib/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const FAQS = [
  {
    q: "En combien de temps mon site sera-t-il en ligne ?",
    a: "Entre 1 et 2 semaines selon la formule choisie et la rapidité de vos retours. Nous travaillons avec un planning précis : maquette sous 5 jours, site livré au plus tard au jour 14.",
  },
  {
    q: "Le devis est-il vraiment gratuit ?",
    a: "Oui, à 100%. Vous décrivez votre projet via le brief ou WhatsApp, et vous recevez un devis détaillé sous 24 à 48h — sans aucun engagement de votre part.",
  },
  {
    q: "Pourrai-je modifier mon site moi-même ?",
    a: "Absolument. La formule Premium inclut une interface d'administration simple pour modifier vos textes, photos et horaires en toute autonomie. Et avec la formule Sérénité, on s'en occupe pour vous.",
  },
  {
    q: "Travaillez-vous avec des clients hors de Montpellier ?",
    a: "Oui ! Nous accompagnons des clients partout en France métropolitaine et dans les DOM-TOM. Tout se fait à distance : visio, WhatsApp, e-mail — avec la même exigence de qualité.",
  },
  {
    q: "Mon site sera-t-il visible sur Google ?",
    a: "Chaque site est livré avec les fondations SEO : structure optimisée, vitesse de chargement, balisage sémantique. La formule Premium ajoute le SEO local avancé et l'optimisation de votre fiche Google Business.",
  },
  {
    q: "Que comprend l'abonnement maintenance à 50 € / mois ?",
    a: "L'hébergement haute vitesse, les sauvegardes hebdomadaires, les mises à jour de sécurité, les petites modifications de contenu et un support prioritaire sous 24h. Sans engagement de durée.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="mx-auto max-w-[1100px] px-5 py-24 md:px-10 md:py-36">
      <SectionHeading
        index="08"
        eyebrow="FAQ"
        align="center"
        title={
          <>
            Les questions <br />
            <span className="serif-accent text-lime">qu'on nous pose</span>
          </>
        }
      />

      <div className="border-t border-line">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className="border-b border-line" data-cursor="hover">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center gap-6 py-6 text-left md:py-7"
                >
                  <span
                    className={`font-mono text-xs ${isOpen ? "text-lime" : "text-fog"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`flex-1 font-display text-lg font-bold tracking-tight transition-colors duration-300 md:text-2xl ${
                      isOpen ? "text-milk" : "text-milk/70"
                    }`}
                  >
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                      isOpen ? "border-lime bg-lime text-white" : "border-line text-fog"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-3xl pb-8 pl-9 pr-4 text-sm leading-relaxed text-fog md:pl-12 md:text-base">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* CTA under FAQ */}
      <Reveal delay={0.1}>
        <div className="mt-14 flex flex-col items-center gap-5 text-center">
          <p className="max-w-md text-base text-fog">
            Vous ne trouvez pas la réponse à votre question ? Écrivez-nous
            directement, on répond sous 24–48h.
          </p>
          <a
            href={WA.faq}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-lime-deep underline-offset-4 hover:underline"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Poser ma question sur WhatsApp
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}

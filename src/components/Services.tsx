import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarCheck,
  Gauge,
  LayoutGrid,
  Monitor,
  PenTool,
  Wrench,
} from "lucide-react";
import { CTA_LABEL, EASE, goToBrief, scrollTo } from "../lib/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const SERVICES = [
  {
    icon: Monitor,
    title: "Site Vitrine Essentiel",
    desc: "Présentez votre activité, vos réalisations et vos coordonnées de manière claire, esthétique et parfaitement optimisée pour smartphone.",
    tags: ["Design responsive & sur-mesure", "Formulaire + Google Maps", "Livré en 1 à 2 semaines"],
  },
  {
    icon: PenTool,
    title: "Portfolio & Book Créatif",
    desc: "Sublimez vos projets grâce à une galerie visuelle immersive, idéale pour mettre en lumière vos réalisations et capter de nouveaux contrats.",
    tags: ["Galeries photos HD dynamiques", "Mise en page épurée", "Tri par projet ou catégorie"],
  },
  {
    icon: CalendarCheck,
    title: "Prise de RDV & Réservation",
    desc: "Incorporez un calendrier interactif permettant à vos clients de réserver directement un créneau ou un rendez-vous sur votre site.",
    tags: ["Sync Google Calendar / Outlook", "Rappels automatiques", "Gain de temps quotidien"],
  },
  {
    icon: Gauge,
    title: "SEO & Référencement Google",
    desc: "Soyez facilement trouvé par des prospects qualifiés à Montpellier ou dans votre région grâce à une structure technique optimisée pour Google.",
    tags: ["Mots-clés stratégiques & SEO local", "Fiche Google Business", "Chargement ultra-rapide"],
  },
  {
    icon: LayoutGrid,
    title: "Refonte & Modernisation",
    desc: "Transformez votre site existant obsolète en une vitrine élégante, ultra-rapide et parfaitement alignée avec votre image actuelle.",
    tags: ["Acquis SEO conservés", "Design nouvelle génération", "Contenus mis à jour"],
  },
  {
    icon: Wrench,
    title: "Forfait Maintenance LOLITE",
    desc: "Votre site reste en ligne, à jour et sécurisé, sans que vous ayez à vous en occuper.",
    tags: ["Hébergement, sécurité et mises à jour", "1 petite modification par mois", "25 € par mois, sans engagement"],
  },
];

export function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
      <SectionHeading
        index="01"
        eyebrow="Nos expertises"
        title={
          <>
            Un seul métier : <br />
            <span className="serif-accent text-lime">vous rendre</span> inoubliable
          </>
        }
        description="Nous concentrons 100% de notre savoir-faire sur la création de sites vitrines sur-mesure d'exception qui subliment votre image de marque."
      />

      <div className="border-t border-line">
        {SERVICES.map((s, i) => {
          const open = active === i;
          const Icon = s.icon;
          return (
            <Reveal key={s.title} delay={i * 0.04}>
              <div
                className="group border-b border-line"
                data-cursor="hover"
                onMouseEnter={() => setActive(i)}
              >
                <button
                  onClick={() => setActive(open ? -1 : i)}
                  className="flex w-full items-center gap-5 py-6 text-left md:gap-10 md:py-8"
                >
                  <span
                    className={`font-mono text-xs transition-colors duration-300 ${
                      open ? "text-lime" : "text-fog"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={`flex-1 font-display text-xl font-bold tracking-tight transition-all duration-500 md:text-4xl ${
                      open ? "translate-x-2 text-milk md:translate-x-4" : "text-fog group-hover:text-milk"
                    }`}
                  >
                    {s.title}
                  </span>
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all duration-500 md:h-14 md:w-14 ${
                      open
                        ? "rotate-0 border-lime bg-lime text-white"
                        : "rotate-45 border-line text-fog group-hover:border-fog"
                    }`}
                  >
                    <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-9 pl-9 pr-2 md:grid-cols-[auto_1fr_1.3fr] md:gap-12 md:pl-[4.5rem]">
                        <span className="hidden h-14 w-14 place-items-center rounded-2xl border border-lime/30 bg-lime/10 text-lime md:grid">
                          <Icon className="h-6 w-6" />
                        </span>
                        <p className="max-w-md text-sm leading-relaxed text-fog md:text-base">
                          {s.desc}
                        </p>
                        <ul className="flex flex-col gap-2.5">
                          {s.tags.map((t) => (
                            <li
                              key={t}
                              className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-milk/80"
                            >
                              <span className="h-1 w-1 rounded-full bg-lime" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center justify-between gap-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fog">
          Un besoin spécifique ? Parlons-en.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => goToBrief()}
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-lime-deep"
          >
            {CTA_LABEL}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
          </button>
          <button
            onClick={() => scrollTo("#tarifs")}
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-milk"
          >
            Voir les tarifs
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </Reveal>
    </section>
  );
}

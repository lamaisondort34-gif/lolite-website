import { motion } from "framer-motion";
import { ArrowUpRight, Globe2, MessageCircle, Phone, Video } from "lucide-react";
import { CTA_LABEL, EASE_OUT, goToBrief } from "../lib/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";

const SECTORS = [
  {
    img: "sector-archi",
    alt: "Villa d'architecte contemporaine en béton éclairée au crépuscule",
    title: "Architectes & Designers",
    desc: "Un book haut de gamme aux visuels épurés et percutants pour valoriser vos projets de construction et d'aménagement.",
  },
  {
    img: "sector-coach",
    alt: "Coach sportif s'entraînant avec des cordes ondulatoires dans une salle",
    title: "Coachs & Bien-être",
    desc: "Présentez vos formules, vos tarifs et vos avis clients — avec réservation directe de vos séances en ligne.",
  },
  {
    img: "sector-artisan",
    alt: "Boulanger pétrissant la pâte à la main dans son atelier",
    title: "Artisans & Restauration",
    desc: "Pâtissiers, menuisiers, restaurateurs : attirez une clientèle de proximité avec une vitrine claire et géolocalisée.",
  },
  {
    img: "sector-liberal",
    alt: "Avocat à son bureau dans un cabinet avec vue sur la ville",
    title: "Professions libérales & TPE",
    desc: "Avocats, consultants, thérapeutes : établissez votre crédibilité en ligne avec une vitrine élégante et rassurante.",
  },
];

export function Sectors() {
  return (
    <section id="pour-qui" className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
      <SectionHeading
        index="03"
        eyebrow="Pour qui ?"
        title={
          <>
            Pensé pour votre <br />
            <span className="serif-accent text-lime">savoir-faire</span>
          </>
        }
        description="Que vous soyez à Montpellier, Paris, Lyon, aux Antilles ou à La Réunion — LOLITE crée votre site vitrine sur-mesure, quel que soit votre secteur."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
        {SECTORS.map((s, i) => (
          <motion.article
            key={s.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: (i % 2) * 0.12 }}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-coal ${
              i % 2 === 1 ? "lg:translate-y-10" : ""
            }`}
            data-cursor="hover"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={`/images/${s.img}-800.webp`}
                srcSet={`/images/${s.img}-800.webp 800w, /images/${s.img}.webp 1400w`}
                sizes="(min-width: 640px) 50vw, 100vw"
                width={1400}
                height={963}
                alt={s.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
              />
              <span className="absolute left-5 top-5 rounded-full bg-coal/90 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-milk backdrop-blur-md">
                0{i + 1}
              </span>
            </div>
            {/* Texte sous la photo (et non par-dessus) : lisible quelle que soit l'image. */}
            <div className="flex-1 border-t border-line p-6 md:p-8">
              <div className="mb-3 h-px w-10 bg-lime transition-all duration-500 group-hover:w-20" />
              <h3 className="font-display text-2xl font-bold tracking-tight text-milk md:text-3xl">
                {s.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-fog">
                {s.desc}
              </p>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Remote banner */}
      <Reveal delay={0.1}>
        <div className="mt-20 flex flex-col items-start justify-between gap-8 overflow-hidden rounded-2xl border border-line bg-coal p-8 md:mt-24 md:flex-row md:items-center md:p-12">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-lime">
              <Globe2 className="h-4 w-4" />
              100% à distance — zéro déplacement
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-milk md:text-4xl">
              Votre projet avance,{" "}
              <span className="serif-accent text-lime">où que vous soyez</span>
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-fog md:text-base">
              Grâce à une organisation 100% optimisée — visio, WhatsApp, téléphone —
              nous réalisons votre site où que vous soyez en France
              métropolitaine et dans les DOM-TOM, sans jamais perdre en
              proximité.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                { icon: Video, label: "Visio" },
                { icon: MessageCircle, label: "WhatsApp" },
                { icon: Phone, label: "Téléphone" },
              ].map((c) => (
                <span
                  key={c.label}
                  className="flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-milk/80"
                >
                  <c.icon className="h-3.5 w-3.5 text-lime" />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={() => goToBrief()}
              className="group flex shrink-0 items-center gap-3 rounded-full bg-lime px-8 py-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-lime-deep"
            >
              {CTA_LABEL}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
            </button>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}

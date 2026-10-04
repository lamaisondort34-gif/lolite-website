import { motion } from "framer-motion";
import { ArrowUpRight, Globe2, Mail, Phone, Video } from "lucide-react";
import { EASE_OUT, WA } from "../lib/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";

const SECTORS = [
  {
    img: "/images/sector-archi.jpg",
    title: "Architectes & Designers",
    desc: "Un book haut de gamme aux visuels épurés et percutants pour valoriser vos projets de construction et d'aménagement.",
  },
  {
    img: "/images/sector-coach.jpg",
    title: "Coachs & Bien-être",
    desc: "Présentez vos formules, vos tarifs et vos avis clients — avec réservation directe de vos séances en ligne.",
  },
  {
    img: "/images/sector-artisan.jpg",
    title: "Artisans & Restauration",
    desc: "Pâtissiers, menuisiers, restaurateurs : attirez une clientèle de proximité avec une vitrine claire et géolocalisée.",
  },
  {
    img: "/images/sector-liberal.jpg",
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
            className={`group relative overflow-hidden rounded-2xl border border-line ${
              i % 2 === 1 ? "lg:translate-y-10" : ""
            }`}
            data-cursor="hover"
          >
            <div className="relative aspect-[16/11] overflow-hidden">
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full border border-milk/20 bg-ink/50 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-milk backdrop-blur-md">
                0{i + 1}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <div className="mb-3 h-px w-10 bg-lime transition-all duration-500 group-hover:w-20" />
              <h3 className="font-display text-2xl font-bold tracking-tight text-milk md:text-3xl">
                {s.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-milk/70">
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
              Grâce à une organisation 100% optimisée — visio, WhatsApp, e-mail —
              nous réalisons votre site où que vous soyez en France
              métropolitaine et dans les DOM-TOM, sans jamais perdre en
              proximité.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                { icon: Video, label: "Visio" },
                { icon: Phone, label: "WhatsApp" },
                { icon: Mail, label: "E-mail" },
              ].map((c) => (
                <span
                  key={c.label}
                  className="flex items-center gap-2 rounded-full border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-milk/80"
                >
                  <c.icon className="h-3.5 w-3.5 text-lime" />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
          <Magnetic strength={0.25}>
            <a
              href={WA.projet}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex shrink-0 items-center gap-3 rounded-full bg-lime px-8 py-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-lime-deep"
            >
              Discuter de mon projet
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}

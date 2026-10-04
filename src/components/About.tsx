import { motion } from "framer-motion";
import { ArrowUpRight, Fingerprint, MapPin, Timer } from "lucide-react";
import { CTA_LABEL, EASE_OUT, goToBrief } from "../lib/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";

const VALUES = [
  {
    icon: Timer,
    title: "Réactivité 24–48h",
    desc: "Une réponse rapide à chaque question, tout au long du projet.",
  },
  {
    icon: Fingerprint,
    title: "100% sur-mesure",
    desc: "Aucun modèle générique : votre identité est unique, votre site aussi.",
  },
];

export function About() {
  return (
    <section id="apropos" className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
      <SectionHeading
        index="06"
        eyebrow="Le studio"
        title={
          <>
            Un studio, <br />
            <span className="serif-accent text-lime">une conviction</span>
          </>
        }
      />

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <p className="text-lg leading-relaxed text-milk md:text-xl">
              Basé à <span className="text-lime">Montpellier</span>, LOLITE est
              né d'une conviction simple : chaque professionnel mérite un site
              internet moderne, esthétique et performant —{" "}
              <em className="not-italic text-fog">
                sans processus interminable ni tarif exorbitant.
              </em>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-base leading-relaxed text-fog">
              Nous combinons création visuelle sur-mesure, écriture optimisée et
              technologies récentes pour vous livrer un outil clé-en-main en{" "}
              <span className="text-milk">1 à 2 semaines seulement</span>.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={0.15 + i * 0.1}>
                <div
                  className="group h-full rounded-2xl border border-line bg-coal p-6 transition-colors duration-500 hover:border-lime/40"
                  data-cursor="hover"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-lime/10 text-lime transition-transform duration-500 group-hover:scale-110">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-milk">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">
                    {v.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: EASE_OUT }}
          className="relative"
        >
          <div className="group overflow-hidden rounded-2xl border border-line">
            <img
              src="/images/about-studio-800.webp"
              srcSet="/images/about-studio-800.webp 800w, /images/about-studio.webp 1400w"
              sizes="(min-width: 1024px) 50vw, 100vw"
              width={1400}
              height={1050}
              alt="Bureau lumineux avec un écran affichant la maquette d'un site d'agence web"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
            />
          </div>
          <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-line bg-coal/95 px-6 py-4 backdrop-blur-md md:-left-8 md:left-auto md:-right-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-lime text-white">
              <MapPin className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-display text-sm font-bold uppercase text-milk">
                Montpellier
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog">
                France & DOM-TOM
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <Reveal delay={0.1}>
        <div className="mt-16 flex flex-col items-center gap-5 text-center md:mt-20">
          <p className="max-w-lg text-base text-fog">
            Envie d'en savoir plus sur notre approche ? Discutons de votre
            projet, c'est gratuit et sans engagement.
          </p>
          <Magnetic strength={0.25}>
            <button
              type="button"
              onClick={() => goToBrief()}
              className="group flex items-center gap-3 rounded-full bg-lime px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-lime-deep"
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

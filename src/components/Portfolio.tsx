import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Globe,
  Lock,
  Quote,
  Star,
} from "lucide-react";
import { CTA_LABEL, EASE_OUT, goToBrief } from "../lib/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";

const TAGS = [
  "Site vitrine sur-mesure",
  "Devis & RDV en ligne",
  "SEO local Montpellier",
  "Livré en 10 jours",
];

const STATS = [
  { value: "10", unit: "jours", label: "Délai de livraison" },
  { value: "7j/7", unit: "", label: "Prise de RDV visible" },
  { value: "100", unit: "%", label: "Sur-mesure & responsive" },
];

export function Portfolio() {
  return (
    <section id="realisations" className="relative border-y border-line bg-coal">
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[520px] rounded-full bg-lime/[0.06] blur-[130px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <SectionHeading
          index="04"
          eyebrow="Réalisations"
          title={
            <>
              Des projets qui <br />
              <span className="serif-accent text-lime">parlent d'eux-mêmes</span>
            </>
          }
          description="Chaque site est une histoire. Découvrez comment nous transformons des savoir-faire locaux en présences digitales qui convertissent."
        />

        {/* ---- Case study ---- */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          {/* visual */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: EASE_OUT }}
            className="relative"
          >
            {/* browser frame */}
            <div
              className="relative overflow-hidden rounded-2xl border border-line bg-coal shadow-[0_30px_90px_rgba(76,29,149,0.14)]"
              data-cursor="hover"
            >
              <div className="flex items-center gap-3 border-b border-line bg-ink px-5 py-3.5">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </span>
                <span className="mx-auto flex items-center gap-2 rounded-full border border-line bg-coal px-4 py-1.5 font-mono text-[11px] tracking-[0.08em] text-fog">
                  <Lock className="h-3 w-3 text-lime" />
                  toutneuf34.com
                </span>
                <span className="w-10" />
              </div>
              <div className="group overflow-hidden">
                <img
                  src="/images/work-toutneuf-desktop-800.webp"
                  srcSet="/images/work-toutneuf-desktop-800.webp 800w, /images/work-toutneuf-desktop.webp 1400w"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  width={1400}
                  height={788}
                  alt="Page d'accueil du site Toutneuf34 sur ordinateur : « Un intérieur comme neuf, ça change tout », nettoyage professionnel à Montpellier"
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
              </div>
            </div>

            {/* secondary shot */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-12 right-2 w-[28%] max-w-[190px] overflow-hidden rounded-[1.4rem] border-[5px] border-milk bg-milk shadow-[0_24px_60px_rgba(76,29,149,0.25)] md:-right-8"
            >
              <img
                src="/images/work-toutneuf-mobile.webp"
                width={390}
                height={690}
                alt="Le même site Toutneuf34 affiché sur smartphone, version responsive"
                loading="lazy"
                decoding="async"
                className="aspect-[390/690] w-full rounded-[1rem] object-cover object-top"
              />
            </motion.div>

            {/* badge */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute -left-3 top-16 rounded-xl border border-line bg-coal/95 px-4 py-3 shadow-[0_16px_50px_rgba(76,29,149,0.12)] backdrop-blur-md md:-left-8"
            >
              <p className="font-display text-lg font-extrabold text-lime">2026</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fog">
                Étude de cas
              </p>
            </motion.div>
          </motion.div>

          {/* text */}
          <div className="max-lg:mt-8">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-fog">
                <Globe className="h-4 w-4 text-lime" />
                Nettoyage écologique à domicile — Montpellier
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h3 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-milk md:text-6xl">
                Toutneuf34<span className="text-lime">.</span>
              </h3>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-5 text-base leading-relaxed text-fog md:text-lg">
                Site vitrine complet pour{" "}
                <span className="text-milk">Toutneuf34</span>, service de
                nettoyage professionnel écologique : canapés, matelas, tapis et
                intérieurs de véhicules. Présentation claire des formules, devis
                gratuit en ligne et référencement local pour remplir son agenda
                — 7 jours sur 7.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {TAGS.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-milk/80 transition-colors duration-300 hover:border-lime/50"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.26}>
              <div className="mt-9 grid grid-cols-3 gap-4 border-y border-line py-7 sm:gap-6">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-2xl font-extrabold text-milk sm:text-3xl md:text-4xl">
                      {s.value}
                      <span className="text-lime">{s.unit}</span>
                    </p>
                    <p className="mt-1.5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-fog md:text-[11px]">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Magnetic strength={0.25}>
                  <a
                    href="https://toutneuf34.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 rounded-full border border-milk px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-milk transition-colors duration-300 hover:bg-milk hover:text-white"
                  >
                    Visiter toutneuf34.com
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </Magnetic>
                <button
                  type="button"
                  onClick={() => goToBrief()}
                  className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-lime-deep"
                >
                  {CTA_LABEL}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ---- Testimonial ---- */}
        <Reveal delay={0.1}>
          <figure className="relative mt-24 overflow-hidden rounded-3xl border border-line bg-carbon p-8 md:mt-32 md:p-14">
            <Quote
              className="absolute -right-6 -top-6 h-40 w-40 rotate-12 text-lime/10"
              strokeWidth={1}
            />
            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-lime text-lime" />
                  ))}
                </div>
                <span className="flex items-center gap-2 rounded-full border border-line bg-coal px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fog">
                  <BadgeCheck className="h-3.5 w-3.5 text-lime" />
                  Avis client vérifié
                </span>
              </div>

              <blockquote className="mt-8 max-w-4xl font-serif text-2xl italic leading-snug text-milk md:text-[2.6rem] md:leading-[1.25]">
                « LOLITE a livré notre site en moins de deux semaines, exactement
                comme on l'imaginait. Les clients nous trouvent désormais sur
                Google et demandent leur devis directement en ligne. Rapide,
                professionnel, sans prise de tête —{" "}
                <span className="text-lime">je recommande les yeux fermés.</span> »
              </blockquote>

              <figcaption className="mt-9 flex items-center gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-lime font-display text-base font-extrabold text-white">
                  T34
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-milk">
                    Le gérant — Toutneuf34
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fog">
                    Nettoyage écologique · Montpellier
                  </p>
                </div>
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

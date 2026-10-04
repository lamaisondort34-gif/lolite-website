import { motion } from "framer-motion";
import { ArrowUpRight, Check, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { CTA_LABEL, EASE_OUT, goToBrief } from "../lib/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const PLANS = [
  {
    icon: Zap,
    name: "Formule Vitrine",
    tag: "Livraison 1–2 sem.",
    desc: "Parfait pour lancer votre présence en ligne avec professionnalisme.",
    price: "450 €",
    suffix: "",
    prefix: "À partir de",
    features: [
      "Design 100% sur-mesure & responsive",
      "Présentation activité & services",
      "Formulaire de contact + Google Maps",
      "SEO de base & certificat SSL",
      "Optimisé smartphone & tablette",
      "Devis gratuit, réponse 24–48h",
    ],
    preset: { type: "Site vitrine", budget: "< 500 €" },
    featured: false,
  },
  {
    icon: Sparkles,
    name: "Complet & Avancé",
    tag: "Livraison 1–2 sem.",
    desc: "Pour les entreprises qui veulent se démarquer et générer des prospects qualifiés.",
    price: "800 €",
    suffix: "",
    prefix: "À partir de",
    features: [
      "Tout le pack Essentiel inclus",
      "Design haut de gamme + animations fluides",
      "Architecture multi-pages complète",
      "Réservation en ligne ou e-commerce",
      "SEO avancé & fiche Google Business",
      "Interface d'admin — autonomie totale",
    ],
    preset: { type: "Site vitrine", budget: "500 – 1 000 €" },
    featured: true,
  },
  {
    icon: ShieldCheck,
    name: "Sérénité Totale",
    tag: "Abonnement",
    desc: "La tranquillité d'esprit pour garder votre site performant au quotidien.",
    price: "50 €",
    suffix: " / mois",
    prefix: "À partir de",
    features: [
      "Hébergement haute vitesse sécurisé",
      "Sauvegardes automatiques hebdo",
      "Mises à jour de sécurité régulières",
      "Petites modifs de contenu incluses",
      "Support prioritaire sous 24h",
    ],
    preset: { type: "Maintenance" },
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="tarifs" className="relative overflow-hidden border-y border-line bg-coal">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-lime/[0.05] blur-[130px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <SectionHeading
          index="05"
          eyebrow="Tarifs"
          align="center"
          title={
            <>
              Des prix clairs, <br />
              <span className="serif-accent text-lime">zéro surprise</span>
            </>
          }
          description="Aucun frais caché. Devis 100% gratuit et réponse garantie sous 24 à 48h — promis."
        />

        <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((p, i) => {
            const Icon = p.icon;
            const featured = p.featured;
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.12 }}
                className={`relative flex flex-col rounded-3xl p-8 md:p-10 ${
                  featured
                    ? "bg-lime text-white lg:-my-5 lg:py-14"
                    : "border border-line bg-ink text-milk"
                }`}
                data-cursor="hover"
              >
                {featured && (
                  <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-milk px-5 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white shadow-[0_8px_24px_rgba(76,29,149,0.25)]">
                    <Sparkles className="h-3 w-3 text-lime" />
                    Recommandé
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${
                      featured ? "bg-white/20 text-white" : "bg-lime/10 text-lime"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.2em] ${
                      featured ? "text-white/90" : "text-fog"
                    }`}
                  >
                    {p.tag}
                  </span>
                </div>

                <h3 className="mt-7 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                  {p.name}
                </h3>
                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    featured ? "text-white/90" : "text-fog"
                  }`}
                >
                  {p.desc}
                </p>

                <div className="mt-7">
                  <div
                    className={`flex w-full items-end justify-between gap-3 border-t pt-6 ${
                      featured ? "border-white/20" : "border-line"
                    }`}
                  >
                    <div>
                      <p
                        className={`font-mono text-[11px] uppercase tracking-[0.2em] ${
                          featured ? "text-white/90" : "text-fog"
                        }`}
                      >
                        {p.prefix}
                      </p>
                      <p className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">
                        {p.price}
                        {p.suffix && (
                          <span className="text-lg font-bold">{p.suffix}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="mt-7 flex flex-col gap-3.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                          featured ? "bg-white/20 text-white" : "bg-lime/15 text-lime"
                        }`}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className={featured ? "text-white/85" : "text-milk/85"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => goToBrief(p.preset)}
                  aria-label={`${CTA_LABEL} — ${p.name}`}
                  className={`group mt-9 flex items-center justify-center gap-2.5 rounded-full py-4.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
                    featured
                      ? "bg-white text-lime hover:bg-white/90"
                      : "border border-line text-milk hover:border-lime hover:bg-lime hover:text-white"
                  } mt-auto`}
                >
                  {CTA_LABEL}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </button>
              </motion.div>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-14 max-w-xl text-center font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-fog">
            Aucun frais caché · Devis 100% gratuit · Réponse sous 24–48h
          </p>
        </Reveal>
      </div>
    </section>
  );
}

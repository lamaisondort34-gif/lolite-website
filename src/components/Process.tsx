import { motion } from "framer-motion";
import { Code2, MessagesSquare, Rocket, Search } from "lucide-react";
import { EASE_OUT } from "../lib/site";
import { SectionHeading } from "./SectionHeading";

const STEPS = [
  {
    icon: MessagesSquare,
    num: "01",
    title: "Brief & devis",
    desc: "Vous remplissez le brief ou nous échangeons sur WhatsApp. Devis détaillé et 100% gratuit sous 24–48h.",
    meta: "Jour 1",
  },
  {
    icon: Search,
    num: "02",
    title: "Design sur-mesure",
    desc: "Nous créons une maquette unique qui reflète votre identité — aucun modèle générique, jamais.",
    meta: "Jours 2–5",
  },
  {
    icon: Code2,
    num: "03",
    title: "Développement",
    desc: "Intégration soignée, contenus optimisés, site ultra-rapide et parfait sur mobile comme sur desktop.",
    meta: "Jours 5–10",
  },
  {
    icon: Rocket,
    num: "04",
    title: "Lancement & suivi",
    desc: "Mise en ligne, SEO local, formation à la prise en main. Vous êtes autonome, on reste disponible.",
    meta: "Jour 14",
  },
];

export function Process() {
  return (
    <section id="methode" className="relative border-y border-line bg-coal">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <SectionHeading
          index="02"
          eyebrow="La méthode"
          title={
            <>
              De l'idée au site <br />
              <span className="serif-accent text-lime">en quatre étapes</span>
            </>
          }
          description="Un processus rodé, sans réunion interminable : vous savez toujours où en est votre projet, du premier message à la mise en ligne."
        />

        <div className="grid gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.12 }}
                className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden bg-coal p-7 transition-colors duration-500 hover:bg-carbon md:p-9"
                data-cursor="hover"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-6xl font-extrabold text-stroke-thin transition-colors duration-500 group-hover:text-lime group-hover:[-webkit-text-stroke:0px]">
                    {s.num}
                  </span>
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-line text-fog transition-all duration-500 group-hover:border-lime group-hover:text-lime">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <div>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-lime">
                    {s.meta}
                  </p>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-milk">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-fog">
                    {s.desc}
                  </p>
                </div>
                <span className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-lime transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { CTA_LABEL, EASE, EASE_OUT, goToBrief, scrollTo } from "../lib/site";
import { Magnetic } from "./Magnetic";
import { LineReveal } from "./Reveal";

const STATS = [
  { value: "1–2", unit: "sem.", label: "Semaines de délai" },
  { value: "24–48", unit: "h", label: "Réponse garantie" },
  { value: "100", unit: "%", label: "Design sur-mesure" },
  { value: "0", unit: "€", label: "Devis & audit initial" },
];

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="bg-grid relative flex min-h-svh flex-col overflow-hidden pt-[72px]"
    >
      {/* glow */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-lime/[0.055] blur-[120px]" />
      <div className="pointer-events-none absolute -left-52 top-[45svh] h-[480px] w-[480px] rounded-full bg-lime/[0.04] blur-[120px]" />

      <motion.div
        style={{ opacity }}
        className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-5 md:px-10"
      >
        {/* top eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5 md:mt-12"
        >
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-fog">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-pulse-dot rounded-full bg-lime" />
            </span>
            Studio web indépendant — Montpellier
          </div>
          <div className="hidden font-mono text-[11px] uppercase tracking-[0.24em] text-fog md:block">
            France entière · DOM-TOM · 100% à distance
          </div>
        </motion.div>

        <div className="grid flex-1 grid-cols-1 items-center gap-10 py-10 lg:grid-cols-[1.35fr_1fr] lg:gap-6">
          {/* headline */}
          <motion.div style={{ y: yText }}>
            <h1 className="font-display font-extrabold leading-[0.96] tracking-tight text-milk">
              <LineReveal animate={ready} delay={0.45}>
                <span className="text-[clamp(3rem,9vw,8.25rem)]">
                  Des sites web
                </span>
              </LineReveal>
              <LineReveal animate={ready} delay={0.55} className="pb-[0.14em] -mb-[0.14em]">
                <span className="serif-accent text-[clamp(3.3rem,10vw,9.25rem)] font-normal normal-case text-lime">
                  d'exception,
                </span>
              </LineReveal>
              <LineReveal animate={ready} delay={0.65}>
                <span className="text-[clamp(3rem,9vw,8.25rem)]">
                  livrés en{" "}
                  <span className="relative inline-block whitespace-nowrap">
                    14 jours
                    <motion.svg
                      viewBox="0 0 220 12"
                      className="absolute -bottom-1 left-0 w-full text-lime"
                      initial={{ pathLength: 0 }}
                    >
                      <motion.path
                        d="M4 9 C 60 2, 160 2, 216 7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={ready ? { pathLength: 1 } : {}}
                        transition={{ duration: 0.9, ease: EASE, delay: 1.4 }}
                      />
                    </motion.svg>
                  </span>
                </span>
              </LineReveal>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.95 }}
              className="mt-8 max-w-xl text-base leading-relaxed text-fog md:text-lg"
            >
              <span className="text-milk">LOLITE</span> conçoit des sites
              vitrines sur-mesure qui subliment votre savoir-faire. Design
              premium, SEO local inclus, zéro frais caché — et un devis gratuit
              sous 24 à 48h.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 1.1 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Magnetic strength={0.3}>
                <button
                  type="button"
                  onClick={() => goToBrief()}
                  className="group flex items-center gap-3 rounded-full bg-lime px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-lime-deep"
                >
                  {CTA_LABEL}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </button>
              </Magnetic>
              <a
                href="#tarifs"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#tarifs");
                }}
                className="group flex items-center gap-2 px-2 py-4 font-mono text-xs uppercase tracking-[0.18em] text-milk underline-offset-4 hover:underline"
              >
                Voir les tarifs
                <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true" />
              </a>
            </motion.div>
          </motion.div>

          {/* visual */}
          <motion.div
            style={{ y: yImg }}
            initial={{ opacity: 0, scale: 0.92, rotate: 6 }}
            animate={ready ? { opacity: 1, scale: 1, rotate: 3 } : {}}
            transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.8 }}
            className="relative mx-auto hidden w-full max-w-[440px] lg:block"
          >
            <div className="relative overflow-hidden rounded-2xl border border-line bg-coal shadow-[0_30px_80px_rgba(76,29,149,0.14)]">
              <img
                src="/images/hero-visual-800.webp"
                srcSet="/images/hero-visual-800.webp 800w, /images/hero-visual.webp 1400w"
                sizes="440px"
                width={800}
                height={1000}
                fetchPriority="high"
                decoding="async"
                alt="Ruban de verre violet en mouvement, visuel de l'identité LOLITE"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-milk/80">
                <span>Design LOLITE</span>
                <span>Sur-mesure</span>
              </div>
            </div>

            {/* floating badges */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-14 top-10 rounded-xl border border-line bg-coal/95 px-5 py-4 shadow-[0_16px_50px_rgba(76,29,149,0.12)] backdrop-blur-md"
            >
              <p className="font-display text-2xl font-bold text-lime">1–2 sem.</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                Livraison express
              </p>
            </motion.div>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -right-8 bottom-24 rounded-xl border border-line bg-coal/95 px-5 py-4 shadow-[0_16px_50px_rgba(76,29,149,0.12)] backdrop-blur-md"
            >
              <p className="font-display text-2xl font-bold text-milk">SEO</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                Local inclus
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.35 }}
          className="grid grid-cols-2 border-t border-line lg:grid-cols-4"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 1.4 + i * 0.1 }}
              className={`flex flex-col gap-1 py-6 pr-4 md:py-8 ${
                i > 0 ? "border-l border-line pl-5 md:pl-8" : ""
              } ${i === 2 ? "max-lg:border-l-0 max-lg:pl-0" : ""}`}
            >
              <p className="font-display text-3xl font-extrabold text-milk md:text-5xl">
                {s.value}
                <span className="text-lime">{s.unit}</span>
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fog md:text-[11px]">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

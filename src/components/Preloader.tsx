import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "../lib/site";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setLeaving(true);
        setTimeout(onDone, 700);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[400] flex flex-col justify-between overflow-hidden bg-ink px-6 py-6 md:px-10 md:py-8"
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-fog">
        <span>Studio web — Montpellier</span>
        <span className="hidden sm:block">Chargement de l'expérience</span>
        <span>EST. 2026</span>
      </div>

      <div className="flex items-center justify-center">
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="flex flex-col items-center"
          >
            <img
              src="/images/logo-lolite.webp"
              alt="LOLITE Web Agency"
              width={547} height={520} className="h-[28vw] max-h-[260px] w-auto sm:h-[22vw]"
              draggable={false}
            />
          </motion.div>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <p className="max-w-[220px] font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-fog">
          Sites vitrines d'exception — livrés en 1 à 2 semaines
        </p>
        <span className="font-display text-6xl font-bold tabular-nums text-lime md:text-8xl">
          {count}
          <span className="text-2xl align-top md:text-4xl">%</span>
        </span>
      </div>

      {/* progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[3px] bg-lime"
        style={{ width: `${count}%` }}
      />
    </motion.div>
  );
}

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { CTA_LABEL, EASE, goToBrief, scrollTo } from "../lib/site";
import { Magnetic } from "./Magnetic";
import { Logo } from "./Logo";

const LINKS = [
  { label: "Expertises", href: "#services" },
  { label: "Méthode", href: "#methode" },
  { label: "Pour qui", href: "#pour-qui" },
  { label: "Réalisations", href: "#realisations" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "FAQ", href: "#faq" },
];

export function Nav({ ready }: { ready: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isHome = typeof window !== "undefined" && window.location.pathname === "/";

  // Sur l'accueil : scroll fluide. Ailleurs : vrai lien vers /#section.
  const go = (e: React.MouseEvent, href: string) => {
    if (!isHome) return;
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollTo(href), open ? 350 : 0);
  };

  const cta = () => {
    setOpen(false);
    setTimeout(() => goToBrief(), open ? 350 : 0);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-ink/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between px-5 md:px-10">
          <a
            href="/"
            onClick={(e) => {
              if (!isHome) return;
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-2.5"
            aria-label="LOLITE — accueil"
          >
            <Logo variant="full" size={36} />
          </a>

          <nav aria-label="Navigation principale" className="hidden items-center gap-6 xl:flex 2xl:gap-8">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={`/${l.href}`}
                onClick={(e) => go(e, l.href)}
                className="link-underline font-mono text-[11px] uppercase tracking-[0.22em] text-fog transition-colors hover:text-milk"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={cta}
                className="group flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-lime-deep"
              >
                {CTA_LABEL}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </button>
            </Magnetic>
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-milk xl:hidden"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              aria-controls="menu-mobile"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE }}
            id="menu-mobile"
            className="fixed inset-0 z-[90] flex flex-col justify-between overflow-y-auto bg-coal px-6 pb-10 pt-28"
          >
            <nav aria-label="Navigation mobile" className="flex flex-col gap-1">
              {LINKS.map((l, i) => (
                <div key={l.href} className="overflow-hidden">
                  <motion.a
                    href={`/${l.href}`}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.06 }}
                    onClick={(e) => {
                      if (isHome) go(e, l.href);
                      else setOpen(false);
                    }}
                    className="flex w-full items-baseline gap-4 border-b border-line py-4 text-left"
                  >
                    <span className="font-mono text-xs text-lime">
                      0{i + 1}
                    </span>
                    <span className="font-display text-3xl font-bold text-milk sm:text-4xl">
                      {l.label}
                    </span>
                  </motion.a>
                </div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <button
                type="button"
                onClick={cta}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-lime py-4 font-mono text-xs uppercase tracking-[0.2em] text-white"
              >
                {CTA_LABEL}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

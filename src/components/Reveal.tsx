import { motion, useInView, type Variants } from "framer-motion";
import { useLayoutEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { EASE_OUT } from "../lib/site";

type Margin = NonNullable<Parameters<typeof useInView>[1]>["margin"];

/**
 * Apparition au scroll sans jamais masquer le texte dans le HTML : l'élément est rendu
 * visible (prérendu, sans JavaScript, animations réduites) et n'est masqué qu'une fois la
 * page affichée, s'il est encore sous la ligne de flottaison — il apparaît alors au scroll.
 */
function useReveal<T extends HTMLElement>(margin: Margin, observeParent = false) {
  const ref = useRef<T>(null);
  const target = useRef<HTMLElement | null>(null);
  const inView = useInView(target, { once: true, margin });
  const [armed, setArmed] = useState(false);

  useLayoutEffect(() => {
    const el = observeParent ? ref.current?.parentElement : ref.current;
    target.current = el ?? null;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
  }, [observeParent]);

  return { ref, animate: armed && !inView ? "hidden" : "visible" };
}

const TAGS = { div: motion.div, article: motion.article, p: motion.p };

export function Reveal({
  children,
  delay = 0,
  duration = 1,
  from = { y: 44 },
  margin = "-60px",
  as = "div",
  observeParent = false,
  className,
  "data-cursor": cursor,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  /** État de départ de l'animation (en plus de l'opacité 0). */
  from?: { y?: number; scale?: number };
  margin?: Margin;
  as?: keyof typeof TAGS;
  /** Observer le parent : utile quand un cadre overflow-hidden rogne l'élément décalé. */
  observeParent?: boolean;
  className?: string;
  "data-cursor"?: string;
}) {
  const { ref, animate } = useReveal<HTMLElement>(margin, observeParent);
  const Tag = TAGS[as] as typeof motion.div;
  const variants: Variants = {
    hidden: { opacity: 0, ...from, transition: { duration: 0 } },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration, ease: EASE_OUT, delay } },
  };

  return (
    <Tag
      ref={ref as Ref<HTMLDivElement>}
      className={className}
      data-cursor={cursor}
      variants={variants}
      initial={false}
      animate={animate}
    >
      {children}
    </Tag>
  );
}

const lineVariants: Variants = {
  hidden: { y: "110%", rotate: 2, transition: { duration: 0 } },
  visible: (delay: number) => ({ y: "0%", rotate: 0, transition: { duration: 1.1, ease: EASE_OUT, delay } }),
};

/** Masked line reveal for big headings */
export function LineReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  // Observé sur le masque (non déplacé) : la ligne, elle, sort du cadre quand elle est masquée.
  const { ref, animate } = useReveal<HTMLSpanElement>("-40px");
  return (
    <span ref={ref} className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block will-change-transform"
        variants={lineVariants}
        custom={delay}
        initial={false}
        animate={animate}
      >
        {children}
      </motion.span>
    </span>
  );
}

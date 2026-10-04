import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT } from "../lib/site";

const variants: Variants = {
  hidden: { y: 44, opacity: 0 },
  visible: (delay: number = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: EASE_OUT, delay },
  }),
};

export function Reveal({
  children,
  delay = 0,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

/** Masked line reveal for big headings */
export function LineReveal({
  children,
  delay = 0,
  className,
  animate = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "110%", rotate: 2 }}
        animate={animate ? { y: "0%", rotate: 0 } : undefined}
        whileInView={animate ? undefined : { y: "0%", rotate: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.1, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

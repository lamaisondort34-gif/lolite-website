import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { LineReveal, Reveal } from "./Reveal";

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div
      className={`mb-14 md:mb-20 ${centered ? "flex flex-col items-center text-center" : ""}`}
    >
      <Reveal>
        <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-fog">
          <span className="text-lime">({index})</span>
          <span className="h-px w-10 bg-line" />
          <span>{eyebrow}</span>
        </div>
      </Reveal>
      <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.6rem)] font-extrabold leading-[1.02] tracking-tight text-milk">
        <LineReveal>{title}</LineReveal>
      </h2>
      {description && (
        <Reveal delay={0.15}>
          <p
            className={`mt-6 max-w-2xl text-base leading-relaxed text-fog md:text-lg ${centered ? "mx-auto" : ""}`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-fog transition-colors duration-300 hover:border-lime/50 hover:text-milk">
      <ArrowUpRight className="h-3 w-3 text-lime" />
      {children}
    </span>
  );
}

import { Asterisk } from "lucide-react";

const ITEMS = [
  "100% sur-mesure",
  "Livraison 1–2 semaines",
  "SEO local inclus",
  "Devis gratuit 48h",
  "Design responsive",
  "Zéro frais caché",
];

export function Marquee({
  reverse = false,
  className = "",
  slow = false,
}: {
  reverse?: boolean;
  className?: string;
  slow?: boolean;
}) {
  const row = (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span key={item} className="flex items-center">
          <span
            className={`whitespace-nowrap px-6 md:px-10 ${
              i % 2 === 1
                ? "serif-accent pt-1 text-2xl text-lime md:text-[2.6rem]"
                : "font-display text-2xl font-bold tracking-tight text-milk md:text-4xl"
            }`}
          >
            {item}
          </span>
          <Asterisk className="h-6 w-6 shrink-0 text-lime md:h-8 md:w-8" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`relative overflow-hidden border-y border-line bg-coal py-5 md:py-6 ${className}`}
    >
      <div
        className={`flex w-max ${slow ? "animate-marquee-slow" : "animate-marquee"}`}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {row}
        {row}
      </div>
    </div>
  );
}

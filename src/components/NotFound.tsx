import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CTA_LABEL, goToBrief } from "../lib/site";

const LINKS = [
  { label: "Nos expertises", href: "/#services" },
  { label: "Nos tarifs", href: "/#tarifs" },
  { label: "Nos réalisations", href: "/#realisations" },
  { label: "FAQ", href: "/#faq" },
];

export function NotFound() {
  return (
    <main
      id="contenu"
      className="bg-grid relative mx-auto flex min-h-svh max-w-[1600px] flex-col items-start justify-center px-5 pb-24 pt-32 md:px-10"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-lime">Erreur 404</p>
      <h1 className="mt-4 font-display text-[clamp(3rem,10vw,8rem)] font-extrabold leading-[0.95] tracking-tight text-milk">
        Page <span className="serif-accent font-normal text-lime">introuvable</span>
      </h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-fog md:text-lg">
        Cette page n'existe pas ou a été déplacée. Pas de panique : tout ce
        qu'il vous faut est à un clic.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => goToBrief()}
          className="group flex items-center gap-3 rounded-full bg-lime px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-lime-deep"
        >
          {CTA_LABEL}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <a
          href="/"
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-milk underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour à l'accueil
        </a>
      </div>

      <nav aria-label="Pages utiles" className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="link-underline text-sm text-fog hover:text-milk">
            {l.label}
          </a>
        ))}
      </nav>
    </main>
  );
}

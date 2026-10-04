import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { LEGAL } from "../lib/site";

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main id="contenu" className="mx-auto max-w-[1600px] px-5 pb-24 pt-32 md:px-10 md:pb-36 md:pt-40">
      <a
        href="/"
        className="mb-10 inline-flex items-center gap-2 text-sm text-fog transition-colors hover:text-milk"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Retour à l'accueil
      </a>

      <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-milk md:text-6xl">
        {title}
      </h1>
      <p className="mb-12 text-sm text-fog">Dernière mise à jour : {LEGAL.updated}</p>

      <div className="legal max-w-3xl">{children}</div>
    </main>
  );
}

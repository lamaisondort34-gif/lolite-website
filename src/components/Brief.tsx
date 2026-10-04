import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Send,
} from "lucide-react";
import { waLink, WA, WA_DISPLAY } from "../lib/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const PROJECT_TYPES = ["Site vitrine", "Portfolio", "Réservation / RDV", "Refonte", "Autre"];
const BUDGETS = ["< 500 €", "500 – 1 000 €", "> 1 000 €", "Je ne sais pas encore"];

const inputCls =
  "w-full rounded-xl border border-line bg-coal px-5 py-4 text-sm text-milk placeholder:text-fog/60 transition-all duration-300 focus:border-lime/60 focus:bg-carbon";

export function Brief() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState(PROJECT_TYPES[0]);
  const [budget, setBudget] = useState(BUDGETS[3]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = [
      `Bonjour LOLITE, je suis ${name || "…"}.`,
      `Projet : ${type}.`,
      `Budget : ${budget}.`,
      message ? `Détails : ${message}` : "",
      contact ? `Me recontacter : ${contact}` : "",
      "Je souhaite recevoir un devis gratuit.",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(waLink(text), "_blank", "noopener,noreferrer");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="brief" className="relative overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-lime/[0.05] blur-[130px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <SectionHeading
          index="07"
          eyebrow="Brief express"
          title={
            <>
              Lancez votre projet <br />
              <span className="serif-accent text-lime">en 2 minutes</span>
            </>
          }
          description="Répondez à ces quelques points clés et recevez un devis gratuit ultra-précis sous 24 à 48h — directement sur WhatsApp."
        />

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* form */}
          <Reveal>
            <form
              onSubmit={submit}
              className="rounded-3xl border border-line bg-ink p-7 md:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
                    Votre nom *
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marie Dupont"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
                    E-mail ou téléphone *
                  </label>
                  <input
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="marie@exemple.fr"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="mt-7">
                <label className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
                  Type de projet
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {PROJECT_TYPES.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setType(t)}
                      className={`rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-300 ${
                        type === t
                          ? "border-lime bg-lime text-white"
                          : "border-line text-fog hover:border-fog hover:text-milk"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <label className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
                  Budget envisagé
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {BUDGETS.map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-300 ${
                        budget === b
                          ? "border-lime bg-lime text-white"
                          : "border-line text-fog hover:border-fog hover:text-milk"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
                  Votre projet en quelques mots
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Parlez-nous de votre activité, de vos envies, de vos exemples préférés…"
                  className={`${inputCls} resize-none`}
                />
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className={`group mt-8 flex w-full items-center justify-center gap-3 rounded-full py-5 font-mono text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                  sent
                    ? "bg-milk text-white"
                    : "bg-lime text-white hover:bg-lime-deep"
                }`}
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Brief envoyé sur WhatsApp
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer mon brief — devis sous 48h
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </>
                )}
              </motion.button>
            </form>
          </Reveal>

          {/* side card */}
          <Reveal delay={0.15}>
            <div className="flex h-full flex-col gap-5">
              <a
                href={WA.devis}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 flex-col justify-between rounded-3xl bg-lime p-8 text-white transition-colors duration-300 hover:bg-lime-deep md:p-10"
                data-cursor="hover"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-lime">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div className="mt-10">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
                    Le plus rapide
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight">
                    WhatsApp direct
                  </h3>
                  <p className="mt-3 text-sm text-white/70">
                    Une question, un doute ? Écrivez-nous, on répond vite.
                  </p>
                  <p className="mt-5 flex items-center gap-2 font-display text-xl font-bold">
                    {WA_DISPLAY}
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </p>
                </div>
              </a>

              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-3xl border border-line bg-coal p-6">
                  <Clock3 className="h-5 w-5 text-lime" />
                  <p className="mt-4 font-display text-2xl font-extrabold text-milk">
                    24–48h
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
                    Réponse garantie
                  </p>
                </div>
                <div className="rounded-3xl border border-line bg-coal p-6">
                  <CheckCircle2 className="h-5 w-5 text-lime" />
                  <p className="mt-4 font-display text-2xl font-extrabold text-milk">
                    0 €
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-fog">
                    Devis sans engagement
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Send,
} from "lucide-react";
import { waLink, WA, WA_DISPLAY, CTA_LABEL, type BriefPreset } from "../lib/site";
import { track } from "../lib/analytics";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const PROJECT_TYPES = ["Site vitrine", "Portfolio", "Réservation / RDV", "Refonte", "Maintenance", "Autre"];
const BUDGETS = ["< 500 €", "500 – 1 000 €", "> 1 000 €", "Je ne sais pas encore"];

const NAME_MAX = 80;
const MESSAGE_MAX = 1000;
// Un humain met plus de 3 s à remplir le brief ; un robot, non.
const MIN_FILL_MS = 3000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9]{9,15}$/;

type Field = "name" | "contact" | "message";
type Errors = Partial<Record<Field, string>>;

function validate(name: string, contact: string, message: string): Errors {
  const errors: Errors = {};
  const n = name.trim();
  if (n.length < 2) errors.name = "Indiquez votre nom (2 caractères minimum).";
  else if (n.length > NAME_MAX) errors.name = `${NAME_MAX} caractères maximum.`;
  else if (/[<>{}]|https?:\/\//i.test(n)) errors.name = "Ce nom contient des caractères non autorisés.";

  const c = contact.trim();
  const phone = c.replace(/[\s.\-()]/g, "");
  if (!c) errors.contact = "Indiquez un e-mail ou un numéro de téléphone pour qu'on puisse vous répondre.";
  else if (!EMAIL_RE.test(c) && !PHONE_RE.test(phone))
    errors.contact = "Format invalide. Exemple : marie@exemple.fr ou 06 12 34 56 78.";

  if (message.length > MESSAGE_MAX) errors.message = `${MESSAGE_MAX} caractères maximum.`;
  else if ((message.match(/https?:\/\//gi) ?? []).length > 2)
    errors.message = "Merci de limiter le nombre de liens (2 maximum).";
  return errors;
}

/** Sauvegarde du lead dans Netlify Forms (filet de sécurité si WhatsApp n'est pas ouvert). */
function saveLead(data: Record<string, string>) {
  const body = new URLSearchParams({ "form-name": "brief", ...data }).toString();
  return fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  }).catch(() => undefined);
}

const inputCls =
  "w-full rounded-xl border bg-coal px-5 py-4 text-base text-milk placeholder:text-fog transition-all duration-300 focus:border-lime focus:bg-carbon md:text-sm";
const labelCls = "mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-fog";

export function Brief() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState(PROJECT_TYPES[0]);
  const [budget, setBudget] = useState(BUDGETS[3]);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [sent, setSent] = useState(false);
  const mountedAt = useRef(Date.now());
  const lastSent = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  // Pré-remplissage depuis un bouton « Demander mon devis gratuit » (ex. carte tarif).
  useEffect(() => {
    const onPreset = (e: Event) => {
      const { type: t, budget: b } = (e as CustomEvent<BriefPreset>).detail ?? {};
      if (t && PROJECT_TYPES.includes(t)) setType(t);
      if (b && BUDGETS.includes(b)) setBudget(b);
    };
    window.addEventListener("lolite:brief", onPreset);
    return () => window.removeEventListener("lolite:brief", onPreset);
  }, []);

  const showError = (f: Field) => (touched[f] ? errors[f] : undefined);

  const onBlur = (f: Field) => {
    setTouched((t) => ({ ...t, [f]: true }));
    setErrors(validate(name, contact, message));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();

    // Anti-spam : champ piège rempli, envoi trop rapide ou en rafale → on ignore en silence.
    const now = Date.now();
    const isBot = honeypot !== "" || now - mountedAt.current < MIN_FILL_MS;
    if (isBot || now - lastSent.current < 30_000) {
      setSent(true);
      setTimeout(() => setSent(false), 4000);
      return;
    }

    const errs = validate(name, contact, message);
    setErrors(errs);
    setTouched({ name: true, contact: true, message: true });
    const firstInvalid = (Object.keys(errs) as Field[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const clean = {
      name: name.trim(),
      contact: contact.trim(),
      type,
      budget,
      message: message.trim(),
    };
    const text = [
      `Bonjour LOLITE, je suis ${clean.name}.`,
      `Projet : ${clean.type}.`,
      `Budget : ${clean.budget}.`,
      clean.message ? `Détails : ${clean.message}` : "",
      `Me recontacter : ${clean.contact}`,
      "Je souhaite recevoir un devis gratuit.",
    ]
      .filter(Boolean)
      .join("\n");

    // window.open doit rester synchrone (sinon bloqué comme pop-up).
    window.open(waLink(text), "_blank", "noopener,noreferrer");
    saveLead(clean);
    track("generate_lead", { method: "brief_form", project_type: type, budget });

    lastSent.current = now;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const chip = (active: boolean) =>
    `rounded-full border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-300 ${
      active ? "border-lime bg-lime text-white" : "border-line text-fog hover:border-fog hover:text-milk"
    }`;

  return (
    <section id="brief" className="relative scroll-mt-20 overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-lime/[0.05] blur-[130px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <SectionHeading
          index="07"
          eyebrow="Devis gratuit"
          title={
            <>
              Lancez votre projet <br />
              <span className="serif-accent text-lime">en 2 minutes</span>
            </>
          }
          description="Répondez à ces quelques questions et recevez un devis gratuit et précis sous 24 à 48h, directement sur WhatsApp ou par e-mail."
        />

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <Reveal>
            <form
              ref={formRef}
              name="brief"
              onSubmit={submit}
              noValidate
              className="rounded-3xl border border-line bg-ink p-6 md:p-10"
            >
              {/* Champ piège anti-robots : invisible pour les humains. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="bf-website">Ne pas remplir ce champ</label>
                <input
                  id="bf-website"
                  name="bot-field"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="bf-name" className={labelCls}>
                    Votre nom *
                  </label>
                  <input
                    id="bf-name"
                    name="name"
                    autoComplete="name"
                    maxLength={NAME_MAX}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => onBlur("name")}
                    placeholder="Marie Dupont"
                    aria-required="true"
                    aria-invalid={!!showError("name")}
                    aria-describedby={showError("name") ? "bf-name-err" : undefined}
                    className={`${inputCls} ${showError("name") ? "border-red-600" : "border-line"}`}
                  />
                  {showError("name") && <FieldError id="bf-name-err">{errors.name}</FieldError>}
                </div>
                <div>
                  <label htmlFor="bf-contact" className={labelCls}>
                    E-mail ou téléphone *
                  </label>
                  <input
                    id="bf-contact"
                    name="contact"
                    autoComplete="email"
                    inputMode="email"
                    maxLength={120}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    onBlur={() => onBlur("contact")}
                    placeholder="marie@exemple.fr"
                    aria-required="true"
                    aria-invalid={!!showError("contact")}
                    aria-describedby={showError("contact") ? "bf-contact-err" : undefined}
                    className={`${inputCls} ${showError("contact") ? "border-red-600" : "border-line"}`}
                  />
                  {showError("contact") && <FieldError id="bf-contact-err">{errors.contact}</FieldError>}
                </div>
              </div>

              <fieldset className="mt-7">
                <legend className={labelCls}>Type de projet</legend>
                <div className="flex flex-wrap gap-2.5">
                  {PROJECT_TYPES.map((t) => (
                    <button type="button" key={t} aria-pressed={type === t} onClick={() => setType(t)} className={chip(type === t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-7">
                <legend className={labelCls}>Budget envisagé</legend>
                <div className="flex flex-wrap gap-2.5">
                  {BUDGETS.map((b) => (
                    <button type="button" key={b} aria-pressed={budget === b} onClick={() => setBudget(b)} className={chip(budget === b)}>
                      {b}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-7">
                <label htmlFor="bf-message" className={labelCls}>
                  Votre projet en quelques mots
                </label>
                <textarea
                  id="bf-message"
                  name="message"
                  rows={4}
                  maxLength={MESSAGE_MAX}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={() => onBlur("message")}
                  placeholder="Votre activité, vos envies, des sites que vous aimez…"
                  aria-invalid={!!showError("message")}
                  aria-describedby={showError("message") ? "bf-message-err bf-message-count" : "bf-message-count"}
                  className={`${inputCls} resize-none ${showError("message") ? "border-red-600" : "border-line"}`}
                />
                <div className="mt-1.5 flex justify-between gap-4">
                  {showError("message") ? <FieldError id="bf-message-err">{errors.message}</FieldError> : <span />}
                  <span id="bf-message-count" className="font-mono text-[11px] text-fog">
                    {message.length}/{MESSAGE_MAX}
                  </span>
                </div>
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                className={`group mt-8 flex w-full items-center justify-center gap-3 rounded-full px-4 py-5 text-center font-mono text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                  sent ? "bg-milk text-white" : "bg-lime text-white hover:bg-lime-deep"
                }`}
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    Demande envoyée — on vous répond sous 48h
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {CTA_LABEL}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                  </>
                )}
              </motion.button>
              <p className="mt-4 text-center text-xs leading-relaxed text-fog" role="status" aria-live="polite">
                {sent
                  ? "WhatsApp s'est ouvert avec votre brief pré-rempli : il ne reste qu'à appuyer sur Envoyer."
                  : <>Gratuit et sans engagement. Vos données servent uniquement à vous répondre (<a href="/confidentialite" className="underline">confidentialité</a>).</>}
              </p>
            </form>
          </Reveal>

          {/* Canal alternatif, volontairement secondaire pour ne pas concurrencer le CTA. */}
          <Reveal delay={0.15}>
            <div className="flex h-full flex-col gap-5">
              <a
                href={WA.devis}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("generate_lead", { method: "whatsapp_direct" })}
                className="group flex flex-1 flex-col justify-between rounded-3xl border border-line bg-coal p-8 transition-colors duration-300 hover:border-lime/50 md:p-10"
                data-cursor="hover"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lime/10 text-lime">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="mt-10">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fog">
                    Pas le temps de remplir ?
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-milk md:text-3xl">
                    Écrivez-nous sur WhatsApp
                  </h3>
                  <p className="mt-5 flex items-center gap-2 font-display text-xl font-bold text-lime">
                    {WA_DISPLAY}
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                  </p>
                </div>
              </a>

              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-3xl border border-line bg-coal p-6">
                  <Clock3 className="h-5 w-5 text-lime" aria-hidden="true" />
                  <p className="mt-4 font-display text-2xl font-extrabold text-milk">24–48h</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-fog">Délai de réponse</p>
                </div>
                <div className="rounded-3xl border border-line bg-coal p-6">
                  <CheckCircle2 className="h-5 w-5 text-lime" aria-hidden="true" />
                  <p className="mt-4 font-display text-2xl font-extrabold text-milk">0 €</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-fog">Devis sans engagement</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs text-red-700">
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

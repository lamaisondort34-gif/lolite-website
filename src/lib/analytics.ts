/**
 * Google Analytics 4, chargé UNIQUEMENT après consentement (exigence CNIL).
 *
 * L'identifiant de mesure n'est pas dans le code : il est lu depuis la variable
 * d'environnement VITE_GA_ID (à définir dans Netlify → Site configuration →
 * Environment variables). Sans cette variable, aucun traceur n'est chargé et le
 * bandeau cookies ne s'affiche pas (il n'y a alors rien à consentir).
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_ID: string = import.meta.env.VITE_GA_ID ?? "";
export const ANALYTICS_ENABLED = /^G-[A-Z0-9]+$/.test(GA_ID);

const CONSENT_KEY = "lolite-cookie-consent";
// La CNIL recommande de redemander le choix au bout de 6 mois.
const CONSENT_TTL_MS = 1000 * 60 * 60 * 24 * 182;

export type Consent = "accepted" | "refused";

export function getConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const { value, date } = JSON.parse(raw) as { value: Consent; date: number };
    if (Date.now() - date > CONSENT_TTL_MS) return null;
    return value;
  } catch {
    return null;
  }
}

export function setConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, date: Date.now() }));
  } catch {
    /* stockage indisponible (navigation privée) : on ne bloque pas */
  }
  if (value === "accepted") loadAnalytics();
  else clearAnalyticsCookies();
}

export function loadAnalytics() {
  if (!ANALYTICS_ENABLED || window.gtag) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
}

function clearAnalyticsCookies() {
  const host = window.location.hostname;
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (name.startsWith("_ga")) {
      for (const domain of [host, `.${host}`, `.${host.replace(/^www\./, "")}`]) {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
      }
      document.cookie = `${name}=; Max-Age=0; path=/`;
    }
  });
}

/** Événement GA4 — ne fait rien tant que l'utilisateur n'a pas accepté. */
export function track(event: string, params: Record<string, unknown> = {}) {
  window.gtag?.("event", event, params);
}

/** Rouvre le bandeau (lien « Gérer les cookies » du footer). */
export function openCookieSettings() {
  window.dispatchEvent(new Event("lolite:cookies"));
}

/**
 * Google Analytics 4, conforme aux recommandations CNIL :
 * - Google Consent Mode v2 : tout est refusé (« denied ») par défaut, dès l'arrivée ;
 * - le script Google n'est chargé QU'APRÈS « Accepter » : avant un choix ou en cas de refus,
 *   aucune requête vers Google et aucun cookie Google ;
 * - seule la mesure d'audience (analytics_storage) est accordée : publicité, signaux Google
 *   et personnalisation des annonces restent refusés ;
 * - cookies limités à 13 mois.
 *
 * L'ID de mesure n'est pas un secret : il figure en clair dans le code de tout site équipé de GA.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export const GA_ID = "G-Y6Y5L2TN5N";
// Désactivé en développement local (npm run dev) pour ne pas fausser les statistiques.
export const ANALYTICS_ENABLED = import.meta.env.PROD;

const CONSENT_KEY = "lolite-cookie-consent";
// La CNIL recommande de redemander le choix au bout de 6 mois…
const CONSENT_TTL_MS = 1000 * 60 * 60 * 24 * 182;
// … et de limiter la durée des cookies de mesure d'audience à 13 mois.
const COOKIE_EXPIRES_S = 60 * 60 * 24 * 395;

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
  if (value === "accepted") startAnalytics();
  else stopAnalytics();
}

/** File d'attente gtag, avec le Consent Mode v2 « tout refusé » déclaré en premier. */
function ensureGtag() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // gtag.js attend l'objet `arguments` lui-même, pas un tableau.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "denied",
  });
}

function gtag(...args: unknown[]) {
  ensureGtag();
  window.gtag!(...args);
}

let granted = false;
let listening = false;

/** Au chargement de chaque page : consentement par défaut, puis GA si le visiteur a déjà accepté. */
export function initAnalytics() {
  if (!ANALYTICS_ENABLED) return;
  ensureGtag(); // déclare le « tout refusé », sans rien charger
  if (!listening) {
    document.addEventListener("click", onWhatsAppClick, { capture: true });
    listening = true;
  }
  if (getConsent() === "accepted") startAnalytics();
}

function startAnalytics() {
  if (!ANALYTICS_ENABLED) return;
  window[`ga-disable-${GA_ID}`] = false;
  gtag("consent", "update", { analytics_storage: "granted" });
  granted = true;
  if (document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]')) return;
  gtag("js", new Date());
  gtag("config", GA_ID, {
    cookie_expires: COOKIE_EXPIRES_S,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

function stopAnalytics() {
  granted = false;
  // Si GA était déjà chargé (accord retiré en cours de visite) : plus aucun envoi.
  window[`ga-disable-${GA_ID}`] = true;
  if (window.gtag) gtag("consent", "update", { analytics_storage: "denied" });
  clearAnalyticsCookies();
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

/** Événement GA4 — ne fait rien tant que le visiteur n'a pas accepté. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (granted) gtag("event", event, params);
}

/** Tous les liens WhatsApp du site (présents et futurs) → événement whatsapp_click. */
function onWhatsAppClick(e: MouseEvent) {
  const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="https://wa.me/"]');
  if (!link) return;
  track("whatsapp_click", {
    link_location:
      link.dataset.waLocation ?? link.closest("section[id]")?.id ?? (link.closest("footer") ? "footer" : "autre"),
  });
}

/** Rouvre le bandeau (lien « Gérer les cookies » du footer). */
export function openCookieSettings() {
  window.dispatchEvent(new Event("lolite:cookies"));
}

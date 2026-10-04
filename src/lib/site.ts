import Lenis from "lenis";

let lenis: Lenis | null = null;

export function initLenis() {
  if (lenis) return lenis;
  lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    wheelMultiplier: 1,
  });
  function raf(time: number) {
    lenis!.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  return lenis;
}

export function scrollTo(target: string) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -72, duration: 1.5 });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}

/* ---------- WhatsApp ---------- */

export const WA_NUMBER = "33663530157";
export const WA_DISPLAY = "+33 6 63 53 01 57";

export function waLink(message: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WA = {
  devis: waLink(
    "Bonjour LOLITE 👋, je souhaite obtenir un devis gratuit pour la création de mon site internet. Pouvez-vous me rappeler ou m'envoyer un devis ?"
  ),
  projet: waLink(
    "Bonjour LOLITE 👋, j'aimerais discuter de mon projet de site internet. Quand seriez-vous disponible pour un échange rapide ?"
  ),
  essentiel: waLink(
    "Bonjour LOLITE 👋, je suis intéressé(e) par la formule Vitrine Essentiel (à partir de 450 €). J'aimerais recevoir un devis gratuit adapté à mon activité."
  ),
  premium: waLink(
    "Bonjour LOLITE 👋, je suis intéressé(e) par la formule Complet & Avancé (à partir de 800 €). J'aimerais recevoir un devis gratuit personnalisé."
  ),
  maintenance: waLink(
    "Bonjour LOLITE 👋, je suis intéressé(e) par la formule Maintenance Sérénité (à partir de 50 € / mois). Pouvez-vous me donner plus de détails ?"
  ),
  portfolio: waLink(
    "Bonjour LOLITE 👋, j'ai vu votre réalisation pour Toutneuf34 et j'aimerais un site du même niveau pour mon activité. Pouvez-vous me faire un devis gratuit ?"
  ),
  faq: waLink(
    "Bonjour LOLITE 👋, j'ai une question à propos de vos services. Pouvez-vous m'aider ?"
  ),
  contact: waLink(
    "Bonjour LOLITE 👋, je souhaite être recontacté(e) pour discuter de mon projet web. Merci !"
  ),
};

/* ---------- Easing ---------- */

export const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

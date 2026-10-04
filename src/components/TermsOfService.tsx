import { SITE_URL, WA_DISPLAY } from "../lib/site";
import { LegalLayout } from "./LegalLayout";

export function TermsOfService() {
  return (
    <LegalLayout title="Conditions générales d'utilisation">
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales d'utilisation (CGU) encadrent l'accès
        et l'utilisation du site <strong>{SITE_URL.replace("https://", "")}</strong>{" "}
        édité par LOLITE (voir les <a href="/mentions-legales">mentions légales</a>).
        Naviguer sur le site vaut acceptation des CGU.
      </p>

      <h2>2. Accès au site</h2>
      <p>
        Le site est accessible gratuitement, 24h/24 et 7j/7, sauf interruption pour
        maintenance ou cas de force majeure. LOLITE ne peut être tenue responsable
        d'une indisponibilité temporaire.
      </p>

      <h2>3. Services proposés</h2>
      <p>
        Le site présente les prestations de création de sites internet de LOLITE
        et permet de demander un devis gratuit et sans engagement. Les prix
        affichés sont indicatifs (« à partir de ») : seul le devis signé engage
        les parties, selon les conditions qui y sont précisées et notre{" "}
        <a href="/remboursement">politique d'annulation et de remboursement</a>.
      </p>

      <h2>4. Utilisation du formulaire de contact</h2>
      <p>L'utilisateur s'engage à :</p>
      <ul>
        <li>fournir des informations exactes et le concernant ;</li>
        <li>ne pas envoyer de contenu illicite, injurieux ou de messages non sollicités (spam) ;</li>
        <li>ne pas tenter de perturber le fonctionnement du site (robots, envois automatisés, intrusion).</li>
      </ul>
      <p>
        LOLITE se réserve le droit d'ignorer toute demande abusive ou manifestement
        automatisée.
      </p>

      <h2>5. Propriété intellectuelle</h2>
      <p>
        Textes, visuels, logo, charte graphique et code du site sont protégés.
        Toute reproduction ou réutilisation sans autorisation écrite est interdite.
        Les réalisations présentées restent la propriété de leurs titulaires
        respectifs.
      </p>

      <h2>6. Responsabilité</h2>
      <p>
        LOLITE s'efforce de fournir des informations exactes et à jour, sans
        pouvoir le garantir de manière absolue. Les liens vers des sites tiers
        (WhatsApp, Instagram, sites clients…) sont fournis à titre pratique :
        LOLITE n'est pas responsable de leur contenu.
      </p>

      <h2>7. Données personnelles</h2>
      <p>
        Voir notre <a href="/confidentialite">politique de confidentialité</a> et
        notre <a href="/cookies">politique cookies</a>.
      </p>

      <h2>8. Modification des CGU</h2>
      <p>
        LOLITE peut modifier les CGU à tout moment. La version applicable est
        celle en ligne au jour de votre visite.
      </p>

      <h2>9. Droit applicable et litiges</h2>
      <p>
        Les CGU sont soumises au droit français. En cas de litige, une solution
        amiable sera recherchée en priorité (téléphone / WhatsApp : {WA_DISPLAY}). À défaut, les
        tribunaux compétents seront ceux du ressort de Montpellier, sous réserve
        des règles protectrices applicables aux consommateurs.
      </p>
    </LegalLayout>
  );
}

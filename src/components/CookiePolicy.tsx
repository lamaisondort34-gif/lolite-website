import { CONTACT_EMAIL } from "../lib/site";
import { ANALYTICS_ENABLED, openCookieSettings } from "../lib/analytics";
import { LegalLayout } from "./LegalLayout";

export function CookiePolicy() {
  return (
    <LegalLayout title="Politique cookies">
      <h2>1. Qu'est-ce qu'un cookie ?</h2>
      <p>
        Un cookie (ou traceur) est un petit fichier déposé sur votre appareil lors
        de la visite d'un site. Certains sont indispensables, d'autres nécessitent
        votre accord préalable.
      </p>

      <h2>2. Les traceurs utilisés sur ce site</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Finalité</th>
            <th scope="col">Durée</th>
            <th scope="col">Consentement</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>lolite-cookie-consent (stockage local)</td>
            <td>Mémoriser votre choix sur les cookies</td>
            <td>6 mois</td>
            <td>Non requis (strictement nécessaire)</td>
          </tr>
          <tr>
            <td>_ga, _ga_* (Google Analytics 4)</td>
            <td>Mesure d'audience anonymisée</td>
            <td>13 mois</td>
            <td>Oui — déposés uniquement si vous acceptez</td>
          </tr>
        </tbody>
      </table>
      <p>
        Aucun cookie publicitaire ni de réseau social n'est déposé. Le lien vers
        WhatsApp ou Instagram ne dépose rien sur ce site : ces services appliquent
        leurs propres règles une fois que vous les ouvrez.
      </p>

      <h2>3. Modifier votre choix</h2>
      <p>
        Vous pouvez accepter ou refuser à tout moment, aussi simplement que lors
        de votre première visite. Si vous retirez votre accord, les cookies Google
        Analytics sont supprimés.
      </p>
      {ANALYTICS_ENABLED ? (
        <p>
          <button type="button" onClick={openCookieSettings} className="legal-button">
            Gérer mes cookies
          </button>
        </p>
      ) : (
        <p>
          <strong>À ce jour, aucun cookie de mesure d'audience n'est actif sur le site.</strong>
        </p>
      )}
      <p>
        Vous pouvez aussi bloquer les cookies depuis les réglages de votre
        navigateur.
      </p>

      <h2>4. Contact</h2>
      <p>
        Une question ? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Voir
        aussi notre <a href="/confidentialite">politique de confidentialité</a>.
      </p>
    </LegalLayout>
  );
}

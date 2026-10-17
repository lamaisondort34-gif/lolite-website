import { PHONE_LINK, WA_DISPLAY } from "../lib/site";
import { ANALYTICS_ENABLED, GA_ID, openCookieSettings } from "../lib/analytics";
import { LegalLayout } from "./LegalLayout";

export function CookiePolicy() {
  return (
    <LegalLayout title="Politique cookies" updated="17 octobre 2026">
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
            <td>lolite-intro (stockage de session)</td>
            <td>Ne jouer l'animation d'accueil qu'une fois par visite</td>
            <td>Jusqu'à la fermeture de l'onglet</td>
            <td>Non requis (confort d'affichage)</td>
          </tr>
          <tr>
            <td>{`_ga, _ga_${GA_ID.replace(/^G-/, "")} (Google Analytics 4)`}</td>
            <td>Mesure d'audience : distinguer les visiteurs et leurs visites</td>
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

      <h2>3. Google Analytics</h2>
      <p>
        Avec votre accord, nous utilisons Google Analytics 4, service de Google
        Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irlande), pour
        savoir comment le site est utilisé et l'améliorer.
      </p>
      <ul>
        <li>
          <strong>Ce qui est mesuré :</strong> pages consultées, provenance des
          visites (moteur de recherche, réseau social, lien direct…), type
          d'appareil et de navigateur, ville approximative, ainsi que deux
          actions : l'envoi du formulaire de devis (avec le type de projet et le
          budget choisis) et les clics sur les liens WhatsApp.
        </li>
        <li>
          <strong>Ce qui n'est jamais transmis :</strong> votre nom, vos
          coordonnées et le contenu de vos messages.
        </li>
        <li>
          <strong>Consentement :</strong> le site utilise le mode consentement
          de Google (Consent Mode v2) avec tout refusé par défaut. Le script
          Google n'est chargé qu'après un clic sur « Accepter ». Tant que vous
          n'avez pas choisi, ou si vous refusez, aucune donnée n'est envoyée à
          Google et aucun cookie Google n'est déposé.
        </li>
        <li>
          <strong>Pas de publicité :</strong> les fonctions publicitaires, les
          signaux Google et la personnalisation des annonces sont désactivés.
        </li>
        <li>
          <strong>Durées :</strong> cookies conservés 13 mois maximum ;
          statistiques conservées 14 mois maximum dans Google Analytics.
        </li>
        <li>
          <strong>Transferts :</strong> Google peut traiter ces données aux
          États-Unis. Ces transferts sont encadrés par le Data Privacy Framework
          UE–États-Unis, auquel Google LLC adhère, et par les clauses
          contractuelles types de la Commission européenne.
        </li>
      </ul>
      <p>
        En savoir plus :{" "}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          comment Google utilise les données des sites partenaires
        </a>
        .
      </p>

      <h2>4. Modifier votre choix</h2>
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

      <h2>5. Contact</h2>
      <p>
        Une question ? Téléphone / WhatsApp : <a href={PHONE_LINK}>{WA_DISPLAY}</a>. Voir
        aussi notre <a href="/confidentialite">politique de confidentialité</a>.
      </p>
    </LegalLayout>
  );
}

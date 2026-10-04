import { LEGAL, PHONE_LINK, WA_DISPLAY } from "../lib/site";
import { LegalLayout } from "./LegalLayout";

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <p>
        LOLITE attache une grande importance à la protection de vos données
        personnelles. Cette politique explique quelles données nous collectons,
        pourquoi, combien de temps nous les gardons et comment exercer vos droits,
        conformément au Règlement général sur la protection des données (RGPD) et
        à la loi Informatique et Libertés.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        LOLITE — {LEGAL.owner}, {LEGAL.address}. Contact (téléphone / WhatsApp) :{" "}
        <a href={PHONE_LINK}>{WA_DISPLAY}</a>.
      </p>

      <h2>2. Données collectées et finalités</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Données</th>
            <th scope="col">Finalité</th>
            <th scope="col">Base légale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Nom, e-mail ou téléphone, type de projet, budget, message (formulaire de brief)</td>
            <td>Répondre à votre demande et établir un devis</td>
            <td>Mesures précontractuelles (art. 6.1.b RGPD)</td>
          </tr>
          <tr>
            <td>Échanges par WhatsApp ou par téléphone</td>
            <td>Suivi de votre demande et de votre projet</td>
            <td>Mesures précontractuelles / contrat</td>
          </tr>
          <tr>
            <td>Données de navigation (pages vues, appareil, ville approximative) — uniquement si vous acceptez</td>
            <td>Mesure d'audience pour améliorer le site</td>
            <td>Consentement (art. 6.1.a RGPD)</td>
          </tr>
          <tr>
            <td>Adresse IP et journaux techniques</td>
            <td>Sécurité et bon fonctionnement du site</td>
            <td>Intérêt légitime (art. 6.1.f RGPD)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Nous ne vendons ni ne louons jamais vos données. Nous n'envoyons pas de
        prospection commerciale sans votre accord.
      </p>

      <h2>3. Destinataires et sous-traitants</h2>
      <ul>
        <li><strong>Netlify</strong> (hébergement du site et réception du formulaire) — États-Unis</li>
        <li><strong>WhatsApp / Meta</strong> (messagerie, si vous choisissez ce canal) — Irlande / États-Unis</li>
        <li><strong>Google Analytics</strong> (mesure d'audience, seulement après consentement) — Irlande / États-Unis</li>
      </ul>
      <p>
        Les transferts hors Union européenne sont encadrés par le Data Privacy
        Framework UE–États-Unis et/ou les clauses contractuelles types de la
        Commission européenne.
      </p>

      <h2>4. Durées de conservation</h2>
      <ul>
        <li>Demandes de devis sans suite : 3 ans après le dernier contact</li>
        <li>Données clients : durée de la relation commerciale, puis archivage légal (10 ans pour les factures)</li>
        <li>Cookies de mesure d'audience : 13 mois maximum ; votre choix de consentement : 6 mois</li>
      </ul>

      <h2>5. Vos droits</h2>
      <p>
        Vous disposez d'un droit d'accès, de rectification, d'effacement, de
        limitation, d'opposition et de portabilité de vos données, ainsi que du
        droit de retirer votre consentement à tout moment et de définir des
        directives sur le sort de vos données après votre décès.
      </p>
      <p>
        Pour les exercer, contactez-nous par téléphone ou WhatsApp au <a href={PHONE_LINK}>{WA_DISPLAY}</a>,
        ou par courrier à l'adresse ci-dessus.
        Nous répondons sous un mois. Si vous estimez que vos droits ne sont pas
        respectés, vous pouvez saisir la CNIL (
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">cnil.fr/plaintes</a>).
      </p>

      <h2>6. Cookies</h2>
      <p>
        Le détail des cookies et la façon de modifier votre choix figurent dans
        notre <a href="/cookies">politique cookies</a>.
      </p>

      <h2>7. Sécurité</h2>
      <p>
        Le site est servi exclusivement en HTTPS. L'accès aux données est limité
        aux seules personnes qui en ont besoin pour traiter votre demande.
      </p>
    </LegalLayout>
  );
}

import { CONTACT_EMAIL, LEGAL, SITE_URL, WA_DISPLAY } from "../lib/site";
import { LegalLayout } from "./LegalLayout";

export function MentionsLegales() {
  return (
    <LegalLayout title="Mentions légales">
      <p>
        Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la
        confiance dans l'économie numérique (LCEN), voici l'identité des
        intervenants du site <strong>{SITE_URL.replace("https://", "")}</strong>.
      </p>

      <h2>1. Éditeur du site</h2>
      <ul>
        <li>Nom commercial : LOLITE — Studio Web</li>
        <li>Responsable : {LEGAL.owner}</li>
        <li>Statut : {LEGAL.status}</li>
        <li>SIRET : {LEGAL.siret}</li>
        <li>Adresse : {LEGAL.address}</li>
        <li>{LEGAL.vat}</li>
        <li>E-mail : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
        <li>Téléphone / WhatsApp : {WA_DISPLAY}</li>
      </ul>

      <h2>2. Directeur de la publication</h2>
      <p>{LEGAL.owner}</p>

      <h2>3. Hébergeur</h2>
      <p>
        Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107,
        États-Unis — <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">netlify.com</a>
      </p>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus du site (textes, visuels, logo, code, mise en page)
        est la propriété de LOLITE ou de ses partenaires et est protégé par le Code
        de la propriété intellectuelle. Toute reproduction, même partielle, sans
        autorisation écrite préalable est interdite. Les captures d'écran de
        réalisations sont présentées avec l'accord des clients concernés.
      </p>

      <h2>5. Données personnelles et cookies</h2>
      <p>
        Le traitement de vos données est détaillé dans notre{" "}
        <a href="/confidentialite">politique de confidentialité</a> et notre{" "}
        <a href="/cookies">politique cookies</a>.
      </p>

      <h2>6. Médiation de la consommation</h2>
      <p>
        Conformément à l'article L.612-1 du Code de la consommation, le client
        consommateur peut recourir gratuitement à un médiateur de la consommation
        en vue de la résolution amiable d'un litige. Coordonnées du médiateur :
        communiquées sur simple demande à {CONTACT_EMAIL}.
      </p>
    </LegalLayout>
  );
}

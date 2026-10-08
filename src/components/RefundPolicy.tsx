import { PHONE_LINK, WA_DISPLAY } from "../lib/site";
import { LegalLayout } from "./LegalLayout";

export function RefundPolicy() {
  return (
    <LegalLayout title="Annulation et remboursement">
      <h2>1. Annulation avant le début du projet</h2>
      <p>
        Si vous annulez une commande <strong>avant le démarrage du projet</strong>,
        l'acompte versé vous est remboursé à 100 % sous <strong>14 jours</strong>.
        La demande se fait par écrit, par message WhatsApp au <a href={PHONE_LINK}>{WA_DISPLAY}</a>.
      </p>

      <h2>2. Après le début du projet</h2>
      <p>
        Une fois le projet commencé (brief validé, maquette en cours), les sommes
        correspondant au travail réalisé restent dues. En contrepartie, chaque
        formule inclut des révisions pour ajuster le résultat à vos attentes.
      </p>

      <h2>3. Modalités</h2>
      <ul>
        <li>Toute demande doit être formulée par écrit.</li>
        <li>Le remboursement est effectué par le même moyen de paiement, sous 5 à 10 jours ouvrés.</li>
        <li>En cas de paiement échelonné, les échéances futures sont annulées, sans pénalité.</li>
        <li>Les frais externes déjà engagés (nom de domaine, licences, extensions) ne sont pas remboursables, sauf accord préalable.</li>
      </ul>

      <h2>4. Révisions incluses</h2>
      <ul>
        <li><strong>Formule Standard :</strong> 3 séries de révisions</li>
        <li><strong>Formule Premium :</strong> 5 séries de révisions</li>
      </ul>
      <p>Les révisions supplémentaires sont facturées sur devis.</p>

      <h2>5. Force majeure</h2>
      <p>
        En cas d'événement imprévisible et irrésistible, LOLITE peut suspendre le
        projet ou proposer un remboursement au prorata du travail réalisé.
      </p>

      <h2>6. Contact</h2>
      <p>
        Téléphone / WhatsApp : <a href={PHONE_LINK}>{WA_DISPLAY}</a>
      </p>
    </LegalLayout>
  );
}

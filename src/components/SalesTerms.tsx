import { LEGAL, PHONE_LINK, WA_DISPLAY } from "../lib/site";
import { LegalLayout } from "./LegalLayout";

export function SalesTerms() {
  return (
    <LegalLayout title="Conditions générales de vente" updated="18 octobre 2026">
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales de vente (CGV) s'appliquent à toutes
        les prestations vendues par LOLITE : création de sites internet et Forfait
        Maintenance LOLITE. Elles sont jointes à chaque devis. La signature du
        devis vaut acceptation des CGV, qui prévalent sur tout autre document du
        Client, sauf accord écrit contraire précisé sur le devis.
      </p>

      <h2>2. Prestataire</h2>
      <p>
        LOLITE — {LEGAL.owner}, {LEGAL.status.toLowerCase()}
        <br />
        Adresse : {LEGAL.address}
        <br />
        SIRET : {LEGAL.siret}
        <br />
        Téléphone / WhatsApp : <a href={PHONE_LINK}>{WA_DISPLAY}</a>
        <br />
        {LEGAL.vat}.
      </p>

      <h2>3. Prestations</h2>
      <ul>
        <li>
          <strong>Formule Standard</strong> (à partir de 450 €) : site vitrine
          sur-mesure et responsive, présentation de l'activité et des services,
          formulaire de contact, Google Maps, référencement de base, certificat
          SSL, hébergement offert pendant un an.
        </li>
        <li>
          <strong>Formule Premium</strong> (à partir de 800 €) : tout le contenu
          de la Formule Standard, plus un design haut de gamme animé, plusieurs
          pages, réservation en ligne ou boutique en ligne, référencement avancé,
          optimisation de la fiche Google Business et interface d'administration.
        </li>
        <li>
          <strong>Forfait Maintenance LOLITE</strong> (25 € par mois sans
          engagement, ou 250 € par an) : voir l'article 10.
        </li>
      </ul>
      <p>
        Les prix affichés sur le site sont indicatifs (« à partir de »). Le
        contenu exact de chaque prestation, son prix et son délai sont ceux du
        devis.
      </p>

      <h2>4. Devis et commande</h2>
      <p>
        Le devis est gratuit, sans engagement et valable 30 jours. La commande
        est ferme à réception du devis signé (mention « bon pour accord », par
        écrit ou par voie électronique) et de l'acompte prévu à l'article 5.
        Toute demande qui ne figure pas sur le devis fait l'objet d'un devis
        complémentaire.
      </p>

      <h2>5. Prix et paiement</h2>
      <ul>
        <li>Les prix sont en euros. {LEGAL.vat} : le prix indiqué est le prix total à payer.</li>
        <li>
          <strong>Création de site :</strong> acompte de 50 % à la signature du
          devis, solde à la livraison, avant la mise en ligne définitive. Un
          paiement en plusieurs fois peut être accordé : l'échéancier figure
          alors sur le devis.
        </li>
        <li><strong>Forfait Maintenance :</strong> payable d'avance, chaque mois ou pour l'année.</li>
        <li>Paiement par virement bancaire ou par tout autre moyen indiqué sur la facture. Aucun escompte pour paiement anticipé.</li>
        <li>
          <strong>Retard de paiement :</strong> après une relance écrite restée
          sans effet pendant 15 jours, LOLITE peut suspendre ses prestations
          (travaux en cours, hébergement, maintenance) jusqu'au paiement complet.
          Pour les clients professionnels, toute somme impayée à l'échéance
          entraîne de plein droit des pénalités de retard égales à trois fois
          le taux d'intérêt légal, ainsi qu'une indemnité forfaitaire de 40 €
          pour frais de recouvrement (articles L441-10 et D441-5 du Code de
          commerce).
        </li>
      </ul>

      <h2>6. Déroulement et délais</h2>
      <p>
        Le projet démarre à réception de l'acompte et des contenus fournis par
        le Client (textes, photos, logo, informations pratiques). Le délai
        indiqué sur le devis — en général 1 à 2 semaines, avec une première
        maquette sous 5 jours — court à partir de cette date. Il est prolongé
        d'autant en cas de retard du Client dans l'envoi des contenus ou de ses
        retours.
      </p>
      <p>
        Si le Client ne donne plus de nouvelles pendant 3 mois malgré deux
        relances, LOLITE peut clôturer le projet : les sommes correspondant au
        travail réalisé restent dues.
      </p>

      <h2>7. Obligations du Client</h2>
      <ul>
        <li>Fournir des contenus exacts, complets et dans les délais convenus.</li>
        <li>
          Garantir qu'il détient les droits sur les contenus qu'il fournit
          (textes, photos, logos, marques). Le Client reste seul responsable de
          ces contenus et garantit LOLITE contre toute réclamation à ce sujet.
        </li>
        <li>
          Rester responsable de la conformité de son activité et des
          informations publiées sur son site (mentions légales, conditions de
          vente de sa boutique, prix, etc.). LOLITE peut l'aider à les mettre en
          forme, sans se substituer à un conseil juridique.
        </li>
      </ul>

      <h2>8. Révisions et validation</h2>
      <p>
        Le devis comprend des séries de révisions : <strong>3 pour la Formule
        Standard, 5 pour la Formule Premium</strong>. Une série regroupe en un
        seul envoi l'ensemble des retours du Client sur une version du site.
        Les révisions supplémentaires, ou les changements qui remettent en
        cause ce qui a déjà été validé, sont facturés sur devis.
      </p>
      <p>
        À la livraison, le Client dispose de 8 jours pour signaler par écrit
        toute anomalie. Sans réponse dans ce délai, ou dès la mise en ligne à
        sa demande, le site est réputé accepté. Les anomalies signalées sont
        corrigées gratuitement.
      </p>

      <h2>9. Nom de domaine, mise en ligne et hébergement</h2>
      <ul>
        <li>
          <strong>Nom de domaine :</strong> il reste la propriété du Client, qui
          l'achète à son nom chez le prestataire de son choix (environ 1 € la
          première année) et en paie le renouvellement. LOLITE peut l'aider à
          le configurer.
        </li>
        <li>
          <strong>Hébergement offert :</strong> l'hébergement du site et ses
          mises à jour de sécurité sont offerts pendant un an à compter de la
          mise en ligne. Pendant cette période, les modifications sont
          facturées au tarif hors forfait (article 10), sauf si le Client
          souscrit au Forfait Maintenance plus tôt.
        </li>
        <li>
          <strong>À la fin de l'année offerte :</strong> LOLITE prévient le
          Client au moins 30 jours avant l'échéance. Le Client choisit alors
          soit de souscrire au Forfait Maintenance LOLITE, soit de récupérer
          gratuitement les fichiers de son site pour le faire héberger
          ailleurs. Sans réponse à l'échéance, le site est mis hors ligne ; ses
          fichiers restent disponibles sur demande pendant 3 mois.
        </li>
        <li>
          LOLITE confie l'hébergement à un prestataire technique spécialisé. Elle
          met tout en œuvre pour assurer la disponibilité du site, sans pouvoir
          garantir une absence totale d'interruption.
        </li>
      </ul>

      <h2>10. Forfait Maintenance LOLITE</h2>
      <p>Le forfait comprend :</p>
      <ul>
        <li>l'hébergement du site ;</li>
        <li>la sécurité et les mises à jour ;</li>
        <li>
          1 petite modification par mois sur un contenu existant (texte, photo,
          horaires, coordonnées), non reportable sur les mois suivants ;
        </li>
        <li>une réponse sous 48 h, par WhatsApp.</li>
      </ul>
      <p>
        En dehors du forfait : modification supplémentaire à partir de 30 €
        selon la taille du changement ; nouvelle page, refonte ou nouvelle
        fonctionnalité sur devis.
      </p>
      <ul>
        <li>
          <strong>Formule mensuelle (25 €/mois) :</strong> sans engagement,
          renouvelée chaque mois. Le Client peut l'arrêter à tout moment par
          simple message écrit ; l'arrêt prend effet à la fin du mois en cours.
        </li>
        <li>
          <strong>Formule annuelle (250 €/an) :</strong> payée d'avance pour 12
          mois, sans reconduction automatique. LOLITE propose son
          renouvellement au moins 30 jours avant l'échéance. Elle n'est pas
          remboursable en cours d'année, sauf manquement de LOLITE.
        </li>
        <li>
          À l'arrêt du forfait, LOLITE remet gratuitement au Client les fichiers
          de son site.
        </li>
      </ul>

      <h2>11. Propriété intellectuelle</h2>
      <p>
        Après paiement complet, LOLITE cède au Client les droits de
        reproduction, de représentation et d'adaptation sur les créations
        réalisées spécifiquement pour lui (design, textes rédigés par LOLITE,
        code propre au projet), pour le monde entier, pour toute la durée des
        droits, aux fins d'exploitation de son site et de sa communication.
        Jusqu'au paiement complet, ces créations restent la propriété de LOLITE.
      </p>
      <p>
        Les outils, bibliothèques de code, polices et images sous licence
        utilisés pour le site restent soumis à leurs licences respectives : le
        Client peut les utiliser dans le cadre de son site. Sauf refus écrit du
        Client, LOLITE peut présenter le site dans ses références (site,
        réseaux sociaux) et faire figurer une mention discrète « Site réalisé
        par LOLITE » en bas de page.
      </p>

      <h2>12. Responsabilité et garanties</h2>
      <ul>
        <li>LOLITE est tenue d'une obligation de moyens.</li>
        <li>
          <strong>Référencement :</strong> LOLITE met en place les bonnes
          pratiques de référencement, mais aucune position dans les résultats
          de Google ne peut être garantie : elle dépend de Google et de la
          concurrence.
        </li>
        <li>
          <strong>Services tiers</strong> (paiement en ligne, réservation,
          messagerie, réseaux sociaux…) : leurs abonnements, commissions et
          interruptions relèvent de leurs éditeurs et sont à la charge du Client.
        </li>
        <li>
          <strong>Clients professionnels :</strong> la responsabilité de LOLITE
          est limitée aux dommages directs et au montant payé pour la
          prestation concernée.
        </li>
        <li>
          <strong>Clients consommateurs :</strong> ils bénéficient de la garantie
          légale de conformité prévue aux articles L224-25-12 et suivants du
          Code de la consommation.
        </li>
      </ul>

      <h2>13. Données personnelles</h2>
      <p>
        Les données du Client sont traitées selon notre{" "}
        <a href="/confidentialite">politique de confidentialité</a>. Lorsque
        LOLITE héberge ou maintient le site du Client, elle peut avoir accès
        aux données de ses visiteurs (par exemple les messages de son
        formulaire de contact). Elle agit alors comme sous-traitant au sens de
        l'article 28 du RGPD :
      </p>
      <ul>
        <li>elle traite ces données uniquement pour faire fonctionner le site, selon les instructions du Client ;</li>
        <li>elle en assure la confidentialité et la sécurité ;</li>
        <li>elle ne fait appel qu'à des prestataires techniques offrant les mêmes garanties, comme l'hébergeur ;</li>
        <li>elle aide le Client à répondre aux demandes des personnes concernées ;</li>
        <li>elle supprime ou restitue ces données à la fin de la prestation.</li>
      </ul>

      <h2>14. Droit de rétractation (clients consommateurs)</h2>
      <p>
        Le Client consommateur dispose d'un délai de 14 jours à compter de la
        signature du devis pour se rétracter, sans avoir à se justifier
        (article L221-18 du Code de la consommation). Il lui suffit d'envoyer
        une déclaration claire par écrit (par exemple par WhatsApp) ou le
        formulaire ci-dessous. LOLITE rembourse alors toutes les sommes versées
        sous 14 jours, par le même moyen de paiement.
      </p>
      <p>
        Si le Client demande expressément que le travail commence avant la fin
        de ce délai, puis se rétracte, il paie le montant correspondant au
        travail déjà réalisé (article L221-25). Si la prestation a été
        entièrement exécutée avant la fin du délai, avec son accord exprès, il
        ne peut plus se rétracter (article L221-28).
      </p>

      <h2>15. Annulation</h2>
      <p>
        Au-delà du droit de rétractation, les règles d'annulation et de
        remboursement figurent dans notre{" "}
        <a href="/remboursement">politique d'annulation et de remboursement</a>.
        En résumé : acompte remboursé à 100 % en cas d'annulation avant le début
        du projet ; une fois le projet commencé, le travail réalisé reste dû.
      </p>

      <h2>16. Force majeure</h2>
      <p>
        Aucune des parties n'est responsable d'un retard ou d'une inexécution
        dû à un cas de force majeure au sens de l'article 1218 du Code civil.
        Si l'empêchement dure plus d'un mois, chaque partie peut mettre fin à
        la prestation ; le travail réalisé est alors facturé au prorata.
      </p>

      <h2>17. Médiation, droit applicable et litiges</h2>
      <p>
        Les CGV sont soumises au droit français. En cas de difficulté, le Client
        contacte d'abord LOLITE pour trouver une solution amiable :{" "}
        <a href={PHONE_LINK}>{WA_DISPLAY}</a>.
      </p>
      <p>
        Le Client consommateur peut ensuite recourir gratuitement à un médiateur
        de la consommation (articles L611-1 et suivants du Code de la
        consommation). Coordonnées du médiateur : en cours de désignation.
      </p>
      <p>
        À défaut d'accord, les litiges avec un client professionnel relèvent
        des tribunaux du ressort de Montpellier. Le client consommateur peut
        saisir le tribunal de son choix parmi ceux prévus par la loi.
      </p>

      <h2>Annexe — Formulaire de rétractation</h2>
      <p>
        À compléter et renvoyer uniquement si vous souhaitez vous rétracter
        (par écrit ou par WhatsApp au {WA_DISPLAY}) :
      </p>
      <blockquote>
        À l'attention de LOLITE, {LEGAL.owner}, {LEGAL.address} :
        <br />
        Je vous notifie par la présente ma rétractation du contrat portant sur
        la prestation de services ci-dessous :
        <br />
        Commandée le : ………… — Nom du client : ………… — Adresse du client : …………
        <br />
        Signature du client (uniquement en cas de notification sur papier) : …………
        <br />
        Date : …………
      </blockquote>
    </LegalLayout>
  );
}

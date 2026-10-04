import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { EASE_OUT, scrollTo } from "../lib/site";

export function RefundPolicy() {
  return (
    <section id="refund" className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => scrollTo("#")}
        className="mb-12 flex items-center gap-2 text-milk/70 hover:text-milk transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-milk md:text-6xl mb-8">
          Politique de remboursement
        </h1>

        <div className="prose prose-invert max-w-3xl space-y-8 text-fog">
          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">1. Remboursement avant le début du projet</h2>
            <p>
              Si vous annulez une commande <strong>avant que le projet ne commence</strong>,
              vous avez le droit d'obtenir un remboursement à 100% sous <strong>14 jours</strong>.
            </p>
            <p className="mt-3">
              Pour demander un remboursement, écrivez-nous à <strong>contact@lolite-agency.fr</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">2. Remboursement après le début</h2>
            <p>
              Une fois le projet commencé (briefing validé, design en cours),
              <strong> aucun remboursement n'est possible</strong>.
            </p>
            <p className="mt-3">
              Cependant, si vous n'êtes pas satisfait du résultat final, nous apporterons
              <strong> jusqu'à 3 révisions gratuites</strong> pour l'améliorer.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">3. Conditions de remboursement</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>La demande doit être formalisée par écrit</li>
              <li>Le délai de 14 jours court à partir de la signature du contrat</li>
              <li>Le remboursement sera effectué par le même moyen de paiement</li>
              <li>Les délais de traitement sont de 5 à 10 jours ouvrables</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">4. Formules avec paiement échelonné</h2>
            <p>
              Si vous avez choisi un paiement en plusieurs versements :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Les versements déjà payés seront remboursés</li>
              <li>Les versements futurs sont annulés</li>
              <li>Aucune pénalité ne s'applique</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">5. Frais supplémentaires</h2>
            <p>
              Si des frais externes ont été engagés (domaine, hébergement, extensions spéciales),
              ceux-ci ne sont pas remboursables sauf accord préalable.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">6. Révisions gratuites incluses</h2>
            <p>
              Chacune de nos formules inclut :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Formule Essentiel :</strong> 3 révisions incluses</li>
              <li><strong>Formule Complet :</strong> 5 révisions incluses</li>
              <li><strong>Formule Avancé :</strong> Révisions illimitées pendant 30 jours</li>
            </ul>
            <p className="mt-3">
              Les révisions au-delà sont facturées <strong>à l'heure</strong> (tarif : nous consulter).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">7. Force majeure</h2>
            <p>
              En cas d'événement imprévisible (situation sanitaire, catastrophe naturelle),
              LOLITE se réserve le droit de suspendre le projet ou de proposer un remboursement partiel.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">8. Nous contacter</h2>
            <p>
              Demande de remboursement ou question :<br />
              Email : <strong>contact@lolite-agency.fr</strong><br />
              WhatsApp : <strong>+33 6 63 53 01 57</strong>
            </p>
            <p className="mt-3 text-sm text-fog">
              <em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</em>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

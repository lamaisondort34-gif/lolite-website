import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { EASE_OUT, scrollTo } from "../lib/site";

export function TermsOfService() {
  return (
    <section id="terms" className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
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
          Conditions d'utilisation
        </h1>

        <div className="prose prose-invert max-w-3xl space-y-8 text-fog">
          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">1. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant ce site web, vous acceptez d'être lié par ces Conditions
              d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">2. Utilisation du site</h2>
            <p>Vous vous engagez à :</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Utiliser ce site à titre personnel et non commercial</li>
              <li>Ne pas modifier ou copier le contenu sans autorisation</li>
              <li>Ne pas utiliser ce site pour des activités illégales ou nuisibles</li>
              <li>Ne pas accéder au site par des moyens automatisés (scraping, bots)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">3. Propriété intellectuelle</h2>
            <p>
              Tout le contenu de ce site (textes, images, logos, code) est la propriété exclusive
              de LOLITE ou de ses fournisseurs. Vous n'avez pas le droit de le réutiliser sans
              permission écrite.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">4. Limitation de responsabilité</h2>
            <p>
              LOLITE ne sera pas responsable des dommages indirects, accidentels ou consécutifs
              découlant de votre utilisation ou incapacité à utiliser le site.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">5. Devis et services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Les devis sont gratuits et sans engagement</li>
              <li>Les délais et prix mentionnés sont estimatifs</li>
              <li>Un contrat séparé signé électroniquement formalisera la commande</li>
              <li>Les modifications de projet peuvent affecter les délais et tarifs</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">6. Paiement</h2>
            <p>
              Le paiement est exigible selon les modalités convenues dans le contrat.
              Les retards de paiement peuvent entraîner la suspension des services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">7. Liens externes</h2>
            <p>
              Ce site peut contenir des liens vers des sites tiers. LOLITE n'est pas responsable
              du contenu, de la disponibilité ou de la politique de confidentialité de ces sites.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">8. Modification des conditions</h2>
            <p>
              LOLITE se réserve le droit de modifier ces conditions à tout moment.
              Les modifications entrent en vigueur immédiatement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">9. Contact</h2>
            <p>
              Pour toute question concernant ces conditions :<br />
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

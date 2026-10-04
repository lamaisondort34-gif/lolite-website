import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { EASE_OUT, scrollTo } from "../lib/site";
import { SectionHeading } from "./SectionHeading";

export function PrivacyPolicy() {
  return (
    <section id="privacy" className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
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
          Politique de confidentialité
        </h1>

        <div className="prose prose-invert max-w-3xl space-y-8 text-fog">
          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">1. Introduction</h2>
            <p>
              LOLITE (« nous », « notre ») s'engage à protéger votre vie privée. Cette Politique de
              confidentialité explique comment nous collectons, utilisons, divulguons et sauvegardons vos
              informations lorsque vous visitez notre site web <strong>lolite-agency.fr</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">2. Informations que nous collectons</h2>
            <p className="mb-3">Nous collectons les informations que vous nous fournissez volontairement :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nom, email, numéro de téléphone (via formulaires de contact)</li>
              <li>Description de votre projet et budget estimé</li>
              <li>Données de navigation (via cookies et analytics)</li>
              <li>Adresse IP, navigateur, système d'exploitation</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">3. Comment nous utilisons vos données</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Répondre à vos demandes de devis et questions</li>
              <li>Améliorer notre site et nos services</li>
              <li>Analyser les tendances de visite (Google Analytics)</li>
              <li>Vous envoyer des mises à jour ou des informations promotionnelles (si consentement)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">4. Cookies et suivi</h2>
            <p>
              Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez les gérer ou les
              refuser dans les paramètres de votre navigateur. Consultez notre{" "}
              <button
                onClick={() => scrollTo("#cookies")}
                className="text-lime hover:underline"
              >
                Politique de cookies
              </button>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">5. Partage de vos données</h2>
            <p>
              Nous ne vendons jamais vos données. Nous partageons vos informations uniquement avec :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Google Analytics</strong> pour l'analyse du trafic</li>
              <li><strong>WhatsApp Business</strong> pour la communication (si vous nous contactez)</li>
              <li>Nos prestataires essentiels (hébergement, email)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">6. Vos droits (RGPD)</h2>
            <p>Vous avez le droit de :</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Accéder à vos données personnelles</li>
              <li>Les rectifier ou les supprimer</li>
              <li>Vous opposer à leur traitement</li>
              <li>Demander la portabilité de vos données</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à{" "}
              <strong>contact@lolite-agency.fr</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">7. Durée de conservation</h2>
            <p>
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour les objectifs
              énoncés. Les données de contact sont conservées 3 ans après le dernier contact.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">8. Sécurité</h2>
            <p>
              Nous utilisons des mesures de sécurité appropriées pour protéger vos données contre
              l'accès non autorisé, l'altération ou la divulgation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">9. Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette Politique de confidentialité de temps en temps.
              Nous vous notifierons des changements importants.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">10. Nous contacter</h2>
            <p>
              Si vous avez des questions, contactez-nous :<br />
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

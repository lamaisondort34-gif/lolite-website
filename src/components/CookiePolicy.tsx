import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { EASE_OUT, scrollTo } from "../lib/site";

export function CookiePolicy() {
  return (
    <section id="cookies" className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
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
          Politique de cookies
        </h1>

        <div className="prose prose-invert max-w-3xl space-y-8 text-fog">
          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">1. Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte stocké sur votre appareil. Il nous aide à vous
              reconnaître lors de vos visites et à améliorer votre expérience.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">2. Types de cookies utilisés</h2>

            <div className="mt-4">
              <h3 className="font-bold text-milk mb-2">🔵 Cookies essentiels</h3>
              <p>
                Nécessaires au fonctionnement du site (session, sécurité).
                <strong> Non consentis - toujours actifs.</strong>
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-bold text-milk mb-2">📊 Cookies d'analyse</h3>
              <p>
                Google Analytics pour comprendre comment vous utilisez le site
                (pages visitées, durée, localisation). <strong>Nécessite votre consentement.</strong>
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-bold text-milk mb-2">💬 Cookies de communication</h3>
              <p>
                Pour faciliter la communication via WhatsApp ou email.
                <strong> Nécessite votre consentement.</strong>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">3. Vos choix</h2>
            <p>
              Vous pouvez accepter ou refuser les cookies non-essentiels lors de votre première
              visite. Vous pouvez modifier vos préférences à tout moment.
            </p>
            <p className="mt-3">
              <strong>Paramètres de navigateur :</strong> Tous les navigateurs modernes vous
              permettent de gérer ou supprimer les cookies.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">4. Partage avec tiers</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Analytics</strong> : Données anonymisées d'utilisation</li>
              <li><strong>Netlify</strong> : Hébergement et cookies de session</li>
            </ul>
            <p className="mt-3">
              Ces prestataires respectent les normes RGPD et signent des contrats de traitement
              de données.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">5. Durée de conservation</h2>
            <p>
              Les cookies d'analyse expirent après <strong>13 mois</strong>.
              Les cookies de session expirent à la fermeture du navigateur.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-milk mb-4">6. Contact</h2>
            <p>
              Questions sur nos cookies ? Contactez-nous :<br />
              Email : <strong>contact@lolite-agency.fr</strong>
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

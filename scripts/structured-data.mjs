/**
 * Données structurées JSON-LD (schema.org), injectées au build par scripts/postbuild.mjs :
 * fiche entreprise et offres (toutes les pages), FAQ (accueil). Tout vient des données mêmes
 * de la page (src/entry-server.tsx) : aucun prix ni texte recopié, rien ne peut contredire l'affichage.
 */

const EUR = "EUR";

/** Premier montant en euros d'un libellé : « 450 € » → 450, « ou 250 € par an » → 250. */
export function euros(label) {
  const m = /(\d[\d\s]*(?:,\d+)?)\s*€/.exec(label ?? "");
  if (!m) throw new Error(`Montant en euros introuvable dans « ${label} »`);
  return Number(m[1].replace(/\s/g, "").replace(",", "."));
}

const perUnit = (price, unitCode) => ({
  "@type": "UnitPriceSpecification",
  price,
  priceCurrency: EUR,
  referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode },
});

function offer(plan, url) {
  const price = euros(plan.price);
  // Abonnement (« 25 € par mois », « ou 250 € par an ») : un prix par période (codes UN/CEFACT).
  // Sinon prix unique, minimum si affiché « À partir de ».
  const priceSpecification = /par mois/.test(plan.suffix)
    ? [perUnit(price, "MON"), ...(/par an\b/.test(plan.altPrice ?? "") ? [perUnit(euros(plan.altPrice), "ANN")] : [])]
    : { "@type": "PriceSpecification", [/partir de/i.test(plan.prefix) ? "minPrice" : "price"]: price, priceCurrency: EUR };
  return {
    "@type": "Offer",
    name: plan.name,
    description: plan.desc,
    url,
    price,
    priceCurrency: EUR,
    priceSpecification,
    itemOffered: { "@type": "Service", name: plan.name, description: plan.desc },
  };
}

/** `data` : le module src/entry-server.tsx compilé (dist-ssr/entry-server.js). */
export function buildStructuredData({ FAQS, PLANS, SITE_URL, INSTAGRAM_URL, FACEBOOK_URL, LEGAL, WA_NUMBER }) {
  // Même adresse que les mentions légales : « rue, code postal ville, France ».
  const address = /^(.+), (\d{5}) ([^,]+), France$/.exec(LEGAL.address);
  if (!address) throw new Error(`Adresse inattendue dans LEGAL.address : « ${LEGAL.address} »`);

  const business = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "LOLITE Studio Web",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description: "Création de sites vitrines sur-mesure, livrés en 1 à 2 semaines.",
    telephone: `+${WA_NUMBER}`,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: address[1],
      postalCode: address[2],
      addressLocality: address[3],
      addressCountry: "FR",
    },
    areaServed: ["FR", "GP", "MQ", "GF", "RE", "YT"],
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
    makesOffer: PLANS.map((p) => offer(p, `${SITE_URL}/#tarifs`)),
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return { business, faq };
}

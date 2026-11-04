/**
 * Données structurées JSON-LD (schema.org), injectées au build par scripts/postbuild.mjs :
 * fiche entreprise et offres (toutes les pages), site et FAQ (accueil). Tout vient des données mêmes
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

// Nom de marque et variantes : le même partout (titres, Open Graph, manifeste) pour que moteurs
// et IA relient toutes les mentions à une seule entreprise.
const BRAND = "Lolite";
const ALT_NAMES = ["LOLITE", "LOLITE Studio Web"];
// « France entière · DOM-TOM » (accroche du site) : départements d'outre-mer.
const DOM = ["Guadeloupe", "Martinique", "Guyane", "La Réunion", "Mayotte"];

/**
 * `data` : le module src/entry-server.tsx compilé (dist-ssr/entry-server.js) ;
 * `description` : la meta description de l'accueil (src/lib/routes.json).
 */
export function buildStructuredData(
  { FAQS, PLANS, SERVICES, SITE_URL, INSTAGRAM_URL, FACEBOOK_URL, LEGAL, WA_NUMBER },
  { description },
) {
  // Même adresse que les mentions légales : « rue, code postal ville, France ».
  const address = /^(.+), (\d{5}) ([^,]+), France$/.exec(LEGAL.address);
  if (!address) throw new Error(`Adresse inattendue dans LEGAL.address : « ${LEGAL.address} »`);

  const id = `${SITE_URL}/#entreprise`;
  const telephone = `+${WA_NUMBER}`;
  const business = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": id,
    name: BRAND,
    alternateName: ALT_NAMES,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}/og-image.jpg`,
    description,
    telephone,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: address[1],
      postalCode: address[2],
      addressLocality: address[3],
      addressCountry: "FR",
    },
    founder: { "@type": "Person", name: LEGAL.owner },
    areaServed: [
      { "@type": "City", name: address[3] },
      { "@type": "AdministrativeArea", name: "Hérault" },
      { "@type": "Country", name: "France" },
      ...DOM.map((name) => ({ "@type": "AdministrativeArea", name })),
    ],
    knowsAbout: ["Création de sites internet", ...SERVICES.map((s) => s.title)],
    contactPoint: {
      "@type": "ContactPoint",
      telephone,
      contactType: "customer service",
      areaServed: "FR",
      availableLanguage: "French",
    },
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

  // Site (accueil) : nom de site affiché par Google dans ses résultats.
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#site`,
    url: `${SITE_URL}/`,
    name: BRAND,
    alternateName: ALT_NAMES,
    inLanguage: "fr-FR",
    publisher: { "@id": id },
  };

  return { business, faq, website };
}

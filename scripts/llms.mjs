/**
 * /llms.txt (convention https://llmstxt.org) : résumé Markdown du site pour les assistants IA.
 * Tout vient des données de la page (dist-ssr/entry-server.js) et de src/lib/routes.json :
 * prix, FAQ, services… ne peuvent pas contredire ce qui est affiché.
 * Fonctions pures, sans lecture ni écriture de fichier :
 *  - buildLlmsTxt(data, routes) → texte Markdown ;
 *  - checkLlmsTxt(text, data, routes?) → liste des problèmes (vide si tout est présent).
 */

// Étude de cas : résumé de src/components/Portfolio.tsx (à tenir à jour avec la section Réalisations).
const CASE = {
  name: "Toutneuf34",
  url: "https://toutneuf34.com",
  activity: "Nettoyage écologique à domicile — Montpellier",
  year: "2026",
  summary:
    "Site vitrine complet pour un service de nettoyage professionnel écologique : canapés, matelas, tapis et intérieurs de véhicules. Présentation claire des formules, devis gratuit en ligne et référencement local, prise de rendez-vous visible 7 jours sur 7.",
  scope: ["Site vitrine sur-mesure et responsive", "Devis et prise de RDV en ligne", "SEO local Montpellier", "Livré en 10 jours"],
  review:
    "LOLITE a livré notre site en moins de deux semaines, exactement comme on l'imaginait. Les clients nous trouvent désormais sur Google et demandent leur devis directement en ligne. Rapide, professionnel, sans prise de tête — je recommande les yeux fermés.",
};

const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const sentence = (s) => (/[.!?…]$/.test(s) ? s : `${s}.`);
// Crochets échappés : le texte d'un lien Markdown ne doit pas se fermer trop tôt.
const linkText = (s) => s.replace(/[[\]]/g, "\\$&");
const euros = (price) => parseInt(price.replace(/\D/g, ""), 10);
const isFrom = (plan) => /^à partir de$/i.test(plan.prefix.trim());

/** « à partir de 450 € » ou « 25 € par mois, sans engagement, ou 250 € par an (…) ». */
function priceLine(plan) {
  const main = isFrom(plan)
    ? `${lower(plan.prefix)} ${plan.price}${plan.suffix}`
    : `${plan.price}${plan.suffix}${plan.prefix ? `, ${lower(plan.prefix)}` : ""}`;
  return plan.altPrice ? `${main}, ${plan.altPrice}` : main;
}

export function buildLlmsTxt(data, routes) {
  const { FAQS, PLANS, SERVICES, SECTORS, SITE_URL, INSTAGRAM_URL, FACEBOOK_URL, LEGAL, WA_DISPLAY, WA_NUMBER } = data;
  const waUrl = `https://wa.me/${WA_NUMBER}`;
  const briefUrl = `${SITE_URL}/#brief`;
  // Prix d'entrée : la moins chère des formules « à partir de » (création de site).
  const entry = PLANS.filter(isFrom).sort((a, b) => euros(a.price) - euros(b.price))[0];

  const out = [];
  const add = (...lines) => out.push(...lines);

  add(
    "# LOLITE",
    "",
    `> LOLITE est un studio web indépendant basé à Montpellier qui crée des sites vitrines sur-mesure pour les professionnels, livrés en 1 à 2 semaines${entry ? `, ${lower(entry.prefix)} ${entry.price}` : ""}. Clientèle professionnelle uniquement (B2B). Travail 100 % à distance, à Montpellier, partout en France et dans les DOM-TOM. Contact par WhatsApp ou téléphone au ${WA_DISPLAY} ; devis gratuit.`,
    "",
    `Site : ${SITE_URL}`,
    "",
  );

  add(
    "## Qui est LOLITE",
    "",
    "- Studio web indépendant basé à Montpellier (Hérault, France).",
    `- Studio tenu par ${LEGAL.owner} — ${lower(LEGAL.status)}.`,
    "- Métier unique : la création de sites vitrines sur-mesure, livrés en 1 à 2 semaines.",
    "- Clientèle professionnelle uniquement (entreprises, artisans, commerçants, professions libérales, associations) ; pas de prestations aux particuliers.",
    "- Zone d'intervention : Montpellier, France entière et DOM-TOM, 100 % à distance (visio, WhatsApp, téléphone).",
    "",
  );

  add("## Services", "");
  for (const s of SERVICES) add(`- **${s.title}** — ${sentence(s.desc)} Points clés : ${s.tags.join(" ; ")}.`);
  add("");

  add("## Tarifs", "", `Prix nets : ${LEGAL.vat}. Devis gratuit et sans engagement.`, "");
  for (const p of PLANS) {
    add(`### ${p.name}`, "", `Prix : ${priceLine(p)}. ${sentence(p.tag)}`, "", p.desc, "");
    if (p.extras?.length) add("Inclus :", "");
    for (const f of p.features) add(`- ${f}`);
    add("");
    if (p.extras?.length) {
      add("En dehors du forfait :", "");
      for (const x of p.extras) add(`- ${x}`);
      add("");
    }
    if (p.note) add(p.note, "");
  }

  add("## Secteurs", "");
  for (const s of SECTORS) add(`- **${s.title}** — ${s.desc}`);
  add("");

  add(
    "## Réalisation",
    "",
    `### ${CASE.name} (${CASE.url})`,
    "",
    `${CASE.activity}. Étude de cas ${CASE.year}.`,
    "",
    CASE.summary,
    "",
    ...CASE.scope.map((x) => `- ${x}`),
    "",
    `Avis du client (le gérant de ${CASE.name}) : « ${CASE.review} »`,
    "",
  );

  add("## FAQ", "");
  for (const f of FAQS) add(`### ${f.q}`, "", f.a, "");

  add(
    "## Contact",
    "",
    `- WhatsApp et téléphone : ${WA_DISPLAY} — ${waUrl}`,
    `- Devis gratuit (formulaire de brief) : ${briefUrl}`,
    `- Instagram : ${INSTAGRAM_URL}`,
    `- Facebook : ${FACEBOOK_URL}`,
    "- Pas d'adresse e-mail : contact uniquement par WhatsApp, téléphone ou formulaire de devis.",
    "",
  );

  add("## Pages", "");
  for (const [path, r] of Object.entries(routes)) add(`- [${linkText(r.title)}](${SITE_URL}${path}): ${r.description}`);

  return out.join("\n") + "\n";
}

export function checkLlmsTxt(text, data, routes) {
  const { FAQS, PLANS, LEGAL, WA_DISPLAY, WA_NUMBER, SITE_URL } = data;
  const problems = [];
  const need = (s, what) => {
    if (!text.includes(s)) problems.push(`${what} manquant : « ${s} »`);
  };
  if (!text.startsWith("# LOLITE\n")) problems.push("titre H1 « # LOLITE » absent en tête");
  if (!/^> \S/m.test(text)) problems.push("résumé en citation (> …) absent");
  for (const p of PLANS) {
    need(p.price, `prix (${p.name})`);
    if (p.altPrice) need(p.altPrice, `second tarif (${p.name})`);
  }
  for (const f of FAQS) {
    need(`### ${f.q}`, "question FAQ");
    need(f.a, "réponse FAQ");
  }
  need(WA_DISPLAY, "numéro WhatsApp");
  need(`https://wa.me/${WA_NUMBER}`, "lien WhatsApp");
  need(CASE.name, "étude de cas");
  need(CASE.url, "lien de l'étude de cas");
  need(LEGAL.vat, "mention TVA");
  if (routes) for (const path of Object.keys(routes)) need(`](${SITE_URL}${path})`, "lien de page");
  // Le contact passe uniquement par WhatsApp / téléphone.
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (email) problems.push(`adresse e-mail présente : « ${email[0]} »`);
  return problems;
}

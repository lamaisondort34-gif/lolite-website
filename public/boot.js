/*
 * Exécuté avant l'affichage : décide si l'écran de chargement doit être joué
 * (accueil, 1re visite de la session, sans « animations réduites », sans ancre).
 * Si oui, la page prérendue est masquée (html.preload) jusqu'à ce que le préchargeur
 * la recouvre — il est rendu uniquement côté navigateur, donc absent du HTML indexé.
 */
(function () {
  var l = window.location;
  if (l.pathname !== "/" || l.hash || /[?&]page=/.test(l.search)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    if (sessionStorage.getItem("lolite-preloaded")) return;
    sessionStorage.setItem("lolite-preloaded", "1");
  } catch (e) {
    /* stockage indisponible : on joue le préchargeur */
  }
  var html = document.documentElement;
  html.classList.add("preload");
  // Filet de sécurité : jamais de page masquée si le JavaScript échoue.
  setTimeout(function () {
    html.classList.remove("preload");
  }, 4000);
})();

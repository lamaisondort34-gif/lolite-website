/*
 * Exécuté avant l'affichage : décide si l'intro doit être jouée (accueil, 1re visite de
 * la session, sans « animations réduites », sans ancre). Si oui, la classe html.intro
 * déclenche un rideau 100 % CSS (cf. src/index.css) posé par-dessus la page, qui est
 * déjà affichée derrière : il ne dépend pas du JavaScript de l'appli et disparaît en 1 s.
 * Sans cette classe, rien n'est masqué ni animé à l'arrivée.
 */
(function () {
  var l = window.location;
  if (l.pathname !== "/" || l.hash || /[?&]page=/.test(l.search)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    if (sessionStorage.getItem("lolite-intro")) return;
    sessionStorage.setItem("lolite-intro", "1");
  } catch (e) {
    /* stockage indisponible : on joue l'intro */
  }
  // Logo du rideau demandé tout de suite (il n'est chargé que si l'intro est jouée).
  var logo = document.createElement("link");
  logo.rel = "preload";
  logo.as = "image";
  logo.href = "/images/logo-lolite.webp";
  document.head.appendChild(logo);

  var html = document.documentElement;
  html.classList.add("intro");
  // Intro terminée (animation intro-done, 1 s) : on retire la classe, la page retrouve
  // son état normal. Filet de sécurité si l'événement n'arrive jamais.
  function end(e) {
    if (e && e.animationName !== "intro-done") return;
    html.classList.remove("intro");
    document.removeEventListener("animationend", end);
  }
  document.addEventListener("animationend", end);
  setTimeout(end, 3000);
})();

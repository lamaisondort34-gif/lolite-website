// Chef d'orchestre : construit les actes, puis window.renderFrame(t, tf) dessine l'instant t.
//   t  = instant exact (sous-images pour le flou de mouvement)
//   tf = instant de l'image (pour les effets discrets : grain, curseur, décodage)
import { $, el, put, clamp, lerp, prog, E, noise1, rng, tw } from "./lib.js";
import { CHAPTERS, SHAKES } from "./timeline.js";
import a1 from "./acts/a1-hook.js";
import a2 from "./acts/a2-logo.js";
import a3 from "./acts/a3-product.js";
import a4 from "./acts/a4-visible.js";
import a5 from "./acts/a5-proof.js";
import a6 from "./acts/a6-convert.js";
import a7 from "./acts/a7-services.js";
import a8 from "./acts/a8-offer.js";
import a9 from "./acts/a9-cta.js";

const ACTS = [a1, a2, a3, a4, a5, a6, a7, a8, a9];
const G = {};

async function init() {
  const cam = $("cam");
  G.fxCanvas = $("fx");
  G.fx = G.fxCanvas.getContext("2d");
  for (const a of ACTS) {
    a.root = el("div", { class: "scene", id: a.id }, cam);
    a.build(a.root, G);
  }
  await Promise.all(
    ["800 100px Bricolage", "300 100px Bricolage", "italic 100px Instrument", "100px Instrument", "400 30px Mono",
     "500 30px Mono", "700 30px Mono", "600 30px Outfit", "400 30px Outfit", "800 30px Outfit"].map((f) => document.fonts.load(f)),
  );
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => (i.complete ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = r; i.onerror = r; }))));
  // mesures de mise en page (éléments visibles le temps de la mesure)
  for (const a of ACTS) {
    if (!a.measure) continue;
    a.root.style.display = "block";
    a.measure(G);
    a.root.style.display = "none";
  }
  buildHud();
  buildGrain();
  window.__ready = true;
}

/* ---------- HUD (habillage « film de marque ») ---------- */
let hud;
function buildHud() {
  const h = $("hud");
  hud = {
    root: h,
    left: el("div", { class: "abs mono", style: { left: "64px", top: "92px", fontSize: "22px", fontWeight: 500 } }, h),
    right: el("div", { class: "abs mono", style: { right: "64px", top: "92px", fontSize: "22px", fontWeight: 500, textAlign: "right", height: "30px", overflow: "hidden" } }, h),
    line: el("div", { class: "abs", style: { left: "64px", right: "64px", top: "140px", height: "2px" } }, h),
    bar: null,
  };
  hud.left.innerHTML = 'LOLITE<span style="opacity:.5">®</span> &nbsp;STUDIO WEB';
  hud.bar = el("div", { class: "abs", style: { left: 0, top: 0, height: "2px", width: "100%", transformOrigin: "0 0" } }, hud.line);
  hud.roll = el("div", {}, hud.right);
  for (const c of CHAPTERS) el("div", { style: { height: "30px", lineHeight: "30px" }, html: c.label }, hud.roll);
}
function renderHud(t) {
  const on = prog(t, 6.75, 7.15) * (1 - prog(t, 39.75, 40.05));
  hud.root.style.opacity = on;
  if (on <= 0) return;
  // thème : texte clair sur fond sombre / violet
  let theme = "light";
  for (const c of CHAPTERS) if (t >= c.t) theme = c.theme;
  const col = theme === "light" ? "rgba(22,16,43,.62)" : "rgba(255,255,255,.78)";
  hud.left.style.color = col;
  hud.right.style.color = col;
  hud.line.style.background = theme === "light" ? "rgba(22,16,43,.10)" : "rgba(255,255,255,.16)";
  hud.bar.style.background = theme === "light" ? "#7c3aed" : "#fff";
  hud.bar.style.transform = `scaleX(${clamp((t - 6.5) / (40 - 6.5))})`;
  // compteur de chapitre qui roule
  let y = 0;
  CHAPTERS.forEach((c, i) => { if (i > 0) y += E.brand(prog(t, c.t - 0.15, c.t + 0.3)); });
  hud.roll.style.transform = `translateY(${-y * 30}px)`;
}

/* ---------- Grain + vignette ---------- */
let grainCtx, grainImg;
function buildGrain() {
  const c = $("grain");
  grainCtx = c.getContext("2d");
  grainImg = grainCtx.createImageData(c.width, c.height);
}
function renderGrain(tf) {
  const r = rng(Math.floor(tf * 24) + 7);
  const d = grainImg.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = 128 + (r() - 0.5) * 48;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = 255;
  }
  grainCtx.putImageData(grainImg, 0, 0);
}

/* ---------- Caméra ---------- */
function camera(t) {
  let x = 0, y = 0, r = 0;
  for (const [t0, amp, dur] of SHAKES) {
    if (t < t0 || t > t0 + dur) continue;
    const k = amp * (1 - prog(t, t0, t0 + dur)) ** 2;
    x += noise1((t - t0) * 38, t0) * k;
    y += noise1((t - t0) * 38, t0 + 11) * k;
    r += noise1((t - t0) * 30, t0 + 23) * k * 0.04;
  }
  put($("cam"), { x, y, r });
}

window.renderFrame = (t, tf = t) => {
  G.fx.setTransform(1, 0, 0, 1, 0, 0);
  G.fx.clearRect(0, 0, 1080, 1920);
  for (const a of ACTS) {
    const on = t >= a.t0 && t < a.t1;
    a.root.style.display = on ? "block" : "none";
    if (on) a.render(t, tf, G);
  }
  camera(t);
  renderHud(t);
  renderGrain(tf);
  // vignette : plus marquée sur les fonds sombres
  const dark = t < 6.2 || (t > 23.6 && t < 31.9);
  $("vignette").style.background = dark
    ? "radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,.55))"
    : "radial-gradient(120% 80% at 50% 45%, transparent 60%, rgba(76,29,149,.10))";
};

init();

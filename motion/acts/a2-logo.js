// ACTE 2 — La lumière (6 → 12 s) : explosion, le logo se dessine, la promesse.
import { el, put, clamp, lerp, prog, E, tw, kf, pulse, polyline } from "../lib.js";
import { headline, animWords, animChars, sprite } from "../ui.js";
import { burst, ring, twinkles, sparkle } from "../fx.js";

const LOGO = "/public/images/logo-lolite.webp";
const IW = 547;
const K = 600 / IW;
const LX = 240, LY = 640; // coin haut-gauche du logo sur la scène
const st = (x, y) => [LX + x * K, LY + y * K];
const LOGO_C = [540, LY + (520 * K) / 2];

const S = {};

// ligne médiane du ruban (deux cercles reliés par des tangentes croisées)
function infinityPoints() {
  const r = 95, C = [273, 188], OR = [407, 188], OL = [139, 188];
  const beta = Math.acos(r / (OR[0] - C[0]));
  const pts = [];
  const arc = (O, a0, a1, n) => { for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push([O[0] + r * Math.cos(a), O[1] + r * Math.sin(a)]); } };
  const line = (A, B, n) => { for (let i = 0; i <= n; i++) pts.push([A[0] + ((B[0] - A[0]) * i) / n, A[1] + ((B[1] - A[1]) * i) / n]); };
  const aUp = Math.PI + beta, aLow = Math.PI - beta + 2 * Math.PI; // sur le cercle droit (sens horaire écran)
  const TupR = [OR[0] + r * Math.cos(aUp), OR[1] + r * Math.sin(aUp)];
  const TlowR = [OR[0] + r * Math.cos(aLow), OR[1] + r * Math.sin(aLow)];
  const TupL = [2 * C[0] - TlowR[0], 2 * C[1] - TlowR[1]];
  const TlowL = [2 * C[0] - TupR[0], 2 * C[1] - TupR[1]];
  line(C, TupR, 12);
  arc(OR, aUp, aLow, 90);
  line(TlowR, TupL, 24);
  arc(OL, -beta, -2 * Math.PI + beta, 90);
  line(TlowL, C, 12);
  return pts.map(([x, y]) => st(x, y));
}

function build(root) {
  root.style.background = "#fafafd";
  // dégradé maillé vivant
  S.blobs = [
    ["#a78bfa", 0.34, 1000, -260, 120],
    ["#c4b5fd", 0.5, 1150, 380, 1180],
    ["#f0abfc", 0.22, 800, 520, -160],
  ].map(([c, a, size, x, y]) => {
    const b = el("div", { class: "abs", style: { left: `${x}px`, top: `${y}px`, width: `${size}px`, height: `${size}px`, borderRadius: "50%",
      background: `radial-gradient(circle, ${c} 0%, transparent 68%)`, opacity: a } }, root);
    return b;
  });

  // ---- logo
  S.logo = el("div", { class: "layer", style: { transformOrigin: `${LOGO_C[0]}px ${LOGO_C[1]}px` } }, root);
  const pts = infinityPoints();
  S.inf = polyline(pts);
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "1080"); svg.setAttribute("height", "1920");
  svg.style.position = "absolute"; svg.style.left = 0; svg.style.top = 0;
  svg.innerHTML = `
    <defs>
      <linearGradient id="ribbonG" x1="240" y1="0" x2="840" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#9333ea"/><stop offset=".5" stop-color="#7c3aed"/><stop offset="1" stop-color="#a855f7"/>
      </linearGradient>
    </defs>
    <path id="infLead" d="${S.inf.d}" pathLength="1" fill="none" stroke="#c4b5fd" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path id="infMain" d="${S.inf.d}" pathLength="1" fill="none" stroke="url(#ribbonG)" stroke-width="${72 * K}" stroke-linecap="round" stroke-linejoin="round"/>
    <path id="infHi" d="${S.inf.d}" pathLength="1" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
  S.logo.appendChild(svg);
  S.svg = svg;
  S.infLead = svg.querySelector("#infLead");
  S.infMain = svg.querySelector("#infMain");
  S.infHi = svg.querySelector("#infHi");

  // ruban raster (sans l'étoile)
  S.mark = sprite(S.logo, LOGO, IW, K, [0, 50, 547, 322], LX, LY);
  const nx0 = (222) * K, nx1 = 324 * K, ny = 42 * K;
  S.mark.inner.style.clipPath = `polygon(0 0, ${nx0}px 0, ${nx0}px ${ny}px, ${nx1}px ${ny}px, ${nx1}px 0, 100% 0, 100% 100%, 0 100%)`;
  // reflet spéculaire masqué par la forme du logo
  S.sheen = el("div", { class: "abs", style: { left: `${LX}px`, top: `${LY}px`, width: `${IW * K}px`, height: `${520 * K}px`,
    WebkitMaskImage: `url(${LOGO})`, WebkitMaskSize: "100% 100%",
    background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,.85) 50%, transparent 62%)", backgroundSize: "300% 100%", mixBlendMode: "screen" } }, S.logo);
  // étoile
  S.star = sprite(S.logo, LOGO, IW, K, [224, 0, 322, 91], LX, LY);
  S.star.box.style.transformOrigin = "50% 100%";
  // lettres LOLITE
  const letters = [[0, 79], [85, 201], [219, 299], [312, 341], [354, 449], [462, 547]];
  S.letters = letters.map(([x0, x1]) => sprite(S.logo, LOGO, IW, K, [x0, 352, x1, 470], LX, LY));
  S.agency = sprite(S.logo, LOGO, IW, K, [0, 482, 547, 520], LX, LY);

  // ---- promesse
  S.p = el("div", { class: "layer", style: { transformOrigin: "540px 930px" } }, root);
  S.l1 = headline(S.p, [{ text: "On crée la", style: { fontSize: "116px" } }], { top: "560px", color: "#16102b" });
  S.hl = ["vitrine", "digitale"].map((word, i) => {
    const line = el("div", { class: "abs center serif", style: { top: `${700 + i * 212}px`, fontSize: "232px", lineHeight: "1" } }, S.p);
    const wrap = el("span", { style: { position: "relative", display: "inline-block", padding: "0 0.1em" } }, line);
    const block = el("span", { class: "abs", style: { left: "0", right: "0", top: "16%", bottom: "2%", background: "#7c3aed", borderRadius: "28px", transformOrigin: "0 50%" } }, wrap);
    const base = el("span", { style: { position: "relative", color: "#7c3aed", display: "inline-block" } }, wrap);
    const over = el("span", { class: "abs", style: { left: "0.1em", top: 0, color: "#fff", display: "inline-block", whiteSpace: "nowrap" } }, wrap);
    const bc = [...word].map((ch) => el("span", { class: "ch", text: ch }, base));
    const oc = [...word].map((ch) => el("span", { class: "ch", text: ch }, over));
    return { line, wrap, block, base, over, bc, oc };
  });
  S.l4 = headline(S.p, [{ text: "de votre entreprise.", style: { fontSize: "80px", fontWeight: 700 } }], { top: "1150px", color: "#16102b" });
  S.expander = el("div", { class: "abs", style: { background: "#7c3aed", display: "none" } }, root);
}

function measure() {
  const r = S.hl[0].block.getBoundingClientRect();
  const s = document.getElementById("stage").getBoundingClientRect();
  S.blockRect = { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
}

function render(t, tf, G) {
  const fx = G.fx;
  // iris d'entrée
  const R = 1180 * E.outExpo(prog(t, 6.1, 6.62));
  S.root.style.clipPath = t < 6.62 ? `circle(${R}px at 540px 960px)` : "none";
  S.blobs.forEach((b, i) => put(b, { x: Math.sin(t * 0.5 + i * 2) * 60, y: Math.cos(t * 0.4 + i) * 50, s: 1 + 0.06 * Math.sin(t * 0.7 + i) }));

  // ---- explosion (au-dessus de tout)
  burst(fx, t, 6.0, 540, 960, { n: 28, seed: 4, r0: 40, r1: 900, dur: 0.7, width: 9, colors: ["#ffffff", "#a78bfa", "#7c3aed"] });
  ring(fx, t, 6.06, 540, 960, { r0: 30, r1: 1250, dur: 0.85, width: 10, color: "#7c3aed" });
  ring(fx, t, 6.14, 540, 960, { r0: 30, r1: 900, dur: 0.75, width: 4, color: "#c4b5fd" });

  // ---- tracé du ruban
  const pLead = E.brand(prog(t, 6.16, 6.98));
  const pMain = E.brand(prog(t, 6.26, 7.06));
  S.infLead.style.strokeDasharray = "1 1";
  S.infLead.style.strokeDashoffset = 1 - pLead;
  S.infMain.style.strokeDasharray = "1 1";
  S.infMain.style.strokeDashoffset = 1 - pMain;
  S.infHi.style.strokeDasharray = "1 1";
  S.infHi.style.strokeDashoffset = 1 - pMain;
  const swap = E.io2(prog(t, 7.04, 7.32));
  S.infLead.style.opacity = 1 - prog(t, 6.9, 7.1);
  S.infMain.style.opacity = 1 - swap;
  S.infHi.style.opacity = 1 - swap;
  S.svg.style.display = t < 7.35 ? "block" : "none";
  // tête lumineuse du tracé
  if (pMain > 0 && pMain < 1) {
    const [hx, hy] = S.inf.at(pMain);
    const g = fx.createRadialGradient(hx, hy, 0, hx, hy, 70);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.3, "rgba(196,181,253,.8)"); g.addColorStop(1, "rgba(124,58,237,0)");
    fx.fillStyle = g; fx.beginPath(); fx.arc(hx, hy, 70, 0, Math.PI * 2); fx.fill();
  }
  // ruban raster
  const pop = 1 + 0.04 * pulse(t, 7.06, 0.1, 0.35);
  put(S.mark.box, { o: swap });
  // reflet
  const sh = prog(t, 7.3, 8.0);
  S.sheen.style.backgroundPosition = `${lerp(110, -10, E.io2(sh))}% 0`;
  S.sheen.style.opacity = sh > 0 && sh < 1 ? 1 : 0;

  // ---- étoile : chute en vrille, impact, rebond
  const fall = prog(t, 6.92, 7.2);
  const land = t - 7.2;
  let sy = -520 * (1 - E.in2(fall)), rot = -300 * (1 - E.out2(fall)), sx = 1, scy = 1;
  if (land > 0) {
    const sq = Math.exp(-land * 9) * Math.cos(land * 34);
    sx = 1 + 0.28 * sq; scy = 1 - 0.32 * sq;
    rot = 0;
    sy = -30 * Math.max(0, Math.exp(-land * 7) * Math.sin(land * 22));
  }
  S.star.box.style.opacity = fall > 0 ? 1 : 0;
  S.star.box.style.transform = `translateY(${sy}px) rotate(${rot}deg) scale(${sx},${scy})`;
  const [stx, sty] = st(273, 45);
  twinkles(fx, t, 7.2, stx, sty, { n: 10, seed: 8, dist: 190, size: 26, dur: 0.85 });
  ring(fx, t, 7.2, stx, sty, { r0: 30, r1: 170, dur: 0.5, width: 5, color: "#a78bfa" });

  // ---- lettres
  S.letters.forEach((L, i) => {
    const p = E.brandOut(prog(t, 7.28 + i * 0.05, 7.88 + i * 0.05));
    L.inner.style.transformOrigin = "0 100%";
    L.inner.style.transform = `translateY(${(1 - p) * 150}%) rotate(${(1 - p) * 8}deg)`;
  });
  const ap = E.brand(prog(t, 7.68, 8.15));
  S.agency.inner.style.clipPath = `inset(0 ${(1 - ap) * 50}% 0 ${(1 - ap) * 50}%)`;

  // ---- le logo monte en tête de page, puis sort
  const up = E.brand(prog(t, 8.25, 8.95));
  const out = E.in3(prog(t, 11.12, 11.4));
  put(S.logo, { y: lerp(0, 318 - LOGO_C[1], up) - out * 300, s: lerp(1, 0.4, up) * pop, o: 1 - out });

  // ---- promesse
  animWords(S.l1.words, t, 8.62, 11.16, { st: 0.1, dur: 0.6 });
  S.hl.forEach((h, i) => {
    const t0 = 8.82 + i * 0.22;
    animChars(h.bc, t, t0, 11.2, { st: 0.035 });
    animChars(h.oc, t, t0, 11.2, { st: 0.035 });
    const bp = E.brand(prog(t, 9.42 + i * 0.12, 9.86 + i * 0.12));
    put(h.block, { sx: bp, sy: 1 });
    h.over.style.clipPath = `inset(17% ${(1 - bp) * 100}% 3% -5%)`;
    h.block.style.opacity = i === 0 && t >= 11.32 ? 0 : 1;
    if (i === 1) put(h.block, { sx: bp * (1 - E.in3(prog(t, 11.15, 11.42))), sy: 1 });
  });
  animWords(S.l4.words, t, 9.74, 11.14, { st: 0.07, dur: 0.55 });
  put(S.p, { s: 1 + 0.025 * E.io2(prog(t, 9, 11.3)) });
  // scintillements autour de « vitrine »
  if (t > 9.8 && t < 11.2) {
    const a = Math.sin(Math.PI * prog(t, 9.85, 11.1));
    sparkle(fx, 905, 760, 34 * a * (0.8 + 0.2 * Math.sin(t * 9)), t * 1.5, "#7c3aed");
    sparkle(fx, 952, 818, 18 * a, -t * 2, "#a78bfa");
    sparkle(fx, 150, 1040, 24 * a * (0.8 + 0.2 * Math.cos(t * 7)), t, "#a78bfa");
  }

  // ---- le surlignage devient l'écran suivant
  const ex = E.brand(prog(t, 11.36, 11.96));
  S.expander.style.display = t >= 11.32 ? "block" : "none";
  if (t >= 11.32) {
    const b = S.blockRect;
    Object.assign(S.expander.style, {
      left: `${lerp(b.x, 0, ex)}px`, top: `${lerp(b.y, 0, ex)}px`, width: `${lerp(b.w, 1080, ex)}px`, height: `${lerp(b.h, 1920, ex)}px`,
      borderRadius: `${lerp(28, 0, ex)}px`,
    });
  }
}

const act = { id: "a2", t0: 6.0, t1: 12.0, build, render, measure };
export default {
  ...act,
  build(root, G) { S.root = root; build(root, G); },
};

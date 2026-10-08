// ACTE 7 — Clé en main (31,8 → 36 s) : on s'occupe de tout.
import { el, put, clamp, lerp, prog, E, tw, pulse } from "../lib.js";
import { headline, animWords, icon } from "../ui.js";
import { ACCEPT } from "./a6-convert.js";
import { twinkles, ring, sparkle } from "../fx.js";

const TILES = [
  { ic: "pen-tool", title: "Design sur-mesure", sub: "Maquette unique" },
  { ic: "image", title: "Photos retouchées", sub: "Mise en valeur pro" },
  { ic: "rocket", title: "Mise en ligne", sub: "Clé en main" },
  { ic: "map-pin", title: "Fiche Google", sub: "SEO local" },
];
const TW = 430, TH = 330, GX = 90, GY = 700, GAP = 40;
export const MERGE = [540, 1070];
const S = {};

function build(root) {
  root.style.background = "#fafafd";
  el("div", { class: "layer", style: { background: "radial-gradient(60% 40% at 15% 15%, rgba(196,181,253,.6), transparent 70%), radial-gradient(60% 40% at 90% 85%, rgba(167,139,250,.4), transparent 70%)" } }, root);
  el("div", { class: "layer", style: { backgroundImage: "radial-gradient(rgba(124,58,237,.16) 1.6px, transparent 2.2px)", backgroundSize: "48px 48px",
    WebkitMaskImage: "radial-gradient(55% 45% at 50% 55%, #000, transparent 85%)" } }, root);

  S.h = headline(root, [{ text: "On s'occupe", style: { fontSize: "108px" } }], { top: "250px", color: "#16102b" });
  S.tout = el("div", { class: "abs center serif", style: { top: "350px", fontSize: "200px", lineHeight: "1", color: "#7c3aed" } }, root);
  S.toutChars = [..."de tout."].map((c) => el("span", { class: "ch", text: c }, S.tout));

  S.tiles = TILES.map((T, i) => {
    const x = GX + (i % 2) * (TW + GAP), y = GY + Math.floor(i / 2) * (TH + GAP);
    const tile = el("div", { class: "abs card", style: { left: `${x}px`, top: `${y}px`, width: `${TW}px`, height: `${TH}px`, transformOrigin: "50% 0%" } }, root);
    const box = el("div", { class: "abs", style: { left: "36px", top: "36px", width: "128px", height: "128px", borderRadius: "34px", background: "#f1edf9", display: "grid", placeItems: "center", color: "#7c3aed", overflow: "hidden" } }, tile);
    box.innerHTML = icon(T.ic, 68, 'style="stroke-width:2"');
    el("div", { class: "abs", style: { left: "36px", top: "200px", font: "700 37px Outfit", color: "#16102b", letterSpacing: "-0.01em" }, text: T.title }, tile);
    el("div", { class: "abs", style: { left: "36px", top: "250px", font: "400 26px Outfit", color: "#5e5872" }, text: T.sub }, tile);
    const bar = i === 2 ? el("div", { class: "abs", style: { left: "200px", top: "86px", width: "190px", height: "14px", borderRadius: "7px", background: "#efeaf9", overflow: "hidden" } }, tile) : null;
    const fill = bar ? el("div", { style: { width: "100%", height: "100%", background: "linear-gradient(90deg,#a78bfa,#7c3aed)", transformOrigin: "0 50%" } }, bar) : null;
    const pct = bar ? el("div", { class: "abs mono", style: { left: "200px", top: "112px", fontSize: "22px", color: "#7c3aed", fontWeight: 700 } }, tile) : null;
    const badge = el("div", { class: "abs", style: { left: `${x + TW - 92}px`, top: `${y + 28}px`, width: "64px", height: "64px", borderRadius: "50%", background: "#7c3aed", color: "#fff", display: "grid", placeItems: "center", boxShadow: "0 10px 30px rgba(124,58,237,.45)" } }, root);
    badge.innerHTML = icon("check", 36, 'style="stroke-width:3.4"');
    return { tile, box, paths: [...box.querySelectorAll("path, circle, rect, line, polyline")], fill, pct, badge, x, y, ico: box.firstElementChild };
  });
  S.merge = el("div", { class: "abs", style: { left: `${MERGE[0] - 60}px`, top: `${MERGE[1] - 60}px`, width: "120px", height: "120px", borderRadius: "50%", background: "#7c3aed", color: "#fff", display: "grid", placeItems: "center", boxShadow: "0 20px 60px rgba(124,58,237,.55)" } }, root);
  S.merge.innerHTML = icon("check", 64, 'style="stroke-width:3.2"');
}

function render(t, tf, G) {
  const fx = G.fx;
  const R = 2300 * E.brand(prog(t, 31.78, 32.38));
  S.root.style.clipPath = t < 32.38 ? `circle(${R}px at ${ACCEPT[0]}px ${ACCEPT[1]}px)` : "none";

  animWords(S.h.words, t, 32.0, 35.3, { st: 0.09 });
  S.toutChars.forEach((c, i) => {
    const t0 = 32.25 + i * 0.05;
    const s = Math.min(1.2, 0.0001 + Math.max(0, 1 - Math.exp(-(t - t0) * 9) * Math.cos((t - t0) * 22)));
    const out = E.in3(prog(t, 35.32 + i * 0.015, 35.55 + i * 0.015));
    c.style.transform = t < t0 ? "scale(0)" : `translateY(${(1 - Math.min(1, s)) * 40 - out * 140}px) scale(${s})`;
    c.style.opacity = t < t0 ? 0 : 1 - out;
  });

  S.tiles.forEach((T, i) => {
    const t0 = 32.6 + i * 0.14;
    const p = prog(t, t0, t0 + 0.6);
    const out = E.inBack(prog(t, 35.3 + i * 0.05, 35.6 + i * 0.05), 1.6);
    put(T.tile, { persp: 1400, rx: (1 - E.outBack(p, 1.5)) * -100, y: (1 - E.out3(p)) * 30, s: 1 - out, o: clamp(p * 4) });
    T.paths.forEach((pa) => { pa.style.strokeDasharray = "1 1"; pa.style.strokeDashoffset = 1 - E.brand(prog(t, t0 + 0.25, t0 + 0.95)); });
    // micro-animations propres à chaque tuile
    if (i === 0) put(T.ico, { r: Math.sin((t - t0) * 3) * 8 * prog(t, t0 + 0.9, t0 + 1.2) });
    if (i === 1 && t > t0 + 0.9 && t < t0 + 2.0) sparkle(fx, T.x + 150, T.y + 60, 20 * Math.sin(Math.PI * prog(t, t0 + 0.9, t0 + 1.8)), t * 3, "#a78bfa");
    if (i === 2) {
      const f = E.io2(prog(t, t0 + 0.4, t0 + 1.5));
      T.fill.style.transform = `scaleX(${f})`;
      T.pct.textContent = `${Math.round(f * 100)} %`;
      put(T.ico, { y: -Math.abs(Math.sin((t - t0) * 9)) * 6 * prog(t, t0 + 0.6, t0 + 0.8), x: Math.sin((t - t0) * 31) * 1.5 * prog(t, t0 + 0.6, t0 + 0.8) });
      T.pct.style.opacity = prog(t, t0 + 0.4, t0 + 0.5);
    }
    if (i === 3) put(T.ico, { y: -18 * pulse(t, t0 + 1.0, 0.12, 0.35) });
    // coche
    const b0 = 34.05 + i * 0.13;
    const bp = prog(t, b0, b0 + 0.35);
    // les coches fusionnent au centre
    const fly = E.brand(prog(t, 35.38 + i * 0.03, 35.72));
    const bx = T.x + TW - 60, by = T.y + 60;
    put(T.badge, { x: (MERGE[0] - bx) * fly, y: (MERGE[1] - by) * fly, s: E.outBack(bp, 2.8) * lerp(1, 1.4, fly), o: bp > 0 && fly < 1 ? 1 : 0 });
    T.badge.querySelectorAll("path, polyline").forEach((pa) => { pa.style.strokeDasharray = "1 1"; pa.style.strokeDashoffset = 1 - E.out3(prog(t, b0 + 0.1, b0 + 0.35)); });
    ring(fx, t, b0 + 0.05, bx, by, { r0: 30, r1: 80, dur: 0.35, width: 4, color: "#7c3aed" });
  });
  const mg = prog(t, 35.7, 35.85);
  put(S.merge, { s: mg > 0 ? 1.4 + 0.3 * pulse(t, 35.72, 0.05, 0.15) : 0, o: mg > 0 ? 1 : 0 });
}

export default { id: "a7", t0: 31.78, t1: 36.25, build(root, G) { S.root = root; build(root, G); }, render };

// ACTE 5 — La preuve (23,5 → 28 s) : comme Toutneuf34, à Montpellier.
import { el, put, clamp, lerp, prog, E, tw, decode, pulse } from "../lib.js";
import { headline, animWords, icon } from "../ui.js";
import { diag, wipeEdge } from "./a4-visible.js";
import { twinkles, ring } from "../fx.js";

const DESK = "/public/images/work-toutneuf-desktop.webp";
const MOB = "/public/images/work-toutneuf-mobile.webp";
const S = {};

export function darkBg(root) {
  root.style.background = "#0b0718";
  el("div", { class: "layer", style: { background: "radial-gradient(70% 45% at 50% 62%, rgba(124,58,237,.42), transparent 70%), radial-gradient(60% 30% at 50% 0%, rgba(167,139,250,.25), transparent 70%)" } }, root);
  el("div", { class: "layer", style: { backgroundImage: "radial-gradient(rgba(196,181,253,.22) 1.6px, transparent 2.2px)", backgroundSize: "54px 54px",
    WebkitMaskImage: "radial-gradient(60% 50% at 50% 55%, #000, transparent 80%)", opacity: 0.6 } }, root);
}

function build(root) {
  darkBg(root);
  S.tag = el("div", { class: "abs center mono", style: { top: "236px", fontSize: "26px", fontWeight: 500, color: "#c4b5fd" } }, root);
  S.h = headline(root, [
    { text: "Comme", style: { fontSize: "92px" } },
    { text: "Toutneuf34,", cls: "serif", style: { fontSize: "176px", lineHeight: "1.0" } },
  ], { top: "300px", color: "#fff" });
  // dégradé sur le nom
  S.h.lines[1].words.forEach((w) => Object.assign(w.inner.style, { background: "linear-gradient(90deg, #c4b5fd, #ffffff 55%, #a78bfa)", WebkitBackgroundClip: "text", color: "transparent", paddingRight: "0.08em" }));
  S.city = el("div", { class: "abs center", style: { top: "584px", display: "flex", justifyContent: "center", alignItems: "center", gap: "18px", color: "#fff" } }, root);
  S.pin = el("span", { style: { color: "#a78bfa", display: "grid" }, html: icon("map-pin", 70, 'style="stroke-width:2.2"') }, S.city);
  S.cityTxt = el("div", { class: "disp", style: { fontSize: "84px", fontWeight: 700 } }, S.city);
  S.cityTxt.textContent = "à Montpellier.";

  // vitrine 3D
  S.stage3d = el("div", { class: "abs", style: { left: 0, top: "700px", width: "1080px", height: "900px", perspective: "1900px" } }, root);
  S.desk = el("div", { class: "abs", style: { left: "110px", top: "90px", width: "820px", borderRadius: "22px", overflow: "hidden", background: "#fff",
    boxShadow: "0 80px 140px -30px rgba(0,0,0,.8), 0 0 0 2px rgba(255,255,255,.12)", transformStyle: "preserve-3d" } }, S.stage3d);
  const chrome = el("div", { style: { height: "42px", background: "#f2eff9", display: "flex", alignItems: "center", gap: "9px", padding: "0 18px" } }, S.desk);
  chrome.innerHTML = `<i style="width:12px;height:12px;border-radius:50%;background:#ff5f57"></i><i style="width:12px;height:12px;border-radius:50%;background:#febc2e"></i><i style="width:12px;height:12px;border-radius:50%;background:#28c840"></i>`;
  S.deskImg = el("img", { src: DESK, style: { width: "820px" } }, S.desk);
  S.deskSheen = el("div", { class: "abs", style: { inset: 0, background: "linear-gradient(110deg, transparent 35%, rgba(255,255,255,.4) 50%, transparent 65%)", backgroundSize: "300% 100%" } }, S.desk);

  S.phone = el("div", { class: "abs", style: { left: "690px", top: "280px", width: "272px", height: "556px", borderRadius: "44px", background: "#0f0a1f", padding: "10px",
    boxShadow: "0 70px 120px -20px rgba(0,0,0,.85), 0 0 0 2px rgba(255,255,255,.14)" } }, S.stage3d);
  const scr = el("div", { style: { width: "100%", height: "100%", borderRadius: "35px", overflow: "hidden", background: "#fff", position: "relative" } }, S.phone);
  S.phoneImg = el("img", { src: MOB, style: { position: "absolute", left: 0, top: "26px", width: "252px" } }, scr);
  S.phoneSheen = el("div", { class: "abs", style: { inset: 0, background: "linear-gradient(110deg, transparent 35%, rgba(255,255,255,.45) 50%, transparent 65%)", backgroundSize: "300% 100%" } }, scr);

  S.badge = el("div", { class: "abs chip", style: { left: "96px", top: "690px", background: "rgba(255,255,255,.1)", border: "2px solid rgba(255,255,255,.18)", color: "#fff", fontSize: "28px", backdropFilter: "blur(8px)" } }, S.stage3d);
  S.badge.innerHTML = `<span style="width:14px;height:14px;border-radius:50%;background:#4ade80;box-shadow:0 0 14px #4ade80"></span> En ligne · mobile &amp; ordinateur`;
}

function render(t, tf, G) {
  const fx = G.fx;
  const e = wipeEdge(t, 23.56);
  S.root.style.clipPath = e > -50 ? diag(e) : "none";

  S.tag.textContent = decode("● RÉALISATION LOLITE", tf, 23.95, 0.5, 9, Math.round(tf * 30));
  put(S.tag, { o: prog(t, 23.9, 24.0) * (1 - prog(t, 27.35, 27.5)) });
  animWords(S.h.words, t, 24.0, 27.35, { st: 0.12, dur: 0.6 });
  const cp = E.brandOut(prog(t, 24.42, 24.95));
  put(S.city, { y: (1 - cp) * 50 - E.in3(prog(t, 27.4, 27.65)) * 60, o: clamp(cp * 2) * (1 - prog(t, 27.4, 27.6)) });
  S.pin.querySelectorAll("path, circle").forEach((p) => { p.style.strokeDasharray = "1 1"; p.style.strokeDashoffset = 1 - E.brand(prog(t, 24.42, 25.0)); });
  put(S.pin, { y: -22 * pulse(t, 25.0, 0.12, 0.3) });

  // écrans qui surgissent de la profondeur, puis flottent
  const dIn = E.brandOut(prog(t, 24.05, 24.95));
  const pIn = E.brandOut(prog(t, 24.25, 25.15));
  const out = E.inExpo(prog(t, 27.3, 27.85));
  const drift = t - 24;
  put(S.desk, { z: lerp(-1600, 0, dIn) - out * 2200, y: (1 - dIn) * 260 + Math.sin(drift * 1.1) * 8, rx: 12 + Math.sin(drift * 0.9) * 2, ry: -20 + Math.sin(drift * 0.7) * 3, r: 3, o: clamp(dIn * 3) * (1 - out) });
  put(S.phone, { z: lerp(-900, 120, pIn) - out * 1600, x: Math.sin(drift * 1.3) * 6, y: (1 - pIn) * 420 + Math.cos(drift * 1.2) * 12, rx: 10, ry: -24 + Math.sin(drift * 0.8) * 4, r: 4, o: clamp(pIn * 3) * (1 - out) });
  S.deskImg.style.transform = `translateY(${-E.io2(prog(t, 25.2, 27.2)) * 40}px)`;
  S.deskSheen.style.backgroundPosition = `${lerp(120, -20, E.io2(prog(t, 25.0, 25.8)))}% 0`;
  S.phoneSheen.style.backgroundPosition = `${lerp(120, -20, E.io2(prog(t, 25.15, 25.95)))}% 0`;
  put(S.badge, { s: E.outBack(prog(t, 25.2, 25.55), 2), o: t > 25.2 ? 1 - out : 0, y: Math.sin(t * 2) * 5 });
  if (t > 25.0 && t < 26.2) twinkles(fx, t, 25.0, 850, 1060, { n: 8, seed: 31, dist: 260, size: 20, dur: 1.0, colors: ["#ffffff", "#c4b5fd"] });
}

export default { id: "a5", t0: 23.5, t1: 27.95, build(root, G) { S.root = root; build(root, G); }, render };

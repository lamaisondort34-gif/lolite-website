// ACTE 8 — L'offre (35,7 → 40,2 s) : livré en 14 jours, dès 450 €.
import { el, put, clamp, lerp, prog, E, tw, pulse } from "../lib.js";
import { headline, animWords, odometer, icon } from "../ui.js";
import { MERGE } from "./a7-services.js";
import { twinkles, ring, burst, confetti } from "../fx.js";

const RC = [540, 920], RR = 268;
const S = {};

function build(root) {
  root.style.background = "#7c3aed";
  el("div", { class: "layer", style: { background: "radial-gradient(60% 40% at 50% 45%, rgba(167,139,250,.75), transparent 70%), radial-gradient(80% 40% at 50% 105%, rgba(76,29,149,.9), transparent 70%)" } }, root);
  S.rays = el("div", { class: "abs", style: { left: `${RC[0] - 1100}px`, top: `${RC[1] - 1100}px`, width: "2200px", height: "2200px", borderRadius: "50%",
    background: "repeating-conic-gradient(from 0deg, rgba(255,255,255,.07) 0deg 6deg, transparent 6deg 18deg)",
    WebkitMaskImage: "radial-gradient(circle, #000 15%, transparent 60%)" } }, root);

  S.h = headline(root, [{ text: "Livré en", style: { fontSize: "104px" } }], { top: "236px", color: "#fff" });

  S.group = el("div", { class: "layer", style: { transformOrigin: `${RC[0]}px ${RC[1]}px` } }, root);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", 1080); svg.setAttribute("height", 1920);
  Object.assign(svg.style, { position: "absolute", left: 0, top: 0 });
  let dots = "";
  for (let i = 0; i < 14; i++) {
    const a = -Math.PI / 2 + ((i + 1) / 14) * Math.PI * 2;
    dots += `<circle class="day" cx="${RC[0] + Math.cos(a) * (RR + 64)}" cy="${RC[1] + Math.sin(a) * (RR + 64)}" r="11" fill="#fff"/>`;
  }
  svg.innerHTML = `<circle cx="${RC[0]}" cy="${RC[1]}" r="${RR}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="26"/>
    <circle id="prog" cx="${RC[0]}" cy="${RC[1]}" r="${RR}" fill="none" stroke="#fff" stroke-width="26" stroke-linecap="round" pathLength="1" transform="rotate(-90 ${RC[0]} ${RC[1]})"/>
    ${dots}`;
  S.group.appendChild(svg);
  S.prog = svg.querySelector("#prog");
  S.days = [...svg.querySelectorAll(".day")];
  S.days.forEach((d) => { d.style.transformBox = "fill-box"; d.style.transformOrigin = "center"; });
  S.num = el("div", { class: "abs disp", style: { left: 0, right: 0, top: `${RC[1] - 175}px`, display: "flex", justifyContent: "center", fontSize: "290px", color: "#fff", letterSpacing: "-0.05em", lineHeight: "1" } }, S.group);
  S.odo = odometer(S.num, 2, { lineHeight: "1em" });
  S.jours = el("div", { class: "abs center", style: { top: `${RC[1] + 130}px`, font: "500 46px Outfit", color: "#ede9fe", letterSpacing: "0.02em" }, text: "jours" }, S.group);

  // prix
  S.price = el("div", { class: "abs", style: { left: 0, right: 0, top: "1010px", display: "flex", justifyContent: "center", alignItems: "baseline", gap: "26px", color: "#fff" } }, root);
  S.des = el("div", { class: "disp", style: { fontSize: "78px", fontWeight: 400 }, text: "Dès" }, S.price);
  S.pnum = el("div", { class: "disp", style: { fontSize: "236px", display: "flex", letterSpacing: "-0.05em", lineHeight: "1" } }, S.price);
  S.podo = odometer(S.pnum, 3, { lineHeight: "1em" });
  S.euro = el("div", { class: "disp", style: { fontSize: "170px", display: "inline-block" }, text: "€" }, S.price);
  S.swoosh = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  S.swoosh.setAttribute("width", 1080); S.swoosh.setAttribute("height", 1920);
  Object.assign(S.swoosh.style, { position: "absolute", left: 0, top: 0 });
  S.swoosh.innerHTML = `<path d="M300 1268 C 450 1236, 690 1236, 820 1256" fill="none" stroke="#ffb547" stroke-width="16" stroke-linecap="round" pathLength="1"/>`;
  root.appendChild(S.swoosh);
  S.swPath = S.swoosh.querySelector("path");
  S.chips = el("div", { class: "abs", style: { left: 0, right: 0, top: "1324px", display: "flex", justifyContent: "center", gap: "20px" } }, root);
  S.chipEls = [`${icon("check", 30, 'style="stroke-width:3"')} Devis gratuit`, "Maintenance dès 50 €/mois"].map((h) =>
    el("div", { class: "chip", style: { background: "rgba(255,255,255,.14)", border: "2px solid rgba(255,255,255,.3)", color: "#fff", fontSize: "30px" }, html: h }, S.chips));
}

function render(t, tf, G) {
  const fx = G.fx;
  const R = 2300 * E.brand(prog(t, 35.7, 36.2));
  S.root.style.clipPath = t < 36.2 ? `circle(${R}px at ${MERGE[0]}px ${MERGE[1]}px)` : "none";
  S.rays.style.transform = `rotate(${t * 8}deg) scale(${1 + 0.15 * pulse(t, 36.0, 0.05, 0.5) + 0.12 * pulse(t, 37.55, 0.05, 0.5)})`;
  S.rays.style.opacity = prog(t, 35.9, 36.3) * (1 - prog(t, 39.7, 39.9));

  animWords(S.h.words, t, 35.92, 39.72, { st: 0.1 });

  // anneau + compteur
  const gp = E.outBack(prog(t, 35.98, 36.45), 1.8);
  const p = E.io2(prog(t, 36.12, 37.55));
  S.prog.style.strokeDasharray = "1 1";
  S.prog.style.strokeDashoffset = 1 - p;
  S.prog.style.strokeWidth = 26 + 14 * pulse(t, 37.55, 0.05, 0.3);
  S.days.forEach((d, i) => {
    const di = (i + 1) / 14;
    const on = prog(p, di - 0.035, di);
    d.style.transform = `scale(${0.5 + E.outBack(on, 3) * 0.6})`;
    d.style.fill = on >= 1 ? "#ffffff" : "rgba(255,255,255,.35)";
  });
  const v14 = 1 + 13 * p;
  const fl = Math.floor(v14);
  S.odo.set(Math.min(14, fl + E.io3(clamp((v14 - fl - 0.45) / 0.55))));
  const done = pulse(t, 37.55, 0.06, 0.35);
  const up = E.brand(prog(t, 37.95, 38.45));
  const outAll = E.inExpo(prog(t, 39.7, 40.05));
  put(S.group, { s: (gp * lerp(1, 0.56, up)) * (1 + 0.08 * done), y: lerp(0, 676 - RC[1], up) - outAll * 900, o: gp > 0 ? 1 : 0 });
  if (t > 37.55 && t < 38.5) {
    twinkles(fx, t, 37.55, RC[0], RC[1], { n: 14, seed: 77, dist: 430, size: 26, dur: 0.9, colors: ["#ffffff", "#ffb547", "#ede9fe"] });
    ring(fx, t, 37.55, RC[0], RC[1], { r0: RR, r1: RR + 260, dur: 0.6, width: 10, color: "#ffffff" });
  }

  // prix
  const pp = E.brandOut(prog(t, 38.05, 38.4));
  put(S.price, { y: (1 - pp) * 120 - outAll * 1300, o: clamp(pp * 2) });
  const v = E.outExpo(prog(t, 38.1, 38.68)) * 450;
  S.podo.set(v);
  put(S.euro, { s: E.outBack(prog(t, 38.62, 38.9), 3), r: (1 - E.out3(prog(t, 38.62, 38.9))) * -30 });
  put(S.des, { o: prog(t, 38.05, 38.25) });
  S.swPath.style.strokeDasharray = "1 1";
  S.swPath.style.strokeDashoffset = 1 - E.brand(prog(t, 38.72, 39.08));
  put(S.swoosh, { y: -outAll * 1300 });
  confetti(fx, t, 38.66, 540, 1130, { n: 70, seed: 5, dur: 1.4, spread: 1000, up: 1300 });
  S.chipEls.forEach((c, i) => put(c, { s: E.outBack(prog(t, 38.92 + i * 0.14, 39.25 + i * 0.14), 2.4), o: t > 38.92 + i * 0.14 ? 1 : 0 }));
  put(S.chips, { y: -outAll * 1400 });
}

export default { id: "a8", t0: 35.7, t1: 40.3, build(root, G) { S.root = root; build(root, G); }, render };

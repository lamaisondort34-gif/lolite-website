// ACTE 3 — Le produit (12 → 18 s) : un site sur-mesure, moderne, à votre image.
import { el, put, clamp, lerp, prog, E, tw, pulse, rng } from "../lib.js";
import { headline, animWords, icon } from "../ui.js";
import { sparkle, ring, twinkles } from "../fx.js";

const MOB = "/public/images/work-toutneuf-mobile.webp";
const DESK = "/public/images/work-toutneuf-desktop.webp";
const PH = { x: 330, y: 650, w: 420, h: 860 };
const DK = { x: 70, y: 720, w: 940, h: 600 };
const S = {};

function build(root) {
  root.style.background = "#7c3aed";
  S.glow = el("div", { class: "layer", style: { background: "radial-gradient(70% 45% at 30% 20%, rgba(167,139,250,.7), transparent 70%), radial-gradient(80% 50% at 80% 95%, rgba(76,29,149,.85), transparent 70%)" } }, root);
  S.grid = el("div", { class: "layer", style: {
    backgroundImage: "linear-gradient(rgba(255,255,255,.08) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.08) 2px, transparent 2px)",
    backgroundSize: "90px 90px", backgroundPosition: "45px 0",
    WebkitMaskImage: "radial-gradient(70% 55% at 50% 55%, #000 30%, transparent 85%)" } }, root);

  S.zoom = el("div", { class: "layer", style: { transformOrigin: "540px 1050px" } }, root);
  const Z = S.zoom;

  // titre + mot sur rouleau
  S.h = headline(Z, [{ text: "Un site", style: { fontSize: "124px" } }], { top: "236px", color: "#fff" });
  S.slot = el("div", { class: "abs center serif", style: { top: "372px", height: "180px", overflow: "hidden", fontSize: "150px", lineHeight: "180px", color: "#ede9fe" } }, Z);
  S.strip = el("div", {}, S.slot);
  for (const w of ["", "sur-mesure.", "moderne.", "à votre image."]) el("div", { text: w || " ", style: { height: "180px" } }, S.strip);

  // ---- appareil (téléphone → ordinateur)
  S.dev = el("div", { class: "abs", style: { background: "#0f0a1f", boxShadow: "0 60px 120px -30px rgba(30,10,70,.75), 0 0 0 2px rgba(255,255,255,.08)" } }, Z);
  S.screen = el("div", { class: "abs", style: { overflow: "hidden", background: "#fff" } }, S.dev);
  // contenu mobile
  S.mob = el("div", { class: "abs", style: { left: 0, top: 0, width: "392px" } }, S.screen);
  S.mobScroll = el("div", { class: "abs", style: { left: 0, top: 0, width: "392px" } }, S.mob);
  // filaire
  S.wire = el("div", { class: "abs", style: { left: 0, top: 0, width: "392px", height: "832px" } }, S.mobScroll);
  const W = (x, y, w, h, r = 10, c = "#e4dcfb") => el("div", { class: "abs", style: { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, borderRadius: `${r}px`, background: c, transformOrigin: "0 50%" } }, S.wire);
  S.wires = [
    W(22, 54, 34, 26, 6), W(150, 50, 92, 34, 17), W(336, 54, 34, 26, 6),
    W(0, 112, 392, 300, 0, "#efeafd"),
    W(22, 170, 250, 30, 8, "#d8cdfb"), W(22, 236, 330, 44, 10, "#c9b8fa"), W(22, 290, 260, 44, 10, "#c9b8fa"),
    W(22, 440, 300, 16, 8), W(22, 470, 250, 16, 8), W(22, 500, 280, 16, 8),
    W(22, 548, 348, 70, 20, "#a78bfa"),
    W(22, 640, 348, 70, 20, "#e4dcfb"),
    W(22, 740, 166, 120, 18), W(204, 740, 166, 120, 18),
  ];
  // design final
  S.design = el("div", { class: "abs", style: { left: 0, top: 0, width: "392px", height: "1200px", background: "#fff" } }, S.mobScroll);
  const sb = el("div", { class: "abs", style: { left: 0, top: 0, width: "392px", height: "40px", font: "600 17px Outfit", color: "#111", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 26px" } }, S.design);
  sb.innerHTML = `<span>9:41</span><span style="width:110px;height:28px;border-radius:14px;background:#111"></span><span>●●● ▮</span>`;
  el("img", { src: MOB, style: { position: "absolute", left: 0, top: "40px", width: "392px" } }, S.design);
  const sec = el("div", { class: "abs", style: { left: 0, top: "733px", width: "392px", padding: "34px 24px", fontFamily: "Arial, sans-serif" } }, S.design);
  sec.innerHTML = `<div style="font:600 13px Arial;letter-spacing:.14em;color:#1ba8e0">NOS SERVICES</div>
    <div style="font:700 28px Arial;color:#1d1d1f;margin:10px 0 22px;line-height:1.15">Textiles, sols &amp; véhicules : comme neufs</div>
    ${["Canapés & fauteuils", "Matelas & tapis", "Intérieurs auto"].map((n) => `<div style="display:flex;gap:16px;align-items:center;padding:16px;margin-bottom:12px;border-radius:16px;background:#f4f8fb">
      <div style="width:52px;height:52px;border-radius:14px;background:#1ba8e0;display:grid;place-items:center;color:#fff">${icon("sparkles", 26)}</div>
      <div><div style="font:700 18px Arial;color:#1d1d1f">${n}</div><div style="width:150px;height:8px;border-radius:4px;background:#d9e3ea;margin-top:9px"></div></div></div>`).join("")}`;
  S.scanLine = el("div", { class: "abs", style: { left: "-20px", width: "432px", height: "6px", background: "#fff", boxShadow: "0 0 24px 8px rgba(167,139,250,.95)", borderRadius: "3px" } }, S.mob);

  // contenu ordinateur
  S.desk = el("div", { class: "abs", style: { inset: 0, opacity: 0 } }, S.screen);
  const chrome = el("div", { class: "abs", style: { left: 0, top: 0, right: 0, height: "52px", background: "#f2eff9", display: "flex", alignItems: "center", gap: "10px", padding: "0 20px" } }, S.desk);
  chrome.innerHTML = `<i style="width:14px;height:14px;border-radius:50%;background:#ff5f57"></i><i style="width:14px;height:14px;border-radius:50%;background:#febc2e"></i><i style="width:14px;height:14px;border-radius:50%;background:#28c840"></i>
    <div style="margin-left:24px;flex:1;height:32px;border-radius:10px;background:#fff;font:500 17px Outfit;color:#5e5872;display:flex;align-items:center;padding:0 14px;gap:8px">🔒&nbsp;toutneuf34 — Nettoyage professionnel à Montpellier</div>`;
  S.deskImg = el("img", { src: DESK, style: { position: "absolute", left: 0, top: "52px", width: "100%" } }, S.desk);

  // contour tracé
  S.outline = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  Object.assign(S.outline.style, { position: "absolute", left: 0, top: 0 });
  S.outline.setAttribute("width", 1080); S.outline.setAttribute("height", 1920);
  S.outline.innerHTML = `<rect x="${PH.x}" y="${PH.y}" width="${PH.w}" height="${PH.h}" rx="64" fill="none" stroke="#fff" stroke-width="5" pathLength="1"/>`;
  Z.appendChild(S.outline);
  S.outRect = S.outline.querySelector("rect");

  // pastilles d'annotation
  const chip = (txt, ic, x, y, lx, ly) => {
    const line = el("div", { class: "abs", style: { height: "3px", background: "rgba(255,255,255,.85)", transformOrigin: "0 50%" } }, Z);
    const dot = el("div", { class: "abs", style: { width: "18px", height: "18px", borderRadius: "50%", background: "#fff", boxShadow: "0 0 0 8px rgba(255,255,255,.25)" } }, Z);
    const c = el("div", { class: "abs chip", style: { left: `${x}px`, top: `${y}px`, background: "#fff", color: "#16102b", boxShadow: "0 20px 50px -10px rgba(30,10,70,.55)", transformOrigin: "50% 50%" } }, Z);
    c.innerHTML = `<span style="color:#7c3aed;display:grid">${icon(ic, 34, 'style="stroke-width:2.4"')}</span>${txt}`;
    return { c, line, dot, x, y, lx, ly };
  };
  S.chips = [
    chip("Design unique", "pen-tool", 40, 740, 360, 860),
    chip("Ultra-rapide", "zap", 700, 1010, 730, 1100),
    chip("Parfait sur mobile", "smartphone", 30, 1290, 360, 1250),
  ];
  // nuancier « à votre image »
  S.swatches = el("div", { class: "abs", style: { left: "0", right: "0", top: "1372px", display: "flex", justifyContent: "center", gap: "22px", alignItems: "center" } }, Z);
  S.sw = ["#1ba8e0", "#1d1d1f", "#c9b8a6", "#f4f8fb"].map((c) => el("div", { style: { width: "86px", height: "86px", borderRadius: "50%", background: c, border: "5px solid #fff", boxShadow: "0 16px 40px -8px rgba(30,10,70,.6)" } }, S.swatches));
  S.sw.push(el("div", { class: "serif", style: { height: "86px", padding: "0 30px", borderRadius: "43px", background: "#fff", color: "#16102b", fontSize: "58px", lineHeight: "86px", boxShadow: "0 16px 40px -8px rgba(30,10,70,.6)" }, text: "Aa" }, S.swatches));
  S.swLabel = el("div", { class: "abs center mono", style: { top: "1488px", fontSize: "24px", color: "rgba(255,255,255,.85)" }, text: "VOS COULEURS · VOTRE STYLE · VOTRE LOGO" }, Z);

  S.flash = el("div", { class: "layer", style: { background: "#fafafd", opacity: 0 } }, root);
}

function render(t, tf, G) {
  const fx = G.fx;
  S.grid.style.opacity = tw(t, 12.0, 12.8, 0, 1);
  S.grid.style.backgroundPosition = `45px ${t * 18}px`;
  S.glow.style.opacity = tw(t, 12.0, 12.6, 0, 1);

  // titre + rouleau
  animWords(S.h.words, t, 12.35, 17.2, { st: 0.1 });
  let idx = 0;
  [[12.68, 0.55], [14.42, 0.5], [15.66, 0.5]].forEach(([t0, d]) => (idx += E.brand(prog(t, t0, t0 + d))));
  const outS = E.in3(prog(t, 17.22, 17.5));
  S.strip.style.transform = `translateY(${-idx * 180 - outS * 200}px)`;

  // contour
  const dp = E.brand(prog(t, 12.12, 12.78));
  S.outRect.style.strokeDasharray = "1 1";
  S.outRect.style.strokeDashoffset = 1 - dp;
  S.outline.style.opacity = 1 - prog(t, 12.8, 13.0);

  // morph téléphone → ordinateur
  const m = E.brand(prog(t, 15.62, 16.32));
  const x = lerp(PH.x, DK.x, m), y = lerp(PH.y, DK.y, m), w = lerp(PH.w, DK.w, m), h = lerp(PH.h, DK.h, m);
  const bez = lerp(14, 10, m);
  Object.assign(S.dev.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, borderRadius: `${lerp(64, 26, m)}px`,
    background: m > 0 ? `rgb(${Math.round(lerp(15, 255, m))},${Math.round(lerp(10, 255, m))},${Math.round(lerp(31, 255, m))})` : "#0f0a1f" });
  Object.assign(S.screen.style, { left: `${bez}px`, top: `${bez}px`, right: `${bez}px`, bottom: `${bez}px`, borderRadius: `${lerp(52, 18, m)}px` });
  const body = prog(t, 12.7, 12.95);
  // légère rotation 3D en respiration
  const float = Math.sin((t - 12) * 1.3);
  put(S.dev, { persp: 1600, ry: lerp(-6 * float, 0, m) * prog(t, 13.8, 14.4), rx: 4 * float * prog(t, 13.8, 14.4) * (1 - m), o: body, s: lerp(0.96, 1, E.out3(body)) });

  // filaire
  S.wires.forEach((b, i) => {
    const p = E.brandOut(prog(t, 12.8 + i * 0.03, 13.25 + i * 0.03));
    put(b, { sx: p, o: clamp(p * 3) });
  });
  // révélation par balayage
  const sc = E.io2(prog(t, 13.3, 13.85));
  S.design.style.clipPath = `inset(0 0 ${(1 - sc) * 100}% 0)`;
  S.scanLine.style.top = `${sc * 832 - 3}px`;
  S.scanLine.style.opacity = sc > 0 && sc < 1 ? 1 : 0;
  S.wire.style.opacity = 1 - prog(t, 13.85, 14.0);
  // défilement dans le téléphone
  const scroll = E.brand(prog(t, 13.98, 14.7)) * 330 - E.brand(prog(t, 15.2, 15.65)) * 330;
  S.mobScroll.style.transform = `translateY(${-scroll}px)`;
  S.mob.style.opacity = 1 - prog(t, 15.7, 15.95);
  S.desk.style.opacity = prog(t, 15.78, 16.05);
  S.deskImg.style.transform = `scale(${1 + 0.05 * prog(t, 16, 17.4)})`;
  S.deskImg.style.transformOrigin = "30% 40%";

  // annotations
  S.chips.forEach((c, i) => {
    const t0 = 14.5 + i * 0.14;
    const pl = E.brand(prog(t, t0, t0 + 0.35));
    const pc = E.outBack(prog(t, t0 + 0.12, t0 + 0.5), 2);
    const out = E.in3(prog(t, 15.45 + i * 0.04, 15.7 + i * 0.04));
    // trait du point d'ancrage vers la pastille
    const cx = c.x < 540 ? c.x + 150 : c.x + 30;
    const cy = c.y + 36;
    const dx = cx - c.lx, dy = cy - c.ly;
    const len = Math.hypot(dx, dy);
    Object.assign(c.line.style, { left: `${c.lx}px`, top: `${c.ly - 1.5}px`, width: `${len}px` });
    c.line.style.transform = `rotate(${Math.atan2(dy, dx)}rad) scaleX(${pl * (1 - out)})`;
    put(c.dot, { x: c.lx - 9, y: c.ly - 9, s: E.outBack(prog(t, t0, t0 + 0.25), 3) * (1 - out) });
    c.dot.style.left = "0px"; c.dot.style.top = "0px";
    put(c.c, { s: pc * (1 - out), o: pc > 0 ? 1 : 0, y: Math.sin(t * 2.4 + i * 2) * 6 });
  });

  // nuancier
  S.sw.forEach((s, i) => {
    const p = prog(t, 16.15 + i * 0.07, 16.6 + i * 0.07);
    put(s, { s: E.outBack(p, 2.6) * (1 - E.in3(prog(t, 17.15, 17.4))), y: Math.sin(t * 3 + i) * 4 });
  });
  put(S.swLabel, { o: prog(t, 16.5, 16.8) * (1 - prog(t, 17.1, 17.3)), y: (1 - E.out3(prog(t, 16.5, 16.9))) * 20 });
  if (t > 16.2 && t < 17.2) twinkles(fx, t, 16.2, 540, 1415, { n: 10, seed: 14, dist: 420, size: 20, dur: 0.9, colors: ["#ffffff", "#ede9fe"] });

  // ---- plongée dans l'écran
  const dive = E.inExpo(prog(t, 17.3, 17.98));
  S.zoom.style.transformOrigin = `540px ${DK.y + DK.h / 2 + 26}px`;
  put(S.zoom, { s: 1 + dive * 4.2 });
  S.flash.style.opacity = E.in2(prog(t, 17.62, 17.98));
}

export default { id: "a3", t0: 11.95, t1: 18.0, build, render };

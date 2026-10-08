// ACTE 9 — L'appel à l'action (39,8 → 45 s).
import { el, put, clamp, lerp, prog, E, tw, pulse, decode } from "../lib.js";
import { headline, animWords, icon, varfont } from "../ui.js";
import { twinkles, ring, burst, sparkle } from "../fx.js";

const LOGO = "/public/images/logo-lolite.webp";
const HERO = "/public/images/hero-visual.webp";
const S = {};

function build(root) {
  root.style.background = "#fafafd";
  el("div", { class: "layer", style: { background: "radial-gradient(60% 35% at 50% 20%, rgba(196,181,253,.55), transparent 70%), radial-gradient(70% 40% at 50% 100%, rgba(167,139,250,.45), transparent 70%)" } }, root);
  S.hero = el("img", { src: HERO, class: "abs", style: { left: "-260px", top: "980px", width: "1600px", mixBlendMode: "multiply", opacity: 0.5,
    WebkitMaskImage: "radial-gradient(50% 50% at 50% 50%, #000 45%, transparent 75%)" } }, root);

  // question
  S.q1 = el("div", { class: "abs center disp", style: { top: "700px", fontSize: "112px", color: "#16102b" } }, root);
  S.q1.textContent = "Envie d'en faire";
  S.q1w = [];
  {
    const words = S.q1.textContent.split(" ");
    S.q1.textContent = "";
    words.forEach((w, i) => {
      const m = el("span", { class: "wm" }, S.q1);
      const inner = el("span", { class: "wi", text: w }, m);
      S.q1w.push({ mask: m, inner });
      if (i < words.length - 1) S.q1.appendChild(document.createTextNode(" "));
    });
  }
  S.q2 = el("div", { class: "abs center serif", style: { top: "810px", fontSize: "240px", lineHeight: "1", color: "#7c3aed" } }, root);
  S.q2c = [..."autant ?"].map((c) => el("span", { class: "ch", text: c }, S.q2));

  // carte finale
  S.logo = el("img", { src: LOGO, class: "abs", style: { left: "350px", top: "236px", width: "380px" } }, root);
  S.logoSheen = el("div", { class: "abs", style: { left: "350px", top: "236px", width: "380px", height: `${(380 * 520) / 547}px`,
    WebkitMaskImage: `url(${LOGO})`, WebkitMaskSize: "100% 100%", mixBlendMode: "screen",
    background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,.9) 50%, transparent 62%)", backgroundSize: "300% 100%" } }, root);
  S.r1 = headline(root, [
    { text: "Réservez votre", style: { fontSize: "88px" } },
    { text: "devis gratuit.", cls: "serif", style: { fontSize: "160px", lineHeight: "0.95", color: "#7c3aed" } },
  ], { top: "668px", color: "#16102b" });

  S.btn = el("div", { class: "abs", style: { left: "150px", top: "968px", width: "780px", height: "144px", borderRadius: "72px", overflow: "hidden",
    background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", boxShadow: "0 30px 80px -14px rgba(124,58,237,.7), inset 0 2px 0 rgba(255,255,255,.35)" } }, root);
  S.btnTxt = el("div", { class: "abs", style: { left: "64px", top: "0", height: "144px", display: "flex", alignItems: "center", font: "700 50px Outfit", color: "#fff", letterSpacing: "-0.01em" }, text: "Réserver mon devis" }, S.btn);
  S.arrow = el("div", { class: "abs", style: { right: "20px", top: "20px", width: "104px", height: "104px", borderRadius: "50%", background: "#fff", color: "#7c3aed", display: "grid", placeItems: "center" },
    html: icon("arrow-right", 52, 'style="stroke-width:2.6"') }, S.btn);
  S.btnShine = el("div", { class: "abs", style: { inset: 0, background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,.45) 50%, transparent 60%)", backgroundSize: "300% 100%" } }, S.btn);
  S.finger = el("div", { class: "abs", style: { left: "-55px", top: "-55px", width: "110px", height: "110px", borderRadius: "50%", background: "rgba(124,58,237,.18)", border: "4px solid rgba(124,58,237,.75)" } }, root);

  S.url = el("div", { class: "abs center disp", style: { top: "1150px", fontSize: "84px", color: "#16102b", letterSpacing: "-0.03em" } }, root);
  S.chips = el("div", { class: "abs", style: { left: 0, right: 0, top: "1270px", display: "flex", justifyContent: "center", gap: "18px" } }, root);
  S.chipEls = ["Sans engagement", "Réponse sous 24–48 h"].map((txt) => el("div", { class: "chip", style: { background: "#f1edf9", color: "#4c1d95", fontSize: "30px" },
    html: `<span style="color:#7c3aed;display:grid">${icon("check", 30, 'style="stroke-width:3"')}</span>${txt}` }, S.chips));
  S.foot = el("div", { class: "abs center mono", style: { top: "1376px", fontSize: "22px", color: "#5e5872" }, text: "Montpellier · France & DOM-TOM · @lolite_agency" }, root);
}

function render(t, tf, G) {
  const fx = G.fx;
  // poussée depuis le bas
  const push = E.brand(prog(t, 39.78, 40.28));
  put(S.root, { y: (1 - push) * 1920 });
  put(S.hero, { o: lerp(0.5, 0.32, prog(t, 41.8, 42.4)), x: Math.sin(t * 0.6) * 30, y: Math.cos(t * 0.5) * 20 + lerp(0, 220, E.brand(prog(t, 41.7, 42.4))), r: -10 + Math.sin(t * 0.4) * 3, s: 1.02 + 0.03 * Math.sin(t * 0.7) });

  // ---- « Envie d'en faire autant ? »
  animWords(S.q1w, t, 40.12, 41.72, { st: 0.09, dur: 0.6 });
  varfont(S.q1, lerp(250, 800, E.io3(prog(t, 40.12, 40.9))), lerp(80, 100, E.io3(prog(t, 40.12, 40.9))));
  S.q2c.forEach((c, i) => {
    const t0 = 40.5 + i * 0.05 + (i === 7 ? 0.18 : 0);
    const s = Math.max(0, 1 - Math.exp(-(t - t0) * 8) * Math.cos((t - t0) * 20));
    const out = E.in3(prog(t, 41.72 + i * 0.012, 41.95 + i * 0.012));
    c.style.transform = t < t0 ? "scale(0)" : `translateY(${(1 - Math.min(1, s)) * 60 - out * 160}px) scale(${Math.min(1.25, s)}) rotate(${i === 7 ? Math.sin((t - t0) * 6) * 12 * Math.exp(-(t - t0) * 2) : 0}deg)`;
    c.style.opacity = t < t0 ? 0 : 1 - out;
  });
  S.q1.style.display = S.q2.style.display = t < 42.1 ? "block" : "none";

  // ---- carte finale
  const lp = prog(t, 42.0, 42.5);
  put(S.logo, { s: lerp(0.55, 1, E.outBack(lp, 1.9)) * (1 + 0.04 * pulse(t, 44.0, 0.08, 0.5)), o: clamp(lp * 3), y: Math.sin((t - 42) * 1.6) * 6 * prog(t, 42.5, 43) });
  put(S.logoSheen, { o: prog(t, 42.35, 42.4) * (1 - prog(t, 43.1, 43.15)), y: Math.sin((t - 42) * 1.6) * 6 * prog(t, 42.5, 43) });
  S.logoSheen.style.backgroundPosition = `${lerp(110, -10, E.io2(prog(t, 42.4, 43.1)))}% 0`;
  burst(fx, t, 42.0, 540, 420, { n: 22, seed: 91, r0: 200, r1: 560, dur: 0.6, width: 7, colors: ["#7c3aed", "#a78bfa", "#ffb547"] });
  ring(fx, t, 42.02, 540, 420, { r0: 120, r1: 700, dur: 0.7, width: 8, color: "#a78bfa" });
  twinkles(fx, t, 42.25, 540, 270, { n: 10, seed: 93, dist: 230, size: 24, dur: 0.9 });
  twinkles(fx, t, 44.0, 540, 270, { n: 8, seed: 97, dist: 200, size: 20, dur: 0.9 });

  animWords(S.r1.words, t, 42.18, Infinity, { st: 0.08, dur: 0.6 });

  const bp = prog(t, 42.55, 42.95);
  const press = 1 - 0.06 * pulse(t, 43.42, 0.05, 0.2);
  put(S.btn, { s: lerp(0.4, 1, E.outBack(bp, 2.2)) * press, o: clamp(bp * 3) });
  S.btnShine.style.backgroundPosition = `${lerp(110, -10, E.io2(prog(t, 42.95, 43.6)))}% 0`;
  const nudge = t > 43.6 ? Math.max(0, Math.sin((t - 43.6) * 7)) * 10 : 0;
  put(S.arrow, { x: nudge });
  // doigt
  const fm = E.brand(prog(t, 43.0, 43.38));
  put(S.finger, { x: lerp(980, 820, fm), y: lerp(1500, 1040, fm), s: 1 - 0.3 * pulse(t, 43.42, 0.05, 0.2), o: prog(t, 43.0, 43.1) * (1 - prog(t, 43.75, 43.9)) });
  ring(fx, t, 43.44, 820, 1040, { r0: 40, r1: 560, dur: 0.7, width: 7, color: "#7c3aed" });

  S.url.textContent = decode("lolite.fr", tf, 42.85, 0.45, 41, Math.round(tf * 30));
  put(S.url, { o: prog(t, 42.85, 42.95) });
  S.chipEls.forEach((c, i) => put(c, { s: E.outBack(prog(t, 43.2 + i * 0.12, 43.55 + i * 0.12), 2.4), o: t > 43.2 + i * 0.12 ? 1 : 0 }));
  put(S.foot, { o: prog(t, 43.5, 43.9), y: (1 - E.out3(prog(t, 43.5, 43.9))) * 16 });
}

export default { id: "a9", t0: 39.78, t1: 45.01, build(root, G) { S.root = root; build(root, G); }, render };

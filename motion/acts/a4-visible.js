// ACTE 4 — Visible (18 → 24 s) : sur Google, sur Maps, sur mobile.
import { el, put, clamp, lerp, prog, E, tw, pulse } from "../lib.js";
import { icon, varfont } from "../ui.js";
import { ring, twinkles } from "../fx.js";

const MOB = "/public/images/work-toutneuf-mobile.webp";
const CARD = { x: 90, y: 650, w: 900, h: 780 };
const PHONE = { x: 330, y: 610, w: 420, h: 860 };
const PIN = [470, 420]; // dans la carte
const QUERY = "nettoyage canapé montpellier";
const S = {};

function svgEl(parent, w, h, inner) {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("width", w); s.setAttribute("height", h);
  s.style.position = "absolute"; s.style.left = 0; s.style.top = 0;
  s.innerHTML = inner;
  parent.appendChild(s);
  return s;
}

function build(root) {
  root.style.background = "#fafafd";
  el("div", { class: "layer", style: { background: "radial-gradient(60% 40% at 85% 10%, rgba(196,181,253,.55), transparent 70%), radial-gradient(70% 45% at 10% 90%, rgba(167,139,250,.35), transparent 70%)" } }, root);
  S.zoom = el("div", { class: "layer", style: { transformOrigin: "540px 1040px" } }, root);
  const Z = S.zoom;

  // « Visible » en typo variable
  S.vis = el("div", { class: "abs center disp", style: { top: "200px", fontSize: "196px", color: "#16102b", letterSpacing: "-0.045em" } }, Z);
  S.visChars = [..."Visible"].map((c) => el("span", { class: "ch", text: c }, S.vis));
  // « sur » + mot rouleau
  S.sur = el("div", { class: "abs", style: { left: "230px", top: "418px", font: "400 84px Bricolage", color: "#5e5872", letterSpacing: "-0.03em" }, text: "sur" }, Z);
  S.slot = el("div", { class: "abs serif", style: { left: "400px", top: "390px", height: "150px", width: "560px", overflow: "hidden", fontSize: "128px", lineHeight: "150px", color: "#7c3aed" } }, Z);
  S.strip = el("div", {}, S.slot);
  for (const w of [" ", "Google.", "Maps.", "mobile."]) el("div", { text: w, style: { height: "150px", whiteSpace: "nowrap" } }, S.strip);

  // ---- carte (recto Google / verso Maps / puis téléphone)
  S.cardWrap = el("div", { class: "abs", style: { left: `${CARD.x}px`, top: `${CARD.y}px`, width: `${CARD.w}px`, height: `${CARD.h}px`, perspective: "2000px" } }, Z);
  // recto : recherche
  S.g = el("div", { class: "abs card", style: { inset: 0, backfaceVisibility: "hidden", overflow: "hidden" } }, S.cardWrap);
  const pill = el("div", { class: "abs", style: { left: "40px", top: "40px", width: "820px", height: "96px", borderRadius: "48px", background: "#faf8ff", border: "2px solid #e4dcfb", display: "flex", alignItems: "center", gap: "20px", padding: "0 32px", color: "#7c3aed" } }, S.g);
  pill.innerHTML = icon("search", 40, 'style="stroke-width:2.6"');
  S.q = el("span", { style: { font: "500 36px Outfit", color: "#16102b", whiteSpace: "pre" } }, pill);
  S.qCaret = el("span", { style: { width: "3px", height: "40px", background: "#7c3aed", display: "inline-block", marginLeft: "-14px" } }, pill);
  const tabs = el("div", { class: "abs", style: { left: "64px", top: "166px", display: "flex", gap: "40px", font: "500 26px Outfit", color: "#8a84a0" } }, S.g);
  tabs.innerHTML = `<span style="color:#7c3aed;border-bottom:4px solid #7c3aed;padding-bottom:10px">Tous</span><span>Maps</span><span>Images</span><span>Actualités</span>`;
  el("div", { class: "abs", style: { left: 0, right: 0, top: "218px", height: "2px", background: "#efeaf9" } }, S.g);
  // résultat mis en avant
  S.r1 = el("div", { class: "abs", style: { left: "28px", top: "246px", width: "844px", height: "236px", borderRadius: "28px", padding: "26px 30px" } }, S.g);
  S.r1.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px">
      <div style="width:52px;height:52px;border-radius:50%;background:#1ba8e0;color:#fff;display:grid;place-items:center;font:800 26px Bricolage">T</div>
      <div><div style="font:600 24px Outfit;color:#16102b">Toutneuf34</div><div style="font:400 21px Outfit;color:#8a84a0">Site officiel · Montpellier</div></div>
    </div>
    <div style="font:600 36px Outfit;color:#6d28d9;margin:18px 0 10px;letter-spacing:-0.01em">Nettoyage professionnel à Montpellier</div>
    <div style="font:400 25px/1.4 Outfit;color:#5e5872">Textiles et véhicules, produits 100 % écologiques. Intervention sous 24-48h · 7j/7.</div>`;
  S.r1Border = svgEl(S.r1, 844, 236, `<rect x="2" y="2" width="840" height="232" rx="28" fill="none" stroke="#7c3aed" stroke-width="4" pathLength="1"/>`);
  S.r1Rect = S.r1Border.querySelector("rect");
  S.found = el("div", { class: "abs chip", style: { right: "24px", top: "22px", background: "#7c3aed", color: "#fff", padding: "12px 22px", fontSize: "26px", gap: "8px" } }, S.r1);
  S.found.innerHTML = `${icon("check", 28, 'style="stroke-width:3.2"')} Trouvé`;
  S.skel = [520, 650].map((y) => {
    const r = el("div", { class: "abs", style: { left: "58px", top: `${y}px`, width: "790px" } }, S.g);
    r.innerHTML = `<div style="display:flex;gap:16px;align-items:center"><div style="width:44px;height:44px;border-radius:50%;background:#ece7f8"></div><div style="width:220px;height:16px;border-radius:8px;background:#ece7f8"></div></div>
      <div style="width:560px;height:22px;border-radius:11px;background:#e4dcfb;margin:20px 0 14px"></div><div style="width:740px;height:14px;border-radius:7px;background:#f0ecfa"></div>`;
    return r;
  });
  // curseur
  S.cursor = el("div", { class: "abs", style: { left: 0, top: 0, color: "#16102b" } }, Z);
  S.cursor.innerHTML = `<svg width="64" height="64" viewBox="0 0 24 24"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" fill="#16102b" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>`;

  // verso : carte
  S.m = el("div", { class: "abs card", style: { inset: 0, backfaceVisibility: "hidden", overflow: "hidden", background: "#f4f1fb" } }, S.cardWrap);
  S.mapInner = el("div", { class: "abs", style: { left: 0, top: 0, width: `${CARD.w}px`, height: `${CARD.h}px`, transformOrigin: `${PIN[0]}px ${PIN[1]}px` } }, S.m);
  const roads = [
    "M-40 150 L940 60", "M-40 330 L940 250", "M-40 640 L940 560", "M-40 760 L940 700",
    "M160 -40 L230 820", "M420 -40 L480 820", "M720 -40 L770 820",
  ];
  S.map = svgEl(S.mapInner, CARD.w, CARD.h, `
    <rect x="250" y="90" width="150" height="120" rx="14" fill="#e9e3f8"/><rect x="510" y="70" width="190" height="140" rx="14" fill="#e9e3f8"/>
    <rect x="40" y="380" width="100" height="200" rx="14" fill="#e9e3f8"/><rect x="255" y="430" width="140" height="150" rx="14" fill="#e9e3f8"/>
    <rect x="800" y="300" width="120" height="200" rx="14" fill="#e9e3f8"/><rect x="510" y="600" width="190" height="120" rx="14" fill="#e9e3f8"/>
    <ellipse cx="640" cy="440" rx="120" ry="78" fill="#d9f5e3"/>
    <path class="river" d="M-40 470 C 120 520, 230 380, 380 440 S 650 610, 940 520" fill="none" stroke="#c9dcfb" stroke-width="46" stroke-linecap="round" pathLength="1"/>
    ${roads.map((d) => `<path class="road" d="${d}" fill="none" stroke="#ddd5f2" stroke-width="30" stroke-linecap="round" pathLength="1"/>`).join("")}
    ${roads.map((d) => `<path class="road2" d="${d}" fill="none" stroke="#ffffff" stroke-width="20" stroke-linecap="round" pathLength="1"/>`).join("")}
    <path class="road" d="M-40 560 C 200 520, 360 300, 940 330" fill="none" stroke="#c4b5fd" stroke-width="34" stroke-linecap="round" pathLength="1"/>
    <path class="road2" d="M-40 560 C 200 520, 360 300, 940 330" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round" pathLength="1"/>
    <text x="70" y="510" font-family="Mono" font-size="20" fill="#8aa3d6" letter-spacing="3">LE LEZ</text>
    <text x="590" y="446" font-family="Mono" font-size="18" fill="#6aa983" letter-spacing="2">PARC</text>`);
  S.roads = [...S.map.querySelectorAll(".road, .road2, .river")];
  S.pinShadow = el("div", { class: "abs", style: { left: `${PIN[0] - 34}px`, top: `${PIN[1] - 10}px`, width: "68px", height: "20px", borderRadius: "50%", background: "rgba(22,16,43,.25)" } }, S.mapInner);
  S.pin = el("div", { class: "abs", style: { left: `${PIN[0] - 50}px`, top: `${PIN[1] - 112}px`, width: "100px", height: "112px", transformOrigin: "50% 100%" } }, S.mapInner);
  S.pin.innerHTML = `<svg width="100" height="112" viewBox="0 0 100 112"><path d="M50 108 C 50 108, 8 66, 8 42 A 42 42 0 1 1 92 42 C 92 66, 50 108, 50 108 Z" fill="#7c3aed" stroke="#fff" stroke-width="5"/><circle cx="50" cy="42" r="16" fill="#fff"/></svg>`;
  S.bubble = el("div", { class: "abs card", style: { left: `${PIN[0] - 230}px`, top: `${PIN[1] - 360}px`, width: "460px", padding: "26px 28px", borderRadius: "28px", transformOrigin: "50% 120%" } }, S.mapInner);
  S.bubble.innerHTML = `<div style="font:700 34px Outfit;color:#16102b">Toutneuf34</div>
    <div style="font:400 24px Outfit;color:#5e5872;margin:4px 0 18px">Nettoyage pro · Montpellier · <span style="color:#16a34a">Ouvert</span></div>
    <div style="display:flex;gap:12px"><span class="chip" style="background:#7c3aed;color:#fff;font-size:24px;padding:12px 22px;gap:8px">${icon("navigation", 24)} Itinéraire</span>
    <span class="chip" style="border:2px solid #e4dcfb;color:#7c3aed;font-size:24px;padding:10px 22px;gap:8px">${icon("phone", 24)} Appeler</span></div>`;
  // site mobile qui glisse par-dessus la carte (dans le téléphone)
  S.mobSite = el("div", { class: "abs", style: { left: 0, top: 0, width: "392px", height: "832px", background: "#fff", overflow: "hidden" } }, S.m);
  const sb = el("div", { class: "abs", style: { left: 0, top: 0, width: "392px", height: "40px", font: "600 17px Outfit", color: "#111", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 26px" } }, S.mobSite);
  sb.innerHTML = `<span>9:41</span><span style="width:110px;height:28px;border-radius:14px;background:#111"></span><span>●●● ▮</span>`;
  el("img", { src: MOB, style: { position: "absolute", left: 0, top: "40px", width: "392px" } }, S.mobSite);

  // bandes du volet diagonal vers l'acte suivant
  S.bands = ["#c4b5fd", "#7c3aed"].map((c) => el("div", { class: "layer", style: { background: c } }, root));
}

export const diag = (e) => `polygon(0 ${e}px, 1080px ${e - 640}px, 1080px 1920px, 0 1920px)`;
export const wipeEdge = (t, t0) => lerp(2600, -60, E.brand(prog(t, t0, t0 + 0.62)));

function render(t, tf, G) {
  const fx = G.fx;
  // entrée en dé-zoom (continuité de la plongée)
  const zin = E.brandOut(prog(t, 18.0, 18.7));
  put(S.zoom, { s: lerp(1.35, 1, zin) });

  // « Visible » : graisse 200 → 800, chasse 75 → 100, lettres en cascade
  S.visChars.forEach((c, i) => {
    const p = E.brandOut(prog(t, 18.05 + i * 0.045, 18.75 + i * 0.045));
    const out = E.in3(prog(t, 23.25 + i * 0.02, 23.5 + i * 0.02));
    c.style.transform = `translateY(${(1 - p) * 60 - out * 80}px)`;
    c.style.opacity = clamp(p * 2) * (1 - out);
  });
  const wp = E.io3(prog(t, 18.1, 18.9));
  varfont(S.vis, lerp(200, 800, wp) - 120 * pulse(t, 20.0, 0.08, 0.3) - 120 * pulse(t, 21.6, 0.08, 0.3), lerp(75, 100, wp));

  // sur + rouleau
  put(S.sur, { o: prog(t, 18.3, 18.5) * (1 - prog(t, 23.25, 23.45)), y: (1 - E.out3(prog(t, 18.3, 18.7))) * 30 });
  let idx = 0;
  [[18.32, 0.5], [19.98, 0.45], [21.58, 0.45]].forEach(([t0, d]) => (idx += E.brand(prog(t, t0, t0 + d))));
  S.strip.style.transform = `translateY(${-idx * 150 - E.in3(prog(t, 23.25, 23.5)) * 160}px)`;

  // ---- carte : apparition, retournement
  const cin = E.brandOut(prog(t, 18.25, 18.85));
  const flip = E.brand(prog(t, 19.95, 20.5));
  put(S.cardWrap, { y: (1 - cin) * 160, o: clamp(cin * 2) });
  put(S.g, { persp: 2000, ry: -180 * flip });
  put(S.m, { persp: 2000, ry: 180 - 180 * flip });
  S.g.style.visibility = flip < 0.5 ? "visible" : "hidden";
  S.m.style.visibility = flip >= 0.5 ? "visible" : "hidden";

  // frappe de la requête
  const n = Math.floor(clamp((t - 18.6) / 0.55) * QUERY.length);
  S.q.textContent = QUERY.slice(0, n) || " ";
  S.qCaret.style.opacity = t > 18.5 && (t < 19.2 || Math.floor(tf * 2.4) % 2 === 0) ? 1 : 0;
  // résultats
  put(S.r1, { y: (1 - E.brandOut(prog(t, 19.1, 19.55))) * 50, o: prog(t, 19.1, 19.3) });
  S.skel.forEach((s, i) => put(s, { y: (1 - E.brandOut(prog(t, 19.2 + i * 0.07, 19.65 + i * 0.07))) * 50, o: prog(t, 19.2 + i * 0.07, 19.4 + i * 0.07) }));
  const hl = E.brand(prog(t, 19.42, 19.8));
  S.r1Rect.style.strokeDasharray = "1 1";
  S.r1Rect.style.strokeDashoffset = 1 - hl;
  S.r1.style.background = `rgba(245,243,255,${hl})`;
  put(S.found, { s: E.outBack(prog(t, 19.62, 19.9), 2.5), o: t > 19.62 ? 1 : 0 });
  // curseur : arrive, clique
  const cp = E.brand(prog(t, 19.3, 19.72));
  const click = 1 - 0.18 * pulse(t, 19.74, 0.05, 0.15);
  const cx = lerp(980, 640, cp), cy = lerp(1560, 1000, cp);
  put(S.cursor, { x: cx, y: cy, s: click, o: prog(t, 19.3, 19.4) * (1 - prog(t, 19.95, 20.05)) });
  ring(fx, t, 19.76, cx + 8, cy + 8, { r0: 6, r1: 70, dur: 0.4, width: 5, color: "#7c3aed" });

  // ---- carte Maps
  S.roads.forEach((r, i) => {
    const p = E.brand(prog(t, 20.18 + (i % 9) * 0.04, 20.75 + (i % 9) * 0.04));
    r.style.strokeDasharray = "1 1";
    r.style.strokeDashoffset = 1 - p;
  });
  const fall = prog(t, 20.6, 20.86);
  const land = t - 20.86;
  let py = -420 * (1 - E.in2(fall)), sx = 1, sy = 1;
  if (land > 0) {
    const q = Math.exp(-land * 8) * Math.cos(land * 30);
    sx = 1 + 0.22 * q; sy = 1 - 0.26 * q;
    py = -28 * Math.max(0, Math.exp(-land * 6) * Math.sin(land * 20));
  }
  S.pin.style.opacity = fall > 0 ? 1 : 0;
  S.pin.style.transform = `translateY(${py}px) scale(${sx},${sy})`;
  put(S.pinShadow, { s: lerp(0.3, 1, E.in2(fall)), o: fall * 0.9 });
  put(S.bubble, { s: E.outBack(prog(t, 20.98, 21.3), 2.2), o: t > 20.98 ? 1 : 0, y: Math.sin(t * 2.2) * 5 });
  put(S.mapInner, { s: 1 + 0.08 * E.io2(prog(t, 20.3, 21.7)) });

  // ---- carte → téléphone
  const mp = E.brand(prog(t, 21.58, 22.22));
  const x = lerp(CARD.x, PHONE.x, mp), y = lerp(CARD.y, PHONE.y, mp), w = lerp(CARD.w, PHONE.w, mp), h = lerp(CARD.h, PHONE.h, mp);
  Object.assign(S.cardWrap.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
  const bez = 14 * mp;
  Object.assign(S.m.style, { inset: `${bez}px`, borderRadius: `${lerp(36, 52, mp)}px` });
  S.cardWrap.style.background = mp > 0 ? "#0f0a1f" : "transparent";
  S.cardWrap.style.borderRadius = `${lerp(36, 64, mp)}px`;
  S.cardWrap.style.boxShadow = mp > 0 ? `0 60px 120px -30px rgba(76,29,149,${0.55 * mp})` : "none";
  // la carte reste centrée sur l'épingle pendant le morph
  S.mapInner.style.left = `${lerp(0, 392 / 2 - PIN[0], mp)}px`;
  S.mapInner.style.top = `${lerp(0, 832 / 2 + 60 - PIN[1], mp)}px`;
  const slide = E.brand(prog(t, 22.12, 22.62));
  put(S.mobSite, { y: (1 - slide) * 840, o: slide > 0 ? 1 : 0 });
  const float = prog(t, 22.4, 23.0);
  put(S.cardWrap, { persp: 1600, ry: Math.sin((t - 22) * 1.6) * 8 * float, rx: 3 * float, y: (1 - cin) * 160, o: clamp(cin * 2) * (1 - prog(t, 23.25, 23.5)) });
  if (t > 22.55 && t < 23.4) twinkles(fx, t, 22.55, 540, 1040, { n: 9, seed: 22, dist: 380, size: 22, dur: 0.85 });

  // ---- volet diagonal
  S.bands.forEach((b, i) => {
    const e = wipeEdge(t, 23.42 + i * 0.07);
    b.style.display = t > 23.42 + i * 0.07 ? "block" : "none";
    b.style.clipPath = diag(e);
  });
}

export default { id: "a4", t0: 18.0, t1: 24.15, build, render };

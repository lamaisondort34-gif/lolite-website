// ACTE 6 — La conversion (27,9 → 32 s) : visiteurs → clients ; un bouton, et le téléphone sonne.
import { el, put, clamp, lerp, prog, E, tw, pulse, hash, noise1 } from "../lib.js";
import { headline, animWords, icon } from "../ui.js";
import { darkBg } from "./a5-proof.js";
import { ring, burst, twinkles } from "../fx.js";

const GATE = [540, 1010];
const N = 24;
const BTN = { x: 210, y: 790, w: 660, h: 156 };
const PH = { x: 350, y: 700, w: 380, h: 760 };
export const ACCEPT = [PH.x + PH.w - 110, PH.y + 644];
const S = {};

const visitor = (i) => {
  const s = 28.12 + i * 0.04;
  const left = i % 2 === 0;
  const start = [left ? -60 : 1140, 720 + hash(i * 3.1) * 280];
  const ctrl = [left ? 220 : 860, 700 + hash(i * 5.7) * 120];
  const gate = [GATE[0] + (hash(i * 7.3) - 0.5) * 220, GATE[1]];
  const c = i % 8, r = Math.floor(i / 8);
  const slot = [540 + (c - 3.5) * 112, 1160 + r * 124];
  return { s, start, ctrl, gate, slot };
};
const VIS = Array.from({ length: N }, (_, i) => visitor(i));

function person(ctx, x, y, k, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y - 16 * k, 12 * k, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y + 20 * k, 22 * k, 20 * k, 0, Math.PI, 2 * Math.PI); ctx.closePath(); ctx.fill();
}

function build(root) {
  darkBg(root);
  // 6a
  S.h1 = headline(root, [
    { text: "Vos visiteurs", style: { fontSize: "104px" } },
    { text: "deviennent", style: { fontSize: "104px" } },
    { text: "des clients.", style: { fontSize: "104px" } },
  ], { top: "270px", color: "#fff" });
  Object.assign(S.h1.lines[0].words[1].inner.style, { color: "transparent", WebkitTextStroke: "2.5px rgba(255,255,255,.85)" });
  Object.assign(S.h1.lines[2].words[1].inner.style, { fontFamily: "Instrument", fontStyle: "italic", fontWeight: 400, fontSize: "1.42em", letterSpacing: "-0.01em",
    background: "linear-gradient(90deg, #c4b5fd, #fff)", WebkitBackgroundClip: "text", color: "transparent", lineHeight: "0.8", paddingRight: "0.06em" });

  // 6b
  S.h2 = headline(root, [
    { text: "Un bouton,", style: { fontSize: "106px" } },
    { text: "et le téléphone", style: { fontSize: "92px" } },
    { text: "sonne.", cls: "serif", style: { fontSize: "150px", lineHeight: "0.92", color: "#c4b5fd" } },
  ], { top: "236px", color: "#fff" });

  S.btn = el("div", { class: "abs", style: { overflow: "hidden", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    boxShadow: "0 30px 90px -10px rgba(124,58,237,.8), inset 0 2px 0 rgba(255,255,255,.3)" } }, root);
  S.btnContent = el("div", { class: "abs", style: { inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "30px", color: "#fff", font: "700 60px Outfit" } }, S.btn);
  S.btnContent.innerHTML = `<span style="width:104px;height:104px;border-radius:50%;background:#fff;color:#7c3aed;display:grid;place-items:center">${icon("phone", 50, 'style="stroke-width:2.4"')}</span>Appeler`;
  // écran d'appel entrant
  S.call = el("div", { class: "abs", style: { left: 0, top: 0, width: `${PH.w}px`, height: `${PH.h}px`, background: "linear-gradient(180deg, #2a1660, #0b0718)", opacity: 0 } }, S.btn);
  S.call.innerHTML = `
    <div class="mono" style="position:absolute;top:70px;left:0;right:0;text-align:center;font-size:22px;color:#c4b5fd">APPEL ENTRANT…</div>
    <div class="ava" style="position:absolute;left:${PH.w / 2 - 80}px;top:150px;width:160px;height:160px;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#7c3aed);display:grid;place-items:center;color:#fff">${icon("user", 76, 'style="stroke-width:2"')}</div>
    <div style="position:absolute;top:360px;left:0;right:0;text-align:center;font:700 46px Outfit;color:#fff">Nouveau client</div>
    <div style="position:absolute;top:422px;left:0;right:0;text-align:center;font:400 27px Outfit;color:#c4b5fd">via votre site · Montpellier</div>`;
  S.avaRings = [0, 1, 2].map(() => el("div", { class: "abs", style: { left: `${PH.w / 2 - 80}px`, top: "150px", width: "160px", height: "160px", borderRadius: "50%", border: "3px solid rgba(196,181,253,.7)" } }, S.call));
  S.call.appendChild(S.call.querySelector(".ava"));
  S.decline = el("div", { class: "abs", style: { left: "56px", top: "590px", width: "108px", height: "108px", borderRadius: "50%", background: "#ef4444", display: "grid", placeItems: "center", color: "#fff" },
    html: `<span style="transform:rotate(135deg);display:grid">${icon("phone", 46, 'style="stroke-width:2.4"')}</span>` }, S.call);
  S.accept = el("div", { class: "abs", style: { left: `${PH.w - 164}px`, top: "590px", width: "108px", height: "108px", borderRadius: "50%", background: "#22c55e", display: "grid", placeItems: "center", color: "#fff", boxShadow: "0 0 40px rgba(34,197,94,.6)" },
    html: icon("phone", 46, 'style="stroke-width:2.4"') }, S.call);
  S.finger = el("div", { class: "abs", style: { left: "-55px", top: "-55px", width: "110px", height: "110px", borderRadius: "50%", background: "rgba(255,255,255,.28)", border: "4px solid rgba(255,255,255,.9)", boxShadow: "0 10px 40px rgba(0,0,0,.4)" } }, root);
}

function render(t, tf, G) {
  const fx = G.fx;
  // ---- 6a : visiteurs → clients
  animWords(S.h1.words, t, 27.84, 29.74, { st: 0.09, dur: 0.6 });
  S.h1.root.style.display = t < 30.1 ? "block" : "none";
  const collapse = E.inExpo(prog(t, 29.72, 30.02));
  // portail
  const gateOn = prog(t, 28.1, 28.4) * (1 - collapse);
  if (gateOn > 0) {
    let hit = 0;
    for (const v of VIS) hit += pulse(t, v.s + 0.5, 0.03, 0.18);
    fx.save();
    fx.translate(GATE[0], GATE[1]);
    fx.scale(1, 0.24);
    for (let k = 0; k < 4; k++) {
      fx.strokeStyle = `rgba(196,181,253,${(0.55 - k * 0.12) * gateOn + hit * 0.15})`;
      fx.lineWidth = 7 + k * 6 + hit * 6;
      fx.beginPath(); fx.arc(0, 0, 200 * gateOn + k * 8, 0, Math.PI * 2); fx.stroke();
    }
    fx.restore();
    const g = fx.createRadialGradient(GATE[0], GATE[1], 0, GATE[0], GATE[1], 260);
    g.addColorStop(0, `rgba(167,139,250,${0.35 * gateOn + 0.2 * Math.min(1, hit)})`); g.addColorStop(1, "rgba(167,139,250,0)");
    fx.fillStyle = g; fx.fillRect(GATE[0] - 260, GATE[1] - 260, 520, 520);
  }
  fx.save();
  for (const v of VIS) {
    const a = prog(t, v.s, v.s + 0.5);
    const b = prog(t, v.s + 0.5, v.s + 0.92);
    if (a <= 0) continue;
    if (a < 1) {
      // visiteur : cercle creux + traînée
      for (let k = 6; k >= 0; k--) {
        const u = E.io2(clamp(a - k * 0.03));
        const x = (1 - u) ** 2 * v.start[0] + 2 * (1 - u) * u * v.ctrl[0] + u * u * v.gate[0];
        const y = (1 - u) ** 2 * v.start[1] + 2 * (1 - u) * u * v.ctrl[1] + u * u * v.gate[1];
        fx.strokeStyle = `rgba(196,181,253,${k === 0 ? 0.95 : 0.25 * (1 - k / 7)})`;
        fx.lineWidth = 3.5;
        fx.globalAlpha = 1 - collapse; fx.beginPath(); fx.arc(x, y, 15 - k * 0.9, 0, Math.PI * 2); fx.stroke(); fx.globalAlpha = 1;
      }
    } else {
      // client : silhouette pleine qui rejoint sa place
      const u = E.brandOut(b);
      let x = lerp(v.gate[0], v.slot[0], u);
      let y = lerp(v.gate[1], v.slot[1], u) - Math.sin(Math.PI * u) * 60;
      const k = lerp(0.6, 1.3, E.outBack(b, 3));
      // effondrement vers le centre pour la suite
      x = lerp(x, 540, collapse); y = lerp(y, 900, collapse);
      person(fx, x, y, k * (1 - collapse * 0.9), b < 1 ? "#ffffff" : `rgba(196,181,253,${1 - collapse})`);
      if (b >= 1 && collapse <= 0 && t < v.s + 1.2) ring(fx, t, v.s + 0.92, v.slot[0], v.slot[1], { r0: 20, r1: 52, dur: 0.3, width: 3, color: "#c4b5fd" });
    }
  }
  fx.restore();

  // ---- 6b : le bouton
  animWords(S.h2.words.slice(0, 2), t, 29.95, 31.78, { st: 0.1, dur: 0.55 });
  animWords(S.h2.words.slice(2), t, 30.5, 31.78, { st: 0.09, dur: 0.55 });
  S.h2.root.style.display = t > 29.9 ? "block" : "none";

  const bp = prog(t, 29.98, 30.4);
  const morph = E.brand(prog(t, 30.72, 31.2));
  const press = 1 - 0.07 * pulse(t, 30.48, 0.05, 0.22);
  const x = lerp(BTN.x, PH.x, morph), y = lerp(BTN.y, PH.y, morph), w = lerp(BTN.w, PH.w, morph), h = lerp(BTN.h, PH.h, morph);
  Object.assign(S.btn.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, borderRadius: `${lerp(78, 56, morph)}px`, display: t > 29.95 ? "block" : "none" });
  // vibration de la sonnerie (deux salves)
  const buzz = (t > 31.15 && t < 31.5) || (t > 31.58 && t < 31.78) ? Math.sin(t * 2 * Math.PI * 23) * 2.6 : 0;
  put(S.btn, { s: (bp < 1 ? lerp(0.3, 1, E.outBack(bp, 2.4)) : 1) * press, o: clamp(bp * 3), r: buzz });
  S.btnContent.style.opacity = 1 - prog(t, 30.7, 30.82);
  S.call.style.opacity = prog(t, 30.95, 31.15);
  S.avaRings.forEach((r, i) => {
    const p = ((t - 31.0 + i * 0.33) % 1 + 1) % 1;
    put(r, { s: 1 + p * 0.9, o: t > 31.0 ? (1 - p) * 0.8 : 0 });
  });
  put(S.accept, { y: t > 31.2 ? -Math.abs(Math.sin((t - 31.2) * 7)) * 14 : 0, s: 1 - 0.15 * pulse(t, 31.72, 0.05, 0.2) });
  // ondes sonores de part et d'autre
  if (t > 31.12 && t < 31.85) {
    for (const side of [-1, 1]) {
      for (let k = 0; k < 3; k++) {
        const p = ((t - 31.12) * 2.2 - k * 0.25) % 1;
        if (p < 0) continue;
        fx.strokeStyle = `rgba(196,181,253,${(1 - p) * 0.9})`;
        fx.lineWidth = 6;
        fx.lineCap = "round";
        fx.beginPath();
        const cx = 540 + side * (PH.w / 2 + 10), cy = PH.y + 200;
        const r = 40 + p * 90;
        const a0 = side > 0 ? -0.6 : Math.PI - 0.6, a1 = side > 0 ? 0.6 : Math.PI + 0.6;
        fx.arc(cx - side * 30, cy, r, a0, a1);
        fx.stroke();
      }
    }
  }
  // doigt : clic sur « Appeler », puis sur « Décrocher »
  let fxp, fyp, fo = 0, fs = 1;
  if (t < 30.75) {
    const m1 = E.brand(prog(t, 30.12, 30.44));
    fxp = lerp(900, 640, m1); fyp = lerp(1350, 880, m1);
    fo = prog(t, 30.12, 30.22) * (1 - prog(t, 30.6, 30.75));
    fs = 1 - 0.3 * pulse(t, 30.46, 0.05, 0.2);
  } else {
    const m2 = E.brand(prog(t, 31.38, 31.68));
    fxp = lerp(900, ACCEPT[0], m2); fyp = lerp(1600, ACCEPT[1], m2);
    fo = prog(t, 31.38, 31.48) * (1 - prog(t, 31.85, 31.95));
    fs = 1 - 0.3 * pulse(t, 31.7, 0.05, 0.2);
  }
  put(S.finger, { x: fxp, y: fyp, s: fs, o: fo });
  ring(fx, t, 30.5, 640, 880, { r0: 30, r1: 420, dur: 0.6, width: 8, color: "#c4b5fd" });
  burst(fx, t, 30.5, 540, 868, { n: 18, seed: 61, r0: 360, r1: 520, dur: 0.5, width: 6, colors: ["#ffffff", "#c4b5fd"] });
  ring(fx, t, 31.72, ACCEPT[0], ACCEPT[1], { r0: 50, r1: 200, dur: 0.45, width: 7, color: "#4ade80" });
}

export default { id: "a6", t0: 27.8, t1: 32.3, build, render };

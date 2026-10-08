// ACTE 1 — L'ombre (0 → 6 s) : quelqu'un cherche, vous n'existez pas, il appelle un concurrent.
import { el, put, clamp, lerp, prog, E, tw, kf, pulse, decode, noise1, hash } from "../lib.js";
import { headline, animWords, icon } from "../ui.js";

const CX = 540, CY = 960;
const BAR = { x: 100, y: 716, w: 880, h: 124 };
const CARD_Y = [884, 1028, 1172, 1316];
const PILL = { x: 904, y: CARD_Y[0] + 62 }; // téléphone du concurrent
const ARRIVALS = [4.15, 4.55, 4.95];
const TYPED = "artisan montpellier";

const S = {};

function build(root) {
  // fond nuit + halo
  S.bg = el("div", { class: "layer", style: { background: "radial-gradient(90% 60% at 50% 42%, #22144a 0%, #120a2b 45%, #07040f 100%)" } }, root);
  S.halo = el("div", { class: "abs", style: { left: "40px", top: "460px", width: "1000px", height: "1000px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,.35), rgba(124,58,237,0) 65%)" } }, root);
  // sol en grille de points (perspective)
  S.floorWrap = el("div", { class: "abs", style: { left: "-700px", top: "420px", width: "2480px", height: "1500px", perspective: "620px", perspectiveOrigin: "50% 600px" } }, root);
  S.floor = el("div", { class: "abs", style: { inset: 0, transformOrigin: "50% 100%",
    backgroundImage: "radial-gradient(rgba(196,181,253,.6) 2.6px, transparent 3.4px)", backgroundSize: "64px 64px",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 30%, #000 75%)" } }, S.floorWrap);

  S.content = el("div", { class: "layer", style: { transformOrigin: `${CX}px ${CY}px` } }, root);
  const C = S.content;

  // étiquette « en direct »
  S.tag = el("div", { class: "abs center mono", style: { top: "232px", fontSize: "27px", fontWeight: 500, color: "#c4b5fd" } }, C);
  S.tagDot = el("span", { style: { display: "inline-block", width: "14px", height: "14px", borderRadius: "50%", background: "#ff4d6d", marginRight: "16px", verticalAlign: "2px", boxShadow: "0 0 18px #ff4d6d" } }, S.tag);
  S.tagText = el("span", {}, S.tag);

  const H = { top: "318px", color: "#fff" };
  S.h1 = headline(C, [
    { text: "Quelqu'un cherche", style: { fontSize: "98px" } },
    { text: "un artisan", cls: "serif", style: { fontSize: "132px", lineHeight: "1.02", color: "#c4b5fd" } },
    { text: "près de chez vous.", style: { fontSize: "98px" } },
  ], H);
  S.h2 = headline(C, [
    { text: "S'il ne vous", style: { fontSize: "118px" } },
    { text: "trouve pas,", style: { fontSize: "118px" } },
  ], { ...H, top: "360px" });
  S.h3 = headline(C, [
    { text: "il appelle", style: { fontSize: "104px" } },
    { text: "quelqu'un", style: { fontSize: "104px" } },
    { text: "d'autre.", cls: "serif", style: { fontSize: "150px", lineHeight: "0.95", color: "#ffb547" } },
  ], { ...H, top: "250px" });

  // barre de recherche (naît du point)
  S.bar = el("div", { class: "abs", style: { borderRadius: "70px", background: "rgba(255,255,255,.07)",
    border: "2px solid rgba(196,181,253,.45)", boxShadow: "0 0 60px rgba(124,58,237,.45), inset 0 0 30px rgba(124,58,237,.15)", overflow: "hidden" } }, C);
  S.barIcon = el("div", { class: "abs", style: { left: "40px", top: "36px", color: "#c4b5fd" }, html: icon("search", 50, 'style="stroke-width:2.4"') }, S.bar);
  S.barText = el("div", { class: "abs mono", style: { left: "116px", top: "36px", fontSize: "44px", lineHeight: "52px", color: "#fff", textTransform: "none", letterSpacing: "0", whiteSpace: "pre" } }, S.bar);
  S.caret = el("span", { style: { display: "inline-block", width: "4px", height: "48px", background: "#a78bfa", verticalAlign: "-8px", marginLeft: "4px" } });
  S.enter = el("div", { class: "abs mono", style: { right: "28px", top: "30px", fontSize: "24px", padding: "14px 18px", borderRadius: "16px", color: "#c4b5fd", border: "2px solid rgba(196,181,253,.35)" }, text: "↵ ENTRÉE" }, S.bar);
  S.ring = el("div", { class: "abs", style: { left: `${BAR.x}px`, top: `${BAR.y}px`, width: `${BAR.w}px`, height: `${BAR.h}px`, borderRadius: "70px", border: "3px solid #a78bfa" } }, C);

  // résultats concurrents
  const results = [
    ["Atelier Martin", "4,9", "#ffb547", "#ff7a59"],
    ["Menuiserie Dubois", "4,7", "#5eead4", "#0ea5e9"],
    ["Plomberie du Sud", "4,8", "#f0abfc", "#a855f7"],
  ];
  S.cards = results.map(([name, note, c1, c2], i) => {
    const c = el("div", { class: "abs glass", style: { left: "100px", top: `${CARD_Y[i]}px`, width: "880px", height: "128px", borderRadius: "30px",
      background: "rgba(255,255,255,.06)", backdropFilter: "blur(2px)" } }, C);
    el("div", { class: "abs", style: { left: "22px", top: "22px", width: "84px", height: "84px", borderRadius: "22px",
      background: `linear-gradient(135deg, ${c1}, ${c2})`, color: "#fff", font: "800 40px Bricolage", display: "grid", placeItems: "center" }, text: name[0] }, c);
    el("div", { class: "abs", style: { left: "130px", top: "20px", font: "600 38px Outfit", color: "#fff" }, text: name }, c);
    el("div", { class: "abs", style: { left: "130px", top: "70px", font: "500 27px Outfit", color: "rgba(255,255,255,.55)" },
      html: `<span style="color:#ffb547;letter-spacing:2px">★★★★★</span>&nbsp; ${note} &nbsp;·&nbsp; <span style="color:#4ade80">Ouvert</span>` }, c);
    const pill = el("div", { class: "abs", style: { right: "22px", top: "26px", width: "76px", height: "76px", borderRadius: "50%",
      background: "rgba(255,255,255,.08)", display: "grid", placeItems: "center", color: "#fff" }, html: icon("phone", 34) }, c);
    return { c, pill };
  });
  // la place vide : « votre entreprise »
  S.ghost = el("div", { class: "abs", style: { left: "100px", top: `${CARD_Y[3]}px`, width: "880px", height: "128px", borderRadius: "30px",
    border: "3px dashed rgba(196,181,253,.5)" } }, C);
  S.ghostTxt = el("div", { class: "abs", style: { left: "40px", top: "36px", font: "700 40px Bricolage", color: "rgba(255,255,255,.5)", letterSpacing: "-0.02em" }, text: "Votre entreprise ?" }, S.ghost);
  S.stamp = el("div", { class: "abs mono", style: { right: "26px", top: "28px", fontSize: "30px", fontWeight: 700, color: "#ff4d6d",
    border: "4px solid #ff4d6d", borderRadius: "14px", padding: "10px 18px", letterSpacing: "0.12em", background: "rgba(255,77,109,.12)" }, text: "INTROUVABLE" }, S.ghost);

  // badge du concurrent
  S.badge = el("div", { class: "abs", style: { left: "640px", top: `${CARD_Y[0] - 40}px`, padding: "12px 24px", borderRadius: "999px",
    background: "#ffb547", color: "#1a1030", font: "800 32px Outfit", boxShadow: "0 12px 40px rgba(255,181,71,.45)", display: "flex", gap: "10px", alignItems: "center", transformOrigin: "20% 100%" } }, C);
  S.badgeN = el("span", { style: { display: "inline-block", height: "38px", overflow: "hidden", lineHeight: "38px" } }, S.badge);
  S.badgeStrip = el("span", { style: { display: "flex", flexDirection: "column" } }, S.badgeN);
  for (const n of ["+1 client", "+2 clients", "+3 clients"]) el("span", { text: n, style: { height: "38px", whiteSpace: "nowrap" } }, S.badgeStrip);

  // le point (persiste hors du contenu pour l'implosion)
  S.dot = el("div", { class: "abs", style: { left: `${CX - 14}px`, top: `${CY - 14}px`, width: "28px", height: "28px", borderRadius: "50%",
    background: "#c4b5fd", boxShadow: "0 0 30px 8px rgba(167,139,250,.9), 0 0 120px 30px rgba(124,58,237,.6)" } }, root);
  // disques d'explosion (sous le prochain acte)
  S.discs = ["#7c3aed", "#c4b5fd"].map((bg) => el("div", { class: "abs", style: { left: `${CX - 1200}px`, top: `${CY - 1200}px`, width: "2400px", height: "2400px", borderRadius: "50%", background: bg } }, root));
}

function render(t, tf, G) {
  const fx = G.fx;
  // ---- ambiance
  S.halo.style.opacity = tw(t, 0, 1.2, 0, 1) * (0.75 + 0.25 * Math.sin(t * 3));
  S.floor.style.transform = `rotateX(76deg)`;
  S.floor.style.backgroundPosition = `0 ${t * 70}px`;
  S.floorWrap.style.opacity = tw(t, 0.3, 1.6, 0, 0.55);

  // ---- étiquette
  S.tagText.textContent = decode("EN CE MOMENT · MONTPELLIER", tf, 0.2, 0.6, 3, Math.round(tf * 30));
  S.tagDot.style.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.cos(tf * 7));
  put(S.tag, { o: prog(t, 0.15, 0.3) * (1 - prog(t, 2.86, 3.0)), y: -14 * E.in2(prog(t, 2.86, 3.0)) });

  // ---- le point : battement, étirement, puis barre
  const beat = pulse(t, 0.12, 0.06, 0.25) + 0.7 * pulse(t, 0.42, 0.05, 0.25);
  const appear = E.outBack(prog(t, 0.02, 0.22), 2.4);
  const toBar = prog(t, 0.72, 1.12);
  const dotY = lerp(CY, BAR.y + BAR.h / 2, E.brand(prog(t, 0.6, 0.9)));
  const w = lerp(28, BAR.w, E.brandOut(prog(t, 0.78, 1.12)));
  const h = lerp(28, BAR.h, E.brandOut(prog(t, 0.95, 1.28)));
  // implosion : le point revient au centre
  const reborn = E.outBack(prog(t, 5.55, 5.85), 2);
  if (t < 1.0) {
    put(S.dot, { x: 0, y: dotY - CY, s: appear * (1 + beat * 0.45) * lerp(1, 0.6, toBar), o: 1 });
  } else if (t < 5.5) {
    put(S.dot, { o: 0 });
  } else {
    const tremble = t > 5.8 ? noise1(t * 60, 3) * 3 : 0;
    put(S.dot, { x: tremble, s: reborn * (1 + 0.35 * pulse(t, 5.86, 0.04, 0.12)), o: 1 });
  }
  const barOn = t >= 0.78;
  S.bar.style.display = barOn ? "block" : "none";
  if (barOn) {
    const press = 1 - 0.035 * pulse(t, 2.05, 0.05, 0.2);
    Object.assign(S.bar.style, { left: `${CX - w / 2}px`, top: `${dotY - h / 2}px`, width: `${w}px`, height: `${h}px` });
    put(S.bar, { s: press });
    const inner = prog(t, 1.1, 1.3);
    put(S.barIcon, { o: inner, x: (1 - E.out3(inner)) * -20 });
    S.barIcon.querySelectorAll("circle, path").forEach((p) => { p.style.strokeDasharray = "1"; p.style.strokeDashoffset = 1 - E.out3(prog(t, 1.08, 1.4)); });
    const n = Math.floor(clamp((t - 1.3) / 0.68) * TYPED.length);
    S.barText.textContent = TYPED.slice(0, n);
    S.barText.appendChild(S.caret);
    const typing = t > 1.25 && t < 2.05;
    S.caret.style.opacity = t < 1.15 ? 0 : typing ? 1 : Math.floor(tf * 2.2) % 2 === 0 ? 1 : 0;
    put(S.enter, { o: prog(t, 1.9, 2.0) * (1 - prog(t, 2.25, 2.4)), s: 1 - 0.1 * pulse(t, 2.03, 0.04, 0.15) });
  }
  // onde d'Entrée
  const rp = prog(t, 2.05, 2.6);
  put(S.ring, { s: 1 + E.out3(rp) * 0.16, o: rp > 0 && rp < 1 ? (1 - rp) * 0.9 : 0 });

  // ---- titres
  animWords(S.h1.words, t, 0.5, 2.86, { st: 0.11, dur: 0.6, stOut: 0.016, durOut: 0.24 });
  animWords(S.h2.words, t, 3.04, 3.7, { st: 0.07, dur: 0.5, stOut: 0.02, durOut: 0.22 });
  animWords(S.h3.words, t, 3.86, Infinity, { st: 0.09, dur: 0.55 });
  S.h1.root.style.display = t < 3.4 ? "block" : "none";
  S.h2.root.style.display = t > 2.9 && t < 4.2 ? "block" : "none";
  S.h3.root.style.display = t > 3.7 ? "block" : "none";
  // aberration chromatique qui monte avant l'implosion
  const glitch = prog(t, 4.9, 5.4);
  if (glitch > 0) {
    const j = (hash(Math.floor(tf * 30)) - 0.5) * 2;
    const o = 3 + glitch * 10;
    S.h3.root.style.textShadow = `${-o + j * 4}px 0 rgba(255,40,90,.75), ${o + j * 3}px 0 rgba(0,220,255,.7)`;
  } else S.h3.root.style.textShadow = "none";

  // ---- cartes résultats (bascule 3D)
  S.cards.forEach(({ c, pill }, i) => {
    const p = prog(t, 2.08 + i * 0.1, 2.68 + i * 0.1);
    const e = E.brandOut(p);
    put(c, { persp: 1200, y: (1 - e) * 120, rx: (1 - e) * 55, s: lerp(0.94, 1, e), o: clamp(p * 2.2) });
    // le concurrent s'allume
    if (i === 0) {
      const hot = prog(t, 3.85, 4.1);
      c.style.borderColor = hot > 0 ? `rgba(255,181,71,${0.25 + hot * 0.65})` : "";
      c.style.boxShadow = hot > 0 ? `0 0 ${60 * hot}px rgba(255,181,71,${0.35 * hot})` : "";
      const ring = t > 3.95 && t < 5.3 ? Math.sin(t * 2 * Math.PI * 16) * 14 * (0.5 + 0.5 * Math.sin(t * 2 * Math.PI * 1.25)) : 0;
      pill.style.background = hot > 0 ? `rgba(255,181,71,${0.25 + 0.75 * hot})` : "rgba(255,255,255,.08)";
      pill.style.color = hot > 0.5 ? "#1a1030" : "#fff";
      put(pill, { r: ring, s: 1 + 0.12 * ARRIVALS.reduce((a, ta) => a + pulse(t, ta, 0.04, 0.2), 0) });
      put(c, { persp: 1200, y: (1 - e) * 120, rx: (1 - e) * 55, s: lerp(0.94, 1, e) * (1 + 0.025 * hot), o: clamp(p * 2.2) });
    } else {
      // les autres s'effacent un peu quand le concurrent gagne
      const dim = prog(t, 3.9, 4.3);
      c.style.opacity = clamp(p * 2.2) * (1 - 0.45 * dim);
    }
  });

  // ---- la place vide
  const gp = prog(t, 2.45, 2.9);
  const flick = gp <= 0 ? 0 : gp >= 1 ? 1 : hash(Math.floor(tf * 30) + 5) > 0.45 ? gp : 0.15;
  const no = t > 3.04 && t < 3.4 ? Math.sin((t - 3.04) * 2 * Math.PI * 7) * 18 * (1 - prog(t, 3.04, 3.4)) : 0;
  put(S.ghost, { o: flick, x: no });
  const sp = prog(t, 2.96, 3.06);
  put(S.stamp, { s: lerp(2.6, 1, E.in2(sp)), r: -6, o: sp > 0 ? 1 : 0 });
  S.ghostTxt.style.textDecoration = t > 3.04 ? "line-through" : "none";
  S.ghostTxt.style.textDecorationColor = "rgba(255,77,109,.8)";

  // ---- badge +n clients
  const bp = prog(t, ARRIVALS[0], ARRIVALS[0] + 0.35);
  let roll = 0;
  ARRIVALS.forEach((ta, i) => { if (i) roll += E.brandOut(prog(t, ta, ta + 0.3)); });
  S.badgeStrip.style.transform = `translateY(${-roll * 38}px)`;
  put(S.badge, { s: E.outBack(bp, 2.2) * (1 + 0.1 * ARRIVALS.reduce((a, ta) => a + pulse(t, ta, 0.04, 0.25), 0)), o: bp > 0 ? 1 : 0, r: -4 });

  // ---- clients qui filent chez le concurrent (particules + traînées)
  const P0 = [-60, 1640], P1 = [560, 1760], P2 = [1180, 1340], P3 = [PILL.x, PILL.y];
  const bez = (u) => {
    const a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3;
    return [a * P0[0] + b * P1[0] + c * P2[0] + d * P3[0], a * P0[1] + b * P1[1] + c * P2[1] + d * P3[1]];
  };
  const travellers = [...ARRIVALS.map((ta) => [ta, 1]), [4.35, 0.6], [4.75, 0.6], [5.1, 0.6], [5.25, 0.5]];
  fx.globalCompositeOperation = "lighter";
  for (const [ta, size] of travellers) {
    const dur = 0.62;
    const u = prog(t, ta - dur, ta);
    if (u <= 0 || u >= 1) continue;
    const ue = E.io2(u);
    const pts = [];
    for (let k = 0; k <= 24; k++) pts.push(bez(clamp(ue - k * 0.009)));
    for (let k = 0; k < 24; k++) {
      fx.strokeStyle = `rgba(255,${190 - k * 3},80,${(1 - k / 24) * 0.7})`;
      fx.lineWidth = (16 - k * 0.6) * size;
      fx.lineCap = "round";
      fx.beginPath(); fx.moveTo(...pts[k]); fx.lineTo(...pts[k + 1]); fx.stroke();
    }
    const [hx, hy] = pts[0];
    const g = fx.createRadialGradient(hx, hy, 0, hx, hy, 46 * size);
    g.addColorStop(0, "rgba(255,240,200,1)"); g.addColorStop(0.25, "rgba(255,181,71,.8)"); g.addColorStop(1, "rgba(255,181,71,0)");
    fx.fillStyle = g; fx.beginPath(); fx.arc(hx, hy, 46 * size, 0, Math.PI * 2); fx.fill();
  }
  // éclats à l'arrivée
  for (const ta of ARRIVALS) {
    const p = prog(t, ta, ta + 0.35);
    if (p <= 0 || p >= 1) continue;
    fx.strokeStyle = `rgba(255,181,71,${1 - p})`;
    fx.lineWidth = 4 * (1 - p);
    fx.beginPath(); fx.arc(PILL.x, PILL.y, 40 + E.out3(p) * 70, 0, Math.PI * 2); fx.stroke();
  }
  fx.globalCompositeOperation = "source-over";

  // ---- poussée caméra lente puis implosion vers le point
  const push = 1 + 0.045 * E.io2(prog(t, 2.0, 5.35));
  const imp = E.inExpo(prog(t, 5.3, 5.78));
  put(S.content, { s: push * (1 - imp), r: imp * 28, o: 1 - prog(t, 5.6, 5.78) });
  S.floorWrap.style.opacity = tw(t, 0.3, 1.6, 0, 0.55) * (1 - prog(t, 5.3, 5.7));
  S.halo.style.opacity = tw(t, 0, 1.2, 0, 1) * (0.75 + 0.25 * Math.sin(t * 3)) * (1 - prog(t, 5.3, 5.75) * 0.7);

  // ---- explosion : disques concentriques
  S.discs.forEach((d, i) => {
    const p = prog(t, 6.0 + i * 0.05, 6.45 + i * 0.06);
    put(d, { s: Math.max(0.001, E.outExpo(p)), o: p > 0 ? 1 : 0 });
  });
}

export default { id: "a1", t0: 0, t1: 6.7, build, render };

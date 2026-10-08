// Briques réutilisables : icônes, titres cinétiques, cartes.
import { el, E, prog, lerp, clamp, splitWords } from "./lib.js";
import { ICONS } from "./icons.js";

export const icon = (name, size = 48, attrs = "") =>
  `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" ${attrs}>${ICONS[name]}</svg>`;

/**
 * Titre multi-lignes. lines = [{ text, cls, style, chars }]
 * Retourne { root, lines: [{ el, words }] , words: [...tous] }
 */
export function headline(parent, lines, style = {}) {
  const root = el("div", { class: "abs center", style }, parent);
  const out = { root, lines: [], words: [] };
  for (const L of lines) {
    const line = el("div", { class: L.cls || "disp", style: { display: "block", ...(L.style || {}) } }, root);
    line.textContent = L.text;
    const words = splitWords(line, { chars: !!L.chars });
    out.lines.push({ el: line, words });
    out.words.push(...words);
  }
  return out;
}

/** Entrée/sortie de mots masqués (glissé vertical + légère rotation). */
export function animWords(words, t, tIn, tOut = Infinity, o = {}) {
  const { st = 0.06, dur = 0.55, ease = E.brandOut, y = 135, rot = 7, stOut = 0.03, durOut = 0.32, yOut = -135 } = o;
  words.forEach((w, i) => {
    const pi = ease(prog(t, tIn + i * st, tIn + i * st + dur));
    const po = tOut === Infinity ? 0 : E.in3(prog(t, tOut + i * stOut, tOut + i * stOut + durOut));
    const yy = (1 - pi) * y + po * yOut;
    const r = (1 - pi) * rot + po * -rot * 0.5;
    w.inner.style.transform = `translateY(${yy}%) rotate(${r}deg)`;
  });
}

/** Entrée lettre à lettre en bascule 3D. */
export function animChars(chars, t, tIn, tOut = Infinity, o = {}) {
  const { st = 0.032, dur = 0.6, ease = E.brandOut, stOut = 0.015, durOut = 0.3 } = o;
  chars.forEach((c, i) => {
    const pi = ease(prog(t, tIn + i * st, tIn + i * st + dur));
    const po = tOut === Infinity ? 0 : E.in3(prog(t, tOut + i * stOut, tOut + i * stOut + durOut));
    const y = (1 - pi) * 70 - po * 120;
    const rx = (1 - pi) * -95 + po * 60;
    c.style.transform = `perspective(600px) translateY(${y}%) rotateX(${rx}deg)`;
    c.style.opacity = clamp(pi * 1.6) * (1 - po);
  });
}

/** Typographie variable : graisse + chasse animées (Bricolage 200–800 / 75–100). */
export function varfont(n, wght, wdth = 100) {
  n.style.fontVariationSettings = `"wght" ${wght.toFixed(1)}, "wdth" ${wdth.toFixed(1)}`;
}

/** Interpolation de couleur hex. */
export function hexmix(a, b, p) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(p)))).join(",")})`;
}

/** Sprite découpé dans une image (pour animer le logo pièce par pièce). */
export function sprite(parent, src, imgW, k, [x0, y0, x1, y1], left, top) {
  const box = el("div", { class: "abs", style: {
    left: `${left + x0 * k}px`, top: `${top + y0 * k}px`, width: `${(x1 - x0) * k}px`, height: `${(y1 - y0) * k}px`, overflow: "hidden" } }, parent);
  const inner = el("div", { class: "abs", style: { inset: 0, overflow: "hidden" } }, box);
  el("img", { src, style: { position: "absolute", width: `${imgW * k}px`, left: `${-x0 * k}px`, top: `${-y0 * k}px`, maxWidth: "none" } }, inner);
  return { box, inner };
}

/** Pastille compteur à rouleau (odomètre). value peut être fractionnaire. */
export function odometer(parent, digits, style = {}) {
  const root = el("div", { style: { display: "inline-flex", ...style } }, parent);
  const cols = [];
  for (let i = 0; i < digits; i++) {
    const win = el("div", { style: { height: "1em", overflow: "hidden", lineHeight: "1em", position: "relative" } }, root);
    const strip = el("div", { style: { display: "flex", flexDirection: "column" } }, win);
    for (let d = 0; d <= 10; d++) el("div", { style: { height: "1em" }, text: String(d % 10) }, strip);
    cols.push({ win, strip });
  }
  return {
    root,
    set(value, hideLeadingZeros = true) {
      const v = Math.max(0, value);
      for (let i = 0; i < digits; i++) {
        const place = 10 ** (digits - 1 - i);
        // rotation continue du chiffre : les unités roulent, les dizaines suivent quand les unités passent 9→0
        const raw = v / place;
        const base = Math.floor(raw) % 10;
        const lower = (v % place) / place; // progression dans le chiffre
        const carry = place === 1 ? raw - Math.floor(raw) : clamp((lower - 0.9) / 0.1);
        const pos = base + (place === 1 ? carry : carry);
        cols[i].strip.style.transform = `translateY(${-pos}em)`;
        const lead = hideLeadingZeros && v < place && i < digits - 1;
        cols[i].win.style.width = lead ? "0" : "";
        cols[i].win.style.opacity = lead ? 0 : 1;
      }
    },
  };
}

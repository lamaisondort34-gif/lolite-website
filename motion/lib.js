// Petite boîte à outils d'animation déterministe : tout est fonction du temps t.

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, p) => a + (b - a) * p;
export const prog = (t, t0, t1) => clamp((t - t0) / (t1 - t0));
export const mix = (a, b, p) => a.map((v, i) => lerp(v, b[i], p));

/* ---------- Courbes ---------- */

function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u) => ((ax * u + bx) * u + cx) * u;
  const sy = (u) => ((ay * u + by) * u + cy) * u;
  const dx = (u) => (3 * ax * u + 2 * bx) * u + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let u = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(u) - x;
      if (Math.abs(e) < 1e-6) break;
      const d = dx(u);
      if (Math.abs(d) < 1e-6) break;
      u -= e / d;
    }
    let lo = 0, hi = 1;
    for (let i = 0; i < 30 && Math.abs(sx(u) - x) > 1e-6; i++) {
      u = (lo + hi) / 2;
      if (sx(u) < x) lo = u; else hi = u;
    }
    return sy(u);
  };
}

const c1 = 1.70158;
export const E = {
  lin: (x) => x,
  // courbes signature du site LOLITE (src/lib/site.ts)
  brand: bezier(0.76, 0, 0.24, 1),
  brandOut: bezier(0.16, 1, 0.3, 1),
  in2: (x) => x * x,
  in3: (x) => x * x * x,
  in4: (x) => x ** 4,
  out2: (x) => 1 - (1 - x) ** 2,
  out3: (x) => 1 - (1 - x) ** 3,
  out4: (x) => 1 - (1 - x) ** 4,
  out5: (x) => 1 - (1 - x) ** 5,
  io2: (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2),
  io3: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
  io4: (x) => (x < 0.5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2),
  inExpo: (x) => (x <= 0 ? 0 : 2 ** (10 * x - 10)),
  outExpo: (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x)),
  ioExpo: (x) =>
    x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2,
  outBack: (x, s = c1) => 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2,
  inBack: (x, s = c1) => (s + 1) * x ** 3 - s * x * x,
  outElastic: (x) =>
    x <= 0 ? 0 : x >= 1 ? 1 : 2 ** (-10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
  sine: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  bezier,
};

/** Ressort amorti 0 → 1 (dépassement naturel). */
export function spring(t, { f = 2.2, z = 0.42 } = {}) {
  if (t <= 0) return 0;
  const w = 2 * Math.PI * f;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
}

/** Valeur animée entre t0 et t1 avec une courbe. */
export const tw = (t, t0, t1, a, b, ease = E.brandOut) => lerp(a, b, ease(prog(t, t0, t1)));

/** Images clés : [[t, v, ease?], ...] — l'ease s'applique au segment qui arrive sur la clé. */
export function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, ease = E.brandOut] = keys[i];
    if (t <= t1) {
      const [t0, v0] = keys[i - 1];
      return lerp(v0, v1, ease(prog(t, t0, t1)));
    }
  }
  return keys[keys.length - 1][1];
}

/** Impulsion 0 → 1 → 0 (attaque/relâche). */
export const pulse = (t, t0, up, down, ease = E.out3) =>
  t < t0 ? 0 : t < t0 + up ? ease(prog(t, t0, t0 + up)) : 1 - E.io2(prog(t, t0 + up, t0 + up + down));

/* ---------- Aléatoire déterministe ---------- */

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let r = Math.imul(a ^ (a >>> 15), 1 | a);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
export const hash = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** Bruit 1D lisse (pour secousses caméra, flottements). */
export function noise1(x, seed = 0) {
  const i = Math.floor(x), f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash(i + seed * 57.3) * 2 - 1, hash(i + 1 + seed * 57.3) * 2 - 1, u);
}

/* ---------- DOM ---------- */

export const $ = (id) => document.getElementById(id);

export function el(tag, attrs = {}, parent) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "style") Object.assign(n.style, v);
    else if (k === "html") n.innerHTML = v;
    else if (k === "text") n.textContent = v;
    else n.setAttribute(k, v);
  }
  if (parent) parent.appendChild(n);
  return n;
}

/** Applique transform + opacité. Les valeurs non fournies restent neutres. */
export function put(n, o) {
  const tr = [];
  if (o.persp) tr.push(`perspective(${o.persp}px)`);
  if (o.x || o.y || o.z) tr.push(`translate3d(${o.x || 0}px,${o.y || 0}px,${o.z || 0}px)`);
  if (o.xp || o.yp) tr.push(`translate(${o.xp || 0}%,${o.yp || 0}%)`);
  if (o.rx) tr.push(`rotateX(${o.rx}deg)`);
  if (o.ry) tr.push(`rotateY(${o.ry}deg)`);
  if (o.r) tr.push(`rotate(${o.r}deg)`);
  if (o.skx) tr.push(`skewX(${o.skx}deg)`);
  if (o.s !== undefined && o.s !== 1) tr.push(`scale(${o.s})`);
  if (o.sx !== undefined || o.sy !== undefined) tr.push(`scale(${o.sx ?? 1},${o.sy ?? 1})`);
  n.style.transform = tr.join(" ");
  if (o.o !== undefined) n.style.opacity = clamp(o.o);
  if (o.blur !== undefined) n.style.filter = o.blur > 0.05 ? `blur(${o.blur}px)` : "none";
  if (o.clip !== undefined) n.style.clipPath = o.clip;
  if (o.vis !== undefined) n.style.visibility = o.vis ? "visible" : "hidden";
}

/** Découpe un texte en mots (et lettres) masqués pour révélations cinétiques. */
export function splitWords(n, { chars = false } = {}) {
  const text = n.textContent;
  n.textContent = "";
  const words = [];
  const parts = text.split(" ");
  parts.forEach((w, i) => {
    const mask = el("span", { class: "wm" }, n);
    const inner = el("span", { class: "wi" }, mask);
    const word = { mask, inner, chars: [] };
    if (chars) {
      for (const ch of w) {
        const c = el("span", { class: "ch", text: ch }, inner);
        word.chars.push(c);
      }
    } else inner.textContent = w;
    words.push(word);
    if (i < parts.length - 1) n.appendChild(document.createTextNode(" "));
  });
  return words;
}

/** Glyphes aléatoires pour l'effet « décodage ». */
const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/<>";
export function decode(final, t, t0, dur, seed = 1, frame = 0) {
  let out = "";
  const n = final.length;
  for (let i = 0; i < n; i++) {
    const ch = final[i];
    const ti = t0 + (dur * i) / n;
    if (t < ti - 0.18) out += ch === " " ? " " : " ";
    else if (t < ti || ch === " ") {
      out += ch === " " ? " " : GLYPHS[Math.floor(hash(i * 13 + seed + Math.floor(frame / 2) * 7) * GLYPHS.length)];
    } else out += ch;
  }
  return out;
}

/** Points le long d'une polyligne + longueur cumulée (pour les têtes de tracé). */
export function polyline(points) {
  const cum = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0], dy = points[i][1] - points[i - 1][1];
    cum.push(cum[i - 1] + Math.hypot(dx, dy));
  }
  const total = cum[cum.length - 1];
  const at = (p) => {
    const L = clamp(p) * total;
    let i = 1;
    while (i < cum.length - 1 && cum[i] < L) i++;
    const f = (L - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
    return [lerp(points[i - 1][0], points[i][0], f), lerp(points[i - 1][1], points[i][1], f)];
  };
  const d = "M" + points.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join(" L");
  return { d, total, at };
}

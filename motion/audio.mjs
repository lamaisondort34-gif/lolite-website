// Bande-son 100 % synthétisée : musique 120 BPM + bruitages calés sur l'image.
// node audio.mjs  →  out/soundtrack.wav (48 kHz, stéréo, float32)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "out");
fs.mkdirSync(OUT, { recursive: true });
const SR = 48000, DUR = 45, N = SR * DUR;
const TAU = Math.PI * 2;
const sec = (s) => Math.round(s * SR);
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));

/* ---------- aléatoire déterministe ---------- */
let _s = 12345;
const rnd = () => { _s = (_s * 1664525 + 1013904223) >>> 0; return _s / 4294967296; };
const nz = () => rnd() * 2 - 1;

/* ---------- filtres ---------- */
class Biquad {
  constructor() { this.x1 = this.x2 = this.y1 = this.y2 = 0; this.set("lp", 1000, 0.707); }
  set(type, f, q = 0.707) {
    f = clamp(f, 10, SR * 0.45);
    const w = (TAU * f) / SR, c = Math.cos(w), s = Math.sin(w), a = s / (2 * q);
    let b0, b1, b2, a0, a1, a2;
    if (type === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; }
    else if (type === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; }
    else { b0 = a; b1 = 0; b2 = -a; } // passe-bande (gain de crête 0 dB)
    a0 = 1 + a; a1 = -2 * c; a2 = 1 - a;
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = a1 / a0; this.a2 = a2 / a0;
    return this;
  }
  p(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

/* ---------- oscillateurs ---------- */
function polyblep(t, dt) {
  if (t < dt) { t /= dt; return t + t - t * t - 1; }
  if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; }
  return 0;
}
function sawOsc(f) {
  let ph = rnd();
  return (fr = f) => { const dt = fr / SR; ph += dt; if (ph >= 1) ph -= 1; return 2 * ph - 1 - polyblep(ph, dt); };
}
function sqrOsc(f) {
  let ph = rnd();
  return () => {
    const dt = f / SR; ph += dt; if (ph >= 1) ph -= 1;
    let v = ph < 0.5 ? 1 : -1;
    v += polyblep(ph, dt); v -= polyblep((ph + 0.5) % 1, dt);
    return v;
  };
}

/* ---------- bus de mixage ---------- */
const mk = () => [new Float32Array(N), new Float32Array(N)];
const BUS = { music: mk(), drums: mk(), sfx: mk() };
const VERB = new Float32Array(N);
function place(bus, t0, mono, { g = 1, pan = 0, send = 0 } = {}) {
  const s0 = sec(t0), [L, R] = BUS[bus];
  const a = ((pan + 1) * Math.PI) / 4, gl = g * Math.cos(a) * 1.414, gr = g * Math.sin(a) * 1.414;
  for (let i = 0; i < mono.length; i++) {
    const j = s0 + i;
    if (j < 0 || j >= N) continue;
    L[j] += mono[i] * gl; R[j] += mono[i] * gr;
    if (send) VERB[j] += mono[i] * g * send;
  }
}
function placeSt(bus, t0, [l, r], { g = 1, send = 0 } = {}) {
  const s0 = sec(t0), [L, R] = BUS[bus];
  for (let i = 0; i < l.length; i++) {
    const j = s0 + i;
    if (j < 0 || j >= N) continue;
    L[j] += l[i] * g; R[j] += r[i] * g;
    if (send) VERB[j] += (l[i] + r[i]) * 0.5 * g * send;
  }
}
const make = (d, fn) => { const n = sec(d), o = new Float32Array(n); for (let i = 0; i < n; i++) o[i] = fn(i / SR, i); return o; };

/* =========================================================
   INSTRUMENTS
   ========================================================= */
function kick({ dark = false } = {}) {
  let ph = 0;
  const hp = new Biquad().set("hp", 1500, 0.7);
  const lp = new Biquad().set("lp", dark ? 160 : 20000, 0.7);
  return make(0.5, (t) => {
    const f = 46 + 140 * Math.exp(-t * 32) + 40 * Math.exp(-t * 220);
    ph += (TAU * f) / SR;
    const a = Math.exp(-t * 6.2) * Math.min(1, t / 0.0015);
    let v = Math.tanh(2.0 * Math.sin(ph) * a) * 0.92;
    if (!dark) v += hp.p(nz()) * Math.exp(-t * 380) * 0.35;
    return lp.p(v);
  });
}
function clap() {
  const bp = new Biquad().set("bp", 1250, 0.9);
  return make(0.4, (t) => {
    let e = 0;
    for (const o of [0, 0.011, 0.023]) if (t >= o) e = Math.max(e, Math.exp(-(t - o) * 230));
    if (t > 0.026) e = Math.max(e, 0.55 * Math.exp(-(t - 0.026) * 15));
    return bp.p(nz()) * e * 1.6;
  });
}
function hat(open = false) {
  const hp = new Biquad().set("hp", 7600, 0.8);
  return make(open ? 0.38 : 0.08, (t) => hp.p(nz()) * Math.exp(-t * (open ? 9 : 58)) * 0.7);
}
function snare() {
  const bp = new Biquad().set("bp", 1900, 0.7);
  let ph = 0;
  return make(0.22, (t) => { ph += (TAU * (190 + 60 * Math.exp(-t * 40))) / SR; return (bp.p(nz()) * 0.9 + Math.sin(ph) * 0.5 * Math.exp(-t * 25)) * Math.exp(-t * 20); });
}
function bassNote(m, d) {
  const f = mtof(m), saw = sawOsc(f), lp = new Biquad(), lp2 = new Biquad();
  let ph = 0;
  return make(d + 0.08, (t, i) => {
    ph += (TAU * f) / SR;
    if (i % 32 === 0) { const c = 160 + 1100 * Math.exp(-t * 14); lp.set("lp", c, 0.9); lp2.set("lp", c * 1.4, 0.6); }
    const env = Math.min(1, t / 0.004) * (t > d ? Math.exp(-(t - d) * 60) : 1);
    return Math.tanh(1.6 * (lp2.p(lp.p(saw())) * 0.7 + Math.sin(ph) * 0.75)) * env;
  });
}
function pluckNote(m, d = 0.32, bright = 1) {
  const f = mtof(m), oscs = [-9, 0, 9].map((c) => sawOsc(f * 2 ** (c / 1200))), lp = new Biquad(), lp2 = new Biquad();
  return make(d + 0.5, (t, i) => {
    if (i % 32 === 0) { const c = (650 + 5200 * bright * Math.exp(-t * 9.5)); lp.set("lp", c, 0.8); lp2.set("lp", c, 0.6); }
    const env = Math.min(1, t / 0.002) * Math.exp(-t * 3.4) * (t > d ? Math.exp(-(t - d) * 14) : 1);
    return lp2.p(lp.p((oscs[0]() + oscs[1]() + oscs[2]()) / 3)) * env;
  });
}
function padChord(notes, d, { cut = 1700, att = 0.3, rel = 0.8 } = {}) {
  const out = [new Float32Array(sec(d + rel)), new Float32Array(sec(d + rel))];
  for (const ch of [0, 1]) {
    const lp = new Biquad().set("lp", cut, 0.6), lp2 = new Biquad().set("lp", cut * 1.3, 0.6);
    const oscs = [];
    for (const m of notes) for (const c of [-12, -5, 4, 11]) oscs.push(sawOsc(mtof(m) * 2 ** ((c + (ch ? 3 : -3)) / 1200)));
    const o = out[ch];
    for (let i = 0; i < o.length; i++) {
      const t = i / SR;
      let v = 0;
      for (const osc of oscs) v += osc();
      const env = Math.min(1, t / att) * (t > d ? Math.exp(-(t - d) * (4 / rel)) : 1);
      o[i] = lp2.p(lp.p(v / oscs.length)) * env * 1.4;
    }
  }
  return out;
}
function arpNote(m) {
  const sq = sqrOsc(mtof(m)), lp = new Biquad().set("lp", 2600, 0.7);
  return make(0.22, (t) => lp.p(sq()) * Math.exp(-t * 16) * Math.min(1, t / 0.002) * 0.6);
}
function bell(f, { dec = 2.8, idx = 2.2, ratio = 3.5 } = {}) {
  return make(Math.min(2.5, 6 / dec), (t) => {
    const mod = Math.sin(TAU * f * ratio * t) * idx * Math.exp(-t * 6);
    return (Math.sin(TAU * f * t + mod) * Math.exp(-t * dec) + 0.25 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t * dec * 2.2)) * Math.min(1, t / 0.001);
  });
}
function boom(d = 1.6, f0 = 75) {
  let ph = 0;
  return make(d, (t) => { ph += (TAU * (f0 * Math.exp(-t * 1.5) + 27)) / SR; return Math.tanh(2.2 * Math.sin(ph) * Math.exp(-t * 2.4)) * Math.min(1, t / 0.003); });
}
function crash(d = 2.4) {
  const out = [new Float32Array(sec(d)), new Float32Array(sec(d))];
  for (const ch of [0, 1]) {
    const hp = new Biquad().set("hp", 500, 0.7), lp = new Biquad();
    for (let i = 0; i < out[ch].length; i++) {
      const t = i / SR;
      if (i % 64 === 0) lp.set("lp", 4000 + 9000 * Math.exp(-t * 2), 0.7);
      out[ch][i] = lp.p(hp.p(nz())) * (Math.exp(-t * 2.6) * 0.8 + Math.exp(-t * 30) * 0.6);
    }
  }
  return out;
}
function whoosh(d, f0 = 300, f1 = 3500, { peak = 0.6, q = 1.1, pan0 = -0.7, pan1 = 0.7 } = {}) {
  const out = [new Float32Array(sec(d)), new Float32Array(sec(d))];
  const bp = new Biquad(), bp2 = new Biquad();
  for (let i = 0; i < out[0].length; i++) {
    const t = i / SR, p = t / d;
    if (i % 32 === 0) { const f = f0 * (f1 / f0) ** p; bp.set("bp", f, q); bp2.set("bp", f * 1.5, q); }
    const e = p < peak ? Math.sin((Math.PI / 2) * (p / peak)) ** 2 : Math.cos((Math.PI / 2) * ((p - peak) / (1 - peak))) ** 1.5;
    const v = (bp.p(nz()) + 0.5 * bp2.p(nz())) * e * 1.4;
    const pan = pan0 + (pan1 - pan0) * p, a = ((pan + 1) * Math.PI) / 4;
    out[0][i] = v * Math.cos(a) * 1.414; out[1][i] = v * Math.sin(a) * 1.414;
  }
  return out;
}
function riser(d, { f0 = 250, f1 = 7000, tone = true } = {}) {
  const bp = new Biquad(), saw = sawOsc(100), lp = new Biquad();
  return make(d, (t, i) => {
    const p = t / d;
    if (i % 32 === 0) { bp.set("bp", f0 * (f1 / f0) ** p, 1.8); lp.set("lp", 500 + 4000 * p, 0.7); }
    const trem = 0.75 + 0.25 * Math.sin(TAU * (4 + 20 * p * p) * t);
    let v = bp.p(nz()) * p ** 1.8 * 1.5 * trem;
    if (tone) v += lp.p(saw(110 * 2 ** (p * 3))) * p ** 3 * 0.25;
    return v;
  });
}
function suck(d) { // souffle inversé
  const c = crash(d);
  const m = new Float32Array(c[0].length);
  for (let i = 0; i < m.length; i++) m[m.length - 1 - i] = (c[0][i] + c[1][i]) * 0.5;
  return m;
}
function pop(f = 600, { dec = 28, drop = 2 } = {}) {
  let ph = 0;
  return make(0.16, (t) => { ph += (TAU * f * (1 + (drop - 1) * Math.exp(-t * 60))) / SR; return Math.sin(ph) * Math.exp(-t * dec) * Math.min(1, t / 0.0008); });
}
function tick(f = 1700) {
  const hp = new Biquad().set("hp", 2000, 0.7);
  return make(0.07, (t) => Math.sin(TAU * f * t) * Math.exp(-t * 90) + 0.35 * Math.sin(TAU * f * 1.6 * t) * Math.exp(-t * 130) + hp.p(nz()) * Math.exp(-t * 900) * 0.4);
}
function key() {
  const bp = new Biquad().set("bp", 2400 + rnd() * 1600, 1.4);
  const lo = 150 + rnd() * 60;
  return make(0.05, (t) => bp.p(nz()) * Math.exp(-t * 170) * 1.3 + Math.sin(TAU * lo * t) * Math.exp(-t * 80) * 0.35);
}
function glitch(d) {
  const bp = new Biquad().set("bp", 2200, 0.6);
  let hold = 0, v = 0, gate = 1;
  return make(d, (t, i) => {
    if (i >= hold) { hold = i + 30 + Math.floor(rnd() * 400); v = nz(); gate = rnd() > 0.35 ? 1 : 0; }
    const crushed = Math.round((v + nz() * 0.2) * 6) / 6;
    return bp.p(crushed) * gate * 0.9;
  });
}
function marimba(f) {
  return make(0.5, (t) => (Math.sin(TAU * f * t) * Math.exp(-t * 9) + 0.25 * Math.sin(TAU * f * 4 * t) * Math.exp(-t * 32) + 0.08 * Math.sin(TAU * f * 9.8 * t) * Math.exp(-t * 60)) * Math.min(1, t / 0.001));
}
function vibrate(d) {
  const lp = new Biquad().set("lp", 700, 0.7);
  return make(d, (t) => lp.p(Math.tanh(3 * Math.sin(TAU * 165 * t))) * (0.65 + 0.35 * Math.sin(TAU * 31 * t)) * Math.min(1, t / 0.02, (d - t) / 0.02));
}
function sweep(d, f0, f1, { vib = 0 } = {}) {
  let ph = 0;
  return make(d, (t) => { const p = t / d; ph += (TAU * f0 * (f1 / f0) ** p * (1 + vib * Math.sin(TAU * 28 * t))) / SR; return Math.sin(ph) * Math.sin(Math.PI * p) ** 0.7; });
}
function thump(f = 85) {
  let ph = 0;
  const lp = new Biquad().set("lp", 1800, 0.7);
  return make(0.35, (t) => { ph += (TAU * (f * 0.6 + f * Math.exp(-t * 25))) / SR; return Math.sin(ph) * Math.exp(-t * 16) + lp.p(nz()) * Math.exp(-t * 45) * 0.5; });
}
function crackle(d, n = 30) {
  const o = new Float32Array(sec(d));
  for (let k = 0; k < n; k++) {
    const at = Math.floor((rnd() ** 1.8) * o.length * 0.9), amp = 0.3 + rnd() * 0.7;
    const f = 3000 + rnd() * 5000;
    for (let i = 0; i < 500 && at + i < o.length; i++) o[at + i] += Math.sin(TAU * f * (i / SR)) * Math.exp(-i / 60) * amp * (1 - at / o.length);
  }
  return o;
}
function hum(d) {
  const s1 = sawOsc(55), s2 = sawOsc(110.3), lp = new Biquad();
  return make(d, (t, i) => {
    const p = t / d;
    if (i % 64 === 0) lp.set("lp", 200 + 1600 * Math.sin(Math.PI * Math.min(1, p * 1.4)) ** 2, 1.4);
    return lp.p(s1() * 0.6 + s2() * 0.4) * Math.sin(Math.PI * p) ** 0.6;
  });
}

/* =========================================================
   MUSIQUE — 120 BPM
   ========================================================= */
const BEAT = 0.5, BAR = 2;
const CH = {
  D: { v: [62, 66, 69, 76], b: 38 }, E: { v: [64, 68, 71, 78], b: 40 }, Fm: { v: [61, 66, 69, 76], b: 42 },
  Cm: { v: [61, 64, 68, 73], b: 37 }, A: { v: [61, 64, 69, 76], b: 45 },
};
// une entrée par demi-mesure (1 s) à partir de 6 s
const PROG = [];
const seq = ["D", "E", "Fm", "D", "E", "Cm", "Fm", "D", "E", "Fm", "D", "E", "Cm", "Fm", "E", "D", "E", "Fm"]; // mesures 3 → 20
seq.forEach((c, i) => { PROG.push([6 + i * 2, c]); PROG.push([7 + i * 2, c]); });
PROG.push([42, "D"], [43, "E"], [44, "A"]);
const chordAt = (t) => { let c = "Fm"; for (const [tt, cc] of PROG) if (t >= tt - 1e-6) c = cc; return CH[c]; };

const KICKS = [];
const kickAt = (t, o) => { place("drums", t, o.dark ? KICK_DARK : KICK, { g: o.g ?? 1 }); if (!o.dark) KICKS.push(t); };
const KICK = kick(), KICK_DARK = kick({ dark: true });
const CLAP = clap(), HATC = hat(false), HATO = hat(true), SNARE = snare();

// intro : pouls sourd + nappe sombre
for (let t = 2.0; t < 5.75; t += BEAT) kickAt(t, { dark: true, g: 0.55 + 0.35 * prog(t, 2, 5.5) });
for (let t = 3.0; t < 5.75; t += BEAT) place("drums", t + 0.25, HATC, { g: 0.12, pan: 0.3 });
placeSt("music", 0, padChord([42, 49, 54, 57], 5.6, { cut: 900, att: 1.4, rel: 0.25 }), { g: 0.3, send: 0.35 });
place("music", 0, make(5.9, (t) => Math.sin(TAU * 46.25 * t) * Math.min(1, t / 1.2) * (t > 5.6 ? Math.exp(-(t - 5.6) * 20) : 1) * 0.5), { g: 0.45 });

// sections à rythme
const sections = [
  { a: 8, b: 20, arp: false }, { a: 20, b: 34, arp: true }, { a: 36, b: 39.75, arp: true, big: true }, { a: 42, b: 44, arp: true, big: true },
];
for (const s of sections) {
  for (let t = s.a; t < s.b - 1e-6; t += BEAT) {
    kickAt(t, { g: 1 });
    const beatIdx = Math.round((t - s.a) / BEAT);
    if (beatIdx % 2 === 1) place("drums", t, CLAP, { g: 0.55, send: 0.18 });
    place("drums", t + 0.25, s.arp ? HATO : HATC, { g: s.arp ? 0.16 : 0.22, pan: 0.25 });
    if (s.arp) for (const o of [0.125, 0.375]) place("drums", t + o, HATC, { g: 0.09, pan: -0.3 });
  }
}
// build 34 → 36 : roulement de caisse claire qui accélère
for (let t = 34; t < 35.875; ) {
  const p = prog(t, 34, 35.875);
  place("drums", t, SNARE, { g: 0.18 + 0.4 * p, pan: (rnd() - 0.5) * 0.3, send: 0.15 });
  t += p < 0.5 ? 0.125 : p < 0.8 ? 0.0625 : 0.03125;
}
for (let t = 34; t < 35; t += BEAT) kickAt(t, { g: 0.9 });
// roulement 41 → 42
for (let t = 41; t < 41.9; ) { const p = prog(t, 41, 41.9); place("drums", t, SNARE, { g: 0.12 + 0.35 * p, send: 0.2 }); t += p < 0.5 ? 0.125 : 0.0625; }

// basse + accords + arpèges
const tres = [0, 3, 6, 8, 11, 14]; // tresillo en doubles-croches
const rhythmic = (t) => (t >= 8 && t < 35.875) || (t >= 36 && t < 39.75) || (t >= 42 && t < 44);
for (let bar = 4; bar < 22; bar++) {
  const t0 = bar * BAR;
  for (let st = 0; st < 16; st++) {
    const t = t0 + st * 0.125;
    if (!rhythmic(t)) continue;
    const c = chordAt(t);
    if (st % 2 === 0) place("music", t, bassNote(c.b + (st % 4 === 2 ? 12 : 0), 0.2), { g: 0.42 });
    if (tres.includes(st)) for (const [k, m] of c.v.entries()) place("music", t, pluckNote(m, 0.18), { g: 0.15, pan: (k - 1.5) * 0.35, send: 0.28 });
    const arpOn = (t >= 20 && t < 35.875) || (t >= 36 && t < 39.75) || (t >= 42 && t < 44);
    if (arpOn) { const order = [0, 2, 1, 3, 2, 0, 3, 1]; place("music", t, arpNote(c.v[order[st % 8]] + 12), { g: 0.085, pan: Math.sin(st) * 0.5, send: 0.25 }); }
  }
}
// nappes : grand accord au logo, au drop et au final
placeSt("music", 6.0, padChord(CH.D.v.concat([50]), 1.8, { cut: 3200, att: 0.02, rel: 1.2 }), { g: 0.5, send: 0.45 });
for (const [tt, c] of [[6, "D"], [7, "D"]]) place("music", tt, bassNote(CH[c].b, 0.9), { g: 0.4 });
for (let t = 8; t < 34; t += BAR) placeSt("music", t, padChord(chordAt(t).v, BAR - 0.05, { cut: 1300, att: 0.4, rel: 0.4 }), { g: 0.16, send: 0.3 });
placeSt("music", 34, padChord(CH.E.v, 1.85, { cut: 1500, att: 1.2, rel: 0.2 }), { g: 0.24, send: 0.3 });
for (let t = 36; t < 39.75; t += BAR) placeSt("music", t, padChord(chordAt(t).v.concat([chordAt(t).b + 12]), BAR - 0.05, { cut: 2600, att: 0.05, rel: 0.4 }), { g: 0.24, send: 0.35 });
placeSt("music", 39.75, padChord(CH.Fm.v.concat([54]), 2.2, { cut: 1600, att: 0.4, rel: 0.3 }), { g: 0.46, send: 0.45 });
place("music", 39.75, bassNote(30, 2.1), { g: 0.32 });
for (let t = 39.75; t < 41.9; t += 0.375) for (const [k, m] of CH.Fm.v.entries()) place("music", t, pluckNote(m + 12, 0.1, 0.5), { g: 0.1, pan: (k - 1.5) * 0.4, send: 0.5 });
placeSt("music", 42, padChord(CH.D.v.concat([50]), 0.98, { cut: 3000, att: 0.02, rel: 0.3 }), { g: 0.26, send: 0.35 });
placeSt("music", 43, padChord(CH.E.v.concat([52]), 0.98, { cut: 3000, att: 0.02, rel: 0.3 }), { g: 0.26, send: 0.35 });
// accord final (La majeur) qui résonne
placeSt("music", 44, padChord([45, 52, 57, 61, 64, 69, 76], 0.5, { cut: 4200, att: 0.01, rel: 1.6 }), { g: 0.42, send: 0.6 });
for (const [k, m] of [57, 61, 64, 69, 76].entries()) place("music", 44 + k * 0.03, pluckNote(m + 12, 0.6, 1.1), { g: 0.12, pan: (k - 2) * 0.3, send: 0.6 });
place("music", 44, bassNote(33, 0.8), { g: 0.5 });
place("drums", 44, KICK, { g: 1 });

/* =========================================================
   BRUITAGES (repères = acts/*.js)
   ========================================================= */
const S = (t, mono, o = {}) => place("sfx", t, mono, o);
const SS = (t, st, o = {}) => placeSt("sfx", t, st, o);

// --- Acte 1
S(0.12, thump(62), { g: 0.9 }); S(0.42, thump(55), { g: 0.7 });
for (let k = 0; k < 12; k++) S(0.2 + k * 0.05, tick(2400 + (k % 3) * 300), { g: 0.06, pan: 0.2 });
SS(0.68, whoosh(0.45, 400, 2400, { peak: 0.7 }), { g: 0.22 });
S(0.8, sweep(0.35, 300, 1400), { g: 0.08 });
for (let k = 1; k <= 19; k++) S(1.3 + (0.68 * k) / 19 - 0.012, key(), { g: 0.42, pan: (rnd() - 0.5) * 0.4 });
S(2.03, key(), { g: 0.8 }); S(2.03, thump(110), { g: 0.25 });
for (const [i, t] of [2.08, 2.18, 2.28].entries()) SS(t, whoosh(0.28, 900, 3200, { peak: 0.35, pan0: -0.2, pan1: 0.2 }), { g: 0.14 + i * 0.02 });
S(2.45, glitch(0.45), { g: 0.16, pan: -0.2 });
S(2.97, thump(70), { g: 0.9 }); S(2.97, snare(), { g: 0.35 }); S(2.98, boom(0.5, 60), { g: 0.35 });
SS(2.86, whoosh(0.3, 600, 3000, { peak: 0.4 }), { g: 0.15 }); SS(3.66, whoosh(0.3, 600, 3000, { peak: 0.4, pan0: 0.5, pan1: -0.5 }), { g: 0.15 });
S(3.98, vibrate(0.55), { g: 0.2, pan: 0.5 }); S(4.7, vibrate(0.55), { g: 0.2, pan: 0.5 });
for (const [i, t] of [4.15, 4.55, 4.95].entries()) {
  S(t, bell(mtof(88 + i * 2), { dec: 4, idx: 1.2 }), { g: 0.18, pan: 0.45, send: 0.3 });
  S(t + 0.06, bell(mtof(95 + i * 2), { dec: 5, idx: 0.8 }), { g: 0.1, pan: 0.45, send: 0.3 });
  SS(t - 0.6, whoosh(0.62, 300, 1600, { peak: 0.85, pan0: -0.8, pan1: 0.5 }), { g: 0.09 });
}
S(4.9, glitch(0.5), { g: 0.2 });
S(4.0, riser(1.78), { g: 0.42 });
S(5.3, suck(0.5), { g: 0.5 });
S(5.82, sweep(0.16, 2000, 4000), { g: 0.04 });
// --- Explosion + logo
S(6.0, boom(2.4, 80), { g: 1.0, send: 0.2 });
SS(6.0, crash(3.0), { g: 0.42, send: 0.35 });
SS(6.0, whoosh(0.8, 3000, 200, { peak: 0.08, q: 0.7 }), { g: 0.4 });
S(6.16, sweep(0.9, 500, 2400, { vib: 0.01 }), { g: 0.06, send: 0.4 });
SS(6.2, whoosh(0.9, 800, 5000, { peak: 0.8, pan0: -0.5, pan1: 0.5 }), { g: 0.16 });
S(6.92, sweep(0.28, 2600, 700), { g: 0.08, send: 0.3 });
S(7.2, pop(420, { dec: 18 }), { g: 0.5 }); S(7.2, thump(90), { g: 0.35 });
[88, 92, 95, 100].forEach((m, k) => S(7.22 + k * 0.045, bell(mtof(m), { dec: 3.5, idx: 1.5 }), { g: 0.09, pan: (k - 1.5) * 0.4, send: 0.5 }));
for (let k = 0; k < 6; k++) S(7.28 + k * 0.05, pop(700 + k * 80, { dec: 40 }), { g: 0.12, pan: (k - 2.5) * 0.25 });
SS(7.66, whoosh(0.4, 1500, 6000, { peak: 0.5, pan0: -0.3, pan1: 0.3 }), { g: 0.08 });
SS(8.22, whoosh(0.55, 300, 2000, { peak: 0.5, pan0: 0, pan1: 0 }), { g: 0.2 });
SS(9.4, whoosh(0.3, 2500, 6000, { peak: 0.3, q: 2, pan0: -0.6, pan1: 0.6 }), { g: 0.12 });
SS(9.52, whoosh(0.3, 2500, 6000, { peak: 0.3, q: 2, pan0: -0.6, pan1: 0.6 }), { g: 0.1 });
SS(11.32, whoosh(0.7, 200, 3000, { peak: 0.75, q: 0.8, pan0: 0, pan1: 0 }), { g: 0.32 });
S(11.95, thump(70), { g: 0.4 });
// --- Acte 3
S(12.12, sweep(0.66, 400, 2000), { g: 0.06, send: 0.3 });
for (const t of [12.68, 14.42, 15.66]) for (let k = 0; k < 4; k++) S(t + k * 0.06, tick(1400 + k * 200), { g: 0.12 - k * 0.02 });
for (let i = 0; i < 14; i++) S(12.8 + i * 0.03, pop(500 + i * 40, { dec: 45 }), { g: 0.06, pan: (rnd() - 0.5) * 0.6 });
S(13.3, sweep(0.55, 300, 2600, { vib: 0.04 }), { g: 0.1, send: 0.25 });
SS(13.98, whoosh(0.5, 400, 1800, { peak: 0.4, pan0: 0, pan1: 0 }), { g: 0.12 });
for (let i = 0; i < 3; i++) S(14.62 + i * 0.14, pop(560 + i * 120, { dec: 22 }), { g: 0.28, pan: [-0.5, 0.5, -0.5][i] });
SS(15.62, whoosh(0.7, 250, 2500, { peak: 0.5, pan0: 0.4, pan1: -0.4 }), { g: 0.26 });
[0, 2, 4, 7, 9].forEach((st, i) => S(16.15 + i * 0.07, bell(mtof(81 + st), { dec: 6, idx: 0.6, ratio: 2 }), { g: 0.12, pan: (i - 2) * 0.35, send: 0.3 }));
S(17.3, riser(0.68, { f0: 400, f1: 9000 }), { g: 0.35 });
SS(17.55, whoosh(0.45, 200, 4000, { peak: 0.95 }), { g: 0.3 });
// --- Acte 4
SS(18.0, whoosh(0.6, 3000, 300, { peak: 0.1, pan0: 0, pan1: 0 }), { g: 0.25 });
for (const t of [18.32, 19.98, 21.58]) for (let k = 0; k < 4; k++) S(t + k * 0.055, tick(1500 + k * 180), { g: 0.11 - k * 0.02 });
for (let k = 1; k <= 28; k++) S(18.6 + (0.55 * k) / 28 - 0.01, key(), { g: 0.3, pan: (rnd() - 0.5) * 0.4 });
SS(19.1, whoosh(0.35, 800, 3000, { peak: 0.3 }), { g: 0.1 });
S(19.42, sweep(0.38, 800, 3000), { g: 0.05 });
S(19.62, bell(mtof(86), { dec: 5, idx: 1 }), { g: 0.16, send: 0.3 }); S(19.68, bell(mtof(93), { dec: 5, idx: 1 }), { g: 0.12, send: 0.3 });
S(19.74, key(), { g: 0.6 });
SS(19.95, whoosh(0.55, 300, 2600, { peak: 0.5, pan0: 0.6, pan1: -0.6 }), { g: 0.24 });
S(20.6, sweep(0.26, 2200, 600), { g: 0.07 });
S(20.86, thump(95), { g: 0.6 }); S(20.86, pop(300, { dec: 14 }), { g: 0.3 });
S(20.98, pop(800, { dec: 25 }), { g: 0.2 });
SS(21.58, whoosh(0.64, 400, 2200, { peak: 0.5, pan0: -0.3, pan1: 0.3 }), { g: 0.22 });
SS(22.12, whoosh(0.5, 300, 1500, { peak: 0.4, pan0: 0, pan1: 0 }), { g: 0.14 });
SS(23.4, whoosh(0.8, 200, 5000, { peak: 0.55, q: 0.8, pan0: -0.8, pan1: 0.8 }), { g: 0.4 });
// --- Acte 5
for (let k = 0; k < 10; k++) S(23.95 + k * 0.05, tick(2600 + (k % 2) * 400), { g: 0.05, pan: -0.2 });
SS(24.0, whoosh(0.9, 150, 1200, { peak: 0.75, q: 0.7, pan0: 0, pan1: 0 }), { g: 0.35 });
S(24.85, boom(0.9, 55), { g: 0.35 });
SS(24.2, whoosh(0.9, 200, 1500, { peak: 0.75, q: 0.7, pan0: 0.3, pan1: 0.5 }), { g: 0.2 });
S(25.0, pop(420, { dec: 20 }), { g: 0.2 });
S(25.0, sweep(0.8, 3000, 6000), { g: 0.025, send: 0.4 });
S(25.2, pop(650, { dec: 25 }), { g: 0.2, pan: -0.4 });
SS(27.3, whoosh(0.6, 2500, 200, { peak: 0.6, pan0: 0, pan1: 0 }), { g: 0.3 });
// --- Acte 6
S(28.1, hum(1.7), { g: 0.14, send: 0.2 });
const pent = [66, 69, 71, 73, 76, 78, 81, 83, 85, 88];
for (let i = 0; i < 24; i++) S(28.12 + i * 0.04 + 0.5, pop(mtof(pent[i % pent.length]), { dec: 30, drop: 1.3 }), { g: 0.09, pan: i % 2 ? 0.3 : -0.3, send: 0.25 });
S(29.72, suck(0.32), { g: 0.35 });
S(29.98, pop(380, { dec: 15 }), { g: 0.4 }); S(30.0, pop(760, { dec: 25 }), { g: 0.15 });
S(30.46, key(), { g: 0.7 }); S(30.48, thump(120), { g: 0.4 });
SS(30.5, whoosh(0.4, 3000, 600, { peak: 0.1, pan0: 0, pan1: 0 }), { g: 0.15 });
SS(30.72, whoosh(0.5, 300, 2400, { peak: 0.5, pan0: 0, pan1: 0 }), { g: 0.2 });
{
  const bp = new Biquad().set("bp", 1500, 0.5);
  const mel = [76, 83, 80, 88, 83, 80, 76, 83, 80, 88, 83, 80];
  mel.forEach((m, k) => { const b = marimba(mtof(m)); for (let i = 0; i < b.length; i++) b[i] = bp.p(b[i]) * 2.2; S(31.0 + k * 0.0625, b, { g: 0.22, pan: 0.1, send: 0.15 }); });
}
S(31.15, vibrate(0.35), { g: 0.25 }); S(31.58, vibrate(0.2), { g: 0.25 });
S(31.7, key(), { g: 0.7 });
SS(31.75, whoosh(0.6, 300, 4000, { peak: 0.6, pan0: 0.3, pan1: -0.3 }), { g: 0.32 });
// --- Acte 7
for (let i = 0; i < 8; i++) if (i !== 2) S(32.25 + i * 0.05, pop(500 + i * 70, { dec: 20 }), { g: 0.16, pan: (i - 3.5) * 0.2 });
for (let i = 0; i < 4; i++) { SS(32.6 + i * 0.14, whoosh(0.3, 500, 2500, { peak: 0.5, pan0: i % 2 ? 0.4 : -0.4, pan1: 0 }), { g: 0.14 }); S(32.85 + i * 0.14, thump(140), { g: 0.15 }); }
S(33.6, sweep(0.8, 300, 900), { g: 0.04 });
[0, 4, 7, 12].forEach((st, i) => S(34.08 + i * 0.13, bell(mtof(81 + st), { dec: 4, idx: 1.2 }), { g: 0.16, pan: (i - 1.5) * 0.4, send: 0.35 }));
SS(35.3, whoosh(0.45, 2500, 400, { peak: 0.5, pan0: 0, pan1: 0 }), { g: 0.2 });
S(35.7, pop(300, { dec: 12 }), { g: 0.45 });
S(34.2, riser(1.66, { f0: 300, f1: 8000 }), { g: 0.35 });
// --- Acte 8
S(36.0, boom(2.0, 70), { g: 0.8, send: 0.15 });
SS(36.0, crash(2.6), { g: 0.36, send: 0.3 });
{
  const io2 = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
  let k = 1;
  for (let t = 36.12; t <= 37.6 && k <= 13; t += 0.002) {
    const v = 1 + 13 * io2(prog(t, 36.12, 37.55));
    if (v >= k + 0.7) { S(t, tick(1300 + k * 40), { g: 0.2, pan: ((k % 2) - 0.5) * 0.4 }); k++; }
  }
}
S(37.55, bell(mtof(88), { dec: 3 }), { g: 0.22, send: 0.45 }); S(37.6, bell(mtof(93), { dec: 3 }), { g: 0.18, send: 0.45 });
S(37.55, thump(80), { g: 0.4 });
SS(37.95, whoosh(0.5, 300, 2000, { peak: 0.5, pan0: 0, pan1: 0 }), { g: 0.16 });
{
  const outExpo = (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x));
  let k = 1;
  for (let t = 38.1; t <= 38.7 && k <= 45; t += 0.001) {
    const v = outExpo(prog(t, 38.1, 38.68)) * 450;
    if (v >= k * 10) { if (k % 2 === 0 || k > 40) S(t, tick(1900), { g: 0.1 }); k++; }
  }
}
S(38.64, thump(90), { g: 0.6 });
S(38.64, bell(mtof(100), { dec: 3.5, idx: 1.4 }), { g: 0.2, send: 0.3 }); S(38.7, bell(mtof(104), { dec: 3.5, idx: 1.4 }), { g: 0.18, send: 0.3 });
S(38.66, crackle(1.3, 60), { g: 0.25, send: 0.2 });
{ const bp = new Biquad().set("bp", 1800, 0.8); S(38.66, make(0.2, (t) => bp.p(nz()) * Math.exp(-t * 35)), { g: 0.5 }); }
SS(38.72, whoosh(0.36, 2000, 6000, { peak: 0.3, q: 2, pan0: -0.6, pan1: 0.6 }), { g: 0.12 });
S(38.92, pop(600, { dec: 22 }), { g: 0.22, pan: -0.3 }); S(39.06, pop(760, { dec: 22 }), { g: 0.22, pan: 0.3 });
SS(39.66, whoosh(0.6, 200, 4000, { peak: 0.7, pan0: 0, pan1: 0 }), { g: 0.36 });
// --- Acte 9
for (let i = 0; i < 8; i++) if (i !== 6) S(40.5 + i * 0.05 + (i === 7 ? 0.18 : 0), pop(i === 7 ? 260 : 450 + i * 60, { dec: i === 7 ? 8 : 20, drop: i === 7 ? 2.5 : 2 }), { g: i === 7 ? 0.35 : 0.14 });
SS(41.7, whoosh(0.35, 500, 3000, { peak: 0.6, pan0: 0, pan1: 0 }), { g: 0.16 });
S(40.8, riser(1.15, { f0: 300, f1: 9000 }), { g: 0.38 });
S(42.0, boom(1.8, 75), { g: 0.85, send: 0.15 });
SS(42.0, crash(2.4), { g: 0.38, send: 0.35 });
[88, 92, 95, 100, 104].forEach((m, k) => S(42.25 + k * 0.05, bell(mtof(m), { dec: 3.5, idx: 1.2 }), { g: 0.08, pan: (k - 2) * 0.35, send: 0.5 }));
S(42.4, sweep(0.7, 2500, 6000), { g: 0.02, send: 0.4 });
S(42.6, pop(380, { dec: 14 }), { g: 0.45 });
for (let k = 0; k < 9; k++) S(42.85 + k * 0.05, tick(2600 + (k % 3) * 300), { g: 0.06 });
S(43.42, key(), { g: 0.7 }); S(43.44, thump(130), { g: 0.35 });
S(43.2, pop(620, { dec: 22 }), { g: 0.2, pan: -0.3 }); S(43.32, pop(780, { dec: 22 }), { g: 0.2, pan: 0.3 });
[100, 104, 107, 112].forEach((m, k) => S(44.0 + k * 0.06, bell(mtof(m), { dec: 2.5, idx: 1 }), { g: 0.07, pan: (k - 1.5) * 0.4, send: 0.6 }));
S(44.0, boom(1.0, 60), { g: 0.45 });

/* =========================================================
   MIXAGE
   ========================================================= */
// side-chain : la musique respire sous la grosse caisse
const duck = new Float32Array(N).fill(1);
for (const tk of KICKS) {
  const s0 = sec(tk);
  for (let i = 0; i < sec(0.35) && s0 + i < N; i++) duck[s0 + i] = Math.min(duck[s0 + i], 1 - 0.6 * Math.exp(-(i / SR) * 11));
}
// automation de filtre (intro étouffée, breakdown, montée)
const cutoff = (t) => (t < 6 ? 380 + 1500 * (t / 6) ** 2 : t >= 39.75 && t < 42 ? 900 * (10) ** prog(t, 39.75, 41.95) : 20000);
const hpcut = (t) => (t >= 34 && t < 36 ? 20 + 380 * prog(t, 34, 35.9) ** 2 : 20);
function automate(bus, useDuck) {
  const [L, R] = BUS[bus];
  const f = [new Biquad(), new Biquad()], h = [new Biquad(), new Biquad()];
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    if (i % 64 === 0) { const c = cutoff(t), hc = hpcut(t); for (const k of [0, 1]) { f[k].set("lp", c, 0.75); h[k].set("hp", hc, 0.7); } }
    const g = useDuck ? duck[i] : 1;
    const c = cutoff(t);
    L[i] = (c < 19000 ? f[0].p(L[i]) : (f[0].p(L[i]), L[i])) * g;
    R[i] = (c < 19000 ? f[1].p(R[i]) : (f[1].p(R[i]), R[i])) * g;
    const hc = hpcut(t);
    if (hc > 21) { L[i] = h[0].p(L[i]); R[i] = h[1].p(R[i]); } else { h[0].p(L[i]); h[1].p(R[i]); }
  }
}
automate("music", true);
automate("drums", false);

// réverbération (Freeverb)
function freeverb(input) {
  const scale = SR / 44100;
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((x) => Math.round(x * scale));
  const apT = [556, 441, 341, 225].map((x) => Math.round(x * scale));
  const out = [new Float32Array(N), new Float32Array(N)];
  for (const ch of [0, 1]) {
    const spread = ch ? Math.round(23 * scale) : 0;
    const combs = combT.map((d) => ({ b: new Float32Array(d + spread), i: 0, s: 0 }));
    const aps = apT.map((d) => ({ b: new Float32Array(d + spread), i: 0 }));
    const fb = 0.86, damp = 0.25;
    const o = out[ch];
    for (let n = 0; n < N; n++) {
      const x = input[n] * 0.015;
      let y = 0;
      for (const c of combs) {
        const v = c.b[c.i];
        c.s = v * (1 - damp) + c.s * damp;
        c.b[c.i] = x + c.s * fb;
        if (++c.i >= c.b.length) c.i = 0;
        y += v;
      }
      for (const a of aps) {
        const v = a.b[a.i];
        a.b[a.i] = y + v * 0.5;
        if (++a.i >= a.b.length) a.i = 0;
        y = v - y;
      }
      o[n] = y;
    }
  }
  return out;
}
const rev = freeverb(VERB);

const gains = { music: 1.1, drums: 0.72, sfx: 0.95 };
if (process.env.STATS) {
  const st = (arr) => { let pk = 0, ss = 0; for (let i = 0; i < N; i++) { pk = Math.max(pk, Math.abs(arr[i])); ss += arr[i] * arr[i]; } return [pk.toFixed(2), (20 * Math.log10(Math.sqrt(ss / N) + 1e-9)).toFixed(1)]; };
  for (const b of ["music", "drums", "sfx"]) console.log(b, "peak/rmsdB", st(BUS[b][0]));
  console.log("verb", st(rev[0]));
  for (const [a, b] of [[0, 6], [6, 12], [12, 24], [24, 36], [36, 40], [40, 45]]) {
    const seg = (arr) => { let ss = 0; for (let i = sec(a); i < sec(b); i++) ss += arr[i] * arr[i]; return (10 * Math.log10(ss / (sec(b) - sec(a)) + 1e-12)).toFixed(1); };
    console.log(`${a}-${b}s`, "music", seg(BUS.music[0]), "drums", seg(BUS.drums[0]), "sfx", seg(BUS.sfx[0]), "verb", seg(rev[0]));
  }
}
const ML = new Float32Array(N), MR = new Float32Array(N);
for (let i = 0; i < N; i++) {
  ML[i] = BUS.music[0][i] * gains.music + BUS.drums[0][i] * gains.drums + BUS.sfx[0][i] * gains.sfx + rev[0][i] * 4.0;
  MR[i] = BUS.music[1][i] * gains.music + BUS.drums[1][i] * gains.drums + BUS.sfx[1][i] * gains.sfx + rev[1][i] * 4.0;
}
// fondu de fin + limiteur à anticipation
const fadeOut = (t) => (t > 44.2 ? Math.cos((Math.PI / 2) * prog(t, 44.2, 45)) ** 1.3 : 1);
let peak = 0;
for (let i = 0; i < N; i++) { const f = fadeOut(i / SR) * 0.5; ML[i] *= f; MR[i] *= f; peak = Math.max(peak, Math.abs(ML[i]), Math.abs(MR[i])); }
const LA = sec(0.004), REL = Math.exp(-1 / (SR * 0.08)), TH = 0.9;
const target = new Float32Array(N);
for (let i = 0; i < N; i++) { const a = Math.max(Math.abs(ML[i]), Math.abs(MR[i])); target[i] = a > TH ? TH / a : 1; }
let g = 1;
const outL = new Float32Array(N), outR = new Float32Array(N);
for (let i = 0; i < N; i++) {
  let m = 1;
  for (let k = 0; k < LA && i + k < N; k += 8) m = Math.min(m, target[i + k]);
  g = m < g ? m : 1 - (1 - g) * REL;
  outL[i] = Math.tanh(ML[i] * g * 1.05) * 0.97;
  outR[i] = Math.tanh(MR[i] * g * 1.05) * 0.97;
}

// écriture WAV float32
function writeWav(file, L, R) {
  const data = Buffer.alloc(N * 8);
  for (let i = 0; i < N; i++) { data.writeFloatLE(L[i], i * 8); data.writeFloatLE(R[i], i * 8 + 4); }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(3, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 8, 28); h.writeUInt16LE(8, 32); h.writeUInt16LE(32, 34); h.write("data", 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
}
writeWav(path.join(OUT, "soundtrack-raw.wav"), outL, outR);
console.log("peak avant limiteur:", peak.toFixed(3), "| kicks:", KICKS.length);

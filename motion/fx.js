// Effets dessinés sur le canvas de surimpression (étincelles, ondes, confettis).
import { clamp, prog, E, rng, lerp } from "./lib.js";

/** Étoile à 4 branches (scintillement). */
export function sparkle(ctx, x, y, r, rot, color, alpha = 1) {
  if (r <= 0.2 || alpha <= 0) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = clamp(alpha);
  ctx.fillStyle = color;
  ctx.beginPath();
  const k = r * 0.22;
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(k, -k, r, 0);
  ctx.quadraticCurveTo(k, k, 0, r);
  ctx.quadraticCurveTo(-k, k, -r, 0);
  ctx.quadraticCurveTo(-k, -k, 0, -r);
  ctx.fill();
  ctx.restore();
}

/** Gerbe de traits radiaux. */
export function burst(ctx, t, t0, x, y, { n = 16, seed = 1, r0 = 30, r1 = 320, dur = 0.55, width = 6, colors = ["#7c3aed"] } = {}) {
  const p = prog(t, t0, t0 + dur);
  if (p <= 0 || p >= 1) return;
  const R = rng(seed);
  ctx.save();
  ctx.lineCap = "round";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (R() - 0.5) * 0.35;
    const len = lerp(0.55, 1, R());
    const head = r0 + (r1 - r0) * len * E.out3(p);
    const tail = r0 + (r1 - r0) * len * E.out3(clamp(p * 1.6 - 0.35));
    if (head <= tail) continue;
    ctx.strokeStyle = colors[i % colors.length];
    ctx.lineWidth = width * (1 - p) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * tail, y + Math.sin(a) * tail);
    ctx.lineTo(x + Math.cos(a) * head, y + Math.sin(a) * head);
    ctx.stroke();
  }
  ctx.restore();
}

/** Onde circulaire. */
export function ring(ctx, t, t0, x, y, { r0 = 20, r1 = 300, dur = 0.6, width = 6, color = "rgba(124,58,237,1)", ease = E.out3 } = {}) {
  const p = prog(t, t0, t0 + dur);
  if (p <= 0 || p >= 1) return;
  ctx.save();
  ctx.globalAlpha = 1 - p;
  ctx.strokeStyle = color;
  ctx.lineWidth = width * (1 - p * 0.7);
  ctx.beginPath();
  ctx.arc(x, y, r0 + (r1 - r0) * ease(p), 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** Scintillements qui s'échappent d'un point. */
export function twinkles(ctx, t, t0, x, y, { n = 8, seed = 3, dist = 160, size = 22, dur = 0.8, colors = ["#7c3aed", "#a78bfa"] } = {}) {
  const p = prog(t, t0, t0 + dur);
  if (p <= 0 || p >= 1) return;
  const R = rng(seed);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + R() * 0.6;
    const d = dist * lerp(0.6, 1.1, R()) * E.out3(p);
    const s = size * lerp(0.5, 1.1, R()) * Math.sin(Math.PI * clamp(p * 1.15));
    sparkle(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, s, p * 2 + i, colors[i % colors.length], 1);
  }
}

/** Confettis (rectangles qui tournent, gravité). */
export function confetti(ctx, t, t0, x, y, { n = 60, seed = 9, dur = 1.6, spread = 900, up = 1200, colors = ["#7c3aed", "#a78bfa", "#ffffff", "#ffb547", "#c4b5fd"] } = {}) {
  const tt = t - t0;
  if (tt <= 0 || tt >= dur) return;
  const R = rng(seed);
  for (let i = 0; i < n; i++) {
    const vx = (R() - 0.5) * spread * 1.6;
    const vy = -up * lerp(0.5, 1.1, R());
    const spin = (R() - 0.5) * 18;
    const w = lerp(10, 22, R()), h = lerp(16, 34, R());
    const drag = Math.exp(-tt * 1.6);
    const px = x + vx * (1 - drag) / 1.6;
    const py = y + vy * (1 - drag) / 1.6 + 900 * tt * tt;
    const a = 1 - clamp((tt - dur * 0.6) / (dur * 0.4));
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(spin * tt + i);
    ctx.scale(1, Math.cos(tt * (6 + R() * 8) + i));
    ctx.globalAlpha = a;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }
}

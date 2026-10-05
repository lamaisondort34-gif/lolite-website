// Partitions partagées image ↔ son. 120 BPM : 1 temps = 0,5 s, 1 mesure = 2 s.
export const FPS = 30;
export const DURATION = 45;

export const CHAPTERS = [
  { t: 0, theme: "dark", label: "01/07 — VITRINE" },
  { t: 6.1, theme: "light", label: "01/07 — VITRINE" },
  { t: 11.9, theme: "violet", label: "02/07 — SUR-MESURE" },
  { t: 17.9, theme: "light", label: "03/07 — VISIBILITÉ" },
  { t: 23.85, theme: "dark", label: "04/07 — RÉALISATION" },
  { t: 27.9, theme: "dark", label: "05/07 — CONVERSION" },
  { t: 31.85, theme: "light", label: "06/07 — CLÉ EN MAIN" },
  { t: 35.9, theme: "violet", label: "07/07 — DÉLAIS & PRIX" },
];

// [début, amplitude px, durée s]
export const SHAKES = [
  [3.02, 10, 0.35],
  [6.0, 26, 0.6],
  [7.2, 6, 0.25],
  [36.0, 18, 0.45],
  [38.7, 10, 0.3],
  [42.0, 16, 0.45],
];

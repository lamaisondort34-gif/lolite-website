/**
 * LOLITE logo component.
 *
 * `variant`:
 *   - "icon"  → SVG star/ribbon mark only
 *   - "full"  → mark + "Lolite" wordmark
 *   - "brand" → full logo image (preloader/about)
 *
 * The SVG mark approximates the original 3D purple ribbon+star form
 * as a clean two-tone purple glyph. The image variant uses
 * mix-blend-mode: multiply to remove the white background.
 */

function Mark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Abstract ribbon / infinity loop */}
      <path
        d="M20 44c-6.6 0-12-5.4-12-12s5.4-12 12-12c4 0 7.5 2 9.6 5l2.4 3.4L34.4 25c2.1-3 5.6-5 9.6-5 6.6 0 12 5.4 12 12s-5.4 12-12 12c-4 0-7.5-2-9.6-5L32 35.6 29.6 39c-2.1 3-5.6 5-9.6 5z"
        fill="url(#ribbon)"
        opacity="0.9"
      />
      {/* Star accent */}
      <path
        d="M32 4l3.5 7.8 8.5 1-6.2 5.7 1.7 8.5L32 22.6 24.5 27l1.7-8.5-6.2-5.7 8.5-1L32 4z"
        fill="url(#star)"
      />
      <defs>
        <linearGradient id="ribbon" x1="8" y1="44" x2="56" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9333ea" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="star" x1="24" y1="4" x2="40" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({
  variant = "full",
  className = "",
  size = 36,
}: {
  variant?: "icon" | "full" | "brand";
  className?: string;
  size?: number;
}) {
  if (variant === "brand") {
    return (
      <img
        src="/images/logo-lolite.png"
        alt="LOLITE Web Agency"
        className={`mix-blend-multiply ${className}`}
        style={{ height: size }}
        draggable={false}
      />
    );
  }

  if (variant === "icon") {
    return <Mark size={size} />;
  }

  // variant === "full"
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Mark size={size} />
      <span className="font-display text-xl font-extrabold tracking-tight text-milk">
        Lolite<span className="text-lime">.</span>
      </span>
    </span>
  );
}

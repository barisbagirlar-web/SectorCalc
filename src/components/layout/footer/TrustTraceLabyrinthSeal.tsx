/**
 * Decorative Trust Trace seal — Pac-Man labyrinth aesthetic (not a scannable QR).
 * Functional verification QR codes belong on PDF reports only.
 */
export function TrustTraceLabyrinthSeal() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="verify-report-box__seal-svg"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="100" height="100" fill="var(--sc-bg, #faf7f2)" rx="4" />

      {/* Finder-style corner squares */}
      <rect x="8" y="8" width="24" height="24" fill="var(--sc-text, #1a1a1a)" />
      <rect x="12" y="12" width="16" height="16" fill="var(--sc-bg, #faf7f2)" />
      <rect x="16" y="16" width="8" height="8" fill="var(--sc-text, #1a1a1a)" />

      <rect x="68" y="8" width="24" height="24" fill="var(--sc-text, #1a1a1a)" />
      <rect x="72" y="12" width="16" height="16" fill="var(--sc-bg, #faf7f2)" />
      <rect x="76" y="16" width="8" height="8" fill="var(--sc-text, #1a1a1a)" />

      <rect x="8" y="68" width="24" height="24" fill="var(--sc-text, #1a1a1a)" />
      <rect x="12" y="72" width="16" height="16" fill="var(--sc-bg, #faf7f2)" />
      <rect x="16" y="76" width="8" height="8" fill="var(--sc-text, #1a1a1a)" />

      {/* Labyrinth walls */}
      <rect x="36" y="8" width="28" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="36" y="16" width="20" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="40" y="24" width="24" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="36" y="32" width="28" height="4" fill="var(--sc-text, #1a1a1a)" />

      <rect x="8" y="40" width="20" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="36" y="40" width="28" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="72" y="40" width="20" height="4" fill="var(--sc-text, #1a1a1a)" />

      <rect x="8" y="48" width="16" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="32" y="48" width="4" height="16" fill="var(--sc-text, #1a1a1a)" />
      <rect x="44" y="48" width="16" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="68" y="48" width="16" height="4" fill="var(--sc-text, #1a1a1a)" />

      <rect x="8" y="56" width="20" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="52" y="56" width="12" height="4" fill="var(--sc-text, #1a1a1a)" />

      <rect x="8" y="64" width="16" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="40" y="64" width="24" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="72" y="64" width="20" height="4" fill="var(--sc-text, #1a1a1a)" />

      <rect x="36" y="32" width="4" height="12" fill="var(--sc-text, #1a1a1a)" />
      <rect x="56" y="32" width="4" height="12" fill="var(--sc-text, #1a1a1a)" />
      <rect x="68" y="36" width="4" height="8" fill="var(--sc-text, #1a1a1a)" />

      <rect x="48" y="52" width="4" height="12" fill="var(--sc-text, #1a1a1a)" />
      <rect x="64" y="52" width="4" height="12" fill="var(--sc-text, #1a1a1a)" />

      <rect x="28" y="60" width="4" height="12" fill="var(--sc-text, #1a1a1a)" />
      <rect x="52" y="68" width="4" height="8" fill="var(--sc-text, #1a1a1a)" />
      <rect x="68" y="72" width="4" height="12" fill="var(--sc-text, #1a1a1a)" />

      <rect x="40" y="36" width="8" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="60" y="40" width="8" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="36" y="56" width="8" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="60" y="60" width="8" height="4" fill="var(--sc-text, #1a1a1a)" />
      <rect x="44" y="72" width="8" height="4" fill="var(--sc-text, #1a1a1a)" />

      {/* Yellow pellets */}
      <circle cx="40" cy="12" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="60" cy="12" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="44" cy="20" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="64" cy="20" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="40" cy="28" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="60" cy="28" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="12" cy="44" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="24" cy="44" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="40" cy="44" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="60" cy="44" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="76" cy="44" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="88" cy="44" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="12" cy="52" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="24" cy="52" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="60" cy="52" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="88" cy="52" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="12" cy="60" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="60" cy="60" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="76" cy="60" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="88" cy="60" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="32" cy="68" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="68" cy="68" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="16" cy="76" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="32" cy="76" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="60" cy="76" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="76" cy="76" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="36" cy="84" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="52" cy="84" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="68" cy="84" r="2" className="verify-report-box__seal-pellet" />
      <circle cx="84" cy="84" r="2" className="verify-report-box__seal-pellet" />

      {/* Power pellets */}
      <circle cx="48" cy="16" r="2.5" className="verify-report-box__seal-power" />
      <circle cx="52" cy="36" r="2.5" className="verify-report-box__seal-power" />
      <circle cx="20" cy="56" r="2.5" className="verify-report-box__seal-power" />
      <circle cx="44" cy="64" r="2.5" className="verify-report-box__seal-power" />
      <circle cx="64" cy="76" r="2.5" className="verify-report-box__seal-power" />
      <circle cx="80" cy="68" r="2.5" className="verify-report-box__seal-power" />
    </svg>
  );
}

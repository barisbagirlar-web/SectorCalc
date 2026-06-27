"use client";

import { Link } from "@/i18n/routing";

type SiteLogoVariant = "default" | "on-dark";

interface SiteLogoProps {
  variant?: SiteLogoVariant;
  priority?: boolean;
  className?: string;
}

/** 2×2 grid mark – the SectorCalc icon */
function LogoMark({
  size = 24,
  inverted = false,
}: {
  size?: number;
  inverted?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="sc-site-logo__mark"
    >
      {inverted ? (
        <>
          <rect x="2" y="2" width="13" height="13" fill="#F0EEE6" />
          <rect x="17" y="2" width="13" height="13" fill="#BD5D3A" />
          <rect x="2" y="17" width="13" height="13" fill="#F0EEE6" fillOpacity="0.28" />
          <rect x="17" y="17" width="13" height="13" fill="#BD5D3A" fillOpacity="0.38" />
        </>
      ) : (
        <>
          <rect x="2" y="2" width="13" height="13" fill="#1A1915" />
          <rect x="17" y="2" width="13" height="13" fill="#BD5D3A" />
          <rect x="2" y="17" width="13" height="13" fill="#1A1915" fillOpacity="0.30" />
          <rect x="17" y="17" width="13" height="13" fill="#BD5D3A" fillOpacity="0.30" />
        </>
      )}
    </svg>
  );
}

export function SiteLogo({
  variant = "default",
  priority: _priority,
  className = "",
}: SiteLogoProps) {
  const inverted = variant === "on-dark";

  return (
    <Link
      href="/"
      prefetch={false}
      className={`site-logo sc-site-logo sc-logo site-logo--${variant} ${className}`.trim()}
      aria-label="SectorCalc home"
    >
      <LogoMark size={24} inverted={inverted} />
      <span className="sc-site-logo__wordmark">SectorCalc</span>
    </Link>
  );
}

"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { BRAND_ASSETS } from "@/config/brand";

type SiteLogoVariant = "default" | "on-dark";

interface SiteLogoProps {
  variant?: SiteLogoVariant;
  priority?: boolean;
  className?: string;
}

export function SiteLogo({
  variant = "default",
  priority = false,
  className = "",
}: SiteLogoProps) {
  const wordmark =
    variant === "on-dark" ? BRAND_ASSETS.logo.onDark : BRAND_ASSETS.logo.default;

  return (
    <Link
      href="/"
      prefetch={false}
      className={`site-logo sc-site-logo site-logo--${variant} sc-logo ${className}`.trim()}
      aria-label="SectorCalc home"
    >
      <Image
        src={wordmark}
        alt="SectorCalc"
        width={BRAND_ASSETS.logo.width}
        height={BRAND_ASSETS.logo.height}
        priority={priority}
        unoptimized
        className="site-logo__img sc-site-logo__wordmark"
      />
    </Link>
  );
}

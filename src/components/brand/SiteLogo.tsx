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
  const logo =
    variant === "on-dark" ? BRAND_ASSETS.logo.onDark : BRAND_ASSETS.logo.default;

  return (
    <Link
      href="/"
      prefetch={true}
      className={`site-logo site-logo--${variant} ${className}`.trim()}
      aria-label="SectorCalc home"
    >
      <Image
        src={logo}
        alt="SectorCalc"
        width={160}
        height={42}
        priority={priority}
        unoptimized
        className="site-logo__img"
      />
    </Link>
  );
}

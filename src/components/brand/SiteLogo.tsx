"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("a11y");
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
        src={BRAND_ASSETS.favicon.master}
        alt=""
        width={40}
        height={40}
        priority={priority}
        unoptimized
        className="sc-site-logo__mark"
        aria-hidden
      />
      <span className="sc-site-logo__combo">
        <span className="sc-site-logo__text">
          <span className="sc-site-logo__text-sector">Sector</span>
          <span className="sc-site-logo__text-calc">Calc</span>
        </span>
      </span>
      <Image
        src={wordmark}
        alt="SectorCalc"
        width={160}
        height={42}
        priority={priority}
        unoptimized
        className="site-logo__img sc-site-logo__wordmark sr-only"
      />
    </Link>
  );
}

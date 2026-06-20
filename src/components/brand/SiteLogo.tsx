"use client";

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

  if (variant === "on-dark") {
    const wordmark = BRAND_ASSETS.logo.headerOnDark;
    return (
      <Link
        href="/"
        prefetch={false}
        className={`site-logo sc-site-logo site-logo--on-dark sc-logo ${className}`.trim()}
        aria-label={t("logoHome")}
      >
        <img
          src={wordmark}
          alt={t("logoAlt")}
          width={BRAND_ASSETS.logo.displayWidth}
          height={BRAND_ASSETS.logo.displayHeight}
          className="site-logo__img sc-site-logo__wordmark"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      prefetch={false}
      className={`site-logo sc-site-logo sc-logo ${className}`.trim()}
      aria-label={t("logoHome")}
    >
      <img
        src={BRAND_ASSETS.logo.symbolBoldSvg}
        alt={t("logoAlt")}
        width={BRAND_ASSETS.logo.displaySymbolWidth}
        height={BRAND_ASSETS.logo.displaySymbolHeight}
        className="sc-site-logo__symbol"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
    </Link>
  );
}

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
    variant === "on-dark"
      ? BRAND_ASSETS.logo.headerOnDark
      : BRAND_ASSETS.logo.headerDefault;

  return (
    <Link
      href="/"
      prefetch={false}
      className={`site-logo sc-site-logo site-logo--${variant} sc-logo ${className}`.trim()}
      aria-label={t("logoHome")}
    >
      <Image
        src={wordmark}
        alt={t("logoAlt")}
        width={BRAND_ASSETS.logo.displayWidth}
        height={BRAND_ASSETS.logo.displayHeight}
        sizes="(max-width: 767px) 144px, 260px"
        quality={85}
        priority={priority}
        className="site-logo__img sc-site-logo__wordmark"
      />
    </Link>
  );
}

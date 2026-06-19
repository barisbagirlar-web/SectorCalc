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

  if (variant === "on-dark") {
    const wordmark = BRAND_ASSETS.logo.headerOnDark;
    return (
      <Link
        href="/"
        prefetch={false}
        className={`site-logo sc-site-logo site-logo--on-dark sc-logo ${className}`.trim()}
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

  return (
    <Link
      href="/"
      prefetch={false}
      className={`site-logo sc-site-logo sc-logo ${className}`.trim()}
      aria-label={t("logoHome")}
    >
      <span className="sc-logo-rotator" role="img" aria-label={t("logoAlt")}>
        <svg
          viewBox="0 0 512 512"
          className="sc-site-logo__symbol sc-logo-animated-svg"
          role="presentation"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="logoGrad"
              x1="0"
              y1="0"
              x2="512"
              y2="512"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" className="sc-logo-stop-1" />
              <stop offset="34%" className="sc-logo-stop-2" />
              <stop offset="67%" className="sc-logo-stop-3" />
              <stop offset="100%" className="sc-logo-stop-4" />
            </linearGradient>
          </defs>
          <g fill="url(#logoGrad)">
            <rect x="101" y="209" width="58" height="20" rx="0" />
            <rect x="355" y="209" width="58" height="20" rx="0" />
            <path d="M254 111H197V91H276V340H254V111Z" />
            <rect x="196" y="374" width="119" height="20" rx="0" />
          </g>
        </svg>
      </span>
    </Link>
  );
}

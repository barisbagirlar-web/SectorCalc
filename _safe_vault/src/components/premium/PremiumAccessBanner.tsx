"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { PremiumAccessMode } from "@/lib/billing/premium-access-mode";
import { getPricingHref, getSingleVerdictPricingHref } from "@/lib/tools/tool-links";
import { getRevenueToolByPaidSlug } from "@/lib/tools/revenue-tools";

type PremiumAccessBannerProps = {
  readonly mode: PremiumAccessMode;
  readonly paidSlug: string;
};

export function PremiumAccessBanner({ mode, paidSlug }: PremiumAccessBannerProps) {
  const t = useTranslations("premiumAccess");
  const tool = getRevenueToolByPaidSlug(paidSlug);
  const loginHref = `/login?next=${encodeURIComponent(`/tools/premium/${paidSlug}`)}`;
  const pricingHref = tool ? getSingleVerdictPricingHref(tool) : getPricingHref(undefined, "pro");

  const title =
    mode === "public-preview" ? t("publicPreviewTitle") : t("signedInPreviewTitle");
  const description =
    mode === "public-preview"
      ? t("publicPreviewDescription")
      : t("signedInPreviewDescription");

  return (
    <aside
      className="sc-premium-access-banner mb-4 min-w-0 rounded-sm border border-border-subtle bg-white p-4 sm:p-5"
      data-premium-access-mode={mode}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-deep-navy">
        {t("previewEyebrow")}
      </p>
      <h2 className="mt-2 text-base font-bold text-text-primary sm:text-lg">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
      <div className="mt-4 flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap">
        {mode === "public-preview" ? (
          <Link href={loginHref} className="sc-cta-secondary min-h-[44px] inline-flex items-center justify-center px-4">
            {t("signIn")}
          </Link>
        ) : null}
        <Link href={pricingHref} className="sc-cta-primary min-h-[44px] inline-flex items-center justify-center px-4">
          {t("getPro")}
        </Link>
      </div>
    </aside>
  );
}

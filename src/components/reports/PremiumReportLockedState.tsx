"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { startCheckoutSession } from "@/lib/billing/create-checkout-session";
import { buildPremiumPricingHref } from "@/lib/entitlements/premium-entitlements";
import { trackConversionEvent } from "@/lib/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/analytics/use-attribution-context";
import { buildTrackedCtaHref } from "@/lib/campaigns/campaign-links";
import { stripLocalePrefix } from "@/i18n/locales";

export interface PremiumReportLockedStateProps {
  schemaName: string;
  schemaSlug: string;
  locale: string;
  priceHint?: string;
  checkoutHref?: string;
}

export function PremiumReportLockedState({
  schemaName,
  schemaSlug,
  priceHint,
  checkoutHref,
}: PremiumReportLockedStateProps) {
  const t = useTranslations("premiumDecisionReport.locked");
  const locale = useLocale();
  const pathname = usePathname();
  const attribution = useAttributionContext();
  const pagePath = stripLocalePrefix(pathname);
  const pricingHref = buildTrackedCtaHref(
    checkoutHref ?? buildPremiumPricingHref(schemaSlug),
    attribution.utmCampaign,
    "premium_locked",
    "pricing",
    attribution
  );

  const handleUnlock = () => {
    trackConversionEvent({
      stage: "unlock_intent",
      eventName: "premium_unlock_click",
      locale,
      pagePath,
      premiumSlug: schemaSlug,
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource,
      medium: attribution.utmMedium,
      ctaId: "unlock_full_report",
      valueType: "premium",
    });

    void startCheckoutSession({
      toolSlug: schemaSlug,
      plan: "single_report",
      returnPath: `/tools/premium-schema/${schemaSlug}`,
      locale: undefined,
    });
  };

  const handlePricingClick = () => {
    trackConversionEvent({
      stage: "pricing_intent",
      eventName: "view_pricing_from_locked_report",
      locale,
      pagePath,
      premiumSlug: schemaSlug,
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource ?? "premium_locked",
      medium: attribution.utmMedium ?? "pricing",
      ctaId: "view_pricing_locked_report",
      valueType: "premium",
    });
  };

  return (
    <section
      className="sc-premium-report-locked"
      aria-labelledby={`premium-locked-${schemaSlug}`}
    >
      <div className="sc-premium-report-locked__card">
        <p className="sc-ledger-eyebrow">{schemaName}</p>
        <h3 id={`premium-locked-${schemaSlug}`} className="sc-premium-report-locked__title">
          {t("title")}
        </h3>
        <p className="sc-premium-report-locked__text">{t("text")}</p>

        <ul className="sc-premium-report-locked__list">
          <li>{t("bulletBreakdown")}</li>
          <li>{t("bulletThreshold")}</li>
          <li>{t("bulletAction")}</li>
          <li>{t("bulletExport")}</li>
          <li>{t("bulletSaved")}</li>
        </ul>

        {priceHint ? (
          <p className="sc-premium-report-locked__price">{priceHint}</p>
        ) : null}

        <p className="mt-3 text-xs leading-relaxed text-body-charcoal">{t("valueLine")}</p>

        <div className="sc-premium-report-locked__actions">
          <button
            type="button"
            onClick={handleUnlock}
            className="sc-ledger-cta-primary sc-premium-report-locked__cta min-h-[48px]"
          >
            {t("unlockCta")}
          </button>
          <Link
            href={pricingHref}
            onClick={handlePricingClick}
            className="sc-ledger-cta-secondary sc-premium-report-locked__secondary min-h-[48px]"
          >
            {t("pricingCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

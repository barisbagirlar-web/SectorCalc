"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { CheckoutStartError, startCheckoutRedirect } from "@/lib/features/billing/start-checkout";
import { buildPremiumPricingHref } from "@/lib/features/entitlements/premium-entitlements";
import { trackConversionEvent } from "@/lib/infrastructure/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/infrastructure/analytics/use-attribution-context";
import { buildTrackedCtaHref } from "@/lib/features/campaigns/campaign-links";
import { stripLocalePrefix } from "@/i18n/locales";
import { useState } from "react";

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
  const tCheckout = useTranslations("checkout");
  const locale = useLocale();
  const pathname = usePathname();
  const attribution = useAttributionContext();
  const pagePath = stripLocalePrefix(pathname);
  const returnPath = `/tools/premium-schema/${schemaSlug}`;
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricingHref = buildTrackedCtaHref(
    checkoutHref ?? buildPremiumPricingHref(schemaSlug),
    attribution.utmCampaign,
    "premium_locked",
    "pricing",
    attribution
  );

  const handleUnlock = () => {
    setError(null);
    setPending(true);

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

    void startCheckoutRedirect({
      planId: "single_report",
      premiumSlug: schemaSlug,
      returnPath,
      locale,
    }).catch((caught: unknown) => {
      setPending(false);
      if (caught instanceof CheckoutStartError) {
        setError(caught.message);
        return;
      }
      setError(tCheckout("error"));
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
            disabled={pending}
            className="sc-ledger-cta-primary sc-premium-report-locked__cta min-h-[48px] disabled:opacity-60"
          >
            {pending ? tCheckout("redirecting") : t("unlockCta")}
          </button>
          <Link
            href={pricingHref}
            onClick={handlePricingClick}
            className="sc-ledger-cta-secondary sc-premium-report-locked__secondary min-h-[48px]"
          >
            {t("pricingCta")}
          </Link>
        </div>
        {error ? (
          <p className="mt-3 text-sm text-amber" role="alert">
            {error}{" "}
            <Link href={pricingHref} className="underline underline-offset-2">
              {t("pricingCta")}
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}

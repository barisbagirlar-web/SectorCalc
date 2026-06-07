"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { startCheckoutSession } from "@/lib/billing/create-checkout-session";
import { buildPremiumPricingHref } from "@/lib/entitlements/premium-entitlements";

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
  const pricingHref = checkoutHref ?? buildPremiumPricingHref(schemaSlug);

  const handleUnlock = () => {
    void startCheckoutSession({
      toolSlug: schemaSlug,
      plan: "single_report",
      returnPath: `/tools/premium-schema/${schemaSlug}`,
      locale: undefined,
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
            className="sc-ledger-cta-secondary sc-premium-report-locked__secondary min-h-[48px]"
          >
            {t("pricingCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

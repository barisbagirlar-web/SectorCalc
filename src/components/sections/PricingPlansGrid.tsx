"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { TrackedCtaLink } from "@/components/campaign/TrackedCtaLink";
import { ProCheckoutButton } from "@/components/subscription/ProCheckoutButton";
import {
  PlanAvailabilityBadge,
  PlanCheckoutAction,
} from "@/components/pricing/PlanCheckoutAction";
import { IconListItem } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";
import {
  REVENUE_EVENTS,
  trackRevenueEvent,
} from "@/lib/analytics/revenue-events";
import { trackConversionEvent } from "@/lib/analytics/conversion-funnel";
import { useAttributionContext } from "@/lib/analytics/use-attribution-context";
import { usePathname } from "@/i18n/routing";
import { stripLocalePrefix } from "@/i18n/locales";
import { PRICING_CHECKOUT_LEGAL } from "@/lib/billing/subscription";
import { PRICING_REFUND_POLICY } from "@/lib/pricing/plan-catalog";
import { getRevenueToolByPaidSlug } from "@/lib/tools/revenue-tools";
import { getSampleReportHref } from "@/lib/tools/tool-links";
import { Container } from "@/components/ui/Container";
import {
  buildPricingPlans,
  type PricingPlan,
} from "@/data/pricing-plans";

interface PricingPlansGridProps {
  showHeader?: boolean;
  compact?: boolean;
  embedded?: boolean;
  featuredOnly?: boolean;
  /** Free + Pro (dominant) + Enterprise — Pro visually primary */
  tierMode?: "default" | "pro-focused";
}

function pickProFocusedPlans(plans: PricingPlan[]): PricingPlan[] {
  const free = plans.find((p) => p.id === "free");
  const pro = plans.find((p) => p.id === "pro");
  const enterprise = plans.find((p) => p.id === "team");
  return [free, pro, enterprise].filter((p): p is PricingPlan => Boolean(p));
}

export function PricingPlansGrid({
  showHeader = true,
  compact = false,
  embedded = false,
  featuredOnly = false,
  tierMode = "default",
}: PricingPlansGridProps) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const attribution = useAttributionContext();
  const pagePath = stripLocalePrefix(pathname);
  const searchParams = useSearchParams();
  const highlightPlanId = searchParams.get("plan") ?? undefined;
  const planRefs = useRef<Record<string, HTMLElement | null>>({});

  const pricingPlans = useMemo(() => buildPricingPlans(t), [t]);

  const checkoutToolSlug = useMemo(() => {
    const tool = searchParams.get("tool");
    return tool && getRevenueToolByPaidSlug(tool) ? tool : undefined;
  }, [searchParams]);

  useEffect(() => {
    if (!highlightPlanId) {
      return;
    }
    const el = planRefs.current[highlightPlanId];
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightPlanId]);

  const visiblePlans = useMemo(() => {
    if (tierMode === "pro-focused") {
      return pickProFocusedPlans(pricingPlans);
    }
    if (featuredOnly) {
      return pricingPlans.filter((plan) => plan.id === "free" || plan.id === "pro");
    }
    return pricingPlans;
  }, [featuredOnly, pricingPlans, tierMode]);

  useEffect(() => {
    trackRevenueEvent(REVENUE_EVENTS.pricing_viewed, {
      toolSlug: checkoutToolSlug,
    });
    trackConversionEvent({
      stage: "pricing_intent",
      eventName: "pricing_view",
      locale,
      pagePath,
      toolSlug: checkoutToolSlug,
      campaignId: attribution.utmCampaign,
      source: attribution.utmSource,
      medium: attribution.utmMedium,
      valueType: "premium",
    });
  }, [attribution.utmCampaign, attribution.utmMedium, attribution.utmSource, checkoutToolSlug, locale, pagePath]);

  const isProFocused = tierMode === "pro-focused";

  const inner = (
    <Container className={`sc-pro-container ${embedded ? "px-0" : ""}`}>
      {showHeader && (
        <div className="mb-8 text-center">
          <p className="sc-pro-eyebrow">{t("pricing.eyebrow")}</p>
          <h2 className="sc-pro-title">{t("pricing.title")}</h2>
          <p className="sc-pro-lead mx-auto">{t("pricing.tagline")}</p>
        </div>
      )}

      {!compact ? (
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm font-medium text-body-charcoal">
          {t("pricing.roiCopy")}
        </p>
      ) : null}

      <div
        className={
          isProFocused
            ? "sc-pro-pricing-grid"
            : `grid gap-6 ${compact ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`
        }
      >
        {visiblePlans.map((plan) => {
          const isFeatured = isProFocused ? plan.id === "pro" : Boolean(plan.highlighted);
          const isEnterprise = isProFocused && plan.id === "team";
          const displayName =
            isEnterprise ? t("pricing.matrix.colEnterprise") : plan.name;

          return (
            <article
              key={plan.id}
              ref={(node) => {
                planRefs.current[plan.id] = node;
              }}
              className={
                isProFocused
                  ? `sc-pro-pricing-card sc-pro-letterpress${
                      isFeatured
                        ? " sc-pro-pricing-card--featured"
                        : isEnterprise
                          ? " sc-pro-pricing-card--enterprise"
                          : " sc-pro-pricing-card--support"
                    }`
                  : `flex flex-col border p-6 md:p-7 ${
                      plan.highlighted || highlightPlanId === plan.id
                        ? plan.highlighted
                          ? "border-technical-gray bg-industrial-matte"
                          : "border-technical-gray bg-white"
                        : "border-technical-gray bg-white"
                    }`
              }
            >
              {isFeatured && plan.badge ? (
                <span className="sc-pro-pricing-card__badge">{plan.badge}</span>
              ) : null}
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-premium-velvet">{displayName}</h3>
                {plan.planId && plan.planId !== "free" && !isEnterprise ? (
                  <PlanAvailabilityBadge planId={plan.planId} />
                ) : null}
              </div>
              <p className={`sc-pro-pricing-card__price mt-2 ${!isProFocused ? "text-2xl font-bold sm:text-3xl" : ""}`}>
                {plan.price}
              </p>
              {plan.period ? (
                <p className="text-sm text-body-charcoal">{plan.period}</p>
              ) : null}
              <p className="mt-3 text-sm leading-relaxed text-body-charcoal">
                {isEnterprise
                  ? t("pricing.teamDescription")
                  : plan.description}
              </p>
              <ul className={`sc-pro-pricing-card__features space-y-2 ${!isProFocused ? "mt-6 flex-1" : ""}`}>
                {plan.features.map((feature) => (
                  <IconListItem
                    key={feature}
                    icon={UI_ICON.check}
                    iconClassName="text-sc-navy"
                    className="text-body-charcoal"
                  >
                    {feature}
                  </IconListItem>
                ))}
              </ul>
              <div className="sc-pro-pricing-card__cta">
                {plan.id === "free" && plan.primaryHref ? (
                  <TrackedCtaLink
                    href={plan.primaryHref}
                    eventName="pricing_cta_click"
                    ctaId="pricing_free_start"
                    source="pricing"
                    medium="free_plan"
                    className="sc-cta-secondary inline-flex w-full justify-center"
                  >
                    {plan.primaryCta}
                  </TrackedCtaLink>
                ) : isEnterprise ? (
                  <TrackedCtaLink
                    href="/for-consultants"
                    eventName="pricing_cta_click"
                    ctaId="pricing_team_contact"
                    source="pricing"
                    medium="team_plan"
                    className="sc-cta-secondary inline-flex w-full justify-center"
                  >
                    Contact us
                  </TrackedCtaLink>
                ) : (
                  <PlanCheckoutAction
                    plan={plan}
                    checkoutToolSlug={checkoutToolSlug}
                    highlighted={isFeatured}
                    className="w-full"
                  />
                )}
              </div>
              {plan.checkoutPlan === "pro" && plan.checkoutReady ? (
                <p className="mt-3 text-xs leading-relaxed text-body-charcoal">
                  {PRICING_CHECKOUT_LEGAL}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      {!compact ? (
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-body-charcoal">
          {PRICING_REFUND_POLICY}
        </p>
      ) : null}

      {!compact ? (
        <p className="mt-6 text-center text-sm text-body-charcoal">
          <Link href={getSampleReportHref()} className="font-semibold text-sc-navy underline underline-offset-2">
            {t("pricing.sampleReport")}
          </Link>
        </p>
      ) : null}

      {!compact && !isProFocused && (
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="w-full max-w-md">
            <ProCheckoutButton
              label={t("pricing.proCta")}
              source="pricing_footer"
              toolSlug={checkoutToolSlug}
            />
            <p className="mt-3 text-center text-xs leading-relaxed text-body-charcoal">
              {PRICING_CHECKOUT_LEGAL}
            </p>
          </div>
          <Link href="/free-tools" className="sc-cta-secondary px-6">
            Start with Free Tools
          </Link>
        </div>
      )}
    </Container>
  );

  if (embedded) {
    return inner;
  }

  return (
    <section className="sc-pro-section sc-pro-section--alt">
      {inner}
    </section>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
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
import {
  ANALYTICS_EVENTS,
  trackEvent,
} from "@/lib/analytics/events";
import { PRICING_CHECKOUT_LEGAL } from "@/lib/billing/subscription";
import { PRICING_REFUND_POLICY } from "@/lib/pricing/plan-catalog";
import { getRevenueToolByPaidSlug } from "@/lib/tools/revenue-tools";
import { getSampleReportHref } from "@/lib/tools/tool-links";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  PRICING_PLANS,
  PRICING_PRO_TAGLINE,
  PRICING_ROI_COPY,
} from "@/data/pricing-plans";

interface PricingPlansGridProps {
  showHeader?: boolean;
  compact?: boolean;
  embedded?: boolean;
  /** Homepage teaser — show Free Check + Pro only */
  featuredOnly?: boolean;
}

export function PricingPlansGrid({
  showHeader = true,
  compact = false,
  embedded = false,
  featuredOnly = false,
}: PricingPlansGridProps) {
  const searchParams = useSearchParams();
  const highlightPlanId = searchParams.get("plan") ?? undefined;
  const planRefs = useRef<Record<string, HTMLElement | null>>({});

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

  const visiblePlans = useMemo(
    () =>
      featuredOnly
        ? PRICING_PLANS.filter((plan) => plan.id === "free" || plan.id === "pro")
        : PRICING_PLANS,
    [featuredOnly]
  );

  useEffect(() => {
    trackRevenueEvent(REVENUE_EVENTS.pricing_viewed, {
      toolSlug: checkoutToolSlug,
    });
  }, [checkoutToolSlug]);

  const inner = (
      <Container className={embedded ? "px-0" : undefined}>
        {showHeader && (
          <SectionHeader
            eyebrow="Pricing"
            title="Protect margin before you quote"
            subtitle={PRICING_PRO_TAGLINE}
            align="center"
          />
        )}

        {!compact ? (
          <p className="mx-auto mb-8 max-w-2xl text-center text-base font-semibold text-deep-navy">
            {PRICING_ROI_COPY}
          </p>
        ) : null}

        <div
          className={`grid gap-6 ${
            compact
              ? "md:grid-cols-2"
              : "md:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {visiblePlans.map((plan) => (
            <article
              key={plan.id}
              ref={(node) => {
                planRefs.current[plan.id] = node;
              }}
              className={`flex flex-col rounded-2xl border p-6 md:p-7 ${
                plan.highlighted || highlightPlanId === plan.id
                  ? plan.highlighted
                    ? "border-professional-blue bg-deep-navy text-white shadow-card-dark ring-1 ring-cyan/20"
                    : "border-professional-blue bg-white shadow-card ring-2 ring-professional-blue/30"
                  : "border-slate/20 bg-white shadow-card"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                {plan.planId && plan.planId !== "free" ? (
                  <PlanAvailabilityBadge planId={plan.planId} />
                ) : null}
                {plan.badge ? (
                  <Badge
                    variant={plan.highlighted ? "premium" : "muted"}
                    className="text-[10px]"
                  >
                    {plan.badge}
                  </Badge>
                ) : null}
              </div>
              <p
                className={`mt-2 text-2xl font-bold sm:text-3xl ${
                  plan.highlighted ? "text-cyan" : "text-deep-navy"
                }`}
              >
                {plan.price}
              </p>
              {plan.period ? (
                <p
                  className={`text-sm ${
                    plan.highlighted ? "text-slate-300" : "text-slate"
                  }`}
                >
                  {plan.period}
                </p>
              ) : null}
              <p
                className={`mt-4 text-sm leading-relaxed ${
                  plan.highlighted ? "text-slate-300" : "text-slate"
                }`}
              >
                {plan.description}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <IconListItem
                    key={feature}
                    icon={UI_ICON.check}
                    iconClassName={plan.highlighted ? "text-cyan" : "text-emerald"}
                    className={plan.highlighted ? "text-slate-200" : "text-deep-navy"}
                  >
                    {feature}
                  </IconListItem>
                ))}
                {plan.comingSoonFeatures?.map((feature) => (
                  <IconListItem
                    key={feature}
                    icon={UI_ICON.exclude}
                    iconClassName={plan.highlighted ? "text-slate-400" : "text-slate"}
                    className={plan.highlighted ? "text-slate-400" : "text-slate"}
                  >
                    {feature}
                  </IconListItem>
                ))}
              </ul>
              {plan.id === "free" && plan.primaryHref ? (
                <Button
                  href={plan.primaryHref}
                  variant="primary"
                  size="md"
                  className="mt-8 w-full"
                  onClick={() => {
                    trackEvent(ANALYTICS_EVENTS.pricing_clicked, {
                      plan: plan.id,
                      source: "pricing_grid",
                    });
                  }}
                >
                  {plan.primaryCta}
                </Button>
              ) : (
                <PlanCheckoutAction
                  plan={plan}
                  checkoutToolSlug={checkoutToolSlug}
                  highlighted={plan.highlighted}
                  className="mt-8 w-full"
                />
              )}
              {plan.checkoutPlan === "pro" && plan.checkoutReady ? (
                <p
                  className={`mt-4 text-xs leading-relaxed ${
                    plan.highlighted ? "text-slate-400" : "text-slate"
                  }`}
                >
                  {PRICING_CHECKOUT_LEGAL}
                </p>
              ) : null}
            </article>
          ))}
        </div>

        {!compact ? (
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-slate">
            {PRICING_REFUND_POLICY}
          </p>
        ) : null}

        {!compact ? (
          <p className="mt-6 text-center text-sm text-slate">
            <Link href={getSampleReportHref()} className="font-semibold text-professional-blue hover:underline">
              View sample verdict report →
            </Link>
          </p>
        ) : null}

        {!compact && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="w-full max-w-md">
              <ProCheckoutButton
                label="Start SectorCalc Pro"
                source="pricing_footer"
                toolSlug={checkoutToolSlug}
              />
              <p className="mt-3 text-center text-xs leading-relaxed text-slate">
                {PRICING_CHECKOUT_LEGAL}
              </p>
            </div>
            <Button href="/free-tools" variant="outline" size="lg">
              Start with Free Tools
            </Button>
          </div>
        )}

        {compact && (
          <p className="mt-8 text-center text-sm text-[#808080]">
            <Link
              href="/pricing"
              className="font-semibold text-[#07b6ef] hover:underline"
            >
              View full plan comparison →
            </Link>
          </p>
        )}
      </Container>
  );

  if (embedded) {
    return inner;
  }

  return (
    <section
      className={
        compact
          ? "border-y border-slate/10 bg-white py-20 md:py-28"
          : "bg-off-white py-16 md:py-24"
      }
    >
      {inner}
    </section>
  );
}

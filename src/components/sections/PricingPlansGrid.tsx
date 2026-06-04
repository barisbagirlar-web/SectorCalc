"use client";

import Link from "next/link";
import { LeadIntentTrigger } from "@/components/leads/LeadIntentTrigger";
import { Container } from "@/components/ui/Container";
import { pricingPlanIdToLeadPlan } from "@/data/lead-options";
import {
  ANALYTICS_EVENTS,
  trackEvent,
} from "@/lib/analytics/events";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getPricingLeadToolLabel, PRICING_PLANS } from "@/data/pricing-plans";

const planCtaBase =
  "inline-flex w-full items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[44px] px-6 py-2.5 text-base mt-8";

interface PricingPlansGridProps {
  showHeader?: boolean;
  compact?: boolean;
  /** When true, omit outer section wrapper (used inside mc-extension) */
  embedded?: boolean;
}

export function PricingPlansGrid({
  showHeader = true,
  compact = false,
  embedded = false,
}: PricingPlansGridProps) {
  const inner = (
      <Container className={embedded ? "px-0" : undefined}>
        {showHeader && (
          <SectionHeader
            eyebrow="Pricing"
            title="Plans for operators, owners and advisors"
            subtitle="Start free. Upgrade when you need packaged decision reports, scenarios and risk verdicts — not just calculator output."
            align="center"
          />
        )}

        <div
          className={`grid gap-6 ${
            compact
              ? "md:grid-cols-2"
              : "md:grid-cols-2 xl:grid-cols-4"
          }`}
        >
          {PRICING_PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`flex flex-col rounded-2xl border p-6 md:p-7 ${
                plan.highlighted
                  ? "border-professional-blue bg-deep-navy text-white shadow-card-dark ring-1 ring-cyan/20"
                  : "border-slate/20 bg-white shadow-card"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                {plan.badge && (
                  <Badge
                    variant={plan.highlighted ? "premium" : "muted"}
                    className="text-[10px]"
                  >
                    {plan.badge}
                  </Badge>
                )}
              </div>
              <p
                className={`mt-2 text-2xl font-bold sm:text-3xl ${
                  plan.highlighted ? "text-cyan" : "text-deep-navy"
                }`}
              >
                {plan.price}
              </p>
              {plan.period && (
                <p
                  className={`text-sm ${
                    plan.highlighted ? "text-slate-300" : "text-slate"
                  }`}
                >
                  {plan.period}
                </p>
              )}
              <p
                className={`mt-4 text-sm leading-relaxed ${
                  plan.highlighted ? "text-slate-300" : "text-slate"
                }`}
              >
                {plan.description}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex gap-2 text-sm ${
                      plan.highlighted ? "text-slate-200" : "text-deep-navy"
                    }`}
                  >
                    <span
                      className={plan.highlighted ? "text-cyan" : "text-emerald"}
                      aria-hidden
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
                {plan.comingSoonFeatures?.map((feature) => (
                  <li
                    key={feature}
                    className={`flex gap-2 text-sm ${
                      plan.highlighted ? "text-slate-400" : "text-slate"
                    }`}
                  >
                    <span aria-hidden>○</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.id === "free" ? (
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
                <LeadIntentTrigger
                  source="pricing"
                  plan={pricingPlanIdToLeadPlan(plan.id)}
                  toolRequested={getPricingLeadToolLabel(plan.name)}
                  className={`${planCtaBase} ${
                    plan.highlighted
                      ? "bg-cyan text-deep-navy hover:bg-cyan/90 focus-visible:ring-cyan"
                      : "bg-professional-blue text-white hover:bg-blue-700 focus-visible:ring-professional-blue"
                  }`}
                  onBeforeOpen={() => {
                    if (plan.id === "sector-pass") {
                      trackEvent(ANALYTICS_EVENTS.sector_pass_clicked, {
                        plan: plan.id,
                      });
                    }
                    trackEvent(ANALYTICS_EVENTS.pricing_clicked, {
                      plan: plan.id,
                      source: "pricing_grid",
                    });
                  }}
                >
                  {plan.primaryCta}
                </LeadIntentTrigger>
              )}
            </article>
          ))}
        </div>

        {!compact && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              href="/industries"
              variant="primary"
              size="lg"
              onClick={() =>
                trackEvent(ANALYTICS_EVENTS.pricing_clicked, {
                  source: "pricing_footer_primary",
                })
              }
            >
              Explore Premium Tools
            </Button>
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

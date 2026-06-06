"use client";

import Link from "next/link";
import { ProCheckoutButton } from "@/components/subscription/ProCheckoutButton";
import { Container } from "@/components/ui/Container";
import {
  ANALYTICS_EVENTS,
  trackEvent,
} from "@/lib/analytics/events";
import { PRICING_CHECKOUT_LEGAL } from "@/lib/billing/subscription";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  PRICING_PLANS,
  PRICING_PRO_TAGLINE,
} from "@/data/pricing-plans";

interface PricingPlansGridProps {
  showHeader?: boolean;
  compact?: boolean;
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
            title="Decision tools, not report upsells"
            subtitle={PRICING_PRO_TAGLINE}
            align="center"
          />
        )}

        <div
          className={`grid gap-6 ${
            compact ? "md:grid-cols-2" : "mx-auto max-w-4xl md:grid-cols-2"
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
              ) : plan.checkoutPlan === "pro" ? (
                <div className="mt-8">
                  <ProCheckoutButton
                    label={plan.primaryCta}
                    source="pricing_grid"
                  />
                  <p
                    className={`mt-4 text-xs leading-relaxed ${
                      plan.highlighted ? "text-slate-400" : "text-slate"
                    }`}
                  >
                    {PRICING_CHECKOUT_LEGAL}
                  </p>
                </div>
              ) : (
                <Button href={plan.primaryHref} variant="primary" size="md" className="mt-8 w-full">
                  {plan.primaryCta}
                </Button>
              )}
            </article>
          ))}
        </div>

        {!compact && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="w-full max-w-md">
              <ProCheckoutButton
                label="Start SectorCalc Pro"
                source="pricing_footer"
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

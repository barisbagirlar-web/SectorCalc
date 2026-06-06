"use client";

import Link from "next/link";
import { ProCheckoutButton } from "@/components/subscription/ProCheckoutButton";
import { PRICING_CHECKOUT_LEGAL } from "@/lib/billing/subscription";

const PAYWALL_BULLETS = [
  "Safe price and bid risk verdicts",
  "Margin leak detection",
  "Sector-specific analyzer tools",
  "Report-style decision summaries",
  "Cancel anytime",
] as const;

interface PremiumPaywallProps {
  toolSlug?: string;
  pricingHref?: string;
}

export function PremiumPaywall({
  toolSlug,
  pricingHref,
}: PremiumPaywallProps) {
  const resolvedPricingHref =
    pricingHref ??
    (toolSlug ? `/pricing?tool=${encodeURIComponent(toolSlug)}` : "/pricing");

  return (
    <aside className="rounded-2xl border border-slate/15 bg-white p-6 shadow-card sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
        SectorCalc Pro required
      </p>
      <h2 className="mt-3 text-xl font-bold text-deep-navy sm:text-2xl">
        Unlock this analyzer with SectorCalc Pro.
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate">
        Get safe price, bid risk and margin leak verdicts for sector-specific
        decisions.
      </p>
      <ul className="mt-5 space-y-2">
        {PAYWALL_BULLETS.map((bullet) => (
          <li key={bullet} className="flex gap-2 text-sm text-deep-navy">
            <span className="text-emerald" aria-hidden>
              ✓
            </span>
            {bullet}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ProCheckoutButton
          label="Unlock SectorCalc Pro"
          source="premium_paywall"
          toolSlug={toolSlug}
          className="sm:max-w-xs"
        />
        <Link
          href={resolvedPricingHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-slate/20 bg-white px-5 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue hover:text-professional-blue"
        >
          View pricing
        </Link>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate">{PRICING_CHECKOUT_LEGAL}</p>
    </aside>
  );
}

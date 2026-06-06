"use client";

import Link from "next/link";
import { ProCheckoutButton } from "@/components/subscription/ProCheckoutButton";
import { SECTORCALC_PRO_PRICE_LABEL } from "@/lib/pricing/sectorcalc-pro";
import { getFreeToolHref, getPricingHref } from "@/lib/tools/tool-links";
import type { RevenueTool } from "@/lib/tools/revenue-tools";

const PAYWALL_BULLETS = [
  "Safe price and bid risk verdicts",
  "Margin leak detection",
  "Sector-specific analyzer tools",
  "Report-style decision summaries",
  "Cancel anytime",
] as const;

const PAYWALL_SHORT_LEGAL =
  "Digital product. No refunds. Estimates only.";

interface PremiumPaywallProps {
  tool?: RevenueTool;
  toolSlug?: string;
  pricingHref?: string;
}

export function PremiumPaywall({ tool, toolSlug, pricingHref }: PremiumPaywallProps) {
  const resolvedPricingHref =
    pricingHref ?? (tool ? getPricingHref(tool) : getPricingHref());
  const resolvedToolSlug = tool?.paidSlug ?? toolSlug;
  const freeHref = tool ? getFreeToolHref(tool) : "/free-tools";

  return (
    <aside className="rounded-2xl border border-slate/15 bg-white p-6 shadow-card sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
        SectorCalc Pro required
      </p>
      <h2 className="mt-3 text-xl font-bold text-deep-navy sm:text-2xl">
        Unlock this analyzer with SectorCalc Pro.
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate">
        Get safe price, bid risk and margin leak verdicts before you accept the job.
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
          label={`Start SectorCalc Pro — ${SECTORCALC_PRO_PRICE_LABEL}`}
          source="premium_paywall"
          toolSlug={resolvedToolSlug}
          className="sm:max-w-xs"
        />
        <Link
          href={freeHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-slate/20 bg-white px-5 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue hover:text-professional-blue"
        >
          Try the Free Calculator
        </Link>
        <Link
          href={resolvedPricingHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-transparent px-5 text-sm font-semibold text-slate transition-colors hover:text-professional-blue"
        >
          View pricing
        </Link>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate">{PAYWALL_SHORT_LEGAL}</p>
    </aside>
  );
}

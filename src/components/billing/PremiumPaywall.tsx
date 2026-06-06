"use client";

import Link from "next/link";
import { ProCheckoutButton } from "@/components/subscription/ProCheckoutButton";
import { SingleVerdictCheckoutButton } from "@/components/subscription/SingleVerdictCheckoutButton";
import { IconListItem } from "@/components/icons/ScIcon";
import { UI_ICON } from "@/lib/icons/icon-registry";
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
    <aside className="rounded-2xl border border-slate/15 bg-white p-6 shadow-card dark:border-slate-600 dark:bg-slate-800 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-professional-blue">
        Premium access required
      </p>
      <h2 className="mt-3 text-xl font-bold text-deep-navy dark:text-white sm:text-2xl">
        Unlock this analyzer with Single Verdict or SectorCalc Pro.
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate dark:text-slate-300">
        Get safe price, bid risk and margin leak verdicts before you accept the job.
      </p>
      <ul className="mt-5 space-y-2">
        {PAYWALL_BULLETS.map((bullet) => (
          <IconListItem key={bullet} icon={UI_ICON.check} iconClassName="text-emerald">
            {bullet}
          </IconListItem>
        ))}
      </ul>
      <div className="mt-6 flex flex-col gap-3">
        <SingleVerdictCheckoutButton
          toolSlug={resolvedToolSlug}
          returnPath={
            resolvedToolSlug
              ? `/tools/premium/${resolvedToolSlug}`
              : "/pricing"
          }
          source="premium_paywall"
          className="sm:max-w-md"
        />
        <ProCheckoutButton
          label={`Start SectorCalc Pro — ${SECTORCALC_PRO_PRICE_LABEL}`}
          source="premium_paywall"
          toolSlug={resolvedToolSlug}
          className="sm:max-w-xs"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href={freeHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-slate/20 bg-white px-5 text-sm font-semibold text-deep-navy transition-colors hover:border-professional-blue hover:text-professional-blue dark:border-slate-600 dark:bg-slate-900 dark:text-off-white dark:hover:border-professional-blue"
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
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate dark:text-slate-300">{PAYWALL_SHORT_LEGAL}</p>
    </aside>
  );
}

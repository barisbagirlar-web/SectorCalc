"use client";

import { ProCheckoutButton } from "@/components/subscription/ProCheckoutButton";
import { SECTORCALC_PRO_PRICE_LABEL } from "@/lib/tools/revenue-tools";

interface PremiumToolPaywallProps {
  toolTitle: string;
}

export function PremiumToolPaywall({ toolTitle }: PremiumToolPaywallProps) {
  return (
    <div className="rounded-2xl border border-amber/30 bg-gradient-to-br from-deep-navy to-dark-navy p-6 md:p-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-cyan">
        SectorCalc Pro required
      </p>
      <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
        Unlock the {toolTitle} decision
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
        Free tools show quick checks. Paid decision tools deliver safe price floors,
        margin leak detection and accept/reject verdicts — {SECTORCALC_PRO_PRICE_LABEL}.
      </p>
      <div className="mt-6">
        <ProCheckoutButton
          source="premium_tool_paywall"
          className="max-w-md"
        />
      </div>
    </div>
  );
}

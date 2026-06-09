"use client";

import type { ReactNode } from "react";
import type { ParsedPremiumVerdict } from "@/lib/premium/parse-premium-verdict-txt";

/**
 * Phase 2 integration slot — Stochastic Risk Engine (MarginCore P90).
 * Wire `PremiumDecisionReportPanel` or inline verdict UI here when ready.
 */
interface CncStochasticPhaseSlotProps {
  enabled: boolean;
  premiumVerdict: ParsedPremiumVerdict | null;
  children?: ReactNode;
}

export function CncStochasticPhaseSlot({
  enabled,
  premiumVerdict,
  children,
}: CncStochasticPhaseSlotProps) {
  if (!enabled || !premiumVerdict || premiumVerdict.isError) {
    return null;
  }

  return (
    <section
      id="margincore-stochastic-phase"
      data-phase="stochastic-risk-engine"
      aria-label="Stochastic risk engine output"
      className="border border-ink-black/20 bg-white p-6 sm:p-8"
    >
      {children}
    </section>
  );
}

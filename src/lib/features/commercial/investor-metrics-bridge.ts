/**
 * Bridge governance metrics into product pages - Phase 6A read-only.
 * SSR-safe: no filesystem scans (Cloud Run cwd lacks src/ tree).
 */

import { FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts";
import { ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { buildDebtRegister } from "@/lib/features/formula-governance/roadmap-debt-register/debt-register-builder";
import { INVESTOR_PAGE_TRUST_TRACE_READY } from "@/lib/features/commercial/investor-page-metrics-snapshot";

export type InvestorPageMetrics = {
  readonly livePilotCount: number;
  readonly rolloutPotential: number;
  readonly calculationBridgeEligible: number;
  readonly formulaContracts: number;
  readonly trustTraceReady: number;
  readonly remainingDebtCount: number;
  readonly toolFactoryStatus: "skeleton_ready";
};

export function loadInvestorPageMetrics(): InvestorPageMetrics {
  return {
    livePilotCount: 0,
    rolloutPotential: ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS.length,
    calculationBridgeEligible: 0,
    formulaContracts: FORMULA_CONTRACTS.length,
    trustTraceReady: INVESTOR_PAGE_TRUST_TRACE_READY,
    remainingDebtCount: buildDebtRegister().length,
    toolFactoryStatus: "skeleton_ready",
  };
}

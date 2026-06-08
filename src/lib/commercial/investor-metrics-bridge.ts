/**
 * Bridge governance metrics into product pages — Phase 6A read-only.
 * SSR-safe: no filesystem scans (Cloud Run cwd lacks src/ tree).
 */

import { ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS } from "@/components/tools/smart-form/rollout-batch-h-catalog";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import { buildDebtRegister } from "@/lib/formula-governance/roadmap-debt-register/debt-register-builder";
import { getCalculationBridgeEligibleSlugs } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-eligibility";
import { INVESTOR_PAGE_TRUST_TRACE_READY } from "@/lib/commercial/investor-page-metrics-snapshot";

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
    livePilotCount: ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS.length,
    rolloutPotential: ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS.length,
    calculationBridgeEligible: getCalculationBridgeEligibleSlugs().length,
    formulaContracts: FORMULA_CONTRACTS.length,
    trustTraceReady: INVESTOR_PAGE_TRUST_TRACE_READY,
    remainingDebtCount: buildDebtRegister().length,
    toolFactoryStatus: "skeleton_ready",
  };
}

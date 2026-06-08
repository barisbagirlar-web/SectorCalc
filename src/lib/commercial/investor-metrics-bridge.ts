/**
 * Bridge governance audit metrics into product pages — Phase 6A read-only.
 */

import { collectInvestorDemoMetrics } from "@/lib/formula-governance/investor-demo/investor-demo-metrics";
import { runRoadmapDebtAudit } from "@/lib/formula-governance/roadmap-debt-register/roadmap-debt-audit";
import { runSmartFormRolloutExpansionAudit } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-batch-audit";

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
  const metrics = collectInvestorDemoMetrics();
  const rollout = runSmartFormRolloutExpansionAudit();
  const debt = runRoadmapDebtAudit();

  return {
    livePilotCount: rollout.liveAlready,
    rolloutPotential: rollout.totalCompletedPatchTools,
    calculationBridgeEligible: rollout.eligibleForCalculationBridge,
    formulaContracts: metrics.formulaGovernanceCoverage,
    trustTraceReady: metrics.trustTraceCoverage,
    remainingDebtCount: debt.totalRemainingDebt,
    toolFactoryStatus: "skeleton_ready",
  };
}

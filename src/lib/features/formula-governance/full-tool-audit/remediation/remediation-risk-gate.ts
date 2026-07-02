/**
 * Remediation risk gate - Phase 5I-D low-risk selection only.
 */

import type { FullToolAuditItem } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-types";
import type { PatchPlan } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

export function isEligibleForRemediationBatch1(
  item: FullToolAuditItem,
  plan: PatchPlan | undefined,
): { readonly eligible: boolean; readonly reason: string } {
  if (item.recommendedAction === "no_action") {
    return { eligible: false, reason: "no_action" };
  }

  if (item.smartFormStatus === "live_pilot") {
    return { eligible: false, reason: "production_live_smart_form_pilot" };
  }

  if (item.recommendedAction === "blocked_manual_review" || item.blockers.length > 0) {
    return { eligible: false, reason: "blocked_manual_review" };
  }

  if (!plan) {
    return { eligible: false, reason: "missing_patch_plan" };
  }

  if (plan.riskLevel === "critical" || plan.riskLevel === "high") {
    return { eligible: false, reason: `risk_${plan.riskLevel}` };
  }

  if (!plan.expectedDiffContract.noProductionCalculatorChange) {
    return { eligible: false, reason: "requires_production_calculator_change" };
  }

  return { eligible: true, reason: "low_risk_score_lift" };
}

export function estimateScoreLift(item: FullToolAuditItem): number {
  const headroom = Math.max(0, 100 - item.score);
  if (item.recommendedAction === "metadata_patch") {
    return Math.min(15, headroom);
  }
  if (item.recommendedAction === "fixture_ontology") {
    return Math.min(20, headroom);
  }
  if (item.recommendedAction === "trust_trace_patch") {
    return Math.min(10, headroom);
  }
  if (item.recommendedAction === "smart_form_patch") {
    return Math.min(5, headroom);
  }
  return Math.min(8, headroom);
}

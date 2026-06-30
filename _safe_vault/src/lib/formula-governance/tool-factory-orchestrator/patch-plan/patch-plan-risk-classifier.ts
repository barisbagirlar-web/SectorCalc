/**
 * Patch plan risk classifier — Phase 5I-B deterministic risk scoring.
 */

import type { FullToolAuditItem } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-types";
import type {
  PatchPlanRiskLevel,
  PatchPlanType,
} from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

export function mapRecommendedActionToPatchType(
  action: FullToolAuditItem["recommendedAction"],
): PatchPlanType {
  switch (action) {
    case "metadata_patch":
      return "metadata_only";
    case "fixture_ontology":
      return "fixture_ontology";
    case "input_design_patch":
      return "input_design_patch";
    case "smart_form_patch":
      return "smart_form_patch";
    case "trust_trace_patch":
      return "trust_trace_patch";
    case "report_layer_patch":
      return "report_export_contract";
    case "blocked_manual_review":
      return "blocked_manual_review";
    case "no_action":
    default:
      return "test_only_patch";
  }
}

export function classifyPatchPlanRisk(
  item: Pick<FullToolAuditItem, "score" | "blockers" | "recommendedAction" | "oracleStatus">,
  patchType: PatchPlanType,
): PatchPlanRiskLevel {
  if (patchType === "blocked_manual_review" || item.blockers.length > 0) {
    return "critical";
  }

  if (patchType === "smart_form_patch" || patchType === "input_design_patch") {
    return item.score >= 90 ? "medium" : "high";
  }

  if (patchType === "fixture_ontology") {
    return item.oracleStatus === "PASS" ? "medium" : "high";
  }

  if (patchType === "metadata_only" || patchType === "trust_trace_patch" || patchType === "report_export_contract") {
    return "low";
  }

  return "medium";
}

export function canAutoGeneratePatch(patchType: PatchPlanType, riskLevel: PatchPlanRiskLevel): boolean {
  if (patchType === "blocked_manual_review") {
    return false;
  }
  return riskLevel === "low" || riskLevel === "medium";
}

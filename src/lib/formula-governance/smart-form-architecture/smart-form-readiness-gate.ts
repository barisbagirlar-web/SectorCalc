/**
 * Smart form readiness gate — Phase 5H-G-A governance gate (no UI).
 */

import type { ControlledInputDesignPatch } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-patch-types";
import type { ToolMigrationPlanItem } from "@/lib/formula-governance/input-design-audit/migration-plan/migration-plan-types";
import type { BatchAlignmentSummary } from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";
import type { SmartFormReadinessResult } from "@/lib/formula-governance/smart-form-architecture/smart-form-types";

const HIGH_ALIGNMENT_RISK_THRESHOLD = 35;

export type EvaluateSmartFormReadinessParams = {
  readonly migrationPlanItem: ToolMigrationPlanItem;
  readonly controlledInputPatch?: ControlledInputDesignPatch;
  readonly alignmentSummary?: BatchAlignmentSummary;
};

export function evaluateSmartFormReadiness(
  params: EvaluateSmartFormReadinessParams,
): SmartFormReadinessResult {
  const { migrationPlanItem, controlledInputPatch, alignmentSummary } = params;
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!controlledInputPatch) {
    return {
      status: "needs_input_design_patch",
      blockers,
      warnings,
    };
  }

  if (alignmentSummary?.status === "blocked") {
    blockers.push(`Alignment blocked for "${migrationPlanItem.slug}".`);
    return { status: "blocked", blockers, warnings };
  }

  if (
    alignmentSummary?.status === "needs_review" &&
    (migrationPlanItem.migrationRiskLevel === "high" ||
      migrationPlanItem.migrationRiskLevel === "critical" ||
      alignmentSummary.migrationRiskScore >= HIGH_ALIGNMENT_RISK_THRESHOLD)
  ) {
    return {
      status: "needs_alignment_review",
      blockers,
      warnings: [
        `Alignment needs review with elevated migration risk (${alignmentSummary.migrationRiskScore}).`,
      ],
    };
  }

  if (controlledInputPatch.productionImpact !== "none") {
    blockers.push(
      `Controlled input patch for "${migrationPlanItem.slug}" must declare productionImpact none.`,
    );
    return { status: "blocked", blockers, warnings };
  }

  if (controlledInputPatch.requiredInputs.length === 0) {
    blockers.push(`Smart form plan for "${migrationPlanItem.slug}" requires at least one required field.`);
    return { status: "blocked", blockers, warnings };
  }

  warnings.push(...controlledInputPatch.warnings);
  blockers.push(...controlledInputPatch.blockers);

  if (blockers.length > 0) {
    return { status: "blocked", blockers, warnings };
  }

  const uiImpactAllowsSpec =
    controlledInputPatch.uiImpact === "future_smart_form_required" ||
    controlledInputPatch.uiImpact === "none";

  if (!uiImpactAllowsSpec) {
    blockers.push(`UI impact "${controlledInputPatch.uiImpact}" does not allow smart form spec.`);
    return { status: "blocked", blockers, warnings };
  }

  return {
    status: "ready_for_spec",
    blockers,
    warnings,
  };
}

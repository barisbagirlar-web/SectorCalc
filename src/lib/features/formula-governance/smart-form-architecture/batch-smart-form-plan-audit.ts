/**
 * Batch smart form plan audit - Phase 5H-G-A read-only governance audit.
 */

import type { ControlledInputDesignPatch } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-patch-types";
import { FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import type { BatchMigrationPlan } from "@/lib/features/formula-governance/input-design-audit/migration-plan/migration-plan-types";
import { buildSmartFormPlan } from "@/lib/features/formula-governance/smart-form-architecture/smart-form-plan-builder";
import type {
  BatchSmartFormPlanAuditResult,
  SmartFormPlan,
  SmartFormReadinessStatus,
} from "@/lib/features/formula-governance/smart-form-architecture/smart-form-types";
import type { BatchAlignmentAuditResult } from "@/lib/features/formula-governance/requirement-engine/batch-alignment-audit";

export type RunBatchSmartFormPlanAuditParams = {
  readonly migrationPlan: BatchMigrationPlan;
  readonly controlledPatchRegistry: Readonly<Record<string, ControlledInputDesignPatch>>;
  readonly alignmentAudit?: BatchAlignmentAuditResult;
};

function countByStatus(
  plans: readonly SmartFormPlan[],
  status: SmartFormReadinessStatus,
): number {
  return plans.filter((plan) => plan.readinessStatus === status).length;
}

function selectRecommendedFirstSmartFormBatch(
  plans: readonly SmartFormPlan[],
): readonly string[] {
  const readySlugs = new Set(
    plans
      .filter((plan) => plan.readinessStatus === "ready_for_spec")
      .map((plan) => plan.slug),
  );

  const fromFirstBatch = FIRST_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS.filter((slug) =>
    readySlugs.has(slug),
  );

  if (fromFirstBatch.length >= 3) {
    return fromFirstBatch.slice(0, 3);
  }

  return plans
    .filter((plan) => plan.readinessStatus === "ready_for_spec")
    .map((plan) => plan.slug)
    .slice(0, 3);
}

export function runBatchSmartFormPlanAudit(
  params: RunBatchSmartFormPlanAuditParams,
): BatchSmartFormPlanAuditResult {
  const { migrationPlan, controlledPatchRegistry, alignmentAudit } = params;
  const plans: SmartFormPlan[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];

  for (const item of migrationPlan.items) {
    const patch = controlledPatchRegistry[item.slug];
    const alignmentSummary = alignmentAudit?.summaries.find(
      (entry) => entry.slug === item.slug,
    );

    const plan = buildSmartFormPlan({
      migrationPlanItem: item,
      controlledInputPatch: patch,
      alignmentSummary,
    });

    plans.push(plan);
    warnings.push(...plan.warnings.map((warning) => `${item.slug}: ${warning}`));
    blockers.push(...plan.blockers.map((blocker) => `${item.slug}: ${blocker}`));
  }

  return {
    totalTools: migrationPlan.totalTools,
    readyForSpec: countByStatus(plans, "ready_for_spec"),
    needsInputDesignPatch: countByStatus(plans, "needs_input_design_patch"),
    needsAlignmentReview: countByStatus(plans, "needs_alignment_review"),
    blocked: countByStatus(plans, "blocked"),
    plans,
    recommendedFirstSmartFormBatch: selectRecommendedFirstSmartFormBatch(plans),
    warnings,
    blockers,
  };
}

export function formatBatchSmartFormPlanAuditReport(
  result: BatchSmartFormPlanAuditResult,
): string {
  const lines = [
    "Smart Form Architecture Audit",
    `Total tools: ${result.totalTools}`,
    `Ready for spec: ${result.readyForSpec}`,
    `Needs input design patch: ${result.needsInputDesignPatch}`,
    `Needs alignment review: ${result.needsAlignmentReview}`,
    `Blocked: ${result.blocked}`,
    "",
    "Recommended first smart form batch:",
  ];

  if (result.recommendedFirstSmartFormBatch.length === 0) {
    lines.push("- (none - resolve blockers first)");
  } else {
    result.recommendedFirstSmartFormBatch.forEach((slug, index) => {
      lines.push(`${index + 1}. ${slug}`);
    });
  }

  if (result.blockers.length > 0) {
    lines.push("", "Blockers:");
    for (const blocker of result.blockers.slice(0, 5)) {
      lines.push(`- ${blocker}`);
    }
  }

  return lines.join("\n");
}

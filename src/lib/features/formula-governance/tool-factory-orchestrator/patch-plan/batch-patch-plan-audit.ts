/**
 * Batch patch plan audit - Phase 5I-B read-only.
 */

import type { FullExistingToolAuditResult } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-types";
import { auditPatchPlan } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-audit";
import { buildPatchPlanFromFullToolAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-generator";
import type { BatchPatchPlanAuditResult } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

export function runBatchPatchPlanAudit(
  fullToolAudit: FullExistingToolAuditResult,
): BatchPatchPlanAuditResult {
  const plans = fullToolAudit.items
    .filter((item) => item.recommendedAction !== "no_action")
    .map((item) => buildPatchPlanFromFullToolAudit(item));

  const audited = plans.map((plan) => auditPatchPlan(plan));
  const forbiddenFileViolations = audited.flatMap((result) => result.forbiddenFileViolations);

  const top10PatchCandidates = [...plans]
    .filter((plan) => plan.status === "patch_plan_ready" && plan.riskLevel === "low")
    .sort((left, right) => left.slug.localeCompare(right.slug))
    .slice(0, 10)
    .map((plan) => plan.slug);

  return {
    totalPlans: plans.length,
    patchPlanReady: plans.filter((plan) => plan.status === "patch_plan_ready").length,
    needsMetadata: plans.filter((plan) => plan.status === "needs_metadata").length,
    needsFixture: plans.filter((plan) => plan.status === "needs_fixture").length,
    manualReview: plans.filter((plan) => plan.status === "needs_manual_review").length,
    blocked: plans.filter((plan) => plan.status === "blocked").length,
    lowRiskPlans: plans.filter((plan) => plan.riskLevel === "low").length,
    highRiskPlans: plans.filter(
      (plan) => plan.riskLevel === "high" || plan.riskLevel === "critical",
    ).length,
    top10PatchCandidates,
    forbiddenFileViolations,
    plans,
    warnings: audited.flatMap((result) => result.warnings),
    blockers: audited.flatMap((result) => result.blockers),
  };
}

export function formatBatchPatchPlanAuditReport(result: BatchPatchPlanAuditResult): string {
  const lines = [
    "Tool Factory Patch Plan Audit",
    `Total plans: ${result.totalPlans}`,
    `Patch plan ready: ${result.patchPlanReady}`,
    `Needs metadata: ${result.needsMetadata}`,
    `Needs fixture: ${result.needsFixture}`,
    `Manual review: ${result.manualReview}`,
    `Blocked: ${result.blocked}`,
    `Low risk plans: ${result.lowRiskPlans}`,
    `High risk plans: ${result.highRiskPlans}`,
    `Forbidden file violations: ${result.forbiddenFileViolations.length}`,
    "",
    "Top 10 patch candidates:",
  ];

  if (result.top10PatchCandidates.length === 0) {
    lines.push("- (none)");
  } else {
    for (const slug of result.top10PatchCandidates) {
      lines.push(`- ${slug}`);
    }
  }

  return lines.join("\n");
}

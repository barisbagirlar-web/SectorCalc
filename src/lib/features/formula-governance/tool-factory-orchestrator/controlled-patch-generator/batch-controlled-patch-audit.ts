/**
 * Batch controlled patch draft audit — Phase 5I-E read-only.
 */

import { validateApprovalInvariants } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-approval";
import { buildControlledPatchDraft } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-generator";
import { validateProposedOperations } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-file-policy";
import type { BatchControlledPatchDraftAuditResult } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-types";
import type { BatchPatchPlanAuditResult } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

export function runBatchControlledPatchDraftAudit(
  patchPlanAudit: BatchPatchPlanAuditResult,
): BatchControlledPatchDraftAuditResult {
  const drafts = patchPlanAudit.plans.map((plan) => buildControlledPatchDraft(plan));

  let forbiddenFileViolations = 0;
  const blockers: string[] = [];
  const warnings: string[] = [];

  for (const draft of drafts) {
    blockers.push(...validateApprovalInvariants(draft));
    const violations = validateProposedOperations(draft.proposedOperations);
    forbiddenFileViolations += violations.length;
    blockers.push(...violations.map((v) => `${draft.slug}: ${v}`));
    warnings.push(...draft.warnings);
  }

  const topPatchDrafts = drafts
    .filter((draft) => draft.status === "dry_run_ready")
    .sort((left, right) => left.slug.localeCompare(right.slug))
    .slice(0, 10)
    .map((draft) => draft.slug);

  const canApplyCount = drafts.filter((draft) => draft.canApply).length;

  return {
    totalDrafts: drafts.length,
    dryRunReady: drafts.filter((draft) => draft.status === "dry_run_ready").length,
    needsManualApproval: drafts.filter((draft) => draft.status === "needs_manual_approval").length,
    blocked: drafts.filter((draft) => draft.status === "blocked").length,
    forbiddenFileViolations,
    lowRiskDrafts: drafts.filter(
      (draft) => draft.status === "dry_run_ready" && draft.productionImpact === "none",
    ).length,
    topPatchDrafts,
    canApplyCount,
    drafts,
    warnings,
    blockers: [...new Set(blockers)],
  };
}

export function formatBatchControlledPatchAuditReport(
  result: BatchControlledPatchDraftAuditResult,
): string {
  return [
    "Controlled Patch Draft Audit",
    `Total drafts: ${result.totalDrafts}`,
    `Dry run ready: ${result.dryRunReady}`,
    `Needs manual approval: ${result.needsManualApproval}`,
    `Blocked: ${result.blocked}`,
    `Forbidden file violations: ${result.forbiddenFileViolations}`,
    `Low risk drafts: ${result.lowRiskDrafts}`,
    `Can apply count: ${result.canApplyCount}`,
    "",
    "Top patch drafts:",
    ...(result.topPatchDrafts.length > 0
      ? result.topPatchDrafts.map((slug) => `- ${slug}`)
      : ["- (none)"]),
  ].join("\n");
}

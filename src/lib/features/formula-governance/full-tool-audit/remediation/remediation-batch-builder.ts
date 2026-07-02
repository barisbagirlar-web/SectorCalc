/**
 * Remediation batch builder - Phase 5I-D batch 1 deterministic plan.
 */

import type { FullExistingToolAuditResult } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-types";
import {
  getRemediationAllowedFiles,
  mapPatchTypeToRemediationAction,
  REMEDIATION_FORBIDDEN_FILES,
} from "@/lib/features/formula-governance/full-tool-audit/remediation/remediation-action-contract";
import { rankRemediationCandidates } from "@/lib/features/formula-governance/full-tool-audit/remediation/remediation-priority-selector";
import type { RemediationAction, RemediationBatch } from "@/lib/features/formula-governance/full-tool-audit/remediation/remediation-types";
import type { BatchPatchPlanAuditResult } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";
import type { BatchTrustTraceAuditResult } from "@/lib/features/formula-governance/trust-trace-report/trust-trace-types";
import type { BatchTrustTraceExportAuditResult } from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";

export type BuildRemediationBatch1Params = {
  readonly fullToolAudit: FullExistingToolAuditResult;
  readonly patchPlanAudit: BatchPatchPlanAuditResult;
  readonly trustTraceAudit: BatchTrustTraceAuditResult;
  readonly exportAudit: BatchTrustTraceExportAuditResult;
  readonly sourceAuditTimestamp?: string;
};

function buildRemediationAction(
  candidate: ReturnType<typeof rankRemediationCandidates>["selected"][number],
): RemediationAction {
  const actionType = mapPatchTypeToRemediationAction(candidate.plan.patchType);

  return {
    slug: candidate.item.slug,
    actionType,
    reason: `${candidate.item.recommendedAction} with expected score lift ${candidate.scoreLift}`,
    expectedScoreLift: candidate.scoreLift,
    allowedFiles: getRemediationAllowedFiles(actionType),
    forbiddenFiles: [...REMEDIATION_FORBIDDEN_FILES],
    linkedPatchPlanId: candidate.plan.planId,
    riskLevel: candidate.plan.riskLevel,
    blockers: [...candidate.plan.blockers],
  };
}

export function buildRemediationBatch1(params: BuildRemediationBatch1Params): RemediationBatch {
  const { fullToolAudit, patchPlanAudit } = params;
  const ranking = rankRemediationCandidates(fullToolAudit.items, patchPlanAudit.plans, 8);
  const actions = ranking.selected.map((candidate) => buildRemediationAction(candidate));

  const blockers: string[] = [];
  const warnings: string[] = [];

  if (actions.length === 0) {
    blockers.push("No eligible tools found for remediation batch 1.");
  }

  const missingPatchPlans = actions.filter((action) => action.linkedPatchPlanId === null);
  if (missingPatchPlans.length > 0) {
    blockers.push(`${missingPatchPlans.length} action(s) missing linked patch plan.`);
  }

  const riskLevels = actions.map((action) => action.riskLevel);
  const batchRisk =
    riskLevels.includes("high") || riskLevels.includes("critical")
      ? "high"
      : riskLevels.includes("medium")
        ? "medium"
        : "low";

  const canRunAsMetadataOnly = actions.every(
    (action) =>
      action.actionType === "metadata_hygiene" ||
      action.actionType === "trust_trace_fix" ||
      action.actionType === "report_export_mapping",
  );

  let status: RemediationBatch["status"] = "remediation_batch_ready";
  if (blockers.length > 0) {
    status = actions.length === 0 ? "blocked" : "needs_patch_plan";
  } else if (actions.some((action) => action.actionType === "manual_review")) {
    status = "needs_manual_review";
  } else if (missingPatchPlans.length > 0) {
    status = "needs_patch_plan";
  }

  const totalLift = actions.reduce((sum, action) => sum + action.expectedScoreLift, 0);

  return {
    batchId: "remediation-batch-1",
    sourceAuditTimestamp: params.sourceAuditTimestamp ?? new Date().toISOString(),
    batchName: "Full Audit Remediation Batch 1",
    selectedTools: actions.map((action) => action.slug),
    excludedTools: ranking.excluded,
    actions,
    expectedImpact: `Estimated aggregate score lift ${totalLift} across ${actions.length} tool(s) without production calculator changes.`,
    requiredPatchPlans: actions
      .map((action) => action.linkedPatchPlanId)
      .filter((planId): planId is string => planId !== null),
    requiredTests: [
      "npm run test:formulas",
      "npm run audit:patch-plans",
      "npm run audit:remediation-batch1",
      "npm run audit:trust-trace-export",
    ],
    riskLevel: batchRisk,
    canRunAsMetadataOnly,
    canRunWithoutCalculatorChange: true,
    requiresHumanApproval: true,
    status,
    nextBatchCandidates: ranking.nextBatchCandidates,
    blockers,
    warnings,
  };
}

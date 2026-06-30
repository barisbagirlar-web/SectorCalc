/**
 * Remediation apply gate — Phase 5I-J no actual apply.
 */

import type { ControlledPatchDraft } from "@/lib/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-types";
import type { HumanApprovalRecord } from "@/lib/formula-governance/tool-factory-orchestrator/human-approval/human-approval-types";
import {
  isDraftEligibleForApplyBatch,
  REMEDIATION_APPLY_ALLOWED_OPERATIONS,
  REMEDIATION_APPLY_FORBIDDEN_OPERATIONS,
  validateDraftForApplyBatch,
} from "@/lib/formula-governance/full-tool-audit/remediation/apply-gate/remediation-apply-safety-policy";
import {
  resolveApplyGateApprovalStatus,
} from "@/lib/formula-governance/full-tool-audit/remediation/apply-gate/remediation-apply-approval";
import type { RemediationApplyGate } from "@/lib/formula-governance/full-tool-audit/remediation/apply-gate/remediation-apply-types";

export type BuildRemediationApplyGateParams = {
  readonly batchId: string;
  readonly patchDrafts: readonly ControlledPatchDraft[];
  readonly humanApproval: HumanApprovalRecord;
};

export function buildRemediationApplyGate(params: BuildRemediationApplyGateParams): RemediationApplyGate {
  const eligibleDrafts = params.patchDrafts.filter(isDraftEligibleForApplyBatch);
  const blockers: string[] = [];
  const warnings: string[] = [];

  for (const draft of params.patchDrafts) {
    blockers.push(...validateDraftForApplyBatch(draft));
  }

  const allDryRunReady = eligibleDrafts.every((draft) => draft.status === "dry_run_ready");
  if (!allDryRunReady && eligibleDrafts.length > 0) {
    warnings.push("Not all selected drafts are dry_run_ready.");
  }

  const approvalStatus = resolveApplyGateApprovalStatus(params.humanApproval);
  let status = approvalStatus;

  if (blockers.length > 0 || eligibleDrafts.length === 0) {
    status = "blocked";
  }

  const calculatorBlocked = params.patchDrafts.some((d) => d.calculatorImpact === "blocked");
  const routeBlocked = params.patchDrafts.some((d) => d.routeImpact === "blocked");
  const deployBlocked = params.patchDrafts.some((d) => d.deployImpact === "blocked");

  return {
    batchId: params.batchId,
    selectedPatchDrafts: eligibleDrafts,
    allDryRunReady,
    humanApprovalStatus: params.humanApproval.status,
    allowedOperations: [...REMEDIATION_APPLY_ALLOWED_OPERATIONS],
    forbiddenOperations: [...REMEDIATION_APPLY_FORBIDDEN_OPERATIONS],
    canApply: false,
    applyCommandGenerated: false,
    productionImpact: blockers.length > 0 ? "blocked" : "none",
    calculatorImpact: calculatorBlocked ? "blocked" : "none",
    routeImpact: routeBlocked ? "blocked" : "none",
    deployImpact: deployBlocked ? "blocked" : "none",
    blockers: [...new Set(blockers)],
    warnings,
    status,
  };
}

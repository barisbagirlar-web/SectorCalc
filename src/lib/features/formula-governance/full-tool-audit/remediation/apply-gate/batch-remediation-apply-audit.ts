/**
 * Batch remediation apply audit - Phase 5I-J read-only.
 */

import { FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts";
import { runFullExistingToolAudit } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-runner";
import { buildRemediationBatch1 } from "@/lib/features/formula-governance/full-tool-audit/remediation/remediation-batch-builder";
import { buildRemediationApplyGate } from "@/lib/features/formula-governance/full-tool-audit/remediation/apply-gate/remediation-apply-gate";
import type { BatchRemediationApplyAuditResult } from "@/lib/features/formula-governance/full-tool-audit/remediation/apply-gate/remediation-apply-types";
import { runBatchControlledPatchDraftAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/batch-controlled-patch-audit";
import { buildDefaultHumanApprovalRecord } from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/human-approval-record";
import { runBatchPatchPlanAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/batch-patch-plan-audit";
import { runBatchTrustTraceAudit } from "@/lib/features/formula-governance/trust-trace-report/batch-trust-trace-audit";
import { runBatchTrustTraceExportAudit } from "@/lib/features/formula-governance/trust-trace-report/export-contract/batch-trust-trace-export-audit";

export function runBatchRemediationApplyAudit(): BatchRemediationApplyAuditResult {
  const fullToolAudit = runFullExistingToolAudit(FORMULA_CONTRACTS);
  const patchPlanAudit = runBatchPatchPlanAudit(fullToolAudit);
  const controlledPatchAudit = runBatchControlledPatchDraftAudit(patchPlanAudit);
  const trustTraceAudit = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
  const exportAudit = runBatchTrustTraceExportAudit(trustTraceAudit.reports);

  const batch = buildRemediationBatch1({
    fullToolAudit,
    patchPlanAudit,
    trustTraceAudit,
    exportAudit,
  });

  const selectedDrafts = controlledPatchAudit.drafts.filter((draft) =>
    batch.selectedTools.includes(draft.slug),
  );

  const gate = buildRemediationApplyGate({
    batchId: batch.batchId,
    patchDrafts: selectedDrafts,
    humanApproval: buildDefaultHumanApprovalRecord({
      toolSlug: "remediation-batch-1",
      linkedPlanId: batch.batchId,
      approvalScope: "controlled_patch",
    }),
  });

  return {
    batchId: batch.batchId,
    totalSelectedDrafts: gate.selectedPatchDrafts.length,
    waitingHumanApproval: gate.status === "waiting_human_approval" ? 1 : 0,
    applyReadyButNotExecuted: gate.status === "apply_ready_but_not_executed" ? 1 : 0,
    blocked: gate.status === "blocked" ? 1 : 0,
    canApplyCount: gate.canApply ? 1 : 0,
    applyCommandGeneratedCount: gate.applyCommandGenerated ? 1 : 0,
    gate,
    blockers: gate.blockers,
    warnings: gate.warnings,
  };
}

export function formatBatchRemediationApplyReport(
  result: BatchRemediationApplyAuditResult,
): string {
  return [
    "Remediation Apply Gate Audit",
    `Batch: ${result.batchId}`,
    `Selected drafts: ${result.totalSelectedDrafts}`,
    `Status: ${result.gate.status}`,
    `Waiting human approval: ${result.waitingHumanApproval}`,
    `Apply ready (not executed): ${result.applyReadyButNotExecuted}`,
    `Blocked: ${result.blocked}`,
    `Can apply count: ${result.canApplyCount}`,
    `Apply command generated: ${result.applyCommandGeneratedCount}`,
  ].join("\n");
}

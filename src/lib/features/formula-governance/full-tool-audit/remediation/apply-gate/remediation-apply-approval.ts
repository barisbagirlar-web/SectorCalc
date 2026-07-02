/**
 * Remediation apply approval - Phase 5I-J human approval invariants.
 */

import type { HumanApprovalRecord } from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/human-approval-types";

export function canProceedWithApplyGate(approval: HumanApprovalRecord): boolean {
  return approval.status === "approved" && approval.approvalScope === "controlled_patch";
}

export function resolveApplyGateApprovalStatus(
  approval: HumanApprovalRecord,
): "waiting_human_approval" | "apply_ready_but_not_executed" | "blocked" {
  if (approval.status === "expired" || approval.status === "rejected" || approval.status === "blocked") {
    return "blocked";
  }
  if (approval.status === "approved" && approval.approvalScope === "controlled_patch") {
    return "apply_ready_but_not_executed";
  }
  return "waiting_human_approval";
}

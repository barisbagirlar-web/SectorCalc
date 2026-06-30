/**
 * Controlled patch approval gate — Phase 5I-E always requires approval.
 */

import type { ControlledPatchDraft } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-types";

export function buildControlledPatchApprovalFlags(): {
  readonly approvalRequired: true;
  readonly approvedToApply: false;
  readonly canApply: false;
} {
  return {
    approvalRequired: true,
    approvedToApply: false,
    canApply: false,
  };
}

export function validateApprovalInvariants(draft: ControlledPatchDraft): string[] {
  const blockers: string[] = [];

  if (!draft.approvalRequired) {
    blockers.push(`${draft.slug}: approvalRequired must remain true.`);
  }
  if (draft.approvedToApply) {
    blockers.push(`${draft.slug}: approvedToApply must remain false in dry-run phase.`);
  }
  if (draft.canApply) {
    blockers.push(`${draft.slug}: canApply must remain false.`);
  }
  if (draft.mode !== "dry_run") {
    blockers.push(`${draft.slug}: only dry_run mode is allowed in Phase 5I-E.`);
  }

  return blockers;
}

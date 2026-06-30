/**
 * Controlled patch draft types — Phase 5I-E dry-run only.
 */

import type { PatchPlanType } from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

export type ControlledPatchMode = "dry_run";

export type ControlledPatchOperationKind =
  | "create_file"
  | "update_file"
  | "append_export"
  | "add_test"
  | "add_metadata"
  | "add_fixture"
  | "no_op";

export type ControlledPatchOperation = {
  readonly kind: ControlledPatchOperationKind;
  readonly targetPath: string;
  readonly summary: string;
};

export type ControlledPatchImpact = "none" | "blocked";

export type ControlledPatchDraftStatus =
  | "dry_run_ready"
  | "needs_manual_approval"
  | "blocked";

export type ControlledPatchDraft = {
  readonly patchId: string;
  readonly sourcePatchPlanId: string;
  readonly slug: string;
  readonly patchType: PatchPlanType;
  readonly mode: ControlledPatchMode;
  readonly proposedFiles: readonly string[];
  readonly proposedOperations: readonly ControlledPatchOperation[];
  readonly allowedFiles: readonly string[];
  readonly forbiddenFiles: readonly string[];
  readonly expectedDiffSummary: string;
  readonly requiredTests: readonly string[];
  readonly approvalRequired: true;
  readonly approvedToApply: false;
  readonly canApply: false;
  readonly productionImpact: ControlledPatchImpact;
  readonly calculatorImpact: ControlledPatchImpact;
  readonly routeImpact: ControlledPatchImpact;
  readonly deployImpact: ControlledPatchImpact;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
  readonly status: ControlledPatchDraftStatus;
};

export type BatchControlledPatchDraftAuditResult = {
  readonly totalDrafts: number;
  readonly dryRunReady: number;
  readonly needsManualApproval: number;
  readonly blocked: number;
  readonly forbiddenFileViolations: number;
  readonly lowRiskDrafts: number;
  readonly topPatchDrafts: readonly string[];
  readonly canApplyCount: number;
  readonly drafts: readonly ControlledPatchDraft[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

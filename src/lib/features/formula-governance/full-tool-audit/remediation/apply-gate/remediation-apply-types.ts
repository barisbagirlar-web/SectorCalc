/**
 * Remediation apply gate types — Phase 5I-J (no actual apply).
 */

import type { ControlledPatchDraft } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-types";
import type { HumanApprovalStatus } from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/human-approval-types";

export type RemediationApplyGateStatus =
  | "waiting_human_approval"
  | "apply_ready_but_not_executed"
  | "blocked";

export type RemediationApplyImpact = "none" | "blocked";

export type RemediationApplyGate = {
  readonly batchId: string;
  readonly selectedPatchDrafts: readonly ControlledPatchDraft[];
  readonly allDryRunReady: boolean;
  readonly humanApprovalStatus: HumanApprovalStatus;
  readonly allowedOperations: readonly string[];
  readonly forbiddenOperations: readonly string[];
  readonly canApply: false;
  readonly applyCommandGenerated: false;
  readonly productionImpact: RemediationApplyImpact;
  readonly calculatorImpact: RemediationApplyImpact;
  readonly routeImpact: RemediationApplyImpact;
  readonly deployImpact: RemediationApplyImpact;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
  readonly status: RemediationApplyGateStatus;
};

export type BatchRemediationApplyAuditResult = {
  readonly batchId: string;
  readonly totalSelectedDrafts: number;
  readonly waitingHumanApproval: number;
  readonly applyReadyButNotExecuted: number;
  readonly blocked: number;
  readonly canApplyCount: number;
  readonly applyCommandGeneratedCount: number;
  readonly gate: RemediationApplyGate;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

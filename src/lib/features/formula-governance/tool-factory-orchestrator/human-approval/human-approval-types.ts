/**
 * Human approval types - Phase 5I-G gate only; no deploy execution.
 */

export type HumanApprovalScope =
  | "patch_plan"
  | "controlled_patch"
  | "report_contract"
  | "smart_form_rollout"
  | "production_deploy";

export type HumanApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "blocked";

export type HumanApprovalRecord = {
  readonly approvedBy: string | null;
  readonly approvedAt: string | null;
  readonly approvalScope: HumanApprovalScope;
  readonly linkedPlanId: string;
  readonly linkedPatchId: string | null;
  readonly linkedToolSlug: string;
  readonly allowedOperations: readonly string[];
  readonly forbiddenOperations: readonly string[];
  readonly expiresAt: string | null;
  readonly status: HumanApprovalStatus;
  readonly notes: string;
};

export type ToolFactoryDeployReadyStatus =
  | "deploy_ready"
  | "waiting_human_approval"
  | "blocked";

export type ToolFactoryDeployReadyGate = {
  readonly toolSlug: string;
  readonly patchPlanReady: boolean;
  readonly controlledPatchDryRunReady: boolean;
  readonly trustTraceReady: boolean;
  readonly reportRendererReady: boolean;
  readonly fullAuditPassed: boolean;
  readonly buildGatePassed: boolean;
  readonly secretGatePassed: boolean;
  readonly humanApprovalStatus: HumanApprovalStatus;
  readonly deployCommandAllowed: false;
  readonly deployReady: boolean;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
  readonly status: ToolFactoryDeployReadyStatus;
};

export type BatchDeployReadyAuditResult = {
  readonly totalTools: number;
  readonly deployReady: number;
  readonly waitingHumanApproval: number;
  readonly blocked: number;
  readonly commandAllowedCount: number;
  readonly topReadyCandidates: readonly string[];
  readonly topBlockedReasons: readonly string[];
  readonly gates: readonly ToolFactoryDeployReadyGate[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

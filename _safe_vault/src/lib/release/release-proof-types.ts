/**
 * Autonomous release gate proof types — deterministic SYSTEM_APPROVABLE / BLOCKED verdict.
 */

export type ReleaseGateStatus = "PASS" | "FAIL" | "SKIP";

export type ReleaseVerdict = "SYSTEM_APPROVABLE" | "BLOCKED";

export type ReleaseGateId =
  | "lint"
  | "test_formulas"
  | "build"
  | "audit_coverage"
  | "check_secrets"
  | "route_smoke"
  | "ssr_visible_404_check"
  | "formula_contract_count"
  | "full_loop_runtime_count"
  | "audit_pipeline_count"
  | "changed_files_allowlist"
  | "rollback_note";

export type ReleaseGateResult = {
  readonly id: ReleaseGateId;
  readonly label: string;
  readonly status: ReleaseGateStatus;
  readonly required: boolean;
  readonly detail?: string;
  readonly value?: number | string | boolean;
};

export type ReleaseCoverageMetrics = {
  readonly formulaContractCount: number;
  readonly fullLoopRuntimeCount: number;
  readonly auditPipelineCount: number;
  readonly stagedCalculationBridge: number;
  readonly governedBuildtimeOnly: number;
};

export type ReleaseProofThresholds = {
  readonly minFormulaContractCount: number;
  readonly minFullLoopRuntimeCount: number;
  readonly maxAuditPipelineCount: number;
};

export type ReleaseChangedFilesCheck = {
  readonly enabled: boolean;
  readonly changedFiles: readonly string[];
  readonly allowlist: readonly string[];
  readonly disallowedFiles: readonly string[];
};

export type ReleaseProofInput = {
  readonly generatedAt: string;
  readonly commitSha?: string;
  readonly rollbackNote?: string;
  readonly gates: readonly ReleaseGateResult[];
  readonly coverage: ReleaseCoverageMetrics;
  readonly changedFiles?: ReleaseChangedFilesCheck;
  readonly thresholds?: ReleaseProofThresholds;
};

export type ReleaseProofScore = {
  readonly proofScore: number;
  readonly maxScore: number;
  readonly passedRequiredGates: number;
  readonly totalRequiredGates: number;
  readonly failedGates: readonly ReleaseGateId[];
  readonly skippedOptionalGates: readonly ReleaseGateId[];
};

export type ReleaseProofResult = {
  readonly verdict: ReleaseVerdict;
  readonly score: ReleaseProofScore;
  readonly input: ReleaseProofInput;
  readonly blockers: readonly string[];
  readonly deployCommandAllowed: false;
};

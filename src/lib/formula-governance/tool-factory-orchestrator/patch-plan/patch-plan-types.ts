/**
 * Tool factory patch plan types — Phase 5I-B (plan only; no apply).
 */

import type { FullToolRecommendedAction } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-types";

export type PatchPlanType =
  | "metadata_only"
  | "fixture_ontology"
  | "input_design_patch"
  | "smart_form_patch"
  | "trust_trace_patch"
  | "report_export_contract"
  | "test_only_patch"
  | "blocked_manual_review";

export type PatchPlanRiskLevel = "low" | "medium" | "high" | "critical";

export type PatchPlanStatus =
  | "patch_plan_ready"
  | "needs_metadata"
  | "needs_fixture"
  | "needs_manual_review"
  | "blocked";

export type PatchPlanDiffContract = {
  readonly noProductionCalculatorChange: true;
  readonly noFormulaOutputChange: true;
  readonly noRouteChange: true;
  readonly noFirebaseChange: true;
  readonly noAuthPricingMailChange: true;
  readonly noDeployConfigChange: true;
  readonly testsRequired: readonly string[];
  readonly auditCommandsRequired: readonly string[];
};

export type PatchPlan = {
  readonly planId: string;
  readonly slug: string;
  readonly sourceAudit: "full_tool_audit";
  readonly targetPhase: string;
  readonly patchType: PatchPlanType;
  readonly allowedFiles: readonly string[];
  readonly forbiddenFiles: readonly string[];
  readonly expectedDiffContract: PatchPlanDiffContract;
  readonly requiredTests: readonly string[];
  readonly rollbackPlan: readonly string[];
  readonly riskLevel: PatchPlanRiskLevel;
  readonly canAutoGeneratePatch: boolean;
  readonly requiresHumanApproval: true;
  readonly canApplyWithoutHumanApproval: false;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
  readonly status: PatchPlanStatus;
  readonly sourceRecommendedAction: FullToolRecommendedAction;
};

export type BatchPatchPlanAuditResult = {
  readonly totalPlans: number;
  readonly patchPlanReady: number;
  readonly needsMetadata: number;
  readonly needsFixture: number;
  readonly manualReview: number;
  readonly blocked: number;
  readonly lowRiskPlans: number;
  readonly highRiskPlans: number;
  readonly top10PatchCandidates: readonly string[];
  readonly forbiddenFileViolations: readonly string[];
  readonly plans: readonly PatchPlan[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

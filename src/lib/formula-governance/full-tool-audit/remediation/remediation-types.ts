/**
 * Full audit remediation types — Phase 5I-D batch 1 planning only.
 */

import type { PatchPlanRiskLevel } from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

export type RemediationActionType =
  | "metadata_hygiene"
  | "fixture_ontology_add"
  | "input_design_upgrade"
  | "smart_form_rollout"
  | "trust_trace_fix"
  | "report_export_mapping"
  | "manual_review";

export type RemediationBatchStatus =
  | "remediation_batch_ready"
  | "needs_patch_plan"
  | "needs_manual_review"
  | "blocked";

export type RemediationAction = {
  readonly slug: string;
  readonly actionType: RemediationActionType;
  readonly reason: string;
  readonly expectedScoreLift: number;
  readonly allowedFiles: readonly string[];
  readonly forbiddenFiles: readonly string[];
  readonly linkedPatchPlanId: string | null;
  readonly riskLevel: PatchPlanRiskLevel;
  readonly blockers: readonly string[];
};

export type RemediationBatch = {
  readonly batchId: string;
  readonly sourceAuditTimestamp: string;
  readonly batchName: string;
  readonly selectedTools: readonly string[];
  readonly excludedTools: readonly { readonly slug: string; readonly reason: string }[];
  readonly actions: readonly RemediationAction[];
  readonly expectedImpact: string;
  readonly requiredPatchPlans: readonly string[];
  readonly requiredTests: readonly string[];
  readonly riskLevel: PatchPlanRiskLevel;
  readonly canRunAsMetadataOnly: boolean;
  readonly canRunWithoutCalculatorChange: true;
  readonly requiresHumanApproval: true;
  readonly status: RemediationBatchStatus;
  readonly nextBatchCandidates: readonly string[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

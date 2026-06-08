/**
 * Smart form pilot staging rollout decision gate — Phase 5H-G-L.
 */

import type { SmartFormPilotStagingRolloutApproval } from "@/components/tools/smart-form/pilot-staging-rollout-approval";
import type { SmartFormPilotQaDecisionResult } from "@/components/tools/smart-form/pilot-qa-decision-gate";

export type SmartFormPilotStagingRolloutGateStatus = "ready" | "blocked" | "pending";

export type SmartFormPilotStagingRolloutDecision = {
  readonly manualQaStatus: SmartFormPilotQaDecisionResult["manualQaStatus"];
  readonly stagingFlagReady: boolean;
  readonly humanApprovalStatus: SmartFormPilotStagingRolloutApproval["status"];
  readonly stagingRolloutReady: boolean;
  readonly deploymentReady: false;
  readonly rollbackRequired: boolean;
  readonly smokeTestRequired: boolean;
  readonly status: SmartFormPilotStagingRolloutGateStatus;
  readonly blockedReasons: readonly string[];
};

export type EvaluateSmartFormPilotStagingRolloutParams = {
  readonly qaDecision: SmartFormPilotQaDecisionResult;
  readonly approval: SmartFormPilotStagingRolloutApproval;
};

export function evaluateSmartFormPilotStagingRollout(
  params: EvaluateSmartFormPilotStagingRolloutParams,
): SmartFormPilotStagingRolloutDecision {
  const blockedReasons: string[] = [];

  if (!params.qaDecision.stagingFlagReady) {
    blockedReasons.push("Manual QA staging flag gate is not ready");
  }

  if (params.approval.status === "blocked") {
    blockedReasons.push("Human approval record is blocked");
  }

  if (params.approval.status === "pending_approval") {
    blockedReasons.push("Human approval is pending");
  }

  if (!params.approval.rollbackRequired) {
    blockedReasons.push("Rollback checklist is not required");
  }

  if (!params.approval.smokeTestRequired) {
    blockedReasons.push("Smoke test gate is not required");
  }

  const stagingRolloutReady =
    params.approval.status === "approved_for_staging" &&
    params.qaDecision.stagingFlagReady &&
    params.approval.rollbackRequired &&
    params.approval.smokeTestRequired;

  let status: SmartFormPilotStagingRolloutGateStatus = "blocked";
  if (stagingRolloutReady) {
    status = "ready";
  } else if (
    params.approval.status === "pending_approval" &&
    params.qaDecision.stagingFlagReady &&
    params.approval.rollbackRequired &&
    params.approval.smokeTestRequired
  ) {
    status = "pending";
  }

  return {
    manualQaStatus: params.qaDecision.manualQaStatus,
    stagingFlagReady: params.qaDecision.stagingFlagReady,
    humanApprovalStatus: params.approval.status,
    stagingRolloutReady,
    deploymentReady: false,
    rollbackRequired: params.approval.rollbackRequired,
    smokeTestRequired: params.approval.smokeTestRequired,
    status,
    blockedReasons,
  };
}

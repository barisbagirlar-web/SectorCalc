/**
 * Smart form pilot production deploy decision gate — Phase 5H-G-P.
 */

import type { SmartFormPilotProductionDeployApproval } from "@/components/tools/smart-form/pilot-production-deploy-approval";
import { isProductionDeployApprovalScope } from "@/components/tools/smart-form/pilot-production-deploy-approval";
import type { SmartFormPilotStagingSmokeTestGateDecision } from "@/components/tools/smart-form/pilot-staging-smoke-test-gate";

export type SmartFormPilotProductionDeployGateStatus = "ready" | "blocked" | "pending";

export type SmartFormPilotProductionDeployGateDecision = {
  readonly manualQaStatus: string;
  readonly stagingSmokePassed: boolean;
  readonly productionApprovalStatus: SmartFormPilotProductionDeployApproval["status"];
  readonly productionDeployApproved: boolean;
  readonly productionDeploymentReady: boolean;
  readonly rollbackRequired: boolean;
  readonly postDeploySmokeRequired: boolean;
  readonly monitoringRequired: boolean;
  readonly status: SmartFormPilotProductionDeployGateStatus;
  readonly blockedReasons: readonly string[];
};

export type EvaluateSmartFormPilotProductionDeployGateParams = {
  readonly stagingSmokeGate: SmartFormPilotStagingSmokeTestGateDecision;
  readonly approval: SmartFormPilotProductionDeployApproval;
};

export function evaluateSmartFormPilotProductionDeployGate(
  params: EvaluateSmartFormPilotProductionDeployGateParams,
): SmartFormPilotProductionDeployGateDecision {
  const blockedReasons: string[] = [];

  if (!isProductionDeployApprovalScope(params.approval.scope)) {
    blockedReasons.push("Approval scope is not production_deploy");
  }

  if (!params.stagingSmokeGate.stagingSmokePassed) {
    blockedReasons.push("Staging smoke has not passed");
  }

  if (params.approval.status === "blocked") {
    blockedReasons.push("Human approval record is blocked");
  }

  if (!params.approval.rollbackRequired) {
    blockedReasons.push("Rollback checklist is not required");
  }

  if (!params.approval.postDeploySmokeRequired) {
    blockedReasons.push("Post-deploy smoke test is not required");
  }

  if (!params.approval.monitoringRequired) {
    blockedReasons.push("Production monitoring is not required");
  }

  const productionDeploymentReady =
    params.approval.status === "approved_for_production" &&
    params.stagingSmokeGate.stagingSmokePassed &&
    isProductionDeployApprovalScope(params.approval.scope) &&
    params.approval.rollbackRequired &&
    params.approval.postDeploySmokeRequired &&
    params.approval.monitoringRequired &&
    blockedReasons.length === 0;

  const productionDeployApproved =
    params.approval.productionDeployApproved && productionDeploymentReady;

  let status: SmartFormPilotProductionDeployGateStatus = "blocked";
  if (productionDeploymentReady) {
    status = "ready";
  } else if (
    params.approval.status === "pending_approval" &&
    params.stagingSmokeGate.stagingSmokePassed &&
    isProductionDeployApprovalScope(params.approval.scope) &&
    params.approval.rollbackRequired &&
    params.approval.postDeploySmokeRequired &&
    params.approval.monitoringRequired &&
    blockedReasons.length === 0
  ) {
    status = "pending";
  }

  return {
    manualQaStatus: params.approval.manualQaStatus,
    stagingSmokePassed: params.stagingSmokeGate.stagingSmokePassed,
    productionApprovalStatus: params.approval.status,
    productionDeployApproved,
    productionDeploymentReady,
    rollbackRequired: params.approval.rollbackRequired,
    postDeploySmokeRequired: params.approval.postDeploySmokeRequired,
    monitoringRequired: params.approval.monitoringRequired,
    status,
    blockedReasons,
  };
}

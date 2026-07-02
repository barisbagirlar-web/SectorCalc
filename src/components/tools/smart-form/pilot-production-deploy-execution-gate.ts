/**
 * Smart form pilot production deploy execution gate - Phase 5H-G-R.
 */

import type { SmartFormPilotProductionDeployExecutionPlan } from "@/components/tools/smart-form/pilot-production-deploy-execution-plan";
import type { SmartFormPilotProductionDeployExecutionPlanStatus } from "@/components/tools/smart-form/pilot-production-deploy-execution-plan";
import type { SmartFormPilotProductionDeployGateDecision } from "@/components/tools/smart-form/pilot-production-deploy-gate";

export type SmartFormPilotProductionDeployExecutionGateDecision = {
  readonly deploymentReady: boolean;
  readonly productionDeployApproved: boolean;
  readonly executionStatus: SmartFormPilotProductionDeployExecutionPlanStatus;
  readonly requiresFinalHumanCommandApproval: boolean;
  readonly deployCommandExecuted: false;
  readonly deployCommand: string;
  readonly rollbackCommandReady: boolean;
  readonly requiresPostDeploySmoke: boolean;
  readonly requiresMonitoring: boolean;
  readonly blockedReasons: readonly string[];
};

export type EvaluateSmartFormPilotProductionDeployExecutionGateParams = {
  readonly productionDeployGate: SmartFormPilotProductionDeployGateDecision;
  readonly executionPlan: SmartFormPilotProductionDeployExecutionPlan;
};

function pushUniqueBlocker(blockers: string[], reason: string): void {
  if (!blockers.includes(reason)) {
    blockers.push(reason);
  }
}

export function evaluateSmartFormPilotProductionDeployExecutionGate(
  params: EvaluateSmartFormPilotProductionDeployExecutionGateParams,
): SmartFormPilotProductionDeployExecutionGateDecision {
  const blockedReasons: string[] = [...params.executionPlan.blockers];

  if (!params.productionDeployGate.productionDeploymentReady) {
    pushUniqueBlocker(blockedReasons, "Production deployment is not ready");
  }

  if (!params.productionDeployGate.productionDeployApproved) {
    pushUniqueBlocker(blockedReasons, "Production deploy is not approved");
  }

  if (!params.executionPlan.requiresFinalHumanCommandApproval) {
    pushUniqueBlocker(blockedReasons, "Final human command approval is not required");
  }

  if (!params.executionPlan.requiresPostDeploySmoke) {
    pushUniqueBlocker(blockedReasons, "Post-deploy smoke test is not required");
  }

  if (!params.executionPlan.requiresMonitoring) {
    pushUniqueBlocker(blockedReasons, "Production monitoring is not required");
  }

  const readyForCommand =
    params.productionDeployGate.productionDeploymentReady &&
    params.productionDeployGate.productionDeployApproved &&
    params.executionPlan.requiresFinalHumanCommandApproval &&
    params.executionPlan.requiresPostDeploySmoke &&
    params.executionPlan.requiresMonitoring &&
    blockedReasons.length === 0;

  const executionStatus: SmartFormPilotProductionDeployExecutionPlanStatus = readyForCommand
    ? "ready_for_final_command"
    : "blocked";

  return {
    deploymentReady: params.productionDeployGate.productionDeploymentReady,
    productionDeployApproved: params.productionDeployGate.productionDeployApproved,
    executionStatus,
    requiresFinalHumanCommandApproval: params.executionPlan.requiresFinalHumanCommandApproval,
    deployCommandExecuted: false,
    deployCommand: params.executionPlan.deployCommand,
    rollbackCommandReady: params.executionPlan.rollbackCommand.length > 0,
    requiresPostDeploySmoke: params.executionPlan.requiresPostDeploySmoke,
    requiresMonitoring: params.executionPlan.requiresMonitoring,
    blockedReasons,
  };
}

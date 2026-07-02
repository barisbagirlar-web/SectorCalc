/**
 * Smart form pilot production deploy execution plan - Phase 5H-G-R.
 */

import type { SmartFormPilotProductionDeployGateDecision } from "@/components/tools/smart-form/pilot-production-deploy-gate";
import { buildSmartFormPilotProductionRollbackChecklist } from "@/components/tools/smart-form/pilot-production-rollback-checklist";
import { SMART_FORM_PILOT_STAGING_FLAG_NAME } from "@/components/tools/smart-form/pilot-staging-rollout-approval";

export type SmartFormPilotProductionDeployExecutionPlanStatus =
  | "ready_for_final_command"
  | "blocked";

export type SmartFormPilotProductionDeployExecutionPlan = {
  readonly deploymentReady: boolean;
  readonly productionDeployApproved: boolean;
  readonly flagName: typeof SMART_FORM_PILOT_STAGING_FLAG_NAME;
  readonly targetFlagValue: "true";
  readonly hostingTarget: "production";
  readonly deployCommand: string;
  readonly rollbackCommand: string;
  readonly requiresFinalHumanCommandApproval: boolean;
  readonly requiresPostDeploySmoke: boolean;
  readonly requiresMonitoring: boolean;
  readonly pilotRoutes: readonly string[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
  readonly status: SmartFormPilotProductionDeployExecutionPlanStatus;
};

export const SMART_FORM_PILOT_PRODUCTION_DEPLOY_COMMAND =
  `${SMART_FORM_PILOT_STAGING_FLAG_NAME}=true npm run build && firebase deploy --only hosting` as const;

export const SMART_FORM_PILOT_PRODUCTION_ROLLBACK_COMMAND =
  `${SMART_FORM_PILOT_STAGING_FLAG_NAME}=false npm run build && firebase deploy --only hosting` as const;

export function buildSmartFormPilotProductionDeployExecutionPlan(
  productionDeployGate: SmartFormPilotProductionDeployGateDecision,
): SmartFormPilotProductionDeployExecutionPlan {
  const rollbackChecklist = buildSmartFormPilotProductionRollbackChecklist();
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!productionDeployGate.productionDeploymentReady) {
    blockers.push("Production deployment is not ready");
  }

  if (!productionDeployGate.productionDeployApproved) {
    blockers.push("Production deploy is not approved");
  }

  const requiresFinalHumanCommandApproval = true;
  const requiresPostDeploySmoke = productionDeployGate.postDeploySmokeRequired;
  const requiresMonitoring = productionDeployGate.monitoringRequired;

  if (!requiresPostDeploySmoke) {
    blockers.push("Post-deploy smoke test is not required");
  }

  if (!requiresMonitoring) {
    blockers.push("Production monitoring is not required");
  }

  const status: SmartFormPilotProductionDeployExecutionPlanStatus =
    blockers.length === 0 ? "ready_for_final_command" : "blocked";

  if (status === "ready_for_final_command") {
    warnings.push(
      "Deploy command generated but not executed - final human command approval required",
    );
  }

  return {
    deploymentReady: productionDeployGate.productionDeploymentReady,
    productionDeployApproved: productionDeployGate.productionDeployApproved,
    flagName: SMART_FORM_PILOT_STAGING_FLAG_NAME,
    targetFlagValue: "true",
    hostingTarget: "production",
    deployCommand: SMART_FORM_PILOT_PRODUCTION_DEPLOY_COMMAND,
    rollbackCommand: SMART_FORM_PILOT_PRODUCTION_ROLLBACK_COMMAND,
    requiresFinalHumanCommandApproval,
    requiresPostDeploySmoke,
    requiresMonitoring,
    pilotRoutes: rollbackChecklist.pilotRoutes,
    blockers,
    warnings,
    status,
  };
}

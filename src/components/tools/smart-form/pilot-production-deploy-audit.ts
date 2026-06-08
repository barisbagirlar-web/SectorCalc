/**
 * Smart form pilot production deploy audit — Phase 5H-G-P.
 */

import {
  getDefaultSmartFormPilotProductionDeployApproval,
  type SmartFormPilotProductionDeployApproval,
} from "@/components/tools/smart-form/pilot-production-deploy-approval";
import {
  evaluateSmartFormPilotProductionDeployGate,
  type SmartFormPilotProductionDeployGateDecision,
} from "@/components/tools/smart-form/pilot-production-deploy-gate";
import { buildSmartFormPilotProductionRollbackChecklist } from "@/components/tools/smart-form/pilot-production-rollback-checklist";
import { getSmartFormPilotPostDeploySmokeTestResults } from "@/components/tools/smart-form/pilot-post-deploy-smoke-test";
import {
  evaluateSmartFormPilotStagingSmokeTestGate,
} from "@/components/tools/smart-form/pilot-staging-smoke-test-gate";
import { getSmartFormPilotStagingSmokeTestResults } from "@/components/tools/smart-form/pilot-staging-smoke-test-result";

export type SmartFormPilotProductionDeployAuditResult = {
  readonly approval: SmartFormPilotProductionDeployApproval;
  readonly deployDecision: SmartFormPilotProductionDeployGateDecision;
  readonly rollbackChecklistRouteCount: number;
  readonly postDeploySmokePendingCount: number;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export function runSmartFormPilotProductionDeployAudit(
  approval: SmartFormPilotProductionDeployApproval = getDefaultSmartFormPilotProductionDeployApproval(),
): SmartFormPilotProductionDeployAuditResult {
  const smokeResults = getSmartFormPilotStagingSmokeTestResults();
  const stagingSmokeGate = evaluateSmartFormPilotStagingSmokeTestGate(smokeResults.results);
  const deployDecision = evaluateSmartFormPilotProductionDeployGate({
    stagingSmokeGate,
    approval,
  });
  const rollbackChecklist = buildSmartFormPilotProductionRollbackChecklist();
  const postDeploySmoke = getSmartFormPilotPostDeploySmokeTestResults();

  const warnings: string[] = [];
  const blockers: string[] = [];

  if (deployDecision.status === "pending") {
    warnings.push("Production deploy approval is pending explicit human sign-off");
  }

  if (deployDecision.blockedReasons.length > 0 && !deployDecision.productionDeploymentReady) {
    if (deployDecision.status === "blocked") {
      blockers.push(...deployDecision.blockedReasons);
    } else {
      warnings.push(...deployDecision.blockedReasons);
    }
  }

  if (rollbackChecklist.pilotRoutes.length !== 3) {
    blockers.push(
      `Expected 3 production rollback pilot routes, found ${rollbackChecklist.pilotRoutes.length}`,
    );
  }

  if (postDeploySmoke.aggregateStatus === "pending_post_deploy_smoke") {
    warnings.push("Post-deploy smoke tests are pending after production rollout");
  }

  return {
    approval,
    deployDecision,
    rollbackChecklistRouteCount: rollbackChecklist.pilotRoutes.length,
    postDeploySmokePendingCount: postDeploySmoke.results.filter(
      (result) => result.status === "pending_post_deploy_smoke",
    ).length,
    warnings,
    blockers,
  };
}

export function formatSmartFormPilotProductionDeployReport(
  result: SmartFormPilotProductionDeployAuditResult,
): string {
  const decision = result.deployDecision;
  const lines = [
    "Smart Form Production Deploy Gate",
    `Manual QA status: ${decision.manualQaStatus}`,
    `Staging smoke passed: ${decision.stagingSmokePassed}`,
    `Production approval: ${decision.productionApprovalStatus}`,
    `Production deployment ready: ${decision.productionDeploymentReady}`,
    `Production deploy approved: ${decision.productionDeployApproved}`,
    `Rollback required: ${decision.rollbackRequired}`,
    `Post-deploy smoke required: ${decision.postDeploySmokeRequired}`,
    `Monitoring required: ${decision.monitoringRequired}`,
    `Blockers: ${result.blockers.length}`,
    "",
    "Production rollback pilot routes:",
    ...buildSmartFormPilotProductionRollbackChecklist().pilotRoutes.map((route) => `- ${route}`),
  ];

  if (result.warnings.length > 0) {
    lines.push("", "Warnings:");
    for (const warning of result.warnings) {
      lines.push(`- ${warning}`);
    }
  }

  if (result.blockers.length > 0) {
    lines.push("", "Blockers:");
    for (const blocker of result.blockers) {
      lines.push(`- ${blocker}`);
    }
  }

  return lines.join("\n");
}

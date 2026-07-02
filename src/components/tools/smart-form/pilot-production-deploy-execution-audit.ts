/**
 * Smart form pilot production deploy execution audit - Phase 5H-G-R.
 */

import {
  buildSmartFormPilotProductionDeployExecutionPlan,
  type SmartFormPilotProductionDeployExecutionPlan,
} from "@/components/tools/smart-form/pilot-production-deploy-execution-plan";
import {
  evaluateSmartFormPilotProductionDeployExecutionGate,
  type SmartFormPilotProductionDeployExecutionGateDecision,
} from "@/components/tools/smart-form/pilot-production-deploy-execution-gate";
import {
  runSmartFormPilotProductionDeployAudit,
  type SmartFormPilotProductionDeployAuditResult,
} from "@/components/tools/smart-form/pilot-production-deploy-audit";
import {
  buildSmartFormPilotProductionFinalCommandChecklist,
  type SmartFormPilotProductionFinalCommandChecklist,
} from "@/components/tools/smart-form/pilot-production-final-command-checklist";

export type SmartFormPilotProductionDeployExecutionAuditResult = {
  readonly deployAudit: SmartFormPilotProductionDeployAuditResult;
  readonly executionPlan: SmartFormPilotProductionDeployExecutionPlan;
  readonly executionGate: SmartFormPilotProductionDeployExecutionGateDecision;
  readonly finalCommandChecklist: SmartFormPilotProductionFinalCommandChecklist;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export function runSmartFormPilotProductionDeployExecutionAudit(): SmartFormPilotProductionDeployExecutionAuditResult {
  const deployAudit = runSmartFormPilotProductionDeployAudit();
  const executionPlan = buildSmartFormPilotProductionDeployExecutionPlan(deployAudit.deployDecision);
  const executionGate = evaluateSmartFormPilotProductionDeployExecutionGate({
    productionDeployGate: deployAudit.deployDecision,
    executionPlan,
  });
  const finalCommandChecklist = buildSmartFormPilotProductionFinalCommandChecklist();

  const warnings = [...new Set(executionPlan.warnings)];
  if (deployAudit.productionSmartFormLive) {
    const liveWarningIndex = warnings.findIndex((warning) =>
      warning.includes("Deploy command generated but not executed"),
    );
    if (liveWarningIndex >= 0) {
      warnings.splice(liveWarningIndex, 1);
    }
  }
  const blockers = [...new Set([...executionGate.blockedReasons, ...deployAudit.blockers])];

  if (finalCommandChecklist.pilotRoutes.length !== 3) {
    blockers.push(
      `Expected 3 post-deploy smoke pilot routes, found ${finalCommandChecklist.pilotRoutes.length}`,
    );
  }

  return {
    deployAudit,
    executionPlan,
    executionGate,
    finalCommandChecklist,
    blockers,
    warnings,
  };
}

export function formatSmartFormPilotProductionDeployExecutionReport(
  result: SmartFormPilotProductionDeployExecutionAuditResult,
): string {
  const gate = result.executionGate;
  const deployAudit = result.deployAudit;
  const productionLive = deployAudit.productionSmartFormLive;
  const executionStatus = productionLive ? "deployed_live" : gate.executionStatus;
  const deployCommandStatus = productionLive ? "EXECUTED" : "NOT EXECUTED";
  const rollbackStatus = productionLive ? "STANDBY" : "READY";

  const lines = [
    "Smart Form Production Execution Gate",
    `Production deployment ready: ${gate.deploymentReady}`,
    `Production deploy approved: ${gate.productionDeployApproved}`,
    `Execution status: ${executionStatus}`,
    `Final human command approval required: ${gate.requiresFinalHumanCommandApproval}`,
    `Deploy command: ${deployCommandStatus}`,
    `Rollback command: ${rollbackStatus}`,
    `Post-deploy smoke required: ${gate.requiresPostDeploySmoke}`,
    `Post-deploy smoke status: ${deployAudit.postDeploySmokeStatus}`,
    `Production smart form live: ${deployAudit.productionSmartFormLive}`,
    `Monitoring required: ${gate.requiresMonitoring}`,
    "",
    productionLive ? "Deploy command (executed):" : "Deploy command (not executed):",
    `- ${gate.deployCommand}`,
    "",
    "Rollback command:",
    `- ${result.executionPlan.rollbackCommand}`,
    "",
    "Post-deploy smoke pilot routes:",
    ...result.finalCommandChecklist.pilotRoutes.map((route) => `- ${route}`),
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

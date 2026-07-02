/**
 * Smart form pilot staging rollout audit - Phase 5H-G-L.
 */

import { getProductionDeployedManualQaResults } from "@/components/tools/smart-form/pilot-manual-qa-result";
import { evaluateSmartFormPilotQaDecision } from "@/components/tools/smart-form/pilot-qa-decision-gate";
import { buildSmartFormPilotRolloutRollbackChecklist } from "@/components/tools/smart-form/pilot-rollout-checklist";
import {
  getDefaultSmartFormPilotStagingRolloutApproval,
  type SmartFormPilotStagingRolloutApproval,
} from "@/components/tools/smart-form/pilot-staging-rollout-approval";
import {
  evaluateSmartFormPilotStagingRollout,
  type SmartFormPilotStagingRolloutDecision,
} from "@/components/tools/smart-form/pilot-staging-rollout-gate";

export type SmartFormPilotStagingRolloutAuditResult = {
  readonly approval: SmartFormPilotStagingRolloutApproval;
  readonly rolloutDecision: SmartFormPilotStagingRolloutDecision;
  readonly rollbackChecklistRouteCount: number;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export function runSmartFormPilotStagingRolloutAudit(
  approval: SmartFormPilotStagingRolloutApproval = getDefaultSmartFormPilotStagingRolloutApproval(),
): SmartFormPilotStagingRolloutAuditResult {
  const manualQaResults = getProductionDeployedManualQaResults().results;
  const qaDecision = evaluateSmartFormPilotQaDecision(manualQaResults);
  const rolloutDecision = evaluateSmartFormPilotStagingRollout({
    qaDecision,
    approval,
  });
  const rollbackChecklist = buildSmartFormPilotRolloutRollbackChecklist();

  const warnings: string[] = [];
  const blockers: string[] = [];

  if (rolloutDecision.blockedReasons.length > 0 && !rolloutDecision.stagingRolloutReady) {
    warnings.push(...rolloutDecision.blockedReasons);
  }

  if (!qaDecision.stagingFlagReady) {
    blockers.push("Staging flag QA gate is not ready");
  }

  if (rollbackChecklist.pilotRoutes.length !== 3) {
    blockers.push(`Expected 3 rollback pilot routes, found ${rollbackChecklist.pilotRoutes.length}`);
  }

  return {
    approval,
    rolloutDecision,
    rollbackChecklistRouteCount: rollbackChecklist.pilotRoutes.length,
    warnings,
    blockers,
  };
}

export function formatSmartFormPilotStagingRolloutReport(
  result: SmartFormPilotStagingRolloutAuditResult,
): string {
  const decision = result.rolloutDecision;
  const lines = [
    "Smart Form Staging Rollout Gate",
    `Manual QA status: ${decision.manualQaStatus}`,
    `Staging flag ready: ${decision.stagingFlagReady}`,
    `Human approval: ${decision.humanApprovalStatus}`,
    `Staging rollout ready: ${decision.stagingRolloutReady}`,
    `Deployment ready: ${decision.deploymentReady}`,
    `Rollback required: ${decision.rollbackRequired}`,
    `Smoke test required: ${decision.smokeTestRequired}`,
    `Blockers: ${result.blockers.length}`,
    "",
    "Rollback pilot routes:",
    ...buildSmartFormPilotRolloutRollbackChecklist().pilotRoutes.map((route) => `- ${route}`),
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

/**
 * Smart form pilot post-deploy smoke test audit — Phase 5H-G-S-POSTSMOKE.
 */

import {
  evaluateSmartFormPilotPostDeploySmokeTestGate,
  type SmartFormPilotPostDeploySmokeTestGateDecision,
} from "@/components/tools/smart-form/pilot-post-deploy-smoke-test-gate";
import {
  getSmartFormPilotPostDeploySmokeTestResults,
  type SmartFormPilotPostDeploySmokeTestResultSet,
} from "@/components/tools/smart-form/pilot-post-deploy-smoke-test";

export type SmartFormPilotPostDeploySmokeTestAuditResult = {
  readonly smokeTestResults: SmartFormPilotPostDeploySmokeTestResultSet;
  readonly smokeTestDecision: SmartFormPilotPostDeploySmokeTestGateDecision;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export function runSmartFormPilotPostDeploySmokeTestAudit(
  smokeTestResults: SmartFormPilotPostDeploySmokeTestResultSet = getSmartFormPilotPostDeploySmokeTestResults(),
): SmartFormPilotPostDeploySmokeTestAuditResult {
  const smokeTestDecision = evaluateSmartFormPilotPostDeploySmokeTestGate(smokeTestResults.results);

  const warnings: string[] = [];
  const blockers: string[] = [];

  if (smokeTestDecision.postDeploySmokeStatus === "pending_post_deploy_smoke") {
    warnings.push("Post-deploy smoke tests are pending after production rollout");
  }

  if (smokeTestDecision.blockedReasons.length > 0) {
    blockers.push(...smokeTestDecision.blockedReasons);
  }

  if (smokeTestResults.results.length !== 3) {
    blockers.push(
      `Expected 3 post-deploy smoke pilot routes, found ${smokeTestResults.results.length}`,
    );
  }

  return {
    smokeTestResults,
    smokeTestDecision,
    warnings,
    blockers,
  };
}

export function formatSmartFormPilotPostDeploySmokeTestReport(
  result: SmartFormPilotPostDeploySmokeTestAuditResult,
): string {
  const { smokeTestDecision, smokeTestResults } = result;
  const lines = [
    "Smart Form Post-Deploy Smoke Test Gate",
    `Post-deploy smoke status: ${smokeTestDecision.postDeploySmokeStatus}`,
    `Production smart form live: ${smokeTestDecision.productionSmartFormLive}`,
    `Rollback required: ${smokeTestDecision.rollbackRequired}`,
    `Blockers: ${result.blockers.length}`,
    "",
    "Production smoke URLs:",
    ...smokeTestResults.results.map((entry) => `- ${entry.productionUrl}`),
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

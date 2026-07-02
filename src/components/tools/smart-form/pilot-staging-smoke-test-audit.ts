/**
 * Smart form pilot staging smoke test audit - Phase 5H-G-N.
 */

import { buildSmartFormPilotStagingFlagPlan } from "@/components/tools/smart-form/pilot-staging-flag-plan";
import {
  evaluateSmartFormPilotStagingSmokeTestGate,
  type SmartFormPilotStagingSmokeTestGateDecision,
} from "@/components/tools/smart-form/pilot-staging-smoke-test-gate";
import {
  getSmartFormPilotStagingSmokeTestResults,
  type SmartFormPilotSmokeTestResultSet,
} from "@/components/tools/smart-form/pilot-staging-smoke-test-result";

export type SmartFormPilotStagingSmokeTestAuditResult = {
  readonly flagPlan: ReturnType<typeof buildSmartFormPilotStagingFlagPlan>;
  readonly smokeTestResults: SmartFormPilotSmokeTestResultSet;
  readonly smokeTestDecision: SmartFormPilotStagingSmokeTestGateDecision;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export function runSmartFormPilotStagingSmokeTestAudit(
  smokeTestResults: SmartFormPilotSmokeTestResultSet = getSmartFormPilotStagingSmokeTestResults(),
): SmartFormPilotStagingSmokeTestAuditResult {
  const flagPlan = buildSmartFormPilotStagingFlagPlan();
  const smokeTestDecision = evaluateSmartFormPilotStagingSmokeTestGate(smokeTestResults.results);

  const warnings: string[] = [];
  const blockers: string[] = [];

  if (flagPlan.status === "blocked") {
    blockers.push("Staging flag plan is blocked");
  }

  if (!flagPlan.approvedForStaging) {
    blockers.push("Staging flag is not approved for staging");
  }

  if (flagPlan.productionDeployApproved) {
    blockers.push("Production deploy must remain unapproved");
  }

  if (smokeTestDecision.smokeTestStatus === "pending_smoke_test") {
    warnings.push("Smoke tests are pending execution on staging");
  }

  if (smokeTestDecision.blockedReasons.length > 0) {
    blockers.push(...smokeTestDecision.blockedReasons);
  }

  return {
    flagPlan,
    smokeTestResults,
    smokeTestDecision,
    warnings,
    blockers,
  };
}

export function formatSmartFormPilotStagingSmokeTestReport(
  result: SmartFormPilotStagingSmokeTestAuditResult,
): string {
  const { flagPlan, smokeTestDecision } = result;
  const lines = [
    "Smart Form Staging Smoke Test Gate",
    `Flag: ${flagPlan.flagName}=${flagPlan.targetValue}`,
    `Scope: ${flagPlan.scope}`,
    `Approved for staging: ${flagPlan.approvedForStaging}`,
    `Production deploy approved: ${flagPlan.productionDeployApproved}`,
    `Smoke test status: ${smokeTestDecision.smokeTestStatus}`,
    `Staging smoke passed: ${smokeTestDecision.stagingSmokePassed}`,
    `Production deployment ready: ${smokeTestDecision.productionDeploymentReady}`,
    "",
    "Pilot smoke URLs:",
    ...flagPlan.pilotRoutes.map((route) => `- ${route}`),
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

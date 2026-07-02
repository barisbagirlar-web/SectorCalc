/**
 * Smart form pilot staging smoke test decision gate - Phase 5H-G-N.
 */

import type {
  SmartFormPilotSmokeTestResult,
  SmartFormPilotSmokeTestStatus,
} from "@/components/tools/smart-form/pilot-staging-smoke-test-result";

export type SmartFormPilotStagingSmokeTestGateStatus =
  | "passed"
  | "pending"
  | "needs_fix"
  | "blocked";

export type SmartFormPilotStagingSmokeTestGateDecision = {
  readonly smokeTestStatus: SmartFormPilotSmokeTestStatus;
  readonly stagingSmokePassed: boolean;
  readonly productionDeploymentReady: false;
  readonly status: SmartFormPilotStagingSmokeTestGateStatus;
  readonly blockedReasons: readonly string[];
};

function deriveAggregateStatus(
  results: readonly SmartFormPilotSmokeTestResult[],
): SmartFormPilotSmokeTestStatus {
  if (results.some((result) => result.status === "blocked")) {
    return "blocked";
  }
  if (results.some((result) => result.status === "needs_fix")) {
    return "needs_fix";
  }
  if (results.every((result) => result.status === "passed")) {
    return "passed";
  }
  return "pending_smoke_test";
}

function deriveGateStatus(
  aggregateStatus: SmartFormPilotSmokeTestStatus,
  blockedReasons: readonly string[],
): SmartFormPilotStagingSmokeTestGateStatus {
  if (blockedReasons.length > 0 || aggregateStatus === "blocked") {
    return "blocked";
  }
  if (aggregateStatus === "needs_fix") {
    return "needs_fix";
  }
  if (aggregateStatus === "passed") {
    return "passed";
  }
  return "pending";
}

export function evaluateSmartFormPilotStagingSmokeTestGate(
  results: readonly SmartFormPilotSmokeTestResult[],
): SmartFormPilotStagingSmokeTestGateDecision {
  const blockedReasons: string[] = [];

  for (const result of results) {
    if (result.status === "pending_smoke_test") {
      continue;
    }

    if (!result.consoleClean) {
      blockedReasons.push(`${result.route}: console is not clean`);
    }
    if (!result.networkClean) {
      blockedReasons.push(`${result.route}: network is not clean`);
    }
    if (!result.calculationSubmitPassed) {
      blockedReasons.push(`${result.route}: calculation submit failed`);
    }
    if (!result.resultCardVerified) {
      blockedReasons.push(`${result.route}: result card verification failed`);
    }
  }

  const aggregateStatus = deriveAggregateStatus(results);
  const stagingSmokePassed =
    aggregateStatus === "passed" &&
    results.length > 0 &&
    results.every((result) => result.status === "passed") &&
    blockedReasons.length === 0;

  return {
    smokeTestStatus: aggregateStatus,
    stagingSmokePassed,
    productionDeploymentReady: false,
    status: deriveGateStatus(aggregateStatus, blockedReasons),
    blockedReasons,
  };
}

/**
 * Smart form pilot post-deploy smoke test decision gate — Phase 5H-G-S-POSTSMOKE.
 */

import type {
  SmartFormPilotPostDeploySmokeTestResult,
  SmartFormPilotPostDeploySmokeTestStatus,
} from "@/components/tools/smart-form/pilot-post-deploy-smoke-test";

export type SmartFormPilotPostDeploySmokeTestGateStatus =
  | "passed"
  | "pending"
  | "needs_fix"
  | "blocked";

export type SmartFormPilotPostDeploySmokeTestGateDecision = {
  readonly postDeploySmokeStatus: SmartFormPilotPostDeploySmokeTestStatus;
  readonly productionSmartFormLive: boolean;
  readonly rollbackRequired: boolean;
  readonly status: SmartFormPilotPostDeploySmokeTestGateStatus;
  readonly blockedReasons: readonly string[];
};

function deriveAggregateStatus(
  results: readonly SmartFormPilotPostDeploySmokeTestResult[],
): SmartFormPilotPostDeploySmokeTestStatus {
  if (results.some((result) => result.status === "blocked")) {
    return "blocked";
  }
  if (results.some((result) => result.status === "needs_fix")) {
    return "needs_fix";
  }
  if (results.every((result) => result.status === "passed")) {
    return "passed";
  }
  return "pending_post_deploy_smoke";
}

function deriveGateStatus(
  aggregateStatus: SmartFormPilotPostDeploySmokeTestStatus,
  blockedReasons: readonly string[],
): SmartFormPilotPostDeploySmokeTestGateStatus {
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

export function evaluateSmartFormPilotPostDeploySmokeTestGate(
  results: readonly SmartFormPilotPostDeploySmokeTestResult[],
): SmartFormPilotPostDeploySmokeTestGateDecision {
  const blockedReasons: string[] = [];

  for (const result of results) {
    if (result.status === "pending_post_deploy_smoke") {
      continue;
    }

    if (!result.desktopPassed) {
      blockedReasons.push(`${result.route}: desktop smoke failed`);
    }
    if (!result.mobilePassed) {
      blockedReasons.push(`${result.route}: mobile smoke failed`);
    }
    if (!result.consoleClean) {
      blockedReasons.push(`${result.route}: console is not clean`);
    }
    if (!result.networkClean) {
      blockedReasons.push(`${result.route}: network is not clean`);
    }
    if (!result.smartFormVisible) {
      blockedReasons.push(`${result.route}: smart form is not visible`);
    }
    if (!result.calculationSubmitPassed) {
      blockedReasons.push(`${result.route}: calculation submit failed`);
    }
    if (!result.resultCardVerified) {
      blockedReasons.push(`${result.route}: result card verification failed`);
    }
    if (!result.analyticsShapeVerified) {
      blockedReasons.push(`${result.route}: analytics shape verification failed`);
    }
  }

  const postDeploySmokeStatus = deriveAggregateStatus(results);
  const productionSmartFormLive =
    postDeploySmokeStatus === "passed" &&
    results.length > 0 &&
    results.every((result) => result.status === "passed") &&
    blockedReasons.length === 0;

  return {
    postDeploySmokeStatus,
    productionSmartFormLive,
    rollbackRequired: !productionSmartFormLive,
    status: deriveGateStatus(postDeploySmokeStatus, blockedReasons),
    blockedReasons,
  };
}

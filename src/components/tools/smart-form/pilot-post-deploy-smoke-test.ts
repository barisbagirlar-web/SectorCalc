/**
 * Smart form pilot post-deploy smoke test records — Phase 5H-G-P.
 */

import { siteUrl } from "@/config/site";
import { getSmartFormPilotBatchRegistry } from "@/components/tools/smart-form/pilot-batch-qa-registry";

export type SmartFormPilotPostDeploySmokeTestStatus =
  | "pending_post_deploy_smoke"
  | "passed"
  | "needs_fix"
  | "blocked";

export type SmartFormPilotPostDeploySmokeTestResult = {
  readonly route: string;
  readonly productionUrl: string;
  readonly desktopPassed: boolean;
  readonly mobilePassed: boolean;
  readonly consoleClean: boolean;
  readonly networkClean: boolean;
  readonly smartFormVisible: boolean;
  readonly calculationSubmitPassed: boolean;
  readonly resultCardVerified: boolean;
  readonly fallbackFlagOffVerified: boolean;
  readonly analyticsShapeVerified: boolean;
  readonly status: SmartFormPilotPostDeploySmokeTestStatus;
};

export type SmartFormPilotPostDeploySmokeTestResultSet = {
  readonly results: readonly SmartFormPilotPostDeploySmokeTestResult[];
  readonly aggregateStatus: SmartFormPilotPostDeploySmokeTestStatus;
};

function buildPendingPostDeploySmokeTestResult(route: string): SmartFormPilotPostDeploySmokeTestResult {
  return {
    route,
    productionUrl: `${siteUrl}${route}`,
    desktopPassed: false,
    mobilePassed: false,
    consoleClean: false,
    networkClean: false,
    smartFormVisible: false,
    calculationSubmitPassed: false,
    resultCardVerified: false,
    fallbackFlagOffVerified: false,
    analyticsShapeVerified: false,
    status: "pending_post_deploy_smoke",
  };
}

export function buildDefaultPendingPostDeploySmokeTestResults(): SmartFormPilotPostDeploySmokeTestResultSet {
  const results = getSmartFormPilotBatchRegistry().map((entry) =>
    buildPendingPostDeploySmokeTestResult(entry.manualQaUrl),
  );

  return {
    results,
    aggregateStatus: "pending_post_deploy_smoke",
  };
}

export function getSmartFormPilotPostDeploySmokeTestResults(): SmartFormPilotPostDeploySmokeTestResultSet {
  return buildDefaultPendingPostDeploySmokeTestResults();
}

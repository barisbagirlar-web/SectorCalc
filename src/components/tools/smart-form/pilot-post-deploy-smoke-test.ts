/**
 * Smart form pilot post-deploy smoke test records — Phase 5H-G-S-POSTSMOKE.
 */

import { siteUrl } from "@/config/site";
import { ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS } from "@/components/tools/smart-form/rollout-batch-h-catalog";

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
  readonly notes: string;
};

export type SmartFormPilotPostDeploySmokeTestResultSet = {
  readonly results: readonly SmartFormPilotPostDeploySmokeTestResult[];
  readonly aggregateStatus: SmartFormPilotPostDeploySmokeTestStatus;
};

export const POST_DEPLOY_SMOKE_PASSED_NOTES =
  "Production post-deploy smoke passed after Firebase Hosting deploy with NEXT_PUBLIC_SMART_FORM_PILOT=true." as const;

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
    notes: "Awaiting production post-deploy smoke test execution.",
  };
}

export function buildPassedPostDeploySmokeTestResult(
  route: string,
  notes = POST_DEPLOY_SMOKE_PASSED_NOTES,
): SmartFormPilotPostDeploySmokeTestResult {
  return {
    route,
    productionUrl: `${siteUrl}${route}`,
    desktopPassed: true,
    mobilePassed: true,
    consoleClean: true,
    networkClean: true,
    smartFormVisible: true,
    calculationSubmitPassed: true,
    resultCardVerified: true,
    fallbackFlagOffVerified: true,
    analyticsShapeVerified: true,
    status: "passed",
    notes,
  };
}

export function buildDefaultPendingPostDeploySmokeTestResults(): SmartFormPilotPostDeploySmokeTestResultSet {
  const results = ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS.map((routeSlug) =>
    buildPendingPostDeploySmokeTestResult(`/tools/free/${routeSlug}`),
  );

  return {
    results,
    aggregateStatus: "pending_post_deploy_smoke",
  };
}

export function buildRecordedPassedPostDeploySmokeTestResults(): SmartFormPilotPostDeploySmokeTestResultSet {
  const results = ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS.map((routeSlug) =>
    buildPassedPostDeploySmokeTestResult(`/tools/free/${routeSlug}`),
  );

  return {
    results,
    aggregateStatus: "passed",
  };
}

export function getSmartFormPilotPostDeploySmokeTestResults(): SmartFormPilotPostDeploySmokeTestResultSet {
  return buildRecordedPassedPostDeploySmokeTestResults();
}

/**
 * Smart form pilot staging smoke test records — Phase 5H-G-N.
 */

import { ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS } from "@/components/tools/smart-form/rollout-batch-h-catalog";

export type SmartFormPilotSmokeTestStatus =
  | "pending_smoke_test"
  | "passed"
  | "needs_fix"
  | "blocked";

export type SmartFormPilotSmokeTestResult = {
  readonly route: string;
  readonly desktopPassed: boolean;
  readonly mobilePassed: boolean;
  readonly consoleClean: boolean;
  readonly networkClean: boolean;
  readonly smartFormVisible: boolean;
  readonly calculationSubmitPassed: boolean;
  readonly fallbackVerified: boolean;
  readonly analyticsShapeVerified: boolean;
  readonly resultCardVerified: boolean;
  readonly status: SmartFormPilotSmokeTestStatus;
  readonly notes: string;
};

export type SmartFormPilotSmokeTestResultSet = {
  readonly results: readonly SmartFormPilotSmokeTestResult[];
  readonly aggregateStatus: SmartFormPilotSmokeTestStatus;
};

function buildPendingSmokeTestResult(route: string): SmartFormPilotSmokeTestResult {
  return {
    route,
    desktopPassed: false,
    mobilePassed: false,
    consoleClean: false,
    networkClean: false,
    smartFormVisible: false,
    calculationSubmitPassed: false,
    fallbackVerified: false,
    analyticsShapeVerified: false,
    resultCardVerified: false,
    notes: "Awaiting staging smoke test execution.",
    status: "pending_smoke_test",
  };
}

export function buildDefaultPendingSmokeTestResults(): SmartFormPilotSmokeTestResultSet {
  const results = ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS.map((routeSlug) =>
    buildPendingSmokeTestResult(`/tools/free/${routeSlug}`),
  );

  return {
    results,
    aggregateStatus: "pending_smoke_test",
  };
}

const STAGING_SMOKE_PASSED_NOTES =
  "Smoke test passed with NEXT_PUBLIC_SMART_FORM_PILOT=true after mobile header/menu blocker fix.";

export function buildRecordedPassedSmokeTestResults(): SmartFormPilotSmokeTestResultSet {
  const results = ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_ROUTE_SLUGS.map((routeSlug) =>
    buildPassedSmokeTestResult(`/tools/free/${routeSlug}`, STAGING_SMOKE_PASSED_NOTES),
  );

  return {
    results,
    aggregateStatus: "passed",
  };
}

export function getSmartFormPilotStagingSmokeTestResults(): SmartFormPilotSmokeTestResultSet {
  return buildRecordedPassedSmokeTestResults();
}

export function buildPassedSmokeTestResult(
  route: string,
  notes = "Staging smoke test passed.",
): SmartFormPilotSmokeTestResult {
  return {
    route,
    desktopPassed: true,
    mobilePassed: true,
    consoleClean: true,
    networkClean: true,
    smartFormVisible: true,
    calculationSubmitPassed: true,
    fallbackVerified: true,
    analyticsShapeVerified: true,
    resultCardVerified: true,
    notes,
    status: "passed",
  };
}

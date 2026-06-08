/**
 * Smart form pilot staging smoke test records — Phase 5H-G-N.
 */

import { getSmartFormPilotBatchRegistry } from "@/components/tools/smart-form/pilot-batch-qa-registry";

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
  const results = getSmartFormPilotBatchRegistry().map((entry) =>
    buildPendingSmokeTestResult(entry.manualQaUrl),
  );

  return {
    results,
    aggregateStatus: "pending_smoke_test",
  };
}

export function getSmartFormPilotStagingSmokeTestResults(): SmartFormPilotSmokeTestResultSet {
  return buildDefaultPendingSmokeTestResults();
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

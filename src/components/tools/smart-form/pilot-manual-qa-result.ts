/**
 * Smart form pilot manual QA execution records — Phase 5H-G-J/K.
 */

import { getSmartFormPilotBatchRegistry } from "@/components/tools/smart-form/pilot-batch-qa-registry";
import { ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS } from "@/components/tools/smart-form/rollout-batch-h-catalog";

export type SmartFormPilotManualQaResultStatus =
  | "passed"
  | "needs_fix"
  | "blocked"
  | "pending_manual_qa";

export type SmartFormPilotManualQaResult = {
  readonly slug: string;
  readonly route: string;
  readonly desktopPassed: boolean;
  readonly mobilePassed: boolean;
  readonly consoleClean: boolean;
  readonly networkClean: boolean;
  readonly flagFalseFallbackPassed: boolean;
  readonly flagTrueSmartFormPassed: boolean;
  readonly mappedInputPassed: boolean;
  readonly derivedReadonlyPassed: boolean;
  readonly assumptionCalloutPassed: boolean;
  readonly submitResultPassed: boolean;
  readonly analyticsShapePassed: boolean;
  readonly resultCardConsistencyPassed: boolean;
  readonly notes: string;
  readonly status: SmartFormPilotManualQaResultStatus;
};

export type SmartFormPilotManualQaResultSet = {
  readonly results: readonly SmartFormPilotManualQaResult[];
  readonly aggregateStatus: SmartFormPilotManualQaResultStatus;
};

function buildPendingResult(entry: {
  readonly governanceSlug: string;
  readonly routeSlug: string;
}): SmartFormPilotManualQaResult {
  return {
    slug: entry.governanceSlug,
    route: entry.routeSlug,
    desktopPassed: false,
    mobilePassed: false,
    consoleClean: false,
    networkClean: false,
    flagFalseFallbackPassed: false,
    flagTrueSmartFormPassed: false,
    mappedInputPassed: false,
    derivedReadonlyPassed: false,
    assumptionCalloutPassed: false,
    submitResultPassed: false,
    analyticsShapePassed: false,
    resultCardConsistencyPassed: false,
    notes: "Awaiting local manual QA execution.",
    status: "pending_manual_qa",
  };
}

export function buildPassedManualQaResult(
  entry: Pick<SmartFormPilotManualQaResult, "slug" | "route"> & {
    readonly notes?: string;
  },
): SmartFormPilotManualQaResult {
  return {
    slug: entry.slug,
    route: entry.route,
    desktopPassed: true,
    mobilePassed: true,
    consoleClean: true,
    networkClean: true,
    flagFalseFallbackPassed: true,
    flagTrueSmartFormPassed: true,
    mappedInputPassed: true,
    derivedReadonlyPassed: true,
    assumptionCalloutPassed: true,
    submitResultPassed: true,
    analyticsShapePassed: true,
    resultCardConsistencyPassed: true,
    notes: entry.notes ?? "Manual QA passed.",
    status: "passed",
  };
}

function isProductionDeployedPilot(governanceSlug: string): boolean {
  return ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS.includes(
    governanceSlug as (typeof ROLLOUT_BATCH_H_PRODUCTION_DEPLOYED_GOVERNANCE_SLUGS)[number],
  );
}

function buildBatchHManualQaResult(entry: {
  readonly governanceSlug: string;
  readonly routeSlug: string;
  readonly manualQaUrl: string;
}): SmartFormPilotManualQaResult {
  if (isProductionDeployedPilot(entry.governanceSlug)) {
    return buildPassedManualQaResult({
      slug: entry.governanceSlug,
      route: entry.routeSlug,
      notes: `Local manual QA passed for ${entry.manualQaUrl} with NEXT_PUBLIC_SMART_FORM_PILOT=true.`,
    });
  }

  return buildPendingResult({
    governanceSlug: entry.governanceSlug,
    routeSlug: entry.routeSlug,
  });
}

/**
 * Canonical manual QA records — production deployed pilots passed; batch H expansion pending.
 */
export const SMART_FORM_PILOT_MANUAL_QA_RESULTS: readonly SmartFormPilotManualQaResult[] =
  getSmartFormPilotBatchRegistry().map((entry) => buildBatchHManualQaResult(entry));

export function getProductionDeployedManualQaResults(): SmartFormPilotManualQaResultSet {
  const results = SMART_FORM_PILOT_MANUAL_QA_RESULTS.filter((result) =>
    isProductionDeployedPilot(result.slug),
  );

  return {
    results,
    aggregateStatus: deriveAggregateManualQaStatus(results),
  };
}

export function getSmartFormPilotManualQaResults(): SmartFormPilotManualQaResultSet {
  return {
    results: SMART_FORM_PILOT_MANUAL_QA_RESULTS,
    aggregateStatus: deriveAggregateManualQaStatus(SMART_FORM_PILOT_MANUAL_QA_RESULTS),
  };
}

export function buildDefaultPendingManualQaResults(): SmartFormPilotManualQaResultSet {
  const results = getSmartFormPilotBatchRegistry().map((entry) =>
    buildPendingResult({
      governanceSlug: entry.governanceSlug,
      routeSlug: entry.routeSlug,
    }),
  );

  return {
    results,
    aggregateStatus: "pending_manual_qa",
  };
}

export function deriveAggregateManualQaStatus(
  results: readonly SmartFormPilotManualQaResult[],
): SmartFormPilotManualQaResultStatus {
  if (results.some((result) => result.status === "blocked")) {
    return "blocked";
  }
  if (results.some((result) => result.status === "needs_fix")) {
    return "needs_fix";
  }
  if (results.some((result) => result.status === "pending_manual_qa")) {
    return "pending_manual_qa";
  }
  if (results.length > 0 && results.every((result) => result.status === "passed")) {
    return "passed";
  }
  return "pending_manual_qa";
}

/**
 * Smart form pilot QA decision gate — Phase 5H-G-J (staging go/no-go; no deploy auto-approve).
 */

import type { SmartFormPilotManualQaResult } from "@/components/tools/smart-form/pilot-manual-qa-result";
import { deriveAggregateManualQaStatus } from "@/components/tools/smart-form/pilot-manual-qa-result";

export type SmartFormPilotQaDecisionPilotSummary = {
  readonly slug: string;
  readonly route: string;
  readonly status: SmartFormPilotManualQaResult["status"];
  readonly stagingEligible: boolean;
};

export type SmartFormPilotQaDecisionResult = {
  readonly manualQaStatus: SmartFormPilotManualQaResult["status"];
  readonly stagingFlagReady: boolean;
  readonly deploymentReady: false;
  readonly blockedReasons: readonly string[];
  readonly pilots: readonly SmartFormPilotQaDecisionPilotSummary[];
};

function collectHardBlockReasons(result: SmartFormPilotManualQaResult): string[] {
  const reasons: string[] = [];

  if (result.status === "blocked") {
    reasons.push(`${result.slug}: manual QA marked blocked`);
  }
  if (!result.consoleClean) {
    reasons.push(`${result.slug}: console not clean`);
  }
  if (!result.networkClean) {
    reasons.push(`${result.slug}: network not clean`);
  }
  if (!result.flagFalseFallbackPassed) {
    reasons.push(`${result.slug}: flag false fallback failed`);
  }
  if (!result.submitResultPassed) {
    reasons.push(`${result.slug}: submit result failed`);
  }

  return reasons;
}

function isPilotStagingEligible(result: SmartFormPilotManualQaResult): boolean {
  if (result.status !== "passed") {
    return false;
  }

  return (
    result.desktopPassed &&
    result.mobilePassed &&
    result.consoleClean &&
    result.networkClean &&
    result.flagFalseFallbackPassed &&
    result.flagTrueSmartFormPassed &&
    result.mappedInputPassed &&
    result.derivedReadonlyPassed &&
    result.assumptionCalloutPassed &&
    result.submitResultPassed &&
    result.analyticsShapePassed &&
    result.resultCardConsistencyPassed
  );
}

export function evaluateSmartFormPilotQaDecision(
  results: readonly SmartFormPilotManualQaResult[],
): SmartFormPilotQaDecisionResult {
  const blockedReasons: string[] = [];
  const pilots: SmartFormPilotQaDecisionPilotSummary[] = [];

  for (const result of results) {
    blockedReasons.push(...collectHardBlockReasons(result));
    pilots.push({
      slug: result.slug,
      route: result.route,
      status: result.status,
      stagingEligible: isPilotStagingEligible(result),
    });
  }

  const manualQaStatus = deriveAggregateManualQaStatus(results);
  const hasPending = manualQaStatus === "pending_manual_qa";
  const hasBlocked =
    manualQaStatus === "blocked" ||
    blockedReasons.length > 0 ||
    results.some((result) => result.status === "needs_fix");

  const allPassed =
    results.length > 0 &&
    results.every((result) => isPilotStagingEligible(result)) &&
    manualQaStatus === "passed";

  const stagingFlagReady = !hasPending && !hasBlocked && allPassed;

  return {
    manualQaStatus,
    stagingFlagReady,
    deploymentReady: false,
    blockedReasons,
    pilots,
  };
}

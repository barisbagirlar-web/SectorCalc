/**
 * Smart form pilot batch QA audit — Phase 5H-G-I/J.
 */

import { buildSmartFormPilotCalculationPayload } from "@/components/tools/smart-form/build-smart-form-pilot-calculation-payload";
import { buildSmartFormPilotAnalyticsPayload } from "@/components/tools/smart-form/smart-form-pilot-analytics";
import {
  evaluatePilotOptionalFieldsExpansion,
  isOptionalFieldExpansionBlocked,
} from "@/components/tools/smart-form/optional-expansion-diff-gate";
import { buildSmartFormPilotManualQaChecklist } from "@/components/tools/smart-form/pilot-manual-qa-checklist";
import { buildDefaultPendingManualQaResults } from "@/components/tools/smart-form/pilot-manual-qa-result";
import { evaluateSmartFormPilotQaDecision } from "@/components/tools/smart-form/pilot-qa-decision-gate";
import type { SmartFormPilotManualQaResult } from "@/components/tools/smart-form/pilot-manual-qa-result";
import type { SmartFormPilotQaDecisionResult } from "@/components/tools/smart-form/pilot-qa-decision-gate";
import {
  getSmartFormPilotBatchRegistry,
  type SmartFormPilotBatchRegistryEntry,
} from "@/components/tools/smart-form/pilot-batch-qa-registry";
import { getPilotSmartFormManifest } from "@/components/tools/smart-form/getPilotSmartFormManifest";
import { resolvePilotGovernanceSlugFromRoute } from "@/lib/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";

export type SmartFormPilotQaAuditPilotResult = {
  readonly routeSlug: string;
  readonly governanceSlug: string;
  readonly calculationBridgeReady: boolean;
  readonly fallbackReady: boolean;
  readonly analyticsReady: boolean;
  readonly optionalExpansionBlocked: boolean;
  readonly mappedSubmitKeyCount: number;
  readonly manualQaUrl: string;
  readonly warnings: readonly string[];
};

export type SmartFormPilotBatchQaAuditResult = {
  readonly totalPilots: number;
  readonly calculationBridgeReady: number;
  readonly fallbackReady: number;
  readonly analyticsReady: number;
  readonly optionalExpansionBlocked: boolean;
  readonly manualQaRequired: boolean;
  readonly manualQaStatus: SmartFormPilotManualQaResult["status"];
  readonly stagingFlagReady: boolean;
  readonly deploymentReady: false;
  readonly manualQaResults: readonly SmartFormPilotManualQaResult[];
  readonly qaDecision: SmartFormPilotQaDecisionResult;
  readonly pilots: readonly SmartFormPilotQaAuditPilotResult[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

function verifyPayloadExcludesNonMappedKeys(entry: SmartFormPilotBatchRegistryEntry): string[] {
  const warnings: string[] = [];
  const manifest = getPilotSmartFormManifest(entry.governanceSlug);
  if (!manifest) {
    warnings.push(`${entry.governanceSlug}: UI bridge manifest unavailable for payload QA`);
    return warnings;
  }

  const fieldValues: Record<string, string> = {};
  for (const key of entry.mappedSubmitKeys) {
    fieldValues[key] = "10";
  }
  for (const key of entry.optionalGatedKeys) {
    fieldValues[key] = "99";
  }
  for (const key of entry.derivedExcludedKeys) {
    fieldValues[key] = "999";
  }

  const result = buildSmartFormPilotCalculationPayload({
    slug: entry.governanceSlug,
    fieldValues,
    manifest,
  });

  if (!result.supported || !result.payload) {
    warnings.push(`${entry.governanceSlug}: pilot payload builder did not produce supported payload`);
    return warnings;
  }

  const payloadKeys = Object.keys(result.payload);
  for (const key of payloadKeys) {
    if (!entry.mappedSubmitKeys.includes(key)) {
      warnings.push(`${entry.governanceSlug}: unexpected payload key "${key}"`);
    }
  }

  for (const key of [...entry.optionalGatedKeys, ...entry.derivedExcludedKeys]) {
    if (key in result.payload) {
      warnings.push(`${entry.governanceSlug}: excluded key "${key}" leaked into payload`);
    }
  }

  return warnings;
}

function auditPilot(entry: SmartFormPilotBatchRegistryEntry): SmartFormPilotQaAuditPilotResult {
  const manifest = getPilotSmartFormManifest(entry.governanceSlug);
  const calculationBridgeReady =
    entry.calculationBridgeEnabled && manifest?.status === "ui_bridge_ready";

  const fallbackReady =
    entry.expectedFallbackBehavior.length > 0 &&
    resolvePilotGovernanceSlugFromRoute("plumbing-job-margin-verdict") === null;

  let analyticsReady = false;
  try {
    const payload = buildSmartFormPilotAnalyticsPayload(entry.governanceSlug);
    analyticsReady =
      payload.mode === "smart_form_pilot" &&
      payload.slug === entry.governanceSlug &&
      payload.mappedInputCount === entry.mappedSubmitKeys.length &&
      payload.advancedInputSubmitted === false;
  } catch {
    analyticsReady = false;
  }

  const optionalResults = evaluatePilotOptionalFieldsExpansion(
    entry.governanceSlug,
    entry.optionalGatedKeys.length > 0
      ? entry.optionalGatedKeys
      : ["failedPrintRate", "diagnosticHours", "hardwareCost"],
  );
  const optionalExpansionBlocked = optionalResults.every((result) => result.status === "blocked");

  const warnings = verifyPayloadExcludesNonMappedKeys(entry);
  if (!manifest) {
    warnings.push(`${entry.governanceSlug}: manifest missing for QA audit`);
  }

  return {
    routeSlug: entry.routeSlug,
    governanceSlug: entry.governanceSlug,
    calculationBridgeReady,
    fallbackReady,
    analyticsReady,
    optionalExpansionBlocked,
    mappedSubmitKeyCount: entry.mappedSubmitKeys.length,
    manualQaUrl: entry.manualQaUrl,
    warnings,
  };
}

export function runSmartFormPilotBatchQaAudit(): SmartFormPilotBatchQaAuditResult {
  const registry = getSmartFormPilotBatchRegistry();
  const manualChecklist = buildSmartFormPilotManualQaChecklist();
  const manualQaResults = buildDefaultPendingManualQaResults().results;
  const qaDecision = evaluateSmartFormPilotQaDecision(manualQaResults);
  const pilots = registry.map((entry) => auditPilot(entry));

  const calculationBridgeReady = pilots.filter((pilot) => pilot.calculationBridgeReady).length;
  const fallbackReady = pilots.filter((pilot) => pilot.fallbackReady).length;
  const analyticsReady = pilots.filter((pilot) => pilot.analyticsReady).length;
  const optionalExpansionBlocked = pilots.every((pilot) => pilot.optionalExpansionBlocked);

  const warnings = pilots.flatMap((pilot) => pilot.warnings);
  const blockers: string[] = [];

  if (pilots.length !== 3) {
    blockers.push(`Expected 3 pilots, found ${pilots.length}`);
  }
  if (calculationBridgeReady !== pilots.length) {
    blockers.push(
      `Calculation bridge ready ${calculationBridgeReady}/${pilots.length}`,
    );
  }
  if (analyticsReady !== pilots.length) {
    blockers.push(`Analytics ready ${analyticsReady}/${pilots.length}`);
  }
  if (!optionalExpansionBlocked) {
    blockers.push("Optional field expansion is not fully blocked");
  }

  for (const fieldKey of ["failedPrintRate", "diagnosticHours", "hardwareCost"] as const) {
    if (
      !isOptionalFieldExpansionBlocked({
        slug: registry[0]?.governanceSlug ?? "unknown",
        fieldKey,
        hasPayloadEquivalenceTest: false,
        hasOutputDiffTest: false,
        productionMapped: false,
        analyticsCovered: true,
      })
    ) {
      blockers.push(`Optional field "${fieldKey}" is not blocked`);
    }
  }

  return {
    totalPilots: pilots.length,
    calculationBridgeReady,
    fallbackReady,
    analyticsReady,
    optionalExpansionBlocked,
    manualQaRequired: manualChecklist.totalPilots > 0,
    manualQaStatus: qaDecision.manualQaStatus,
    stagingFlagReady: qaDecision.stagingFlagReady,
    deploymentReady: false,
    manualQaResults,
    qaDecision,
    pilots,
    warnings,
    blockers,
  };
}

export function formatSmartFormPilotBatchQaAuditReport(
  result: SmartFormPilotBatchQaAuditResult,
): string {
  const lines = [
    "Smart Form Pilot QA Audit",
    `Total pilots: ${result.totalPilots}`,
    `Calculation bridge ready: ${result.calculationBridgeReady}`,
    `Fallback ready: ${result.fallbackReady}`,
    `Analytics ready: ${result.analyticsReady}`,
    `Optional expansion blocked: ${result.optionalExpansionBlocked}`,
    `Manual QA required: ${result.manualQaRequired}`,
    `Manual QA status: ${result.manualQaStatus}`,
    `Staging flag ready: ${result.stagingFlagReady}`,
    `Deployment ready: ${result.deploymentReady}`,
    `Blockers: ${result.blockers.length}`,
    "",
    "Pilot manual QA URLs:",
    ...result.pilots.map((pilot) => `- ${pilot.manualQaUrl}`),
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

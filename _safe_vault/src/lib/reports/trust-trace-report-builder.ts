/**
 * Trust trace export payload builder — ADIM 3 runtime full-loop → export data.
 */

import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import type { ContractCalculationIntelligenceLoopResult } from "@/lib/formula-governance/runtime-validation/contract-runtime-loop";
import {
  resolveFullLoopContractSlug,
} from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import type { RuntimeTrustTraceView } from "@/lib/formula-governance/runtime-validation/full-loop-bridge-shared";
import {
  buildOracleCoverageTrace,
  buildPropertyCoverageTrace,
  buildScenarioCoverageTrace,
} from "@/lib/formula-governance/trust-trace-report/trust-trace-coverage";
import { VERDICT_REPORT_LEGAL_DISCLAIMER } from "@/lib/reports/verdict-report";
import { REPORT_DISCLAIMER } from "@/lib/legal/report-disclaimer";
import type {
  BuildTrustTraceReportPayloadInput,
  TrustTraceCanonicalInputClassification,
  TrustTraceCanonicalInputEntry,
  TrustTraceFormulaContractRef,
  TrustTraceMind1PostcalcTrace,
  TrustTraceMind2PrecalcTrace,
  TrustTraceReportExportStatus,
  TrustTraceReportPayload,
} from "@/lib/reports/trust-trace-report-types";

function resolveContractSlug(toolSlug: string, tier: BuildTrustTraceReportPayloadInput["tier"]): string {
  if (tier === "premium") {
    return resolveFullLoopContractSlug(toolSlug);
  }
  return toolSlug;
}

function formatCanonicalValue(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) {
    return "-";
  }
  return String(value);
}

function classifyCanonicalInput(
  key: string,
  trustTrace: RuntimeTrustTraceView,
  loop: ContractCalculationIntelligenceLoopResult,
): TrustTraceCanonicalInputClassification {
  if (trustTrace.rejectedKeys.includes(key)) {
    return "rejected";
  }
  if (trustTrace.defaultedInputs.includes(key)) {
    return "defaulted";
  }
  if (loop.derivedResolutionPlan.some((step) => step.variableId === key)) {
    return "derived";
  }
  if (trustTrace.requiredMissingInputs.includes(key)) {
    return "required";
  }
  return "required";
}

function buildCanonicalInputEntries(input: {
  readonly trustTrace: RuntimeTrustTraceView;
  readonly loop: ContractCalculationIntelligenceLoopResult;
  readonly canonicalInputValues?: Readonly<Record<string, number>>;
}): TrustTraceCanonicalInputEntry[] {
  const keys = new Set<string>([
    ...input.trustTrace.canonicalInputs,
    ...input.trustTrace.rejectedKeys,
    ...input.trustTrace.requiredMissingInputs,
  ]);

  return [...keys]
    .sort((left, right) => left.localeCompare(right))
    .map((key) => ({
      key,
      value: formatCanonicalValue(input.canonicalInputValues?.[key]),
      classification: classifyCanonicalInput(key, input.trustTrace, input.loop),
    }));
}

function buildFormulaContractRef(
  contractSlug: string,
): TrustTraceFormulaContractRef {
  const contract = getFormulaContractBySlug(contractSlug);
  if (!contract) {
    return {
      slug: contractSlug,
      toolId: contractSlug,
      version: "unknown",
      title: contractSlug,
      riskLevel: "medium",
    };
  }

  return {
    slug: contract.slug,
    toolId: contract.toolId ?? contract.slug,
    version: contract.toolId ?? contract.slug,
    title: contract.toolName ?? contract.slug,
    riskLevel: contract.riskLevel ?? "medium",
  };
}

function buildMind2PrecalcTrace(
  trustTrace: RuntimeTrustTraceView,
  loop: ContractCalculationIntelligenceLoopResult,
): TrustTraceMind2PrecalcTrace {
  return {
    requirementStatus: trustTrace.requirementStatus,
    requiredMissingInputs: trustTrace.requiredMissingInputs,
    defaultedInputs: trustTrace.defaultedInputs,
    acceptedAssumptions: trustTrace.acceptedAssumptions,
    formulaPath: trustTrace.formulaPath,
    derivedResolutionPlan: loop.derivedResolutionPlan.map((step) => ({
      variableId: step.variableId,
      formulaNodeId: step.formulaNodeId ?? step.variableId,
      requiredInputs: step.requiredInputs ?? [],
    })),
    readinessStatus: loop.readinessAudit.status,
    readinessWarnings: loop.readinessAudit.warnings,
  };
}

function buildMind1PostcalcTrace(
  trustTrace: RuntimeTrustTraceView,
  loop: ContractCalculationIntelligenceLoopResult,
): TrustTraceMind1PostcalcTrace {
  const validation = loop.validationResult;

  return {
    validationPassed: trustTrace.validationPassed,
    validationErrors: trustTrace.validationErrors,
    validationWarnings: trustTrace.validationWarnings,
    validationSources: trustTrace.validationSources,
    invariantViolations: validation?.invariantViolations ?? [],
    dimensionErrors: validation?.dimensionErrors ?? [],
  };
}

function collectWarnings(input: {
  readonly trustTrace: RuntimeTrustTraceView;
  readonly loop: ContractCalculationIntelligenceLoopResult;
  readonly coverageWarnings: readonly string[];
}): string[] {
  const warnings = new Set<string>([
    ...input.loop.warnings,
    ...input.loop.readinessAudit.warnings,
    ...input.trustTrace.validationWarnings,
    ...input.coverageWarnings,
  ]);

  return [...warnings].sort((left, right) => left.localeCompare(right));
}

function collectBlockers(input: {
  readonly fullLoopResult: BuildTrustTraceReportPayloadInput["fullLoopResult"];
  readonly trustTrace: RuntimeTrustTraceView;
  readonly loop: ContractCalculationIntelligenceLoopResult;
}): string[] {
  const blockers = new Set<string>([
    ...input.loop.blockers,
    ...input.loop.readinessAudit.blockers,
    ...input.trustTrace.blockers,
  ]);

  if (input.fullLoopResult.status === "blocked") {
    for (const blocker of input.fullLoopResult.blockers ?? []) {
      blockers.add(blocker);
    }
  }

  return [...blockers].sort((left, right) => left.localeCompare(right));
}

function resolveExportStatus(input: {
  readonly calculationStatus: "success" | "blocked";
  readonly trustTrace: RuntimeTrustTraceView;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
  readonly coverageStatuses: readonly string[];
}): TrustTraceReportExportStatus {
  if (input.calculationStatus === "blocked" || input.blockers.length > 0) {
    return "blocked";
  }

  const needsReview =
    !input.trustTrace.validationPassed ||
    input.warnings.length > 0 ||
    input.coverageStatuses.some(
      (status) => status === "needs_review" || status === "fail" || status === "not_wired",
    );

  return needsReview ? "needs_review" : "export_ready";
}

export function buildTrustTraceReportPayload(
  input: BuildTrustTraceReportPayloadInput,
): TrustTraceReportPayload {
  const { fullLoopResult, toolSlug, toolTitle, tier } = input;
  const contractSlug = resolveContractSlug(toolSlug, tier);
  const contract = getFormulaContractBySlug(contractSlug);
  const trustTrace = fullLoopResult.trustTrace;
  const loop = fullLoopResult.loop;
  const calculationStatus =
    fullLoopResult.status === "success" ? "success" : "blocked";

  const oracleCoverage = buildOracleCoverageTrace(contractSlug);
  const scenarioCoverage = contract
    ? buildScenarioCoverageTrace(contract)
    : { status: "not_wired" as const, wired: false, detail: "Formula contract not found." };
  const propertyCoverage = contract
    ? buildPropertyCoverageTrace(contract)
    : { status: "not_wired" as const, wired: false, detail: "Formula contract not found." };

  const coverageSummary = {
    oracle: oracleCoverage,
    scenario: scenarioCoverage,
    property: propertyCoverage,
  };

  const coverageWarnings: string[] = [];
  if (oracleCoverage.status === "needs_review" || oracleCoverage.status === "fail") {
    coverageWarnings.push(`Oracle coverage: ${oracleCoverage.detail}`);
  }
  if (scenarioCoverage.status === "needs_review" || scenarioCoverage.status === "fail") {
    coverageWarnings.push(`Scenario coverage: ${scenarioCoverage.detail}`);
  }
  if (propertyCoverage.status === "needs_review" || propertyCoverage.status === "fail") {
    coverageWarnings.push(`Property coverage: ${propertyCoverage.detail}`);
  }

  const warnings = collectWarnings({
    trustTrace,
    loop,
    coverageWarnings,
  });
  const blockers = collectBlockers({ fullLoopResult, trustTrace, loop });

  const exportStatus = resolveExportStatus({
    calculationStatus,
    trustTrace,
    blockers,
    warnings,
    coverageStatuses: [
      oracleCoverage.status,
      scenarioCoverage.status,
      propertyCoverage.status,
    ],
  });

  const assumptions = [
    ...new Set([
      ...trustTrace.acceptedAssumptions,
      ...(contract?.assumptions ?? []),
      ...(contract?.warningPolicy?.acceptedAssumptions ?? []),
    ]),
  ].sort((left, right) => left.localeCompare(right));

  return {
    slug: toolSlug,
    toolTitle,
    tier,
    loopStatus:
      trustTrace.loopStatus === "SUCCESS"
        ? "SUCCESS"
        : trustTrace.loopStatus === "BLOCKED"
          ? "BLOCKED"
          : "NEED_DATA",
    calculationStatus,
    locale: input.locale ?? "en",
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    disclaimer: VERDICT_REPORT_LEGAL_DISCLAIMER,
    formulaContract: buildFormulaContractRef(contractSlug),
    canonicalInputs: buildCanonicalInputEntries({
      trustTrace,
      loop,
      canonicalInputValues: input.canonicalInputValues,
    }),
    rejectedKeys: trustTrace.rejectedKeys,
    assumptions,
    limitations: trustTrace.limitations,
    mind2Precalc: buildMind2PrecalcTrace(trustTrace, loop),
    mind1Postcalc: buildMind1PostcalcTrace(trustTrace, loop),
    trustTrace,
    coverageSummary,
    warnings,
    blockers,
    exportFormats: ["pdf", "excel", "word"],
    exportStatus,
    fileOutputGenerated: false,
    usageAgreement: [...REPORT_DISCLAIMER.paragraphs, REPORT_DISCLAIMER.professionalReviewNote],
  };
}

export function buildTrustTraceReportFileName(
  slug: string,
  format: "pdf" | "excel" | "word",
  generatedAt: string,
): string {
  const date = generatedAt.slice(0, 10);
  const extension = format === "excel" ? "xlsx" : format === "word" ? "docx" : "pdf";
  return `sectorcalc-${slug}-trust-trace-${date}.${extension}`;
}

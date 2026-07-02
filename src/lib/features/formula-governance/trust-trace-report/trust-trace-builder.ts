/**
 * Trust trace report builder - deterministic read-only trace (Phase 5H-I).
 */

import type { TrustTraceReport, BuildTrustTraceReportInput, TrustTraceInputEntry } from "@/lib/features/formula-governance/trust-trace-report/trust-trace-types";

function buildInputTrace(input: BuildTrustTraceReportInput): TrustTraceInputEntry[] {
  const entries: TrustTraceInputEntry[] = [];
  const seen = new Set<string>();

  for (const key of input.requiredInputs) {
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    entries.push({
      key,
      classification: "required",
      source: "contract",
      readonly: false,
    });
  }

  for (const key of input.optionalInputs ?? []) {
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    entries.push({
      key,
      classification: "optional",
      source: "controlled_patch",
      readonly: false,
    });
  }

  for (const key of input.advancedInputs ?? []) {
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    entries.push({
      key,
      classification: "advanced",
      source: "controlled_patch",
      readonly: false,
    });
  }

  for (const key of input.defaultedInputs ?? []) {
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    entries.push({
      key,
      classification: "defaulted",
      source: "requirement_engine",
      readonly: false,
    });
  }

  for (const key of input.derivedFields ?? []) {
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    entries.push({
      key,
      classification: "derived",
      source: "requirement_engine",
      readonly: true,
    });
  }

  return entries;
}

function computeTrustScore(input: BuildTrustTraceReportInput, blockers: readonly string[]): number {
  let score = 20;

  if (input.hasProductionAssumptionLine) {
    score += 10;
  }
  if (input.hasProductionLocator) {
    score += 15;
  }
  if (input.oracleCoverage.status === "pass") {
    score += 15;
  } else if (input.oracleCoverage.status === "needs_review") {
    score += 5;
  }
  if (input.scenarioCoverage.status === "pass") {
    score += 10;
  }
  if (input.propertyCoverage.status === "pass") {
    score += 10;
  }
  if (input.inputDesignStatus === "professional_ready") {
    score += 15;
  } else if (input.inputDesignStatus === "usable") {
    score += 8;
  }
  if ((input.warningTrace?.length ?? 0) > 0 && (input.limitationTrace?.length ?? 0) > 0) {
    score += 5;
  }

  if (blockers.length > 0) {
    score = Math.min(score, 49);
  }

  return Math.max(0, Math.min(100, score));
}

function resolveStatus(
  input: BuildTrustTraceReportInput,
  trustScore: number,
  blockers: readonly string[],
): TrustTraceReport["status"] {
  if (blockers.length > 0) {
    return "blocked";
  }

  const exportReady =
    input.hasProductionLocator &&
    input.validationRules &&
    input.validationRules.length > 0 &&
    (input.limitationTrace?.length ?? 0) > 0;

  if (
    trustScore >= 85 &&
    input.inputDesignStatus === "professional_ready" &&
    input.hasProductionLocator &&
    input.oracleCoverage.status === "pass" &&
    exportReady
  ) {
    return "trust_trace_ready";
  }

  return "needs_review";
}

function buildReportExportReadiness(
  input: BuildTrustTraceReportInput,
  blockers: readonly string[],
): TrustTraceReport["reportExportReadiness"] {
  const exportBlockers: string[] = [];
  const exportWarnings: string[] = [];

  if (!input.hasProductionLocator) {
    exportBlockers.push("Production locator missing - export trace cannot anchor live calculator.");
  }
  if ((input.validationRules?.length ?? 0) === 0) {
    exportBlockers.push("Validation rules missing from contract trace.");
  }
  if ((input.limitationTrace?.length ?? 0) === 0) {
    exportWarnings.push("Model limitations not classified for export disclaimer block.");
  }

  const baseReady = exportBlockers.length === 0 && blockers.length === 0;

  return {
    pdfReady: baseReady,
    excelReady: baseReady && input.tier !== "premium-schema",
    wordReady: baseReady,
    blockers: exportBlockers,
    warnings: exportWarnings,
  };
}

export function buildTrustTraceReport(input: BuildTrustTraceReportInput): TrustTraceReport {
  const blockers = [...(input.blockers ?? [])];
  const warnings = [...(input.warnings ?? [])];

  if (!input.hasProductionAssumptionLine) {
    blockers.push(`Contract "${input.slug}" is missing Production: assumption line.`);
  }

  if (input.inputDesignStatus === "blocked") {
    blockers.push(`Input design audit blocked for "${input.slug}".`);
  }

  const trustScore = computeTrustScore(input, blockers);
  const status = resolveStatus(input, trustScore, blockers);

  return {
    slug: input.slug,
    title: input.title,
    tier: input.tier,
    riskLevel: input.riskLevel,
    inputTrace: buildInputTrace(input),
    requiredInputs: [...input.requiredInputs],
    optionalInputs: [...(input.optionalInputs ?? [])],
    advancedInputs: [...(input.advancedInputs ?? [])],
    defaultedInputs: [...(input.defaultedInputs ?? [])],
    acceptedAssumptions: [...(input.acceptedAssumptions ?? [])],
    derivedFields: [...(input.derivedFields ?? [])],
    validationTrace: [...(input.validationRules ?? [])],
    formulaContractTrace: [...(input.formulaContractLines ?? [])],
    ontologyTrace: [...(input.ontologyLines ?? [])],
    requirementEngineTrace: [...(input.requirementEngineLines ?? [])],
    oracleCoverage: input.oracleCoverage,
    scenarioCoverage: input.scenarioCoverage,
    propertyCoverage: input.propertyCoverage,
    warningTrace: [...(input.warningTrace ?? [])],
    limitationTrace: [...(input.limitationTrace ?? [])],
    reportExportReadiness: buildReportExportReadiness(input, blockers),
    trustScore,
    status,
    inputDesignStatus: input.inputDesignStatus,
    alignmentStatus: input.alignmentStatus,
    blockers,
    warnings,
  };
}

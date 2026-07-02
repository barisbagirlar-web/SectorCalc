/**
 * Trust trace export section mapping - Phase 5I-C deterministic section map.
 */

import type { TrustTraceExportSection } from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";
import type { TrustTraceReport } from "@/lib/features/formula-governance/trust-trace-report/trust-trace-types";

export const REQUIRED_EXPORT_SECTIONS: readonly TrustTraceExportSection[] = [
  "executive_summary",
  "input_trace",
  "assumptions",
  "validation_trace",
  "calculation_trace",
  "oracle_scenario_property_coverage",
  "warnings_limitations",
  "trust_score",
  "audit_appendix",
] as const;

export const DEFAULT_REDACTION_RULES = [
  "no_secrets",
  "no_raw_env",
  "no_firebase_credentials",
  "no_user_pii_unless_allowed",
  "no_unverified_llm_formula",
  "no_internal_stack_traces",
] as const;

export function mapTrustTraceSections(report: TrustTraceReport): TrustTraceExportSection[] {
  const sections: TrustTraceExportSection[] = ["executive_summary", "trust_score", "audit_appendix"];

  if (report.inputTrace.length > 0 || report.requiredInputs.length > 0) {
    sections.push("input_trace");
  }
  if (report.acceptedAssumptions.length > 0) {
    sections.push("assumptions");
  }
  if (report.validationTrace.length > 0) {
    sections.push("validation_trace");
  }
  if (report.formulaContractTrace.length > 0 || report.requirementEngineTrace.length > 0) {
    sections.push("calculation_trace");
  }
  if (
    report.oracleCoverage.wired ||
    report.scenarioCoverage.wired ||
    report.propertyCoverage.wired
  ) {
    sections.push("oracle_scenario_property_coverage");
  }
  if (report.warningTrace.length > 0 || report.limitationTrace.length > 0) {
    sections.push("warnings_limitations");
  }

  return [...new Set(sections)];
}

export function findMissingExportSections(
  mappedSections: readonly TrustTraceExportSection[],
): TrustTraceExportSection[] {
  return REQUIRED_EXPORT_SECTIONS.filter((section) => !mappedSections.includes(section));
}

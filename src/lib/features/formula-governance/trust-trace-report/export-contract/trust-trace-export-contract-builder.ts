/**
 * Trust trace export contract builder - Phase 5I-C (no actual export).
 */

import {
  DEFAULT_REDACTION_RULES,
  findMissingExportSections,
  mapTrustTraceSections,
  REQUIRED_EXPORT_SECTIONS,
} from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-section-map";
import {
  evaluateExportReadiness,
  resolveExportContractStatus,
} from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-readiness";
import type { TrustTraceExportContract } from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";
import type { TrustTraceReport } from "@/lib/features/formula-governance/trust-trace-report/trust-trace-types";

function collectRequiredDataSources(report: TrustTraceReport): string[] {
  const sources = ["formula_contract", "trust_trace_report"];

  if (report.inputTrace.length > 0) {
    sources.push("input_trace");
  }
  if (report.acceptedAssumptions.length > 0) {
    sources.push("accepted_assumptions");
  }
  if (report.validationTrace.length > 0) {
    sources.push("validation_rules");
  }
  if (report.oracleCoverage.wired) {
    sources.push("oracle_coverage");
  }
  if (report.scenarioCoverage.wired) {
    sources.push("scenario_coverage");
  }
  if (report.propertyCoverage.wired) {
    sources.push("property_coverage");
  }

  return sources;
}

function collectMissingDataSources(report: TrustTraceReport): string[] {
  const missing: string[] = [];

  if (report.status !== "trust_trace_ready") {
    missing.push("trust_trace_ready_status");
  }
  if (report.validationTrace.length === 0) {
    missing.push("validation_trace");
  }
  if (!report.oracleCoverage.wired && report.riskLevel !== "low") {
    missing.push("oracle_coverage");
  }
  if (report.limitationTrace.length === 0) {
    missing.push("model_limitations");
  }

  return missing;
}

export function buildTrustTraceExportContract(report: TrustTraceReport): TrustTraceExportContract {
  const sections = mapTrustTraceSections(report);
  const missingSections = findMissingExportSections(sections);
  const requiredDataSources = collectRequiredDataSources(report);
  const missingDataSources = collectMissingDataSources(report);
  const exportReadiness = evaluateExportReadiness(report, missingDataSources);
  const status = resolveExportContractStatus(report, missingDataSources, missingSections);

  const blockers = [...report.blockers];
  const warnings = [...report.warnings];

  if (!sections.includes("audit_appendix")) {
    blockers.push(`${report.slug}: audit_appendix section is required.`);
  }

  if (missingSections.length > 0 && status !== "blocked") {
    warnings.push(
      `${report.slug}: missing export sections ${missingSections.join(", ")}.`,
    );
  }

  const resolvedSections =
    status === "export_contract_ready" ? [...REQUIRED_EXPORT_SECTIONS] : sections;

  return {
    slug: report.slug,
    reportTitle: `${report.title} - Trust Trace Report`,
    exportFormats: ["pdf", "excel", "word"],
    sections: resolvedSections,
    requiredDataSources,
    missingDataSources,
    redactionRules: [...DEFAULT_REDACTION_RULES],
    disclaimerRequired: true,
    exportReadiness,
    status,
    blockers,
    warnings,
  };
}

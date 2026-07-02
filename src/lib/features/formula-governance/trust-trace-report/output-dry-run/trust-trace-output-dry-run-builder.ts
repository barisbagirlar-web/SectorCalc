/**
 * Trust trace output dry-run builder - Phase 5I-M structured sections only.
 */

import type { TrustTraceReport } from "@/lib/features/formula-governance/trust-trace-report/trust-trace-types";
import type { TrustTraceOutputDryRun } from "@/lib/features/formula-governance/trust-trace-report/output-dry-run/trust-trace-output-dry-run-types";

export function buildTrustTraceOutputDryRun(report: TrustTraceReport): TrustTraceOutputDryRun {
  const missingSections: string[] = [];
  const blockers: string[] = [...report.blockers];
  const warnings: string[] = [...report.warnings];

  if (report.status !== "trust_trace_ready") {
    missingSections.push("trust_trace_ready_status");
  }

  const sections = {
    executive_summary: {
      slug: report.slug,
      trustScore: report.trustScore,
      headline: `Trust trace dry-run for ${report.slug}`,
      disclaimer: "Technical simulation; verify before business decisions.",
    },
    input_trace: {
      requiredInputCount: report.requiredInputs.length,
      optionalInputCount: report.optionalInputs.length,
      derivedFieldCount: report.derivedFields.length,
    },
    assumptions: {
      acceptedAssumptions: report.acceptedAssumptions.length,
      defaultedInputs: report.defaultedInputs.length,
    },
    limitations: {
      warningTraceCount: report.warningTrace.length,
      limitationTraceCount: report.limitationTrace.length,
    },
    audit_appendix: {
      oracleStatus: report.oracleCoverage.status,
      scenarioStatus: report.scenarioCoverage.status,
      propertyStatus: report.propertyCoverage.status,
    },
  } as const;

  const reportNarrativeReady = report.status === "trust_trace_ready" && missingSections.length === 0;
  const auditAppendixReady = report.oracleCoverage.status === "pass";

  return {
    slug: report.slug,
    sections,
    missingSections,
    redactionViolations: [],
    reportNarrativeReady,
    auditAppendixReady,
    fileOutputGenerated: false,
    blockers,
    warnings,
  };
}

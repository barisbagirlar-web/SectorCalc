/**
 * Trust trace output dry-run audit — Phase 5I-M read-only.
 */

import { FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts";
import { runBatchTrustTraceAudit } from "@/lib/features/formula-governance/trust-trace-report/batch-trust-trace-audit";
import { buildTrustTraceOutputDryRun } from "@/lib/features/formula-governance/trust-trace-report/output-dry-run/trust-trace-output-dry-run-builder";
import { validateTrustTraceOutputSections } from "@/lib/features/formula-governance/trust-trace-report/output-dry-run/trust-trace-output-section-validator";
import type { TrustTraceOutputDryRunAuditResult } from "@/lib/features/formula-governance/trust-trace-report/output-dry-run/trust-trace-output-dry-run-types";

export function runTrustTraceOutputDryRunAudit(): TrustTraceOutputDryRunAuditResult {
  const trustAudit = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
  const outputs = trustAudit.reports.map((report) =>
    validateTrustTraceOutputSections(buildTrustTraceOutputDryRun(report)),
  );

  const missingSectionCounts = new Map<string, number>();
  for (const output of outputs) {
    for (const section of output.missingSections) {
      missingSectionCounts.set(section, (missingSectionCounts.get(section) ?? 0) + 1);
    }
  }

  const topMissingSections = [...missingSectionCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([section]) => section);

  return {
    totalOutputs: outputs.length,
    outputDryRunReady: outputs.filter((o) => o.reportNarrativeReady).length,
    missingSections: topMissingSections,
    redactionViolations: outputs.reduce((sum, o) => sum + o.redactionViolations.length, 0),
    reportNarrativeReady: outputs.filter((o) => o.reportNarrativeReady).length,
    auditAppendixReady: outputs.filter((o) => o.auditAppendixReady).length,
    outputs,
    blockers: [...new Set(outputs.flatMap((o) => o.blockers))],
    warnings: [...new Set(outputs.flatMap((o) => o.warnings))],
  };
}

export function formatTrustTraceOutputDryRunReport(
  result: TrustTraceOutputDryRunAuditResult,
): string {
  return [
    "Trust Trace Output Dry Run Audit",
    `Total outputs: ${result.totalOutputs}`,
    `Output dry run ready: ${result.outputDryRunReady}`,
    `Report narrative ready: ${result.reportNarrativeReady}`,
    `Audit appendix ready: ${result.auditAppendixReady}`,
    `Redaction violations: ${result.redactionViolations}`,
    "",
    "Top missing sections:",
    ...result.missingSections.map((section) => `- ${section}`),
  ].join("\n");
}

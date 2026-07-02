/**
 * Trust trace output section validator - Phase 5I-M redaction checks.
 */

import type { TrustTraceOutputDryRun } from "@/lib/features/formula-governance/trust-trace-report/output-dry-run/trust-trace-output-dry-run-types";

const PROHIBITED_PATTERNS = ["secret", "api_key", "stack_trace", "private_key", ".env"] as const;

export function validateTrustTraceOutputSections(output: TrustTraceOutputDryRun): TrustTraceOutputDryRun {
  const violations: string[] = [];
  const serialized = JSON.stringify(output.sections).toLowerCase();

  for (const pattern of PROHIBITED_PATTERNS) {
    if (serialized.includes(pattern)) {
      violations.push(`prohibited pattern: ${pattern}`);
    }
  }

  return {
    ...output,
    redactionViolations: violations,
    reportNarrativeReady: output.reportNarrativeReady && violations.length === 0,
    auditAppendixReady: output.auditAppendixReady && violations.length === 0,
  };
}

/**
 * Report render dry-run validator - Phase 5I-I redaction + prohibited field checks.
 */

import { PROHIBITED_RENDERER_FIELDS } from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-data-contract";
import type { ReportRendererContract } from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-types";
import type {
  ReportRenderDryRun,
  ReportRenderDryRunStatus,
} from "@/lib/features/formula-governance/report-renderer-contract/dry-run/report-render-dry-run-types";

const SECRET_PATTERNS = ["secret", "api_key", "password", "token"] as const;
const ENV_PATTERNS = ["raw_env", "process.env", ".env"] as const;
const STACK_PATTERNS = ["stack_trace", "internal_stack"] as const;

function findProhibitedViolations(
  rows: readonly Record<string, string | number>[],
): string[] {
  const violations: string[] = [];

  for (const row of rows) {
    for (const [key, value] of Object.entries(row)) {
      const combined = `${key}:${String(value)}`.toLowerCase();
      if (SECRET_PATTERNS.some((p) => combined.includes(p))) {
        violations.push(`secret pattern in ${key}`);
      }
      if (ENV_PATTERNS.some((p) => combined.includes(p))) {
        violations.push(`env pattern in ${key}`);
      }
      if (STACK_PATTERNS.some((p) => combined.includes(p))) {
        violations.push(`stack trace pattern in ${key}`);
      }
    }
  }

  return violations;
}

export function resolveDryRunStatus(
  contract: ReportRendererContract,
  violations: readonly string[],
  missingFields: readonly string[],
): ReportRenderDryRunStatus {
  if (contract.status === "blocked" || violations.length > 0) {
    return "blocked";
  }
  if (contract.status === "needs_trace_data") {
    return missingFields.length > 0 ? "needs_data" : "dry_run_ready";
  }
  return "dry_run_ready";
}

export function validateReportRenderDryRun(
  dryRun: ReportRenderDryRun,
  contract: ReportRendererContract,
): ReportRenderDryRun {
  const prohibitedViolations = findProhibitedViolations(dryRun.syntheticRows);
  const missingProhibited = PROHIBITED_RENDERER_FIELDS.filter(
    (field) => !contract.dataContract.prohibitedFields.includes(field),
  );

  const blockers = [...dryRun.blockers];
  const warnings = [...dryRun.warnings];

  for (const violation of prohibitedViolations) {
    blockers.push(`${dryRun.slug}: ${violation}`);
  }
  for (const field of missingProhibited) {
    blockers.push(`${dryRun.slug}: missing prohibited field rule ${field}`);
  }

  const status = resolveDryRunStatus(contract, [...prohibitedViolations, ...missingProhibited], dryRun.missingFields);

  return {
    ...dryRun,
    prohibitedFieldViolations: [...prohibitedViolations, ...missingProhibited.map((f) => `missing:${f}`)],
    status,
    blockers,
    warnings,
    canRenderWithoutFileOutput: status === "dry_run_ready",
    fileOutputGenerated: false,
  };
}

/**
 * Report renderer section plan — Phase 5I-F deterministic section mapping.
 */

import type { ReportRendererSection } from "@/lib/formula-governance/report-renderer-contract/report-renderer-types";
import type { TrustTraceExportContract } from "@/lib/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";

export const DEFAULT_RENDERER_SECTIONS: readonly ReportRendererSection[] = [
  "cover",
  "executive_summary",
  "input_table",
  "assumption_table",
  "validation_table",
  "calculation_trace",
  "coverage_matrix",
  "warnings_limitations",
  "trust_score",
  "audit_appendix",
] as const;

export function mapExportSectionsToRendererSections(
  exportContract: TrustTraceExportContract,
): ReportRendererSection[] {
  if (exportContract.status !== "export_contract_ready") {
    return ["cover", "audit_appendix"];
  }

  return [...DEFAULT_RENDERER_SECTIONS];
}

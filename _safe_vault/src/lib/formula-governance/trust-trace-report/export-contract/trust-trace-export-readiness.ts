/**
 * Trust trace export readiness evaluator — Phase 5I-C.
 */

import type {
  TrustTraceExportReadinessFlags,
  TrustTraceExportStatus,
} from "@/lib/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";
import type { TrustTraceReport } from "@/lib/formula-governance/trust-trace-report/trust-trace-types";

export function evaluateExportReadiness(
  report: TrustTraceReport,
  missingDataSources: readonly string[],
): TrustTraceExportReadinessFlags {
  const baseReady =
    report.status === "trust_trace_ready" &&
    missingDataSources.length === 0 &&
    report.blockers.length === 0;

  return {
    pdfReady: baseReady && report.reportExportReadiness.pdfReady,
    excelReady: baseReady && report.reportExportReadiness.excelReady && report.tier !== "premium-schema",
    wordReady: baseReady && report.reportExportReadiness.wordReady,
  };
}

export function resolveExportContractStatus(
  report: TrustTraceReport,
  missingDataSources: readonly string[],
  missingSections: readonly string[],
): TrustTraceExportStatus {
  if (report.status === "blocked" || report.blockers.length > 0) {
    return "blocked";
  }

  if (report.status === "needs_review" || missingDataSources.length > 0) {
    return "needs_trace_data";
  }

  if (missingSections.length > 0) {
    return "needs_report_mapping";
  }

  if (report.status === "trust_trace_ready") {
    return "export_contract_ready";
  }

  return "needs_trace_data";
}

/**
 * Report renderer readiness evaluator — Phase 5I-F.
 */

import type {
  ReportRendererReadiness,
  ReportRendererStatus,
} from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-types";
import type { TrustTraceExportContract } from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";

export function evaluateRendererReadiness(
  exportContract: TrustTraceExportContract,
): ReportRendererReadiness {
  const baseReady = exportContract.status === "export_contract_ready";

  return {
    pdfRendererReady: baseReady && exportContract.exportReadiness.pdfReady,
    excelRendererReady: baseReady && exportContract.exportReadiness.excelReady,
    wordRendererReady: baseReady && exportContract.exportReadiness.wordReady,
  };
}

export function resolveRendererStatus(
  exportContract: TrustTraceExportContract,
): ReportRendererStatus {
  if (exportContract.status === "blocked" || exportContract.blockers.length > 0) {
    return "blocked";
  }
  if (exportContract.status === "needs_trace_data") {
    return "needs_trace_data";
  }
  if (exportContract.status === "needs_report_mapping") {
    return "needs_export_contract";
  }
  if (exportContract.status === "export_contract_ready") {
    return "renderer_contract_ready";
  }
  return "needs_export_contract";
}

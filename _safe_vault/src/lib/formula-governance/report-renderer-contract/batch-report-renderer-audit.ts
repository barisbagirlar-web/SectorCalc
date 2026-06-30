/**
 * Batch report renderer audit — Phase 5I-F read-only.
 */

import { buildReportRendererContract } from "@/lib/formula-governance/report-renderer-contract/report-renderer-contract-builder";
import type { BatchReportRendererAuditResult } from "@/lib/formula-governance/report-renderer-contract/report-renderer-types";
import type { TrustTraceExportContract } from "@/lib/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";

function buildTopMissingFields(contracts: readonly ReturnType<typeof buildReportRendererContract>[]): string[] {
  const counts = new Map<string, number>();

  for (const contract of contracts) {
    for (const field of contract.sourceTrustTraceExportContract.status === "needs_trace_data"
      ? ["trust_trace_ready_status"]
      : []) {
      counts.set(field, (counts.get(field) ?? 0) + 1);
    }
    if (contract.status === "needs_trace_data") {
      counts.set("trace_data", (counts.get("trace_data") ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 10)
    .map(([field, count]) => `- ${field}: ${count}`);
}

export function runBatchReportRendererAudit(
  exportContracts: readonly TrustTraceExportContract[],
): BatchReportRendererAuditResult {
  const contracts = exportContracts.map((exportContract) =>
    buildReportRendererContract(exportContract),
  );

  return {
    totalContracts: contracts.length,
    rendererReady: contracts.filter((c) => c.status === "renderer_contract_ready").length,
    pdfReady: contracts.filter((c) => c.readiness.pdfRendererReady).length,
    excelReady: contracts.filter((c) => c.readiness.excelRendererReady).length,
    wordReady: contracts.filter((c) => c.readiness.wordRendererReady).length,
    blocked: contracts.filter((c) => c.status === "blocked").length,
    needsTraceData: contracts.filter((c) => c.status === "needs_trace_data").length,
    topMissingFields: buildTopMissingFields(contracts),
    contracts,
    warnings: contracts.flatMap((c) => c.warnings),
    blockers: contracts.flatMap((c) => c.blockers),
  };
}

export function formatBatchReportRendererAuditReport(
  result: BatchReportRendererAuditResult,
): string {
  const lines = [
    "Report Renderer Contract Audit",
    `Total contracts: ${result.totalContracts}`,
    `Renderer ready: ${result.rendererReady}`,
    `PDF ready: ${result.pdfReady}`,
    `Excel ready: ${result.excelReady}`,
    `Word ready: ${result.wordReady}`,
    `Blocked: ${result.blocked}`,
    `Needs trace data: ${result.needsTraceData}`,
    "",
    "Top missing fields:",
  ];

  if (result.topMissingFields.length === 0) {
    lines.push("- (none)");
  } else {
    lines.push(...result.topMissingFields);
  }

  return lines.join("\n");
}

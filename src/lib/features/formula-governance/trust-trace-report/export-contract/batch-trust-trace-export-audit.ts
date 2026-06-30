/**
 * Batch trust trace export audit — Phase 5I-C read-only.
 */

import { auditTrustTraceExportContract } from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-audit";
import type { BatchTrustTraceExportAuditResult } from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";
import type { TrustTraceReport } from "@/lib/features/formula-governance/trust-trace-report/trust-trace-types";

function buildTopMissingSections(
  contracts: readonly ReturnType<typeof auditTrustTraceExportContract>[],
): string[] {
  const counts = new Map<string, number>();

  for (const contract of contracts) {
    for (const missing of contract.missingDataSources) {
      counts.set(missing, (counts.get(missing) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 10)
    .map(([section, count]) => `- ${section}: ${count}`);
}

export function runBatchTrustTraceExportAudit(
  trustTraceReports: readonly TrustTraceReport[],
): BatchTrustTraceExportAuditResult {
  const contracts = trustTraceReports.map((report) => auditTrustTraceExportContract(report));

  return {
    totalContracts: contracts.length,
    pdfReady: contracts.filter((contract) => contract.exportReadiness.pdfReady).length,
    excelReady: contracts.filter((contract) => contract.exportReadiness.excelReady).length,
    wordReady: contracts.filter((contract) => contract.exportReadiness.wordReady).length,
    blocked: contracts.filter((contract) => contract.status === "blocked").length,
    needsTraceData: contracts.filter((contract) => contract.status === "needs_trace_data").length,
    needsReportMapping: contracts.filter((contract) => contract.status === "needs_report_mapping")
      .length,
    topMissingSections: buildTopMissingSections(contracts),
    contracts,
    warnings: contracts.flatMap((contract) => contract.warnings),
    blockers: contracts.flatMap((contract) => contract.blockers),
  };
}

export function formatBatchTrustTraceExportAuditReport(
  result: BatchTrustTraceExportAuditResult,
): string {
  const lines = [
    "Trust Trace Export Contract Audit",
    `Total contracts: ${result.totalContracts}`,
    `PDF ready: ${result.pdfReady}`,
    `Excel ready: ${result.excelReady}`,
    `Word ready: ${result.wordReady}`,
    `Blocked: ${result.blocked}`,
    `Needs trace data: ${result.needsTraceData}`,
    `Needs report mapping: ${result.needsReportMapping}`,
    "",
    "Top missing sections:",
  ];

  if (result.topMissingSections.length === 0) {
    lines.push("- (none)");
  } else {
    lines.push(...result.topMissingSections);
  }

  return lines.join("\n");
}

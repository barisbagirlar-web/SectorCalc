/**
 * Batch report render dry-run audit - Phase 5I-I read-only.
 */

import { FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts";
import { buildReportRendererContract } from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-contract-builder";
import type { ReportRendererContract } from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-types";
import { runBatchTrustTraceAudit } from "@/lib/features/formula-governance/trust-trace-report/batch-trust-trace-audit";
import { runBatchTrustTraceExportAudit } from "@/lib/features/formula-governance/trust-trace-report/export-contract/batch-trust-trace-export-audit";
import { buildReportRenderDryRun } from "@/lib/features/formula-governance/report-renderer-contract/dry-run/report-render-dry-run-builder";
import { validateReportRenderDryRun } from "@/lib/features/formula-governance/report-renderer-contract/dry-run/report-render-dry-run-validator";
import type { BatchReportRenderDryRunAuditResult } from "@/lib/features/formula-governance/report-renderer-contract/dry-run/report-render-dry-run-types";

export function runBatchReportRenderDryRunAudit(
  contracts?: readonly ReportRendererContract[],
): BatchReportRenderDryRunAuditResult {
  const rendererContracts =
    contracts ??
    (() => {
      const trustAudit = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
      const exportAudit = runBatchTrustTraceExportAudit(trustAudit.reports);
      return exportAudit.contracts.map(buildReportRendererContract);
    })();

  const dryRuns = rendererContracts.map((contract) => {
    const draft = buildReportRenderDryRun(contract, "pdf");
    return validateReportRenderDryRun(draft, contract);
  });

  const fileOutputGeneratedCount = dryRuns.filter((run) => run.fileOutputGenerated).length;

  return {
    totalDryRuns: dryRuns.length,
    dryRunReady: dryRuns.filter((run) => run.status === "dry_run_ready").length,
    needsData: dryRuns.filter((run) => run.status === "needs_data").length,
    blocked: dryRuns.filter((run) => run.status === "blocked").length,
    fileOutputGeneratedCount,
    dryRuns,
    blockers: [...new Set(dryRuns.flatMap((run) => run.blockers))],
    warnings: [...new Set(dryRuns.flatMap((run) => run.warnings))],
  };
}

export function formatBatchReportRenderDryRunReport(
  result: BatchReportRenderDryRunAuditResult,
): string {
  return [
    "Report Render Dry Run Audit",
    `Total dry runs: ${result.totalDryRuns}`,
    `Dry run ready: ${result.dryRunReady}`,
    `Needs data: ${result.needsData}`,
    `Blocked: ${result.blocked}`,
    `File output generated count: ${result.fileOutputGeneratedCount}`,
  ].join("\n");
}

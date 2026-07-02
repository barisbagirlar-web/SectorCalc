/**
 * Batch trust trace audit - Phase 5H-I read-only across FormulaContracts.
 */

import { runBatchInputDesignAudit } from "@/lib/features/formula-governance/input-design-audit/batch-input-design-audit";
import { buildExistingToolMigrationPlan } from "@/lib/features/formula-governance/input-design-audit/migration-plan/migration-planner";
import { runBatchAlignmentAudit } from "@/lib/features/formula-governance/requirement-engine/batch-alignment-audit";
import { auditTrustTraceReport } from "@/lib/features/formula-governance/trust-trace-report/trust-trace-report-audit";
import type {
  BatchTrustTraceAuditResult,
  TrustTraceReport,
} from "@/lib/features/formula-governance/trust-trace-report/trust-trace-types";
import type { FormulaContract } from "@/lib/features/formula-governance/types";

export type RunBatchTrustTraceAuditParams = {
  readonly contracts: readonly FormulaContract[];
};

function buildTopRisks(reports: readonly TrustTraceReport[]): string[] {
  return [...reports]
    .filter((report) => report.status !== "trust_trace_ready")
    .sort((left, right) => left.trustScore - right.trustScore)
    .slice(0, 10)
    .map(
      (report) =>
        `- ${report.slug}: ${report.status}, trustScore ${report.trustScore}, blockers ${report.blockers.length}`,
    );
}

function buildRecommendedNextActions(reports: readonly TrustTraceReport[]): string[] {
  const actions: string[] = [];

  const blocked = reports.filter((report) => report.status === "blocked");
  if (blocked.length > 0) {
    actions.push(`Resolve blockers for ${blocked.length} blocked trust trace(s).`);
  }

  const missingProduction = reports.filter(
    (report) => report.blockers.some((blocker) => blocker.includes("Production:")),
  );
  if (missingProduction.length > 0) {
    actions.push(`Add Production: assumption metadata for ${missingProduction.length} contract(s).`);
  }

  const needsReview = reports.filter((report) => report.status === "needs_review");
  if (needsReview.length > 0) {
    actions.push(`Review ${needsReview.length} trust trace(s) for report export readiness.`);
  }

  const ready = reports.filter((report) => report.status === "trust_trace_ready");
  if (ready.length > 0) {
    actions.push(`Monitor ${ready.length} trust_trace_ready tool(s) for alignment drift.`);
  }

  return actions;
}

export function runBatchTrustTraceAudit(
  params: RunBatchTrustTraceAuditParams,
): BatchTrustTraceAuditResult {
  const { contracts } = params;
  const inputDesignAudit = runBatchInputDesignAudit({ contracts });
  const alignmentAudit = runBatchAlignmentAudit({ contracts });
  const migrationPlan = buildExistingToolMigrationPlan({
    inputDesignAudit,
    alignmentAudit,
    contracts,
  });

  const reports: TrustTraceReport[] = [];

  for (const contract of contracts) {
    const inputDesignSummary = inputDesignAudit.summaries.find(
      (summary) => summary.slug === contract.slug,
    );
    const migrationItem = migrationPlan.items.find((item) => item.slug === contract.slug);
    const alignmentSummary = alignmentAudit.summaries.find(
      (summary) => summary.slug === contract.slug,
    );

    reports.push(
      auditTrustTraceReport({
        contract,
        inputDesignSummary,
        migrationItem,
        alignmentSummary,
      }),
    );
  }

  const trustTraceReady = reports.filter((report) => report.status === "trust_trace_ready").length;
  const needsReview = reports.filter((report) => report.status === "needs_review").length;
  const blocked = reports.filter((report) => report.status === "blocked").length;
  const reportExportReady = reports.filter((report) => report.reportExportReadiness.pdfReady).length;
  const averageTrustScore =
    reports.length > 0
      ? Math.round(reports.reduce((sum, report) => sum + report.trustScore, 0) / reports.length)
      : 0;

  return {
    totalContracts: contracts.length,
    trustTraceReady,
    needsReview,
    blocked,
    reportExportReady,
    averageTrustScore,
    topRisks: buildTopRisks(reports),
    recommendedNextActions: buildRecommendedNextActions(reports),
    reports,
    warnings: inputDesignAudit.warnings,
    blockers: inputDesignAudit.blockers,
  };
}

export function formatBatchTrustTraceAuditReport(result: BatchTrustTraceAuditResult): string {
  const lines = [
    "Trust Trace Report Audit",
    `Total contracts: ${result.totalContracts}`,
    `Trust trace ready: ${result.trustTraceReady}`,
    `Needs review: ${result.needsReview}`,
    `Blocked: ${result.blocked}`,
    `Report export ready: ${result.reportExportReady}`,
    `Average trust score: ${result.averageTrustScore}`,
    "",
    "Top risks:",
  ];

  if (result.topRisks.length === 0) {
    lines.push("- (none)");
  } else {
    lines.push(...result.topRisks);
  }

  lines.push("", "Recommended next actions:");
  if (result.recommendedNextActions.length === 0) {
    lines.push("- (none)");
  } else {
    for (const action of result.recommendedNextActions) {
      lines.push(`- ${action}`);
    }
  }

  return lines.join("\n");
}

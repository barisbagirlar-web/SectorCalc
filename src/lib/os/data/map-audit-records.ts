import type { GlobalAuditStatus } from "@/lib/os/core/audit-engine";
import type { AuditRecord } from "@/lib/os/data/audit-archive-data";
import { formatPremiumPdfUsd } from "@/lib/features/reports/premium-pdf-data";
import type { SavedVerdictReport } from "@/lib/features/reports/report-storage";
import type { PremiumSeverity } from "@/lib/features/tools/premium-tool-results";

function severityToAuditStatus(severity: PremiumSeverity): GlobalAuditStatus {
  return severity === "danger" || severity === "watch" ? "CRITICAL" : "OPTIMAL";
}

function resolveFinancialImpact(report: SavedVerdictReport): string {
  if (report.margincore && report.margincore.riskBuffer > 0) {
    return formatPremiumPdfUsd(report.margincore.riskBuffer);
  }

  const primary = report.result.primaryMetricValue.trim();
  if (primary.length > 0) {
    return primary;
  }

  return "-";
}

export function savedReportToAuditRecord(report: SavedVerdictReport): AuditRecord {
  return {
    id: report.id,
    timestamp: report.updatedAt || report.createdAt,
    sector: report.sector,
    financialImpact: resolveFinancialImpact(report),
    status: severityToAuditStatus(report.result.severity),
  };
}

export function savedReportsToAuditRecords(reports: readonly SavedVerdictReport[]): AuditRecord[] {
  return reports.map(savedReportToAuditRecord);
}

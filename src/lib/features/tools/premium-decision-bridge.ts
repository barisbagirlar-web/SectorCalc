/**
 * Maps contract-engine PremiumDecisionReport to legacy PremiumToolResult for PDF/save/analytics.
 */

import type { PremiumDecisionReport } from "@/lib/features/tools/premium-tool-contract";
import type { PremiumToolResult, PremiumSeverity } from "@/lib/features/tools/premium-tool-results";

function toUiSeverity(
  verdictSeverity: PremiumDecisionReport["verdict"]["severity"],
): PremiumSeverity {
  if (verdictSeverity === "accept") {
    return "safe";
  }
  if (verdictSeverity === "reject") {
    return "danger";
  }
  return "watch";
}

export function mapDecisionReportToPremiumToolResult(
  report: PremiumDecisionReport,
): PremiumToolResult {
  const riskDrivers = report.hiddenLossDrivers.map(
    (driver) => `${driver.label}: ${driver.amountDisplay}`,
  );

  if (report.sensitivity.length > 0) {
    riskDrivers.push(report.sensitivity[0]?.impactSummary ?? "Sensitivity reviewed.");
  }

  return {
    verdict: report.verdict.label,
    headline: report.summary,
    primaryMetricLabel: report.primaryMetricLabel,
    primaryMetricValue: report.primaryMetricValue,
    riskDrivers: riskDrivers.slice(0, 8),
    suggestedAction: report.recommendation,
    severity: toUiSeverity(report.verdict.severity),
  };
}

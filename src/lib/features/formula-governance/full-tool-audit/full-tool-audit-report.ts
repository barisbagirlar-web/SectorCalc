/**
 * Full existing tool audit report formatter - Phase 5H-J.
 */

import type { FullExistingToolAuditResult } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-types";

export function formatFullExistingToolAuditReport(result: FullExistingToolAuditResult): string {
  const lines = [
    "Full Existing Tool Audit",
    `Total tools: ${result.totalTools}`,
    `Production safe: ${result.productionSafeCount}`,
    `Smart form ready: ${result.smartFormReadyCount}`,
    `Trust trace ready: ${result.trustTraceReadyCount}`,
    `Report ready: ${result.reportReadyCount}`,
    `Blocked/manual review: ${result.blockedCount}`,
    "",
    "Recommended batches:",
    `- metadata: ${result.recommendedBatches.metadataBatch.length}`,
    `- smartForm: ${result.recommendedBatches.smartFormBatch.length}`,
    `- report: ${result.recommendedBatches.reportBatch.length}`,
    `- fixture: ${result.recommendedBatches.fixtureBatch.length}`,
    `- manualReview: ${result.recommendedBatches.manualReviewBatch.length}`,
    "",
    "Top 10 risks:",
  ];

  if (result.top10Risks.length === 0) {
    lines.push("- (none)");
  } else {
    lines.push(...result.top10Risks);
  }

  lines.push("", "Top 10 quick wins:");
  if (result.top10QuickWins.length === 0) {
    lines.push("- (none)");
  } else {
    lines.push(...result.top10QuickWins);
  }

  return lines.join("\n");
}

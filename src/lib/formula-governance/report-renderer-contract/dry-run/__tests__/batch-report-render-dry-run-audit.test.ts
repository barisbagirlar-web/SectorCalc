/**
 * Batch report render dry-run audit tests — Phase 5I-I.
 */

import { describe, expect, test } from "vitest";
import { runBatchReportRenderDryRunAudit } from "@/lib/formula-governance/report-renderer-contract/dry-run/batch-report-render-dry-run-audit";

describe("batch report render dry-run audit — Phase 5I-I", () => {
  test("batch audit is deterministic", () => {
    const first = runBatchReportRenderDryRunAudit();
    const second = runBatchReportRenderDryRunAudit();
    expect(first.totalDryRuns).toBe(second.totalDryRuns);
    expect(first.dryRunReady).toBe(second.dryRunReady);
    expect(first.fileOutputGeneratedCount).toBe(0);
  });

  test("file output generated count is always zero", () => {
    const result = runBatchReportRenderDryRunAudit();
    expect(result.fileOutputGeneratedCount).toBe(0);
    expect(result.dryRuns.every((run) => run.fileOutputGenerated === false)).toBe(true);
  });
});

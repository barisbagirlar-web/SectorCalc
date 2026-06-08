/**
 * Batch remediation apply audit tests — Phase 5I-J.
 */

import { describe, expect, test } from "vitest";
import { runBatchRemediationApplyAudit } from "@/lib/formula-governance/full-tool-audit/remediation/apply-gate/batch-remediation-apply-audit";

describe("batch remediation apply audit — Phase 5I-J", () => {
  test("batch audit is stable", () => {
    const first = runBatchRemediationApplyAudit();
    const second = runBatchRemediationApplyAudit();
    expect(first.batchId).toBe(second.batchId);
    expect(first.canApplyCount).toBe(0);
    expect(first.applyCommandGeneratedCount).toBe(0);
  });

  test("canApply count is always zero", () => {
    const result = runBatchRemediationApplyAudit();
    expect(result.canApplyCount).toBe(0);
    expect(result.gate.canApply).toBe(false);
  });
});

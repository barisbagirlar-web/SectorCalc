/**
 * Phase 5H-B-7 — alignment audit CLI shape tests.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import {
  formatBatchAlignmentAuditReport,
  runBatchAlignmentAudit,
} from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";

const ROOFING_SLUG = "roofing-contract-margin-guard";
const CNC_SLUG = "cnc-quote-risk-analyzer";

describe("alignment audit script shape", () => {
  test("audit summary totalContracts is deterministic", () => {
    const result = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });

    expect(result.totalContracts).toBe(41);
    expect(result.summaries.length).toBe(41);
  });

  test("evaluated / needsReview / blocked / skipped counts are deterministic", () => {
    const first = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
    const second = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });

    expect(first.evaluatedContracts).toBe(2);
    expect(first.lowRisk).toBe(0);
    expect(first.needsReview).toBe(1);
    expect(first.blocked).toBe(1);
    expect(first.skipped).toBe(39);
    expect(second).toEqual(first);
  });

  test("formatted report does not throw for blocked alignment", () => {
    const result = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });

    expect(() => formatBatchAlignmentAuditReport(result)).not.toThrow();
    const formatted = formatBatchAlignmentAuditReport(result);
    expect(formatted).toContain("Alignment Audit Summary");
    expect(formatted).toContain("Blocked: 1");
  });

  test("top findings include roofing and cnc", () => {
    const result = runBatchAlignmentAudit({ contracts: FORMULA_CONTRACTS });
    const formatted = formatBatchAlignmentAuditReport(result);

    expect(formatted).toContain(ROOFING_SLUG);
    expect(formatted).toContain(CNC_SLUG);
    expect(formatted).toContain("needs_review");
    expect(formatted).toContain("blocked");
  });
});

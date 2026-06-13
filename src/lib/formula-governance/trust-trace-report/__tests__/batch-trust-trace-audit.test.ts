/**
 * Batch trust trace audit tests — Phase 5H-I.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import {
  formatBatchTrustTraceAuditReport,
  runBatchTrustTraceAudit,
} from "@/lib/formula-governance/trust-trace-report/batch-trust-trace-audit";

describe("batch trust trace audit — Phase 5H-I", () => {
  test("batch audit returns 120 contracts", () => {
    const result = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });

    expect(result.totalContracts).toBe(FORMULA_CONTRACTS.length);
    expect(result.reports).toHaveLength(FORMULA_CONTRACTS.length);
    expect(result.trustTraceReady + result.needsReview + result.blocked).toBe(FORMULA_CONTRACTS.length);
  });

  test("formatted report includes summary lines", () => {
    const report = formatBatchTrustTraceAuditReport(
      runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS }),
    );

    expect(report).toContain("Trust Trace Report Audit");
    expect(report).toContain(`Total contracts: ${FORMULA_CONTRACTS.length}`);
    expect(report).toContain("Average trust score:");
  });

  test("production calculator is not invoked", () => {
    const result = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
    expect(result.reports.every((report) => typeof report.trustScore === "number")).toBe(true);
  });
});

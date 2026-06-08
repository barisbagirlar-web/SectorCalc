/**
 * Batch trust trace export audit tests — Phase 5I-C.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { runBatchTrustTraceAudit } from "@/lib/formula-governance/trust-trace-report/batch-trust-trace-audit";
import {
  formatBatchTrustTraceExportAuditReport,
  runBatchTrustTraceExportAudit,
} from "@/lib/formula-governance/trust-trace-report/export-contract/batch-trust-trace-export-audit";

describe("batch trust trace export audit — Phase 5I-C", () => {
  test("batch audit is deterministic for 41 contracts", () => {
    const trustAudit = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
    const first = runBatchTrustTraceExportAudit(trustAudit.reports);
    const second = runBatchTrustTraceExportAudit(trustAudit.reports);

    expect(first.totalContracts).toBe(131);
    expect(first.pdfReady).toBe(second.pdfReady);
    expect(first.excelReady).toBe(second.excelReady);
  });

  test("formatted report includes summary", () => {
    const trustAudit = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
    const report = formatBatchTrustTraceExportAuditReport(
      runBatchTrustTraceExportAudit(trustAudit.reports),
    );

    expect(report).toContain("Trust Trace Export Contract Audit");
    expect(report).toContain("Total contracts: 131");
  });
});

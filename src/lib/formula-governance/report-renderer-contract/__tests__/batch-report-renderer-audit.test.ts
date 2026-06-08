/**
 * Batch report renderer audit tests — Phase 5I-F.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { runBatchReportRendererAudit } from "@/lib/formula-governance/report-renderer-contract/batch-report-renderer-audit";
import { runBatchTrustTraceAudit } from "@/lib/formula-governance/trust-trace-report/batch-trust-trace-audit";
import { runBatchTrustTraceExportAudit } from "@/lib/formula-governance/trust-trace-report/export-contract/batch-trust-trace-export-audit";

describe("batch report renderer audit — Phase 5I-F", () => {
  test("batch audit is deterministic for 41 contracts", () => {
    const trustAudit = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
    const exportAudit = runBatchTrustTraceExportAudit(trustAudit.reports);
    const first = runBatchReportRendererAudit(exportAudit.contracts);
    const second = runBatchReportRendererAudit(exportAudit.contracts);

    expect(first.totalContracts).toBe(41);
    expect(first.rendererReady).toBe(second.rendererReady);
    expect(first.pdfReady).toBe(second.pdfReady);
  });
});

/**
 * Report render dry-run tests — Phase 5I-I.
 */

import { describe, expect, test } from "vitest";
import { buildReportRenderDryRun, estimatePageCount, estimateSheetCount, estimateWordSections } from "@/lib/formula-governance/report-renderer-contract/dry-run/report-render-dry-run-builder";
import { validateReportRenderDryRun } from "@/lib/formula-governance/report-renderer-contract/dry-run/report-render-dry-run-validator";
import type { ReportRendererContract } from "@/lib/formula-governance/report-renderer-contract/report-renderer-types";

function buildContract(overrides: Partial<ReportRendererContract>): ReportRendererContract {
  return {
    slug: "test-tool",
    title: "Test Tool",
    sourceTrustTraceExportContract: { slug: "test-tool", status: "export_contract_ready" },
    supportedFormats: ["pdf", "excel", "word"],
    sections: ["cover", "executive_summary", "input_table"],
    formatRules: {
      pdf: { pageSize: "A4", maxTableRowsPerPage: 25, disclaimerPosition: "footer" },
      excel: { sheets: ["Summary"], frozenHeader: true, numericColumns: ["trustScore"] },
      word: { headingLevels: [1, 2], tableStyle: "sectorcalc-audit-table", appendixStyle: "sectorcalc-audit-appendix" },
    },
    dataContract: {
      requiredFields: ["slug", "reportTitle", "trustScore"],
      optionalFields: ["warningTrace"],
      redactedFields: ["internal_notes"],
      prohibitedFields: ["secrets", "raw_env", "firebase_credentials", "internal_stack_traces", "llm_formula_claims", "user_pii_unapproved"],
    },
    readiness: { pdfRendererReady: true, excelRendererReady: true, wordRendererReady: true },
    status: "renderer_contract_ready",
    blockers: [],
    warnings: [],
    ...overrides,
  };
}

describe("report render dry-run — Phase 5I-I", () => {
  test("renderer_contract_ready yields dry_run_ready", () => {
    const contract = buildContract({ status: "renderer_contract_ready" });
    const dryRun = validateReportRenderDryRun(buildReportRenderDryRun(contract), contract);
    expect(dryRun.status).toBe("dry_run_ready");
  });

  test("needs_trace_data yields needs_data", () => {
    const contract = buildContract({ status: "needs_trace_data" });
    const dryRun = validateReportRenderDryRun(buildReportRenderDryRun(contract), contract);
    expect(dryRun.status).toBe("needs_data");
  });

  test("blocked contract yields blocked", () => {
    const contract = buildContract({ status: "blocked", blockers: ["blocked"] });
    const dryRun = validateReportRenderDryRun(buildReportRenderDryRun(contract), contract);
    expect(dryRun.status).toBe("blocked");
  });

  test("fileOutputGenerated stays false", () => {
    const contract = buildContract({});
    const dryRun = buildReportRenderDryRun(contract);
    expect(dryRun.fileOutputGenerated).toBe(false);
  });

  test("PDF page estimate is deterministic", () => {
    expect(estimatePageCount(10, 50)).toBe(estimatePageCount(10, 50));
    expect(estimatePageCount(3, 1)).toBeGreaterThanOrEqual(1);
  });

  test("Excel sheet estimate is deterministic", () => {
    expect(estimateSheetCount("loan-payment-calculator", 10)).toBe(
      estimateSheetCount("loan-payment-calculator", 10),
    );
  });

  test("Word section estimate is deterministic", () => {
    expect(estimateWordSections(8)).toBe(10);
  });

  test("redaction rules include prohibited fields", () => {
    const contract = buildContract({});
    const dryRun = validateReportRenderDryRun(buildReportRenderDryRun(contract), contract);
    expect(contract.dataContract.prohibitedFields).toContain("secrets");
    expect(dryRun.prohibitedFieldViolations.length).toBe(0);
  });

  test("no actual file output", () => {
    const contract = buildContract({});
    const dryRun = buildReportRenderDryRun(contract);
    expect(dryRun.canRenderWithoutFileOutput).toBe(true);
    expect(dryRun.fileOutputGenerated).toBe(false);
  });
});

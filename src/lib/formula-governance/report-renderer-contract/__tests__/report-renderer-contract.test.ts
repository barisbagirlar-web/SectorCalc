/**
 * Report renderer contract tests — Phase 5I-F.
 */

import { describe, expect, test } from "vitest";
import { buildReportRendererContract } from "@/lib/formula-governance/report-renderer-contract/report-renderer-contract-builder";
import { buildFormatRules } from "@/lib/formula-governance/report-renderer-contract/report-renderer-format-contract";
import type { TrustTraceExportContract } from "@/lib/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";

function buildExportContract(
  overrides: Partial<TrustTraceExportContract>,
): TrustTraceExportContract {
  return {
    slug: "sample-tool",
    reportTitle: "Sample Tool",
    exportFormats: ["pdf", "excel", "word"],
    sections: ["executive_summary", "audit_appendix"],
    requiredDataSources: ["formula_contract", "trust_trace_report"],
    missingDataSources: [],
    redactionRules: ["no_secrets", "no_raw_env", "no_firebase_credentials", "no_user_pii_unless_allowed", "no_unverified_llm_formula", "no_internal_stack_traces"],
    disclaimerRequired: true,
    exportReadiness: { pdfReady: true, excelReady: true, wordReady: true },
    status: "export_contract_ready",
    blockers: [],
    warnings: [],
    ...overrides,
  };
}

describe("report renderer contract — Phase 5I-F", () => {
  test("export_contract_ready maps to renderer_contract_ready", () => {
    const contract = buildReportRendererContract(buildExportContract({}));
    expect(contract.status).toBe("renderer_contract_ready");
    expect(contract.readiness.pdfRendererReady).toBe(true);
  });

  test("needs_trace_data maps correctly", () => {
    const contract = buildReportRendererContract(
      buildExportContract({ status: "needs_trace_data", exportReadiness: { pdfReady: false, excelReady: false, wordReady: false } }),
    );
    expect(contract.status).toBe("needs_trace_data");
  });

  test("blocked export maps to blocked", () => {
    const contract = buildReportRendererContract(
      buildExportContract({ status: "blocked", blockers: ["blocked"] }),
    );
    expect(contract.status).toBe("blocked");
  });

  test("PDF/Excel/Word rules are deterministic", () => {
    const rules = buildFormatRules("sample-tool");
    expect(rules.pdf.pageSize).toBe("A4");
    expect(rules.excel.sheets).toEqual(["Summary", "Inputs", "Coverage", "Audit"]);
    expect(rules.word.headingLevels).toEqual([1, 2, 3]);
  });

  test("prohibitedFields include secrets and env", () => {
    const contract = buildReportRendererContract(buildExportContract({}));
    expect(contract.dataContract.prohibitedFields).toContain("secrets");
    expect(contract.dataContract.prohibitedFields).toContain("raw_env");
    expect(contract.dataContract.prohibitedFields).toContain("internal_stack_traces");
  });

  test("no actual file output property", () => {
    const contract = buildReportRendererContract(buildExportContract({}));
    expect(contract).not.toHaveProperty("outputFilePath");
    expect(contract).not.toHaveProperty("binaryPayload");
  });
});

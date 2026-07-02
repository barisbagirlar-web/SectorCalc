/**
 * Trust trace export contract tests - Phase 5I-C.
 */

import { describe, expect, test } from "vitest";
import { buildTrustTraceExportContract } from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-contract-builder";
import { auditTrustTraceExportContract } from "@/lib/features/formula-governance/trust-trace-report/export-contract/trust-trace-export-audit";
import type { TrustTraceReport } from "@/lib/features/formula-governance/trust-trace-report/trust-trace-types";

function buildSampleReport(overrides: Partial<TrustTraceReport>): TrustTraceReport {
  return {
    slug: "sample-tool",
    title: "Sample Tool",
    tier: "free",
    riskLevel: "medium",
    inputTrace: [{ key: "a", classification: "required", source: "contract", readonly: false }],
    requiredInputs: ["a"],
    optionalInputs: [],
    advancedInputs: [],
    defaultedInputs: [],
    acceptedAssumptions: ["assumption"],
    derivedFields: [],
    validationTrace: ["rule-1"],
    formulaContractTrace: ["purpose"],
    ontologyTrace: ["alignment: low_risk"],
    requirementEngineTrace: ["inputDesign: professional_ready"],
    oracleCoverage: { status: "pass", wired: true, detail: "pass" },
    scenarioCoverage: { status: "pass", wired: true, detail: "1/1" },
    propertyCoverage: { status: "pass", wired: true, detail: "registered" },
    warningTrace: ["warning"],
    limitationTrace: ["model limitation"],
    reportExportReadiness: { pdfReady: true, excelReady: true, wordReady: true, blockers: [], warnings: [] },
    trustScore: 90,
    status: "trust_trace_ready",
    blockers: [],
    warnings: [],
    ...overrides,
  };
}

describe("trust trace export contract - Phase 5I-C", () => {
  test("trust_trace_ready maps to export_contract_ready", () => {
    const contract = buildTrustTraceExportContract(buildSampleReport({}));
    expect(contract.status).toBe("export_contract_ready");
    expect(contract.exportReadiness.pdfReady).toBe(true);
  });

  test("needs_review maps to needs_trace_data", () => {
    const contract = buildTrustTraceExportContract(
      buildSampleReport({ status: "needs_review", trustScore: 70 }),
    );
    expect(contract.status).toBe("needs_trace_data");
  });

  test("blocked maps to blocked", () => {
    const contract = buildTrustTraceExportContract(
      buildSampleReport({ status: "blocked", blockers: ["blocked"] }),
    );
    expect(contract.status).toBe("blocked");
  });

  test("disclaimer required and redaction rules include no secrets/no raw env", () => {
    const contract = auditTrustTraceExportContract(buildSampleReport({}));
    expect(contract.disclaimerRequired).toBe(true);
    expect(contract.redactionRules).toContain("no_secrets");
    expect(contract.redactionRules).toContain("no_raw_env");
  });

  test("sections include audit appendix", () => {
    const contract = buildTrustTraceExportContract(buildSampleReport({}));
    expect(contract.sections).toContain("audit_appendix");
  });

  test("no actual file export is performed", () => {
    const contract = buildTrustTraceExportContract(buildSampleReport({}));
    expect(contract.exportFormats).toEqual(["pdf", "excel", "word"]);
    expect(contract).not.toHaveProperty("filePath");
  });
});

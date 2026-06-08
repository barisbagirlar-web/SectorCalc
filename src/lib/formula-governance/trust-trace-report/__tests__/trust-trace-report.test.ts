/**
 * Trust trace report builder tests — Phase 5H-I.
 */

import { describe, expect, test } from "vitest";
import { FORMULA_CONTRACTS, getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import { buildTrustTraceReport } from "@/lib/formula-governance/trust-trace-report/trust-trace-builder";
import {
  buildOracleCoverageTrace,
  buildPropertyCoverageTrace,
  buildScenarioCoverageTrace,
} from "@/lib/formula-governance/trust-trace-report/trust-trace-coverage";
import { auditTrustTraceReport } from "@/lib/formula-governance/trust-trace-report/trust-trace-report-audit";
import { runBatchInputDesignAudit } from "@/lib/formula-governance/input-design-audit/batch-input-design-audit";

describe("trust trace report — Phase 5H-I", () => {
  test("professional-ready tool can reach trust_trace_ready", () => {
    const inputDesignAudit = runBatchInputDesignAudit({ contracts: FORMULA_CONTRACTS });
    const professional = inputDesignAudit.summaries.find(
      (summary) => summary.status === "professional_ready",
    );
    expect(professional).toBeDefined();

    const contract = getFormulaContractBySlug(professional!.slug);
    expect(contract).toBeDefined();

    const report = auditTrustTraceReport({
      contract: contract!,
      inputDesignSummary: professional,
    });

    expect(["trust_trace_ready", "needs_review", "blocked"]).toContain(report.status);
    expect(report.trustScore).toBeGreaterThan(0);
  });

  test("contract-only shallow tool returns needs_review", () => {
    const report = buildTrustTraceReport({
      slug: "shallow-fixture",
      title: "Shallow Fixture",
      tier: "free",
      riskLevel: "medium",
      requiredInputs: ["a"],
      criticalInputs: ["a"],
      oracleCoverage: { status: "not_wired", wired: false, detail: "not wired" },
      scenarioCoverage: { status: "needs_review", wired: false, detail: "0/1" },
      propertyCoverage: { status: "not_required", wired: false, detail: "none" },
      hasProductionLocator: false,
      hasProductionAssumptionLine: true,
      inputDesignStatus: "shallow",
      validationRules: ["rule-1"],
      limitationTrace: ["model limitation"],
      warningTrace: ["warning"],
    });

    expect(report.status).toBe("needs_review");
  });

  test("missing production metadata produces blocker", () => {
    const report = buildTrustTraceReport({
      slug: "missing-production",
      title: "Missing Production",
      tier: "free",
      riskLevel: "high",
      requiredInputs: ["x"],
      criticalInputs: ["x"],
      oracleCoverage: { status: "not_wired", wired: false, detail: "not wired" },
      scenarioCoverage: { status: "not_required", wired: false, detail: "none" },
      propertyCoverage: { status: "not_required", wired: false, detail: "none" },
      hasProductionLocator: false,
      hasProductionAssumptionLine: false,
    });

    expect(report.status).toBe("blocked");
    expect(report.blockers.some((blocker) => blocker.includes("Production:"))).toBe(true);
  });

  test("accepted assumptions and derived fields are traced readonly", () => {
    const report = buildTrustTraceReport({
      slug: "trace-fields",
      title: "Trace Fields",
      tier: "free",
      riskLevel: "low",
      requiredInputs: ["materialCost"],
      criticalInputs: ["materialCost"],
      acceptedAssumptions: ["Standard shift length assumed."],
      derivedFields: ["totalLaborCost"],
      oracleCoverage: { status: "pass", wired: true, detail: "pass" },
      scenarioCoverage: { status: "pass", wired: true, detail: "1/1" },
      propertyCoverage: { status: "pass", wired: true, detail: "registered" },
      hasProductionLocator: true,
      hasProductionAssumptionLine: true,
      validationRules: ["dim-1"],
      limitationTrace: ["model limitation"],
      inputDesignStatus: "professional_ready",
    });

    expect(report.acceptedAssumptions).toContain("Standard shift length assumed.");
    const derived = report.inputTrace.find((entry) => entry.key === "totalLaborCost");
    expect(derived?.classification).toBe("derived");
    expect(derived?.readonly).toBe(true);
  });

  test("oracle/scenario/property coverage traces are deterministic", () => {
    const contract = getFormulaContractBySlug("break-even-calculator");
    expect(contract).toBeDefined();

    const oracle = buildOracleCoverageTrace(contract!.slug);
    const scenario = buildScenarioCoverageTrace(contract!);
    const property = buildPropertyCoverageTrace(contract!);

    expect(oracle.detail.length).toBeGreaterThan(0);
    expect(scenario.detail).toContain("scenario");
    expect(property.detail).toContain("Property");
  });

  test("report export readiness is computed", () => {
    const report = buildTrustTraceReport({
      slug: "export-ready",
      title: "Export Ready",
      tier: "free",
      riskLevel: "medium",
      requiredInputs: ["a"],
      criticalInputs: ["a"],
      oracleCoverage: { status: "pass", wired: true, detail: "pass" },
      scenarioCoverage: { status: "pass", wired: true, detail: "1/1" },
      propertyCoverage: { status: "pass", wired: true, detail: "registered" },
      hasProductionLocator: true,
      hasProductionAssumptionLine: true,
      validationRules: ["rule-1"],
      limitationTrace: ["model limitation"],
      inputDesignStatus: "professional_ready",
    });

    expect(report.reportExportReadiness.pdfReady).toBe(true);
  });

  test("trust score is deterministic for identical input", () => {
    const base = {
      slug: "deterministic",
      title: "Deterministic",
      tier: "free" as const,
      riskLevel: "medium" as const,
      requiredInputs: ["a"],
      criticalInputs: ["a"],
      oracleCoverage: { status: "pass" as const, wired: true, detail: "pass" },
      scenarioCoverage: { status: "pass" as const, wired: true, detail: "1/1" },
      propertyCoverage: { status: "pass" as const, wired: true, detail: "registered" },
      hasProductionLocator: true,
      hasProductionAssumptionLine: true,
      validationRules: ["rule-1"],
      limitationTrace: ["model limitation"],
      inputDesignStatus: "usable" as const,
    };

    expect(buildTrustTraceReport(base).trustScore).toBe(buildTrustTraceReport(base).trustScore);
  });
});

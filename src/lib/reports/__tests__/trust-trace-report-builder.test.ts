/**
 * Trust trace export payload builder tests — ADIM 3.
 */

import { describe, expect, test } from "vitest";
import { runFreeFullLoopCalculation } from "@/lib/formula-governance/runtime-validation/free-full-loop-bridge";
import { runPremiumFullLoopCalculation } from "@/lib/formula-governance/runtime-validation/premium-full-loop-bridge";
import {
  buildTrustTraceReportFileName,
  buildTrustTraceReportPayload,
} from "@/lib/reports/trust-trace-report-builder";

const WELDING_SLUG = "welding-bid-risk-analyzer";
const WELDING_TITLE = "Welding Bid Risk Analyzer";
const WELDING_INPUTS = {
  materialCost: 1200,
  laborHours: 8,
  laborRate: 65,
  gasConsumableCost: 85,
  fitUpHours: 2,
  reworkRiskPercent: 10,
  targetMargin: 25,
} as const;

const REPAIR_FREE_SLUG = "repair-time-vs-price-check";
const REPAIR_FREE_TITLE = "Repair Time vs Price Check";
const REPAIR_FREE_INPUTS = {
  quotedPrice: 850,
  repairHours: 2.5,
  partsCost: 180,
} as const;

describe("buildTrustTraceReportPayload", () => {
  test("builds export-ready payload from premium full-loop success", () => {
    const loopResult = runPremiumFullLoopCalculation(WELDING_SLUG, { ...WELDING_INPUTS });
    expect(loopResult.status).toBe("success");

    const payload = buildTrustTraceReportPayload({
      toolSlug: WELDING_SLUG,
      toolTitle: WELDING_TITLE,
      tier: "premium",
      fullLoopResult: loopResult,
      canonicalInputValues: { ...WELDING_INPUTS },
      locale: "en-US",
      generatedAt: "2026-06-09T12:00:00.000Z",
    });

    expect(payload.slug).toBe(WELDING_SLUG);
    expect(payload.toolTitle).toBe(WELDING_TITLE);
    expect(payload.tier).toBe("premium");
    expect(payload.calculationStatus).toBe("success");
    expect(payload.locale).toBe("en-US");
    expect(payload.generatedAt).toBe("2026-06-09T12:00:00.000Z");
    expect(payload.fileOutputGenerated).toBe(false);
    expect(payload.exportFormats).toEqual(["pdf", "excel", "word"]);
    expect(payload.formulaContract.slug).toBe(WELDING_SLUG);
    expect(payload.formulaContract.version).toBe(payload.formulaContract.toolId);
    expect(payload.trustTrace).toBe(loopResult.trustTrace);
    expect(payload.mind2Precalc.requirementStatus).toBeTruthy();
    expect(payload.mind2Precalc.readinessStatus).toBeTruthy();
    expect(payload.mind1Postcalc.validationPassed).toBe(true);
    expect(payload.canonicalInputs.some((entry) => entry.key === "laborHours")).toBe(true);
    expect(payload.coverageSummary.oracle).toBeDefined();
    expect(payload.coverageSummary.scenario).toBeDefined();
    expect(payload.coverageSummary.property).toBeDefined();
    expect(payload.disclaimer.length).toBeGreaterThan(20);
    expect(payload.usageAgreement.length).toBeGreaterThan(0);
    expect(["export_ready", "needs_review"]).toContain(payload.exportStatus);
  });

  test("builds blocked payload from premium full-loop missing inputs", () => {
    const loopResult = runPremiumFullLoopCalculation(WELDING_SLUG, {
      materialCost: 1200,
    });
    expect(loopResult.status).toBe("blocked");

    const payload = buildTrustTraceReportPayload({
      toolSlug: WELDING_SLUG,
      toolTitle: WELDING_TITLE,
      tier: "premium",
      fullLoopResult: loopResult,
      generatedAt: "2026-06-09T12:00:00.000Z",
    });

    expect(payload.calculationStatus).toBe("blocked");
    expect(payload.exportStatus).toBe("blocked");
    expect(payload.blockers.length).toBeGreaterThan(0);
    expect(payload.mind2Precalc.requiredMissingInputs.length).toBeGreaterThan(0);
    if (loopResult.status === "blocked") {
      expect(payload.trustTrace.loopStatus).toBe(loopResult.loopStatus);
    }
  });

  test("builds payload from free full-loop success", () => {
    const loopResult = runFreeFullLoopCalculation(REPAIR_FREE_SLUG, { ...REPAIR_FREE_INPUTS });
    expect(loopResult.status).toBe("success");

    const payload = buildTrustTraceReportPayload({
      toolSlug: REPAIR_FREE_SLUG,
      toolTitle: REPAIR_FREE_TITLE,
      tier: "free",
      fullLoopResult: loopResult,
      canonicalInputValues: {
        quotedPrice: 850,
        repairHours: 2.5,
        partsCost: 180,
      },
    });

    expect(payload.tier).toBe("free");
    expect(payload.calculationStatus).toBe("success");
    expect(payload.formulaContract.slug).toBe(REPAIR_FREE_SLUG);
    expect(payload.mind1Postcalc.validationSources).toContain(
      "runtime_validation:validateCalculationInputsAndResult",
    );
    expect(payload.assumptions.length).toBeGreaterThanOrEqual(0);
    expect(payload.limitations.length).toBeGreaterThanOrEqual(0);
  });

  test("preserves rejected keys in canonical input trace", () => {
    const loopResult = runPremiumFullLoopCalculation(WELDING_SLUG, {
      ...WELDING_INPUTS,
      rogueKey: 999,
    });
    expect(loopResult.status).toBe("success");

    const payload = buildTrustTraceReportPayload({
      toolSlug: WELDING_SLUG,
      toolTitle: WELDING_TITLE,
      tier: "premium",
      fullLoopResult: loopResult,
    });

    expect(payload.rejectedKeys).toContain("rogueKey");
    expect(
      payload.canonicalInputs.some(
        (entry) => entry.key === "rogueKey" && entry.classification === "rejected",
      ),
    ).toBe(true);
  });
});

describe("buildTrustTraceReportFileName", () => {
  test("uses slug, date, and format extension", () => {
    expect(buildTrustTraceReportFileName("welding-bid-risk-analyzer", "pdf", "2026-06-09T12:00:00.000Z")).toBe(
      "sectorcalc-welding-bid-risk-analyzer-trust-trace-2026-06-09.pdf",
    );
    expect(buildTrustTraceReportFileName("welding-bid-risk-analyzer", "excel", "2026-06-09T12:00:00.000Z")).toBe(
      "sectorcalc-welding-bid-risk-analyzer-trust-trace-2026-06-09.xlsx",
    );
    expect(buildTrustTraceReportFileName("welding-bid-risk-analyzer", "word", "2026-06-09T12:00:00.000Z")).toBe(
      "sectorcalc-welding-bid-risk-analyzer-trust-trace-2026-06-09.docx",
    );
  });
});

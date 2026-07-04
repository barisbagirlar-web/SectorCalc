/**
 * Trust trace export payload builder tests - ADIM 3.
 */

import { describe, expect, test } from "vitest";
import { runPremiumFullLoopCalculation } from "@/lib/features/formula-governance/runtime-validation/premium-full-loop-bridge";
import {
  buildTrustTraceReportFileName,
  buildTrustTraceReportPayload,
} from "@/lib/features/reports/trust-trace-report-builder";

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

describe("buildTrustTraceReportPayload", () => {
  test("builds payload from premium stub (pending status)", () => {
    const loopResult = runPremiumFullLoopCalculation(WELDING_SLUG, { ...WELDING_INPUTS });
    expect(loopResult.status).toBe("pending");

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
    expect(payload.calculationStatus).toBe("blocked");
    expect(payload.locale).toBe("en-US");
    expect(payload.generatedAt).toBe("2026-06-09T12:00:00.000Z");
    expect(payload.fileOutputGenerated).toBe(false);
    expect(payload.exportFormats).toEqual(["pdf", "excel", "word"]);
    expect(payload.formulaContract.slug).toBe(WELDING_SLUG);
    expect(payload.trustTrace).toBe(loopResult.trustTrace);
    expect(payload.mind2Precalc.requirementStatus).toBeTruthy();
    expect(payload.mind2Precalc.readinessStatus).toBeTruthy();
    expect(payload.mind1Postcalc.validationPassed).toBe(false);
    expect(payload.coverageSummary.oracle).toBeDefined();
    expect(payload.coverageSummary.scenario).toBeDefined();
    expect(payload.coverageSummary.property).toBeDefined();
    expect(payload.disclaimer.length).toBeGreaterThan(20);
    expect(payload.usageAgreement.length).toBeGreaterThan(0);
    expect(payload.exportStatus).toBe("blocked");
  });

  test("builds blocked payload from premium stub (pending status)", () => {
    const loopResult = runPremiumFullLoopCalculation(WELDING_SLUG, {
      materialCost: 1200,
    });
    expect(loopResult.status).toBe("pending");

    const payload = buildTrustTraceReportPayload({
      toolSlug: WELDING_SLUG,
      toolTitle: WELDING_TITLE,
      tier: "premium",
      fullLoopResult: loopResult,
      generatedAt: "2026-06-09T12:00:00.000Z",
    });

    expect(payload.calculationStatus).toBe("blocked");
    expect(payload.exportStatus).toBe("blocked");
    expect(payload.blockers).toEqual([]);
    expect(payload.mind2Precalc.requiredMissingInputs).toEqual([]);
  });

  test("rejected keys are empty from stub (no input processing)", () => {
    const loopResult = runPremiumFullLoopCalculation(WELDING_SLUG, {
      ...WELDING_INPUTS,
      rogueKey: 999,
    });
    expect(loopResult.status).toBe("pending");

    const payload = buildTrustTraceReportPayload({
      toolSlug: WELDING_SLUG,
      toolTitle: WELDING_TITLE,
      tier: "premium",
      fullLoopResult: loopResult,
    });

    expect(payload.rejectedKeys).toEqual([]);
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

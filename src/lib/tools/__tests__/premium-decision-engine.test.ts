import { describe, expect, test } from "vitest";
import { PREMIUM_TOOL_CONTRACTS, getPremiumToolContract } from "@/lib/tools/premium-tool-contracts";
import {
  calculatePremiumDecisionReport,
  listPremiumContractSlugs,
} from "@/lib/tools/premium-decision-engine";
import { LEGAL_NOTE } from "@/lib/tools/premium-decision-engine";
import { getRevenueToolByPaidSlug } from "@/lib/tools/revenue-tools";

function defaultValuesForSlug(slug: string): Record<string, number | string> {
  const tool = getRevenueToolByPaidSlug(slug);
  if (!tool) {
    return {};
  }
  const values: Record<string, number | string> = {};
  for (const input of tool.paidInputs) {
    if (input.type === "select") {
      values[input.key] = input.defaultValue ?? input.options?.[0]?.value ?? "no";
      continue;
    }
    values[input.key] =
      input.defaultValue !== undefined
        ? input.defaultValue
        : input.type === "percent"
          ? 10
          : 100;
  }
  return values;
}

function collectStrings(report: ReturnType<typeof calculatePremiumDecisionReport>): string {
  return [
    report.summary,
    report.primaryMetricValue,
    report.baseCostDisplay,
    report.adjustedCostDisplay,
    report.p90CostDisplay,
    report.minimumSafePriceDisplay,
    report.verdict.label,
    report.recommendation,
    report.legalNote,
    ...report.hiddenLossDrivers.map((d) => `${d.label}${d.amountDisplay}${d.explanation}`),
    ...report.sensitivity.map((s) => s.impactSummary),
  ].join(" ");
}

describe("premium-decision-engine", () => {
  test("27 premium contracts exist", () => {
    expect(PREMIUM_TOOL_CONTRACTS.length).toBe(27);
    expect(listPremiumContractSlugs().length).toBe(27);
  });

  test("every slug is unique", () => {
    const slugs = listPremiumContractSlugs();
    expect(new Set(slugs).size).toBe(27);
  });

  test("every contract has at least 5 inputs and hidden variables", () => {
    for (const contract of PREMIUM_TOOL_CONTRACTS) {
      expect(contract.inputs.length).toBeGreaterThanOrEqual(5);
      expect(contract.hiddenVariables.length).toBeGreaterThanOrEqual(3);
      expect(contract.title.trim().length).toBeGreaterThan(0);
      expect(contract.promise.trim().length).toBeGreaterThan(0);
    }
  });

  test("calculatePremiumDecisionReport returns for all 27 slugs", () => {
    for (const slug of listPremiumContractSlugs()) {
      const report = calculatePremiumDecisionReport(slug, defaultValuesForSlug(slug));
      expect(report.toolSlug).toBe(slug);
      expect(report.verdict.label.length).toBeGreaterThan(0);
      expect(report.primaryMetricValue.length).toBeGreaterThan(0);
    }
  });

  test("no NaN or Infinity in result strings", () => {
    for (const slug of listPremiumContractSlugs()) {
      const report = calculatePremiumDecisionReport(slug, defaultValuesForSlug(slug));
      const joined = collectStrings(report);
      expect(joined).not.toMatch(/\bNaN\b/);
      expect(joined).not.toMatch(/\bInfinity\b/i);
    }
  });

  test("hidden loss drivers and sensitivity are non-empty", () => {
    for (const slug of listPremiumContractSlugs()) {
      const report = calculatePremiumDecisionReport(slug, defaultValuesForSlug(slug));
      expect(report.hiddenLossDrivers.length).toBeGreaterThan(0);
      expect(report.sensitivity.length).toBeGreaterThan(0);
    }
  });

  test("legal note is present", () => {
    const report = calculatePremiumDecisionReport(
      "cnc-quote-risk-analyzer",
      defaultValuesForSlug("cnc-quote-risk-analyzer"),
    );
    expect(report.legalNote).toBe(LEGAL_NOTE);
    expect(report.legalNote.length).toBeGreaterThan(20);
  });

  test("low quoted price can yield reject verdict", () => {
    const values = {
      ...defaultValuesForSlug("welding-bid-risk-analyzer"),
      quotedPrice: 1,
      targetMargin: 25,
    };
    const report = calculatePremiumDecisionReport("welding-bid-risk-analyzer", values);
    expect(report.verdict.severity).toBe("reject");
  });

  test("high quoted price can yield accept verdict", () => {
    const values = {
      ...defaultValuesForSlug("welding-bid-risk-analyzer"),
      quotedPrice: 999999,
      targetMargin: 10,
    };
    const report = calculatePremiumDecisionReport("welding-bid-risk-analyzer", values);
    expect(report.verdict.severity).toBe("accept");
  });

  test("CNC minimum safe quote exceeds visible base cost", () => {
    const report = calculatePremiumDecisionReport("cnc-quote-risk-analyzer", {
      setupTime: 60,
      cycleTime: 3,
      quantity: 20,
      toolCost: 500,
      materialCost: 400,
      machineRate: 90,
      riskMargin: 20,
      quotedPrice: 5000,
    });
    expect(report.baseCost).toBeGreaterThan(0);
    expect(report.minimumSafePrice).toBeGreaterThan(report.baseCost);
  });

  test("CBAM exposure uses carbon cost", () => {
    const report = calculatePremiumDecisionReport("cbam-compliance-verdict", {
      productionTons: 100,
      energySource: "coal",
      euImportValue: 500000,
      processEmissionsFactor: 0.5,
      includesTransport: "yes",
      targetMargin: 15,
      quotedPrice: 40000,
    });
    expect(report.baseCost).toBeGreaterThan(0);
    expect(report.primaryMetricValue).toMatch(/\$/);
  });

  test("route analyzer reflects deadhead hidden driver", () => {
    const report = calculatePremiumDecisionReport("route-optimization-analyzer", {
      distanceKm: 500,
      fuelCostPerKm: 0.35,
      driverHours: 8,
      driverRate: 28,
      tolls: 40,
      returnEmpty: "yes",
      targetMargin: 18,
      quotedFreightPrice: 200,
    });
    const deadhead = report.hiddenLossDrivers.find((d) =>
      d.label.toLowerCase().includes("deadhead"),
    );
    expect(deadhead).toBeDefined();
  });

  test("premium reports avoid banned jargon", () => {
    const banned = ["CRITICAL DRIFT", "intelligence layer", "margincore"];
    for (const slug of listPremiumContractSlugs()) {
      const report = calculatePremiumDecisionReport(slug, defaultValuesForSlug(slug));
      const joined = collectStrings(report).toLowerCase();
      for (const term of banned) {
        expect(joined).not.toContain(term.toLowerCase());
      }
    }
  });

  test("every report includes architecture field panel", () => {
    for (const slug of listPremiumContractSlugs()) {
      const report = calculatePremiumDecisionReport(slug, defaultValuesForSlug(slug));
      expect(report.architecture.profile.slug).toBe(slug);
      expect(report.architecture.fieldPanel.kpis.length).toBeGreaterThanOrEqual(4);
      expect(report.architecture.fieldPanel.measuredLine.length).toBeGreaterThan(10);
      expect(report.architecture.fieldPanel.actionLine.length).toBeGreaterThan(5);
    }
  });

  test("getPremiumToolContract resolves every slug", () => {
    for (const slug of listPremiumContractSlugs()) {
      expect(getPremiumToolContract(slug)?.slug).toBe(slug);
    }
  });
});

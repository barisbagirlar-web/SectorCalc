import Big from "big.js";
import { describe, expect, it } from "vitest";
import { execute } from "../return-on-investment-calculator.formula";

export const GOLDEN_ROI_INPUTS = {
  investment_cost: 100_000,
  total_return: 150_000,
  annual_net_benefit: 25_000,
  horizon_years: 5,
  hurdle_rate_pct: 0,
} as const;

export const HUB_SCENARIOS = [
  {
    id: "cnc-automation",
    title: "CNC Automation Upgrade",
    inputs: {
      investment_cost: 80_000,
      total_return: 128_000,
      annual_net_benefit: 16_000,
      horizon_years: 4,
      hurdle_rate_pct: 15,
    },
  },
  {
    id: "energy-efficiency",
    title: "Plant Energy Efficiency Retrofit",
    inputs: {
      investment_cost: 45_000,
      total_return: 58_500,
      annual_net_benefit: 9_000,
      horizon_years: 3,
      hurdle_rate_pct: 10,
    },
  },
  {
    id: "warehouse-wms",
    title: "Warehouse WMS Deployment",
    inputs: {
      investment_cost: 120_000,
      total_return: 156_000,
      annual_net_benefit: 22_000,
      horizon_years: 5,
      hurdle_rate_pct: 12,
    },
  },
  {
    id: "reject-case",
    title: "Low-Return Packaging Line Upgrade",
    inputs: {
      investment_cost: 60_000,
      total_return: 66_000,
      annual_net_benefit: 8_000,
      horizon_years: 3,
      hurdle_rate_pct: 15,
    },
  },
] as const;

const HUB_DISPLAY_SCENARIOS = [
  {
    inputs: HUB_SCENARIOS[0]!.inputs,
    roiPct: 60,
    netGain: 48_000,
    paybackPeriodYears: 5,
    annualizedRoiPct: 12.468265038069815,
    decision: "PASS" as const,
  },
  {
    inputs: HUB_SCENARIOS[1]!.inputs,
    roiPct: 30,
    netGain: 13_500,
    paybackPeriodYears: 5,
    annualizedRoiPct: 9.139288306110593,
    decision: "PASS" as const,
  },
  {
    inputs: HUB_SCENARIOS[2]!.inputs,
    roiPct: 30,
    netGain: 36_000,
    paybackPeriodYears: 5.454545454545454,
    annualizedRoiPct: 5.387395206178347,
    decision: "PASS" as const,
  },
  {
    inputs: HUB_SCENARIOS[3]!.inputs,
    roiPct: 10,
    netGain: 6_000,
    paybackPeriodYears: 7.5,
    annualizedRoiPct: 3.228011545636722,
    decision: "REJECT" as const,
  },
] as const;

function independentRoi(inputs: Record<string, number>): {
  roiPct: number;
  netGain: number;
  paybackPeriodYears: number | null;
  annualizedRoiPct: number;
} {
  const cost = new Big(inputs.investment_cost);
  const totalReturn = new Big(inputs.total_return);
  const netGain = totalReturn.minus(cost);
  const roiPct = Number(netGain.div(cost).times(100));
  const paybackPeriodYears =
    inputs.annual_net_benefit > 0 ? Number(cost.div(inputs.annual_net_benefit)) : null;
  const base = Number(new Big(1).plus(new Big(roiPct).div(100)));
  const annualizedRoiPct = (Math.pow(base, 1 / inputs.horizon_years) - 1) * 100;
  return { roiPct, netGain: Number(netGain), paybackPeriodYears, annualizedRoiPct };
}

function metricValue(response: ReturnType<typeof execute>, id: string): number | undefined {
  return response.outputs.find((output) => output.id === id)?.value;
}

describe("return-on-investment-calculator", () => {
  it("cross-validates ROI against an independent Big.js implementation", () => {
    const response = execute(GOLDEN_ROI_INPUTS);
    const formulaRoi = metricValue(response, "roi_pct");
    const independent = independentRoi(GOLDEN_ROI_INPUTS);

    expect(formulaRoi).toBeDefined();
    expect(formulaRoi).toBeCloseTo(independent.roiPct, 8);
    expect(metricValue(response, "net_gain")).toBeCloseTo(independent.netGain, 8);
    expect(metricValue(response, "payback_period_years")).toBeCloseTo(independent.paybackPeriodYears ?? 0, 8);
    expect(metricValue(response, "annualized_roi_pct")).toBeCloseTo(independent.annualizedRoiPct, 8);
  });

  it("returns PASS for a positive ROI above the hurdle rate", () => {
    const response = execute(GOLDEN_ROI_INPUTS);
    expect(response.status).toBe("PASS");
    expect(metricValue(response, "roi_pct")).toBeGreaterThan(0);
  });

  it("returns REJECT for an ROI below the hurdle rate", () => {
    const response = execute(HUB_SCENARIOS[3]!.inputs);
    expect(response.status).toBe("REJECT");
    expect(metricValue(response, "roi_pct")).toBeLessThan(15);
  });

  it("returns REVIEW when ROI equals the hurdle rate", () => {
    const response = execute({
      investment_cost: 50_000,
      total_return: 57_500,
      annual_net_benefit: 10_000,
      horizon_years: 3,
      hurdle_rate_pct: 15,
    });
    expect(response.status).toBe("REVIEW");
    expect(metricValue(response, "roi_pct")).toBeCloseTo(15, 8);
  });

  it("blocks non-finite inputs", () => {
    expect(() =>
      execute({
        ...GOLDEN_ROI_INPUTS,
        total_return: Number.NaN,
      }),
    ).toThrow(/BLOCKED_NON_FINITE_INPUT:total_return/);
  });

  it("blocks non-positive investment cost", () => {
    expect(() =>
      execute({
        ...GOLDEN_ROI_INPUTS,
        investment_cost: 0,
      }),
    ).toThrow(/BLOCKED_NON_POSITIVE_INVESTMENT_COST:investment_cost/);
  });

  it("blocks negative total return", () => {
    expect(() =>
      execute({
        ...GOLDEN_ROI_INPUTS,
        total_return: -1,
      }),
    ).toThrow(/BLOCKED_NEGATIVE_TOTAL_RETURN:total_return/);
  });

  it("blocks horizon outside 1..30", () => {
    expect(() =>
      execute({
        ...GOLDEN_ROI_INPUTS,
        horizon_years: 31,
      }),
    ).toThrow(/BLOCKED_HORIZON_OUT_OF_RANGE:horizon_years/);
  });

  it("defaults hurdle rate to zero when omitted", () => {
    const response = execute({
      investment_cost: GOLDEN_ROI_INPUTS.investment_cost,
      total_return: GOLDEN_ROI_INPUTS.total_return,
      annual_net_benefit: GOLDEN_ROI_INPUTS.annual_net_benefit,
      horizon_years: GOLDEN_ROI_INPUTS.horizon_years,
    });
    expect(response.status).toBe("PASS");
  });

  it("matches hub scenario display numbers from the formula kernel", () => {
    for (const scenario of HUB_DISPLAY_SCENARIOS) {
      const response = execute(scenario.inputs);
      expect(metricValue(response, "roi_pct")).toBeCloseTo(scenario.roiPct, 8);
      expect(metricValue(response, "net_gain")).toBeCloseTo(scenario.netGain, 8);
      expect(metricValue(response, "payback_period_years")).toBeCloseTo(scenario.paybackPeriodYears, 8);
      expect(metricValue(response, "annualized_roi_pct")).toBeCloseTo(scenario.annualizedRoiPct, 8);
      expect(response.status).toBe(scenario.decision);
    }
  });
});

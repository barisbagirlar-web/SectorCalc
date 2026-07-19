import Big from "big.js";
import { describe, expect, it } from "vitest";
import { execute } from "../net-present-value-calculator.formula";

export const GOLDEN_NPV_INPUTS = {
  initial_investment: 250_000,
  discount_rate_pct: 12,
  horizon_years: 5,
  cf_y1: 65_000,
  cf_y2: 72_000,
  cf_y3: 78_000,
  cf_y4: 80_000,
  cf_y5: 85_000,
} as const;

export const HUB_SCENARIOS = [
  {
    id: "cnc-machine",
    title: "CNC Machine Replacement",
    inputs: GOLDEN_NPV_INPUTS,
  },
  {
    id: "hvac-retrofit",
    title: "Plant HVAC Retrofit",
    inputs: {
      initial_investment: 120_000,
      discount_rate_pct: 8,
      horizon_years: 7,
      cf_y1: 22_000,
      cf_y2: 24_000,
      cf_y3: 26_000,
      cf_y4: 28_000,
      cf_y5: 29_000,
      cf_y6: 30_000,
      cf_y7: 31_000,
    },
  },
  {
    id: "line-automation",
    title: "Production Line Automation",
    inputs: {
      initial_investment: 480_000,
      discount_rate_pct: 10,
      horizon_years: 8,
      cf_y1: 90_000,
      cf_y2: 95_000,
      cf_y3: 100_000,
      cf_y4: 105_000,
      cf_y5: 110_000,
      cf_y6: 115_000,
      cf_y7: 120_000,
      cf_y8: 125_000,
    },
  },
  {
    id: "reject-case",
    title: "Low-Return Packaging Upgrade",
    inputs: {
      initial_investment: 90_000,
      discount_rate_pct: 14,
      horizon_years: 4,
      cf_y1: 12_000,
      cf_y2: 13_000,
      cf_y3: 13_500,
      cf_y4: 14_000,
    },
  },
] as const;

const HUB_DISPLAY_SCENARIOS = [
  { inputs: HUB_SCENARIOS[0]!.inputs, npv: 20025.261807301275, irrPct: 15.040426827700678, decision: "PASS" as const },
  { inputs: HUB_SCENARIOS[1]!.inputs, npv: 18897.179976036416, irrPct: 12.185852041073618, decision: "PASS" as const },
  { inputs: HUB_SCENARIOS[2]!.inputs, npv: 80286.71562247985, irrPct: 14.175795659098332, decision: "PASS" as const },
  { inputs: HUB_SCENARIOS[3]!.inputs, npv: -52069.36698850256, irrPct: -18.18964715617186, decision: "REJECT" as const },
] as const;

function independentNpv(inputs: Record<string, number>): number {
  const investment = new Big(inputs.initial_investment);
  const rate = new Big(inputs.discount_rate_pct).div(100);
  let sum = new Big(0);
  for (let year = 1; year <= inputs.horizon_years; year += 1) {
    const cashFlow = new Big(inputs[`cf_y${year}` as keyof typeof inputs] as number);
    sum = sum.plus(cashFlow.div(new Big(1).plus(rate).pow(year)));
  }
  return Number(sum.minus(investment));
}

function metricValue(response: ReturnType<typeof execute>, id: string): number | undefined {
  return response.outputs.find((output) => output.id === id)?.value;
}

describe("net-present-value-calculator", () => {
  it("cross-validates NPV against an independent Big.js implementation", () => {
    const response = execute(GOLDEN_NPV_INPUTS);
    const formulaNpv = metricValue(response, "npv");
    const independent = independentNpv(GOLDEN_NPV_INPUTS);

    expect(formulaNpv).toBeDefined();
    expect(formulaNpv).toBeCloseTo(independent, 8);
  });

  it("returns PASS for a positive NPV case", () => {
    const response = execute(GOLDEN_NPV_INPUTS);
    expect(response.status).toBe("PASS");
    expect(metricValue(response, "npv")).toBeGreaterThan(0);
  });

  it("returns REJECT for a negative NPV case", () => {
    const response = execute(HUB_SCENARIOS[3]!.inputs);
    expect(response.status).toBe("REJECT");
    expect(metricValue(response, "npv")).toBeLessThan(0);
  });

  it("blocks non-finite inputs", () => {
    expect(() =>
      execute({
        ...GOLDEN_NPV_INPUTS,
        cf_y3: Number.NaN,
      }),
    ).toThrow(/BLOCKED_NON_FINITE_INPUT:cf_y3/);
  });

  it("blocks non-positive initial investment", () => {
    expect(() =>
      execute({
        ...GOLDEN_NPV_INPUTS,
        initial_investment: 0,
      }),
    ).toThrow(/BLOCKED_NON_POSITIVE_INITIAL_INVESTMENT:initial_investment/);
  });

  it("blocks discount rates outside (0, 100)", () => {
    expect(() =>
      execute({
        ...GOLDEN_NPV_INPUTS,
        discount_rate_pct: 0,
      }),
    ).toThrow(/BLOCKED_DISCOUNT_RATE_OUT_OF_RANGE:discount_rate_pct/);
  });

  it("matches hub scenario display numbers from the formula kernel", () => {
    for (const scenario of HUB_DISPLAY_SCENARIOS) {
      const response = execute(scenario.inputs);
      expect(metricValue(response, "npv")).toBeCloseTo(scenario.npv, 8);
      expect(metricValue(response, "irr_pct")).toBeCloseTo(scenario.irrPct, 8);
      expect(response.status).toBe(scenario.decision);
    }
  });
});

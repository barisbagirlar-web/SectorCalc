import { describe, expect, it } from "vitest";
import { buildProReport } from "../pro-report-adapter";

const completeOutputs = [
  { id: "out_contribution_margin_ratio", name: "Cash Contribution Margin", value: 0.6 },
  { id: "out_monthly_variable_cash_cost", name: "Monthly Variable Cash Cost", value: 100000 },
  { id: "out_monthly_contribution", name: "Monthly Contribution", value: 150000 },
  { id: "out_monthly_fixed_cash_cost", name: "Monthly Fixed Cash Cost", value: 125000 },
  { id: "out_monthly_net_cash_flow", name: "Base Monthly Net Cash Flow", value: 25000 },
  { id: "out_break_even_monthly_revenue", name: "Break-Even Monthly Revenue", value: 208333.33333333334 },
  { id: "out_monthly_revenue_gap_to_break_even", name: "Monthly Revenue Gap vs Break-Even", value: 41666.666666666664 },
  { id: "out_stressed_monthly_revenue", name: "Stressed Monthly Revenue", value: 200000 },
  { id: "out_stressed_monthly_net_cash_flow", name: "Stressed Monthly Net Cash Flow", value: -5000 },
  { id: "out_base_ending_cash", name: "Base Forecast Ending Cash", value: 800000 },
  { id: "out_stressed_ending_cash", name: "Stressed Forecast Ending Cash", value: 440000 },
  { id: "out_minimum_cash_reserve", name: "Minimum Cash Reserve", value: 50000 },
  { id: "out_cash_available_above_reserve", name: "Cash Available Above Reserve", value: 450000 },
  { id: "out_stressed_monthly_burn", name: "Stressed Monthly Burn", value: 5000 },
  { id: "out_stressed_runway_within_horizon_months", name: "Stressed Runway Within Forecast Horizon", value: 12 },
  { id: "out_required_opening_cash_for_stress_horizon", name: "Required Opening Cash for Stress Horizon", value: 110000 },
  { id: "out_additional_funding_required", name: "Additional Funding Required", value: 0 },
  { id: "out_source_confidence_ratio", name: "Source Confidence", value: 0.95 },
  { id: "out_cash_uncertainty", name: "Forecast Cash Uncertainty", value: 246000 },
  { id: "out_stressed_cash_lower_bound", name: "Stressed Cash Lower Bound", value: 194000 },
  { id: "out_stressed_cash_upper_bound", name: "Stressed Cash Upper Bound", value: 686000 },
  { id: "out_money_at_risk", name: "Cash at Risk Below Reserve", value: 0 },
  { id: "out_primary_cash_cost_driver", name: "Primary Monthly Cash Cost Driver", value: 3 },
  { id: "out_decision_state", name: "Cash Survival Decision", value: 0 },
];

describe("break-even survival cash Exact Decimal report contract", () => {
  it("renders the complete domain report with selected currency and governed precision", () => {
    const report = buildProReport({
      toolSlug: "break-even-survival-cash-calculator",
      outputs: completeOutputs,
      rawInputs: {},
      selectedUnits: {},
      displayCurrency: "EUR",
    });

    expect(report).not.toBeNull();
    const entries = report?.resolvedSections.flatMap((section) => section.entries) ?? [];
    const labels = entries.map((entry) => entry.label);

    expect(labels).toContain("Break-Even Monthly Revenue");
    expect(labels).toContain("Stressed Runway Within Forecast Horizon");
    expect(labels).toContain("Required Opening Cash for Stress Horizon");
    expect(labels).toContain("Additional Funding Required");
    expect(labels).toContain("Stressed Cash Lower Bound");
    expect(labels).toContain("Cash at Risk Below Reserve");
    expect(labels).toContain("Cash Survival Decision");
    expect(labels).not.toContain("Maximum Absorbed Overhead");
    expect(labels).not.toContain("FMEA Trigger Flag");

    expect(entries.find((entry) => entry.label === "Cash Contribution Margin")?.value).toBe(60);
    expect(entries.find((entry) => entry.label === "Source Confidence")?.value).toBe(95);
    expect(entries.find((entry) => entry.label === "Primary Monthly Cash Cost Driver")?.value).toBe("Stressed variable cash cost");
    expect(entries.find((entry) => entry.label === "Cash Survival Decision")?.value).toBe("PASS");

    const breakEven = entries.find((entry) => entry.label === "Break-Even Monthly Revenue");
    expect(breakEven?.unit).toBe("EUR/month");
    expect(breakEven?.displayDecimals).toBe(2);

    const lowerBound = entries.find((entry) => entry.label === "Stressed Cash Lower Bound");
    expect(lowerBound?.unit).toBe("EUR");
    expect(lowerBound?.displayDecimals).toBe(2);
  });

  it("fails closed when a strict report output is missing", () => {
    const report = buildProReport({
      toolSlug: "break-even-survival-cash-calculator",
      outputs: completeOutputs.filter((output) => output.id !== "out_stressed_cash_lower_bound"),
      rawInputs: {},
      selectedUnits: {},
      displayCurrency: "USD",
    });
    expect(report).toBeNull();
  });

  it("fails closed when a strict report output is duplicated", () => {
    const report = buildProReport({
      toolSlug: "break-even-survival-cash-calculator",
      outputs: [...completeOutputs, completeOutputs[0]],
      rawInputs: {},
      selectedUnits: {},
      displayCurrency: "USD",
    });
    expect(report).toBeNull();
  });
});

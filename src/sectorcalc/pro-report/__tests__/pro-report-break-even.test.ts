import { describe, expect, it } from "vitest";
import { buildProReport } from "../pro-report-adapter";

const completeOutputs = [
  {
    id: "out_break_even_monthly_revenue",
    name: "Break-Even Monthly Revenue",
    value: 345238.1,
  },
  {
    id: "out_current_revenue_gap",
    name: "Current Revenue Gap",
    value: 74761.9,
  },
  {
    id: "out_stressed_monthly_revenue",
    name: "Stressed Monthly Revenue",
    value: 294000,
  },
  {
    id: "out_monthly_cash_burn",
    name: "Monthly Cash Burn",
    value: 21520,
  },
  {
    id: "out_cash_runway_months",
    name: "Cash Runway",
    value: 30.2,
  },
  {
    id: "out_survival_cash_target",
    name: "Survival Cash Target",
    value: 248488,
  },
  { id: "out_funding_gap", name: "Funding Gap", value: 0 },
  {
    id: "out_margin_of_safety_ratio",
    name: "Revenue Margin of Safety",
    value: 0.178,
  },
  {
    id: "out_source_confidence_ratio",
    name: "Source Confidence",
    value: 0.9,
  },
  {
    id: "out_uncertainty_cash_buffer",
    name: "Uncertainty Cash Buffer",
    value: 19368,
  },
  {
    id: "out_target_runway_breached",
    name: "Target Runway Breached",
    value: 0,
  },
  { id: "out_decision_code", name: "Decision Code", value: 0 },
];

describe("break-even survival cash report contract", () => {
  it("renders the complete domain report, selected currency, and governed precision", () => {
    const report = buildProReport({
      toolSlug: "break-even-survival-cash-calculator",
      outputs: completeOutputs,
      rawInputs: {},
      selectedUnits: {},
      displayCurrency: "EUR",
    });

    expect(report).not.toBeNull();
    const entries =
      report?.resolvedSections.flatMap((section) => section.entries) ?? [];
    const labels = entries.map((entry) => entry.label);

    expect(labels).toContain("Break-Even Monthly Revenue");
    expect(labels).toContain("Cash Runway Under Stress");
    expect(labels).toContain("Survival Cash Target");
    expect(labels).toContain("Funding Gap to Target");
    expect(labels).toContain("Decision");
    expect(labels).not.toContain("Maximum Absorbed Overhead");
    expect(
      entries.find((entry) => entry.label === "Revenue Margin of Safety")
        ?.value,
    ).toBeCloseTo(17.8, 8);
    expect(
      entries.find((entry) => entry.label === "Source Confidence")?.value,
    ).toBe(90);
    expect(
      entries.find((entry) => entry.label === "Target Runway Status")?.value,
    ).toBe("WITHIN TARGET");
    expect(entries.find((entry) => entry.label === "Decision")?.value).toBe(
      "GO",
    );

    const breakEvenEntry = entries.find(
      (entry) => entry.label === "Break-Even Monthly Revenue",
    );
    expect(breakEvenEntry?.unit).toBe("EUR/month");
    expect(breakEvenEntry?.displayDecimals).toBe(2);

    const runwayEntry = entries.find(
      (entry) => entry.label === "Cash Runway Under Stress",
    );
    expect(runwayEntry?.displayDecimals).toBe(2);

    const targetEntry = entries.find(
      (entry) => entry.label === "Survival Cash Target",
    );
    expect(targetEntry?.unit).toBe("EUR");
    expect(targetEntry?.displayDecimals).toBe(2);
  });

  it("fails closed when a strict report output is missing", () => {
    const report = buildProReport({
      toolSlug: "break-even-survival-cash-calculator",
      outputs: completeOutputs.filter(
        (output) => output.id !== "out_monthly_cash_burn",
      ),
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

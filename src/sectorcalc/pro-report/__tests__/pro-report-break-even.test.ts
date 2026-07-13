import { describe, expect, it } from "vitest";
import { buildProReport } from "../pro-report-adapter";

describe("break-even survival cash report contract", () => {
  it("renders domain outputs instead of legacy generic metrics", () => {
    const report = buildProReport({
      toolSlug: "break-even-survival-cash-calculator",
      outputs: [
        { id: "out_break_even_monthly_revenue", name: "Break-Even Monthly Revenue", value: 345238.1 },
        { id: "out_current_revenue_gap", name: "Current Revenue Gap", value: 74761.9 },
        { id: "out_cash_runway_months", name: "Cash Runway", value: 30.2 },
        { id: "out_survival_cash_target", name: "Survival Cash Target", value: 232348 },
        { id: "out_funding_gap", name: "Funding Gap", value: 0 },
      ],
      rawInputs: {},
      selectedUnits: {},
    });

    expect(report).not.toBeNull();
    const labels = report?.resolvedSections.flatMap((section) =>
      section.entries.map((entry) => entry.label),
    );

    expect(labels).toContain("Break-Even Monthly Revenue");
    expect(labels).toContain("Cash Runway Under Stress");
    expect(labels).toContain("Survival Cash Target");
    expect(labels).toContain("Funding Gap to Target");
    expect(labels).not.toContain("Maximum Absorbed Overhead");
  });
});

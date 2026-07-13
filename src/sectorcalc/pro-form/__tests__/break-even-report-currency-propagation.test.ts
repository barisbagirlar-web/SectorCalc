import { describe, expect, it } from "vitest";
import { buildProReport } from "@/sectorcalc/pro-report/pro-report-adapter";

const outputs = [
  ["out_break_even_monthly_revenue", 100],
  ["out_current_revenue_gap", 20],
  ["out_margin_of_safety_ratio", 0.2],
  ["out_stressed_monthly_revenue", 80],
  ["out_monthly_cash_burn", 10],
  ["out_cash_runway_months", 12],
  ["out_survival_cash_target", 200],
  ["out_funding_gap", 0],
  ["out_source_confidence_ratio", 0.9],
  ["out_uncertainty_cash_buffer", 20],
  ["out_target_runway_breached", 0],
  ["out_decision_code", 0],
].map(([id, value]) => ({ id: String(id), name: String(id), value: Number(value) }));

describe("break-even report display currency", () => {
  it("uses the selected display currency without changing values", () => {
    const eur = buildProReport({
      toolSlug: "break-even-survival-cash-calculator",
      outputs,
      rawInputs: {},
      selectedUnits: {},
      displayCurrency: "EUR",
    });
    const usd = buildProReport({
      toolSlug: "break-even-survival-cash-calculator",
      outputs,
      rawInputs: {},
      selectedUnits: {},
      displayCurrency: "USD",
    });

    const eurTarget = eur?.resolvedSections
      .flatMap((section) => section.entries)
      .find((entry) => entry.label === "Survival Cash Target");
    const usdTarget = usd?.resolvedSections
      .flatMap((section) => section.entries)
      .find((entry) => entry.label === "Survival Cash Target");

    expect(eurTarget?.value).toBe(usdTarget?.value);
    expect(eurTarget?.unit).toBe("EUR");
    expect(usdTarget?.unit).toBe("USD");
  });
});

import { describe, expect, it } from "vitest";
import { buildProReport } from "@/sectorcalc/pro-report/pro-report-adapter";

const complete = [
  "out_break_even_monthly_revenue",
  "out_current_revenue_gap",
  "out_margin_of_safety_ratio",
  "out_stressed_monthly_revenue",
  "out_monthly_cash_burn",
  "out_cash_runway_months",
  "out_survival_cash_target",
  "out_funding_gap",
  "out_source_confidence_ratio",
  "out_uncertainty_cash_buffer",
  "out_target_runway_breached",
  "out_decision_code",
].map((id) => ({ id, name: id, value: 0 }));

describe("strict break-even report null output", () => {
  it("fails closed when a required output value is null", () => {
    const outputs = complete.map((output) =>
      output.id === "out_survival_cash_target"
        ? { ...output, value: null }
        : output,
    );

    expect(
      buildProReport({
        toolSlug: "break-even-survival-cash-calculator",
        outputs,
        rawInputs: {},
        selectedUnits: {},
      }),
    ).toBeNull();
  });
});

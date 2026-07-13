import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("Baris formula registry break-even binding", () => {
  it("registers the domain formula version and exact output contract", async () => {
    const { formulaRegistry } = await import("@/sectorcalc/pro-runtime/formula-registry");
    await import("../baris-formula-registry");

    const record = formulaRegistry.fetch("PRO_031", "5.3.1-pro-baris.2");
    expect(record).not.toBeNull();
    expect(record?.tool_key).toBe("break-even-survival-cash-calculator");
    expect(record?.nodes.map((node) => node.output_ref)).toEqual([
      "out_break_even_monthly_revenue",
      "out_current_revenue_gap",
      "out_stressed_monthly_revenue",
      "out_monthly_cash_burn",
      "out_cash_runway_months",
      "out_survival_cash_target",
      "out_funding_gap",
      "out_margin_of_safety_ratio",
      "out_evidence_completeness",
      "out_uncertainty_cash_buffer",
      "out_threshold_crossing",
      "out_final_decision_state",
    ]);
  });
});

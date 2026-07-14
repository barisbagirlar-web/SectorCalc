import { describe, expect, it } from "vitest";
import { getProReportContractOverride } from "../pro-report-contract-overrides";

const REQUIRED_IDS = [
  "out_break_even_monthly_revenue",
  "out_monthly_revenue_gap_to_break_even",
  "out_contribution_margin_ratio",
  "out_monthly_fixed_cash_cost",
  "out_monthly_net_cash_flow",
  "out_base_ending_cash",
  "out_stressed_monthly_revenue",
  "out_stressed_monthly_net_cash_flow",
  "out_stressed_ending_cash",
  "out_stressed_runway_within_horizon_months",
  "out_required_opening_cash_for_stress_horizon",
  "out_additional_funding_required",
  "out_stressed_cash_lower_bound",
  "out_stressed_cash_upper_bound",
  "out_money_at_risk",
  "out_source_confidence_ratio",
  "out_cash_uncertainty",
  "out_primary_cash_cost_driver",
  "out_decision_state",
].sort();

const FORBIDDEN_IDS = [
  "out_evidence_completeness",
  "out_threshold_crossing",
  "out_final_decision_state",
  "out_demand_metric",
  "out_capacity_metric",
  "out_fmea_trigger",
  "out_current_revenue_gap",
  "out_monthly_cash_burn",
  "out_cash_runway_months",
  "out_survival_cash_target",
  "out_funding_gap",
  "out_decision_code",
];

describe("break-even Exact Decimal report contract isolation", () => {
  it("uses only the certified cash-survival output namespace", () => {
    const contract = getProReportContractOverride(
      "break-even-survival-cash-calculator",
    );
    expect(contract).not.toBeNull();
    expect(contract?.strict).toBe(true);

    const outputIds =
      contract?.sections.flatMap((section) =>
        section.entries.map((entry) => entry.sourceOutputId),
      ) ?? [];

    expect([...outputIds].sort()).toEqual(REQUIRED_IDS);
    expect(new Set(outputIds).size).toBe(outputIds.length);
    for (const forbiddenId of FORBIDDEN_IDS) {
      expect(outputIds).not.toContain(forbiddenId);
    }
  });
});

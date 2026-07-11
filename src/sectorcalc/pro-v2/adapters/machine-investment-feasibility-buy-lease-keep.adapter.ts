// SectorCalc PRO V2 — Machine Investment Feasibility (Buy/Lease/Keep) Adapter
// Maps form field IDs to server schema input keys.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

export const buyLeaseKeepBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState: Record<string, { value: string; unit: string }>,
) => {
  function n(key: string): number {
    const v = fieldState[key];
    if (!v) return 0;
    const parsed = parseFloat(v.value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const raw_inputs: Record<string, number> = {
    n_machine_purchase_price: n("machine_purchase_price"),
    n_down_payment_pct: n("down_payment_pct"),
    n_lease_annual_payment: n("lease_annual_payment"),
    n_lease_term_years: n("lease_term_years"),
    n_loan_interest_rate_pct: n("loan_interest_rate_pct"),
    n_loan_term_years: n("loan_term_years"),
    n_annual_maintenance_cost: n("annual_maintenance_cost"),
    n_annual_downtime_cost: n("annual_downtime_cost"),
    n_residual_value: n("residual_value"),
    n_operating_savings_per_year: n("operating_savings_per_year"),
    n_discount_rate: n("discount_rate"),
  };

  const selected_units: Record<string, string> = {};
  for (const key of Object.keys(fieldState)) {
    selected_units[key] = fieldState[key].unit;
  }

  return { raw_inputs, selected_units };
};

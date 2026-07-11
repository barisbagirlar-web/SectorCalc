// SectorCalc PRO V2 — Energy Efficiency Grant / Incentive Feasibility Pack Adapter
// Maps form field IDs to server schema input keys.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

export const grantFeasibilityBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState: Record<string, { value: string; unit: string }>,
) => {
  function n(key: string): number {
    const v = fieldState[key];
    if (!v) return 0;
    const parsed = parseFloat(v.value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const raw_inputs: Record<string, number> = {
    n_baseline_energy_consumption_kwh: n("baseline_energy_consumption_kwh"),
    n_baseline_energy_price_per_kwh: n("baseline_energy_price_per_kwh"),
    n_projected_saving_pct: n("projected_saving_pct"),
    n_gross_project_cost: n("gross_project_cost"),
    n_eligible_project_cost: n("eligible_project_cost"),
    n_grant_incentive_amount: n("grant_incentive_amount"),
    n_annual_maintenance_cost: n("annual_maintenance_cost"),
    n_useful_life_years: n("useful_life_years"),
    n_discount_rate: n("discount_rate"),
    n_energy_price_escalation_pct: n("energy_price_escalation_pct"),
  };

  const selected_units: Record<string, string> = {};
  for (const key of Object.keys(fieldState)) {
    selected_units[key] = fieldState[key].unit;
  }

  return { raw_inputs, selected_units };
};

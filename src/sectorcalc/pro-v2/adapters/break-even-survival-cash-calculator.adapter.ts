// SectorCalc PRO V2 — Break-Even Survival Cash Calculator Adapter

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

export const breakEvenBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState: Record<string, { value: string; unit: string }>,
) => {
  function n(key: string): number {
    const v = fieldState[key];
    if (!v) return 0;
    const parsed = parseFloat(v.value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const raw_inputs: Record<string, number> = {
    annual_revenue: n("annual_revenue"),
    variable_cost_percent: n("variable_cost_percent"),
    annual_fixed_costs: n("annual_fixed_costs"),
    available_cash_liquidity: n("available_cash_liquidity"),
    unit_selling_price: n("unit_selling_price"),
    unit_variable_cost: n("unit_variable_cost"),
  };

  const selected_units: Record<string, string> = {};
  for (const key of Object.keys(fieldState)) {
    selected_units[key] = fieldState[key].unit;
  }

  return { raw_inputs, selected_units };
};

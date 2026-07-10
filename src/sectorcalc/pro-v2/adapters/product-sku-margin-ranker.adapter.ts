// SectorCalc PRO V2 — Product SKU Margin Ranker Adapter

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

export const skuMarginRankerBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState: Record<string, { value: string; unit: string }>,
) => {
  function n(key: string): number {
    const v = fieldState[key];
    if (!v) return 0;
    const parsed = parseFloat(v.value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const raw_inputs: Record<string, number> = {
    n_unit_price: n("unit_price"),
    n_material_cost_per_unit: n("material_cost_per_unit"),
    n_labor_cost_per_unit: n("labor_cost_per_unit"),
    n_overhead_per_unit: n("overhead_per_unit"),
    n_logistics_cost_per_unit: n("logistics_cost_per_unit"),
    n_annual_volume_units: n("annual_volume_units"),
    n_target_margin_percent: n("target_margin_percent"),
    n_total_portfolio_revenue: n("total_portfolio_revenue"),
    n_total_portfolio_profit: n("total_portfolio_profit"),
  };

  const selected_units: Record<string, string> = {};
  for (const key of Object.keys(fieldState)) {
    selected_units[key] = fieldState[key].unit;
  }

  return { raw_inputs, selected_units };
};

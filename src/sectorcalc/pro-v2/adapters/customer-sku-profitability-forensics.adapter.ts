// SectorCalc PRO V2 — Customer SKU Profitability Forensics Adapter

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

export const customerSkuForensicsBuildExecutePayload: ProExecutePayloadAdapter = (
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
    n_unit_variable_cost: n("unit_variable_cost"),
    n_annual_volume: n("annual_volume"),
    n_logistics_cost_pct: n("logistics_cost_pct"),
    n_service_cost_pct: n("service_cost_pct"),
    n_return_rate_pct: n("return_rate_pct"),
    n_target_margin: n("target_margin"),
    n_financing_cost_pct: n("financing_cost_pct"),
  };

  const selected_units: Record<string, string> = {};
  for (const key of Object.keys(fieldState)) {
    selected_units[key] = fieldState[key].unit;
  }

  return { raw_inputs, selected_units };
};

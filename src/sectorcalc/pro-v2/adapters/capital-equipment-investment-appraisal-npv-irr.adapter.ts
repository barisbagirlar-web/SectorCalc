// SectorCalc PRO V2 — Capital Equipment Investment Appraisal (NPV/IRR) Adapter
// Maps form field IDs to server schema input keys.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

export const npvIrrBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState: Record<string, { value: string; unit: string }>,
) => {
  function n(key: string): number {
    const v = fieldState[key];
    if (!v) return 0;
    const parsed = parseFloat(v.value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const raw_inputs: Record<string, number> = {
    initial_investment: n("initial_investment"),
    working_capital: n("working_capital"),
    annual_cash_inflow_1: n("annual_cash_inflow_1"),
    annual_cash_inflow_2: n("annual_cash_inflow_2"),
    annual_cash_inflow_3: n("annual_cash_inflow_3"),
    annual_cash_inflow_4: n("annual_cash_inflow_4"),
    annual_cash_inflow_5: n("annual_cash_inflow_5"),
    terminal_residual_value: n("terminal_residual_value"),
    discount_rate_percent: n("discount_rate_percent"),
    scenario_downside_pct: n("scenario_downside_pct"),
    scenario_upside_pct: n("scenario_upside_pct"),
  };

  const selected_units: Record<string, string> = {};
  for (const key of Object.keys(fieldState)) {
    selected_units[key] = fieldState[key].unit;
  }

  return { raw_inputs, selected_units };
};

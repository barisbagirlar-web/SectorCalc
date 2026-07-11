// SectorCalc PRO V2 — Motor/Compressor Replacement ROI Adapter
// Maps form field IDs to server schema input keys.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

export const motorRoiBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState: Record<string, { value: string; unit: string }>,
) => {
  function n(key: string): number {
    const v = fieldState[key];
    if (!v) return 0;
    const parsed = parseFloat(v.value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const raw_inputs: Record<string, number> = {
    current_power_kw: n("current_power_kw"),
    proposed_power_kw: n("proposed_power_kw"),
    annual_operating_hours: n("annual_operating_hours"),
    energy_price_per_kwh: n("energy_price_per_kwh"),
    current_maintenance_cost: n("current_maintenance_cost"),
    proposed_maintenance_cost: n("proposed_maintenance_cost"),
    replacement_cost: n("replacement_cost"),
    useful_life_years: n("useful_life_years"),
    discount_rate: n("discount_rate"),
  };

  const selected_units: Record<string, string> = {};
  for (const key of Object.keys(fieldState)) {
    selected_units[key] = fieldState[key].unit;
  }

  return { raw_inputs, selected_units };
};

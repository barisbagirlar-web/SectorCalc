// SectorCalc PRO V2 — FX Commodity Pass-Through Pricer Execute Payload Adapter
// Maps form field IDs to server schema input keys.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  base_price: "base_price",
  fx_rate_spot: "fx_rate_spot",
  fx_rate_budget: "fx_rate_budget",
  commodity_index_current: "commodity_index_current",
  commodity_index_budget: "commodity_index_budget",
  material_cost_pct: "material_cost_pct",
  fx_hedge_pct: "fx_hedge_pct",
  commodity_hedge_pct: "commodity_hedge_pct",
  annual_volume: "annual_volume",
  target_margin_percent: "target_margin_percent",
};

export { FORM_TO_SCHEMA_INPUT };

export const fxCommodityPricerBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState,
  _hiddenValues,
) => {
  const raw_inputs: Record<string, number> = {};
  const selected_units: Record<string, string> = {};

  for (const [formId, schemaId] of Object.entries(FORM_TO_SCHEMA_INPUT)) {
    const entry = fieldState[formId];
    if (entry && entry.value !== "" && entry.value !== undefined) {
      const num = parseFloat(entry.value);
      if (Number.isFinite(num)) {
        raw_inputs[schemaId] = num;
        selected_units[formId] = entry.unit;
      }
    }
  }

  return { raw_inputs, selected_units };
};

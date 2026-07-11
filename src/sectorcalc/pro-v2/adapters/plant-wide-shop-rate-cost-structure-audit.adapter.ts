// SectorCalc PRO V2 — Plant-Wide Shop Rate Cost Structure Audit Adapter
// Maps form field IDs to server schema input keys.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  total_annual_cost: "total_annual_cost",
  total_productive_hours: "total_productive_hours",
  machine_group_cost: "machine_group_cost",
  machine_group_hours: "machine_group_hours",
  overhead_pool: "overhead_pool",
  overhead_allocation_base: "overhead_allocation_base",
  current_shop_rate: "current_shop_rate",
  target_margin_pct: "target_margin_pct",
  utilization_pct: "utilization_pct",
};

export const plantWideShopRateBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState: Record<string, { value: string; unit: string }>,
  _hiddenValues: Record<string, number>,
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

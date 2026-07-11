// SectorCalc PRO V2 — Outsource vs In-House Analyzer Execute Payload Adapter
// Maps form field IDs to server schema input keys.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  in_house_material_cost_per_unit: "n_in_house_material_cost_per_unit",
  in_house_labor_cost_per_unit: "n_in_house_labor_cost_per_unit",
  in_house_overhead_per_unit: "n_in_house_overhead_per_unit",
  in_house_setup_cost_per_batch: "n_in_house_setup_cost_per_batch",
  outsource_unit_price: "n_outsource_unit_price",
  outsource_logistics_per_unit: "n_outsource_logistics_per_unit",
  quality_defect_allowance_pct: "n_quality_defect_allowance_pct",
  inventory_lead_time_cost_pct: "n_inventory_lead_time_cost_pct",
  capacity_opportunity_cost_pct: "n_capacity_opportunity_cost_pct",
  annual_volume: "n_annual_volume",
};

const HIDDEN_TO_SCHEMA: Record<string, { schemaId: string; defaultValue: number }> = {
  source_confidence: { schemaId: "source_confidence", defaultValue: 0.9 },
};

export { FORM_TO_SCHEMA_INPUT, HIDDEN_TO_SCHEMA };

export const outsourceBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState,
  hiddenValues,
) => {
  const raw_inputs: Record<string, number> = {};

  for (const [formId, schemaId] of Object.entries(FORM_TO_SCHEMA_INPUT)) {
    if (HIDDEN_TO_SCHEMA[formId]) continue;
    const entry = fieldState[formId];
    if (entry && entry.value !== "" && entry.value !== undefined) {
      const num = parseFloat(entry.value);
      if (Number.isFinite(num)) {
        raw_inputs[schemaId] = num;
      }
    }
  }

  for (const [formId, cfg] of Object.entries(HIDDEN_TO_SCHEMA)) {
    const hEntry = fieldState[formId];
    if (hEntry && hEntry.value !== "" && hEntry.value !== undefined) {
      const num = parseFloat(hEntry.value);
      if (Number.isFinite(num)) {
        raw_inputs[cfg.schemaId] = num;
      }
    } else if (hiddenValues[formId] !== undefined) {
      raw_inputs[cfg.schemaId] = hiddenValues[formId];
    } else {
      raw_inputs[cfg.schemaId] = cfg.defaultValue;
    }
  }

  return {
    raw_inputs,
    selected_units: {},
  };
};

// SectorCalc PRO V2 — Scrap & Rework Cost Tracker Execute Payload Adapter
// Maps form field IDs to server schema input keys.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  total_produced: "n_total_produced",
  scrap_quantity: "n_scrap_quantity",
  rework_quantity: "n_rework_quantity",
  unit_material_cost: "n_unit_material_cost",
  unit_labor_cost: "n_unit_labor_cost",
  rework_labor_rate: "n_rework_labor_rate",
  rework_time_per_unit: "n_rework_time_per_unit",
  defect_rate_target_pct: "n_defect_rate_target_pct",
  monthly_volume: "n_monthly_volume",
};

const HIDDEN_TO_SCHEMA: Record<string, { schemaId: string; defaultValue: number }> = {
  source_confidence: { schemaId: "source_confidence", defaultValue: 0.9 },
};

export { FORM_TO_SCHEMA_INPUT, HIDDEN_TO_SCHEMA };

export const scrapReworkBuildExecutePayload: ProExecutePayloadAdapter = (
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

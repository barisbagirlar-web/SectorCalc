// SectorCalc PRO V2 — Downtime & Scrap Loss Statement Execute Payload Adapter
// Maps form field IDs to server schema input keys.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  downtime_hours: "downtime_hours",
  hourly_contribution_rate: "hourly_contribution_rate",
  scrap_quantity: "scrap_quantity",
  material_cost_per_unit: "material_cost_per_unit",
  rework_hours: "rework_hours",
  rework_labor_rate: "rework_labor_rate",
  disposal_inspection_cost: "disposal_inspection_cost",
  annual_event_frequency: "annual_event_frequency",
};

const HIDDEN_TO_SCHEMA: Record<string, { schemaId: string; defaultValue: number }> = {};

export { FORM_TO_SCHEMA_INPUT, HIDDEN_TO_SCHEMA };

export const downtimeScrapBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState,
  hiddenValues,
) => {
  const raw_inputs: Record<string, number> = {};

  // Visible fields
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

  // Hidden field defaults
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

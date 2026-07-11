// SectorCalc PRO V2 — OEE Loss Monetization & Improvement Business Case Adapter
// Maps form field IDs to server schema input keys.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  planned_production_time_seconds: "planned_production_time_seconds",
  operating_time_seconds: "operating_time_seconds",
  net_operating_time_seconds: "net_operating_time_seconds",
  ideal_cycle_time_per_part: "ideal_cycle_time_per_part",
  total_parts_produced: "total_parts_produced",
  good_parts: "good_parts",
  hourly_contribution: "hourly_contribution",
  improvement_investment: "improvement_investment",
  operating_hours_per_year: "operating_hours_per_year",
};

const HIDDEN_TO_SCHEMA: Record<string, { schemaId: string; defaultValue: number }> = {};

export { FORM_TO_SCHEMA_INPUT, HIDDEN_TO_SCHEMA };

export const oeeBuildExecutePayload: ProExecutePayloadAdapter = (
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

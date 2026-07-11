// SectorCalc PRO V2 — Weld Execute Payload Adapter
// Maps form field IDs to server schema input keys.
// Server formula expects schema keys with "n_" prefix after normalization.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  weld_length: "weld_length_m",
  weld_throat: "weld_throat_mm",
  material_density: "weld_density_g_per_cm3",
  wire_cost: "wire_cost_per_kg",
  gas_cost: "gas_cost_per_min",
  arc_time: "arc_time_min",
  total_job_time: "weld_time_min",
  labor_rate: "labor_rate",
  shop_overhead_rate: "overhead_rate",
  deposition_efficiency: "deposition_efficiency_pct",
};

const HIDDEN_TO_SCHEMA: Record<string, { schemaId: string; defaultValue: number }> = {
  material_density: { schemaId: "weld_density_g_per_cm3", defaultValue: 7.85 },
};

export { FORM_TO_SCHEMA_INPUT, HIDDEN_TO_SCHEMA };

export const weldBuildExecutePayload: ProExecutePayloadAdapter = (
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
    selected_units: {}, // All weld schema inputs have unit_selectable: false
  };
};

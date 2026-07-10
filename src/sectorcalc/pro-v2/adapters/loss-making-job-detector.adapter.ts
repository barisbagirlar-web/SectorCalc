// SectorCalc PRO V2 — Loss Making Job Detector Execute Payload Adapter

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  machine_rate: "n_machine_rate",
  material_cost: "n_material_cost",
  labor_rate: "n_labor_rate",
  overhead_rate: "n_overhead_rate",
  defect_or_loss_cost: "n_defect_or_loss_cost",
  target_margin: "n_target_margin",
  batch_quantity: "n_batch_quantity",
  annual_volume: "n_annual_volume",
};

const HIDDEN_TO_SCHEMA: Record<string, { schemaId: string; defaultValue: number }> = {
  source_confidence: { schemaId: "n_source_confidence_ratio", defaultValue: 0.9 },
};

export const lossDetectorBuildExecutePayload: ProExecutePayloadAdapter = (fieldState, hiddenValues) => {
  const raw_inputs: Record<string, number> = {};
  for (const [formId, schemaId] of Object.entries(FORM_TO_SCHEMA_INPUT)) {
    const entry = fieldState[formId];
    if (entry && entry.value !== "" && entry.value !== undefined) {
      const num = parseFloat(entry.value);
      if (Number.isFinite(num)) raw_inputs[schemaId] = num;
    }
  }
  for (const [formId, cfg] of Object.entries(HIDDEN_TO_SCHEMA)) {
    const hEntry = fieldState[formId];
    if (hEntry && hEntry.value !== "" && hEntry.value !== undefined) {
      const num = parseFloat(hEntry.value);
      if (Number.isFinite(num)) raw_inputs[cfg.schemaId] = num;
    } else if (hiddenValues[formId] !== undefined) {
      raw_inputs[cfg.schemaId] = hiddenValues[formId];
    } else {
      raw_inputs[cfg.schemaId] = cfg.defaultValue;
    }
  }
  return { raw_inputs, selected_units: {} };
};

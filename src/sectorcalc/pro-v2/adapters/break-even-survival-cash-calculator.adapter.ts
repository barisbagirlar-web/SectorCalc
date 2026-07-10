// SectorCalc PRO V2 — Break-Even Survival Cash Execute Payload Adapter

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  initial_investment: "n_initial_investment",
  annual_net_cash_flow: "n_annual_net_cash_flow",
  discount_rate: "n_discount_rate",
  analysis_years: "n_analysis_years",
  residual_value: "n_residual_value",
  stress_downside_factor: "n_stress_downside_factor",
  annual_volume: "n_annual_volume",
  labor_rate: "n_labor_rate",
  overhead_rate: "n_overhead_rate",
  defect_or_loss_cost: "n_defect_or_loss_cost",
};

const HIDDEN_TO_SCHEMA: Record<string, { schemaId: string; defaultValue: number }> = {
  source_confidence: { schemaId: "n_source_confidence_ratio", defaultValue: 0.95 },
};

export const breakEvenBuildExecutePayload: ProExecutePayloadAdapter = (fieldState, hiddenValues) => {
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

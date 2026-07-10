// SectorCalc PRO V2 — Job Quote Builder Execute Payload Adapter

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  batch_quantity: "n_batch_quantity",
  material_cost_per_unit: "n_material_cost_per_unit",
  cycle_time_seconds_per_unit: "n_cycle_time_seconds_per_unit",
  setup_time_minutes_per_batch: "n_setup_time_minutes_per_batch",
  machine_rate_per_hour: "n_machine_rate_per_hour",
  labor_rate_per_hour: "n_labor_rate_per_hour",
  operator_count: "n_operator_count",
  annual_unallocated_overhead: "n_annual_unallocated_overhead",
  annual_volume_units: "n_annual_volume_units",
  scrap_rework_percent: "n_scrap_rework_percent",
  target_revenue_margin_percent: "n_target_revenue_margin_percent",
  tooling_consumables_cost_per_batch: "n_tooling_consumables_cost_per_batch",
  external_processing_cost_per_batch: "n_external_processing_cost_per_batch",
  packaging_cost_per_batch: "n_packaging_cost_per_batch",
  freight_cost_per_batch: "n_freight_cost_per_batch",
  other_job_cost_per_batch: "n_other_job_cost_per_batch",
  contingency_percent: "n_contingency_percent",
  current_quote_per_unit: "n_current_quote_per_unit",
};

export const quoteBuilderBuildExecutePayload: ProExecutePayloadAdapter = (fieldState, hiddenValues) => {
  const raw_inputs: Record<string, number> = {};
  for (const [formId, schemaId] of Object.entries(FORM_TO_SCHEMA_INPUT)) {
    const entry = fieldState[formId];
    if (entry && entry.value !== "" && entry.value !== undefined) {
      const num = parseFloat(entry.value);
      if (Number.isFinite(num)) raw_inputs[schemaId] = num;
    }
  }
  return { raw_inputs, selected_units: {} };
};

// SectorCalc PRO V2 — Loss Making Job Detector Execute Payload Adapter
// Maps form field IDs to server formula input keys with unit conversion.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  batch_quantity: "n_batch_quantity",
  selling_price_per_unit: "n_selling_price_per_unit",
  material_cost_per_unit: "n_material_cost_per_unit",
  cycle_time_seconds_per_unit: "n_cycle_time_seconds_per_unit",
  setup_time_minutes_per_batch: "n_setup_time_minutes_per_batch",
  machine_rate_per_hour: "n_machine_rate_per_hour",
  operator_count: "n_operator_count",
  labor_rate_per_hour: "n_labor_rate_per_hour",
  external_processing_per_batch: "n_external_processing_per_batch",
  packaging_freight_per_batch: "n_packaging_freight_per_batch",
  other_job_cost_per_batch: "n_other_job_cost_per_batch",
  allocated_overhead: "n_allocated_overhead",
  scrap_rework_percent: "n_scrap_rework_percent",
  target_revenue_margin_percent: "n_target_revenue_margin_percent",
  annual_volume_units: "n_annual_volume_units",
};

export const lossDetectorBuildExecutePayload: ProExecutePayloadAdapter = (fieldState, hiddenValues) => {
  const raw_inputs: Record<string, number> = {};

  function convertDisplayToEngine(formId: string, value: number, unit: string): number {
    switch (formId) {
      case "machine_rate_per_hour":
        // Engine expects per-hour. USD/min → *60
        if (unit === "USD/min" || unit === "EUR/min" || unit === "GBP/min") return value * 60;
        return value; // USD/h, EUR/h, GBP/h — already per-hour
      case "labor_rate_per_hour":
        if (unit === "USD/min" || unit === "EUR/min") return value * 60;
        return value; // USD/h, EUR/h, GBP/h
      case "batch_quantity":
        if (unit === "hundred") return value * 100;
        if (unit === "thousand") return value * 1000;
        return value;
      case "annual_volume_units":
        if (unit === "thousand") return value * 1000;
        return value;
      case "target_revenue_margin_percent":
      case "scrap_rework_percent":
        if (unit === "factor 0-1" || unit === "factor") return value * 100;
        return value;
      case "cycle_time_seconds_per_unit":
        if (unit === "min") return value * 60;
        if (unit === "h") return value * 3600;
        return value; // sec
      case "setup_time_minutes_per_batch":
        if (unit === "h") return value * 60;
        if (unit === "sec") return value / 60;
        return value; // min
      default:
        return value;
    }
  }

  for (const [formId, schemaId] of Object.entries(FORM_TO_SCHEMA_INPUT)) {
    const entry = fieldState[formId];
    if (entry && entry.value !== "" && entry.value !== undefined) {
      const num = parseFloat(entry.value);
      if (Number.isFinite(num)) {
        raw_inputs[schemaId] = convertDisplayToEngine(formId, num, entry.unit);
      }
    }
  }

  return { raw_inputs, selected_units: {} };
};

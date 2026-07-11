// SectorCalc PRO V2 — Machine Hourly Rate Proof Report Execute Payload Adapter
// Maps form field IDs to exact 23 approved server schema input keys.
// No source_confidence, no hidden default values.
// Converts display-unit values to formula-expected base units.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

// Maps form field IDs (from field contract) to server schema normalized IDs.
// Every formula input must have exactly one mapping.
const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  planned_operating_hours: "planned_operating_hours",
  utilization_percent: "utilization_percent",
  planned_downtime_percent: "planned_downtime_percent",
  purchase_price: "purchase_price",
  residual_value: "residual_value",
  economic_life_years: "economic_life_years",
  maintenance_cost: "maintenance_cost",
  insurance_tax_cost: "insurance_tax_cost",
  facility_allocation: "facility_allocation",
  machine_power_kw: "machine_power_kw",
  electricity_price: "electricity_price",
  consumables_cost_per_hour: "consumables_cost_per_hour",
  tooling_cost_per_hour: "tooling_cost_per_hour",
  operator_count: "operator_count",
  labor_rate_per_hour: "labor_rate_per_hour",
  current_shop_rate: "current_shop_rate",
  target_margin_percent: "target_margin_percent",
  financing_cost_percent: "financing_cost_percent",
  other_annual_fixed_cost: "other_annual_fixed_cost",
  annual_production_volume: "annual_production_volume",
  cycle_time_seconds: "cycle_time_seconds",
  setup_time_minutes: "setup_time_minutes",
  average_batch_quantity: "average_batch_quantity",
};

export { FORM_TO_SCHEMA_INPUT };

// Fields that require unit conversion before sending to server.
// Key: form field ID → conversion: { fromUnitPattern, multiplier }
function convertDisplayToEngine(formId: string, value: number, unit: string): number {
  switch (formId) {
    case "target_margin_percent": {
      // Formula expects percentage value (e.g., 25 → 25). If unit is factor 0-1, multiply to get %
      if (unit === "factor 0-1" || unit === "factor") return value * 100;
      return value;
    }
    case "economic_life_years": {
      // Formula expects years. "month" → /12
      if (unit === "month") return value / 12;
      return value;
    }
    case "cycle_time_seconds": {
      // Formula expects seconds. Convert to seconds
      if (unit === "min") return value * 60;
      if (unit === "h") return value * 3600;
      return value; // sec
    }
    case "setup_time_minutes": {
      // Formula expects minutes. Convert to minutes
      if (unit === "h") return value * 60;
      if (unit === "sec") return value / 60;
      return value; // min
    }
    case "utilization_percent":
    case "planned_downtime_percent": {
      // Formula expects percentage. If factor 0-1, multiply by 100
      if (unit === "factor 0-1" || unit === "factor") return value * 100;
      return value;
    }
    case "financing_cost_percent": {
      // Formula expects percent/year. If %/month → *12, if factor/year → *100
      if (unit === "%/month") return value * 12;
      if (unit === "factor/year") return value * 100;
      return value;
    }
    case "annual_production_volume":
    case "average_batch_quantity": {
      // If "thousand", multiply
      if (unit === "thousand") return value * 1000;
      return value;
    }
    default:
      return value;
  }
}

export const machineRateBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState,
  _hiddenValues,
) => {
  const raw_inputs: Record<string, number> = {};
  const selected_units: Record<string, string> = {};

  for (const [formId, schemaId] of Object.entries(FORM_TO_SCHEMA_INPUT)) {
    const entry = fieldState[formId];
    if (entry && entry.value !== "" && entry.value !== undefined) {
      const num = parseFloat(entry.value);
      if (Number.isFinite(num)) {
        const engineVal = convertDisplayToEngine(formId, num, entry.unit);
        raw_inputs[schemaId] = engineVal;
        selected_units[formId] = entry.unit;
      }
    }
  }

  return { raw_inputs, selected_units };
};

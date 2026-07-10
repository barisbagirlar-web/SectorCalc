// SectorCalc PRO V2 — Weld Preset Examples
// At least 2 realistic examples per tool.

import type { ProPreset } from "../proToolRegistry";

export const WELD_PRESETS: ProPreset[] = [
  {
    label: "Standard carbon steel weld (12m)",
    values: {
      weld_length: "12", weld_throat: "6", material: "carbon_steel",
      wire_cost: "4.2", gas_cost: "0.18", arc_time: "45",
      total_job_time: "60", labor_rate: "55", shop_overhead_rate: "25",
      deposition_efficiency: "85", planned_quote: "190", contingency: "10",
    },
    units: {
      weld_length: "m", weld_throat: "mm", wire_cost: "USD/kg",
      gas_cost: "USD/min", arc_time: "min", total_job_time: "min",
      labor_rate: "USD/h", shop_overhead_rate: "USD/h",
      deposition_efficiency: "%", planned_quote: "USD", contingency: "%",
    },
  },
  {
    label: "Large structural weld (50m)",
    values: {
      weld_length: "50", weld_throat: "8", material: "carbon_steel",
      wire_cost: "4.8", gas_cost: "0.24", arc_time: "180",
      total_job_time: "260", labor_rate: "65", shop_overhead_rate: "35",
      deposition_efficiency: "82", planned_quote: "950", contingency: "12",
    },
    units: {
      weld_length: "m", weld_throat: "mm", wire_cost: "USD/kg",
      gas_cost: "USD/min", arc_time: "min", total_job_time: "min",
      labor_rate: "USD/h", shop_overhead_rate: "USD/h",
      deposition_efficiency: "%", planned_quote: "USD", contingency: "%",
    },
  },
  {
    label: "Small precision weld (2m)",
    values: {
      weld_length: "2", weld_throat: "3", material: "stainless_steel",
      wire_cost: "9.5", gas_cost: "0.22", arc_time: "18",
      total_job_time: "42", labor_rate: "75", shop_overhead_rate: "40",
      deposition_efficiency: "78", planned_quote: "180", contingency: "15",
    },
    units: {
      weld_length: "m", weld_throat: "mm", wire_cost: "USD/kg",
      gas_cost: "USD/min", arc_time: "min", total_job_time: "min",
      labor_rate: "USD/h", shop_overhead_rate: "USD/h",
      deposition_efficiency: "%", planned_quote: "USD", contingency: "%",
    },
  },
];

export function getDefaultPreset(): ProPreset {
  return WELD_PRESETS[0];
}

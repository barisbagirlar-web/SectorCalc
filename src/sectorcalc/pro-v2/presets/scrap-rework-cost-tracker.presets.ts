// SectorCalc PRO V2 — Scrap & Rework Cost Tracker Preset Examples
// At least 2 realistic examples per tool.

import type { ProPreset } from "../proToolRegistry";

export const SCRAP_REWORK_PRESETS: ProPreset[] = [
  {
    label: "Standard production (within target)",
    values: {
      total_produced: "10000",
      scrap_quantity: "150",
      rework_quantity: "80",
      unit_material_cost: "25",
      unit_labor_cost: "15",
      rework_labor_rate: "45",
      rework_time_per_unit: "0.5",
      defect_rate_target_pct: "2.0",
      monthly_volume: "10000",
    },
    units: {
      total_produced: "units",
      scrap_quantity: "units",
      rework_quantity: "units",
      unit_material_cost: "USD/unit",
      unit_labor_cost: "USD/unit",
      rework_labor_rate: "USD/h",
      rework_time_per_unit: "h",
      defect_rate_target_pct: "%",
      monthly_volume: "units/month",
    },
  },
  {
    label: "High scrap rate (critical quality issue)",
    values: {
      total_produced: "8000",
      scrap_quantity: "1200",
      rework_quantity: "400",
      unit_material_cost: "55",
      unit_labor_cost: "30",
      rework_labor_rate: "65",
      rework_time_per_unit: "0.8",
      defect_rate_target_pct: "2.0",
      monthly_volume: "8000",
    },
    units: {
      total_produced: "units",
      scrap_quantity: "units",
      rework_quantity: "units",
      unit_material_cost: "USD/unit",
      unit_labor_cost: "USD/unit",
      rework_labor_rate: "USD/h",
      rework_time_per_unit: "h",
      defect_rate_target_pct: "%",
      monthly_volume: "units/month",
    },
  },
  {
    label: "Low-volume precision run (manageable)",
    values: {
      total_produced: "500",
      scrap_quantity: "5",
      rework_quantity: "8",
      unit_material_cost: "150",
      unit_labor_cost: "45",
      rework_labor_rate: "75",
      rework_time_per_unit: "1.0",
      defect_rate_target_pct: "2.0",
      monthly_volume: "500",
    },
    units: {
      total_produced: "units",
      scrap_quantity: "units",
      rework_quantity: "units",
      unit_material_cost: "USD/unit",
      unit_labor_cost: "USD/unit",
      rework_labor_rate: "USD/h",
      rework_time_per_unit: "h",
      defect_rate_target_pct: "%",
      monthly_volume: "units/month",
    },
  },
];

export function getDefaultScrapReworkPreset(): ProPreset {
  return SCRAP_REWORK_PRESETS[0];
}

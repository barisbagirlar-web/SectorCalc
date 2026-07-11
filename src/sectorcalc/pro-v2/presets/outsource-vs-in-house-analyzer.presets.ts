// SectorCalc PRO V2 — Outsource vs In-House Analyzer Preset Examples
// At least 2 realistic examples per tool.

import type { ProPreset } from "../proToolRegistry";

export const OUTSOURCE_PRESETS: ProPreset[] = [
  {
    label: "Standard comparison (clear make decision)",
    values: {
      in_house_material_cost_per_unit: "30",
      in_house_labor_cost_per_unit: "25",
      in_house_overhead_per_unit: "20",
      in_house_setup_cost_per_batch: "500",
      outsource_unit_price: "95",
      outsource_logistics_per_unit: "8",
      quality_defect_allowance_pct: "3",
      inventory_lead_time_cost_pct: "2",
      capacity_opportunity_cost_pct: "5",
      annual_volume: "5000",
    },
    units: {
      in_house_material_cost_per_unit: "USD/unit",
      in_house_labor_cost_per_unit: "USD/unit",
      in_house_overhead_per_unit: "USD/unit",
      in_house_setup_cost_per_batch: "USD",
      outsource_unit_price: "USD/unit",
      outsource_logistics_per_unit: "USD/unit",
      quality_defect_allowance_pct: "%",
      inventory_lead_time_cost_pct: "%",
      capacity_opportunity_cost_pct: "%",
      annual_volume: "units/year",
    },
  },
  {
    label: "Supplier-competitive scenario (buy decision)",
    values: {
      in_house_material_cost_per_unit: "55",
      in_house_labor_cost_per_unit: "40",
      in_house_overhead_per_unit: "35",
      in_house_setup_cost_per_batch: "2000",
      outsource_unit_price: "85",
      outsource_logistics_per_unit: "12",
      quality_defect_allowance_pct: "4",
      inventory_lead_time_cost_pct: "3",
      capacity_opportunity_cost_pct: "10",
      annual_volume: "10000",
    },
    units: {
      in_house_material_cost_per_unit: "USD/unit",
      in_house_labor_cost_per_unit: "USD/unit",
      in_house_overhead_per_unit: "USD/unit",
      in_house_setup_cost_per_batch: "USD",
      outsource_unit_price: "USD/unit",
      outsource_logistics_per_unit: "USD/unit",
      quality_defect_allowance_pct: "%",
      inventory_lead_time_cost_pct: "%",
      capacity_opportunity_cost_pct: "%",
      annual_volume: "units/year",
    },
  },
  {
    label: "Borderline case (close costs — review needed)",
    values: {
      in_house_material_cost_per_unit: "45",
      in_house_labor_cost_per_unit: "30",
      in_house_overhead_per_unit: "25",
      in_house_setup_cost_per_batch: "1000",
      outsource_unit_price: "88",
      outsource_logistics_per_unit: "5",
      quality_defect_allowance_pct: "2",
      inventory_lead_time_cost_pct: "1",
      capacity_opportunity_cost_pct: "3",
      annual_volume: "8000",
    },
    units: {
      in_house_material_cost_per_unit: "USD/unit",
      in_house_labor_cost_per_unit: "USD/unit",
      in_house_overhead_per_unit: "USD/unit",
      in_house_setup_cost_per_batch: "USD",
      outsource_unit_price: "USD/unit",
      outsource_logistics_per_unit: "USD/unit",
      quality_defect_allowance_pct: "%",
      inventory_lead_time_cost_pct: "%",
      capacity_opportunity_cost_pct: "%",
      annual_volume: "units/year",
    },
  },
];

export function getDefaultOutsourcePreset(): ProPreset {
  return OUTSOURCE_PRESETS[0];
}

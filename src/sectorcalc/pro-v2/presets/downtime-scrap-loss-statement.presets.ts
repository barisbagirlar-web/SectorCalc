// SectorCalc PRO V2 — Downtime & Scrap Loss Statement Preset Examples
// At least 2 realistic examples per tool.

import type { ProPreset } from "../proToolRegistry";

export const DOWNTIME_SCRAP_PRESETS: ProPreset[] = [
  {
    label: "Standard downtime event (manageable loss)",
    values: {
      downtime_hours: "4",
      hourly_contribution_rate: "200",
      scrap_quantity: "150",
      material_cost_per_unit: "25",
      rework_hours: "8",
      rework_labor_rate: "55",
      disposal_inspection_cost: "500",
      annual_event_frequency: "12",
    },
    units: {
      downtime_hours: "h",
      hourly_contribution_rate: "USD/h",
      scrap_quantity: "units",
      material_cost_per_unit: "USD/unit",
      rework_hours: "h",
      rework_labor_rate: "USD/h",
      disposal_inspection_cost: "USD",
      annual_event_frequency: "events/year",
    },
  },
  {
    label: "High-impact breakdown event (critical loss)",
    values: {
      downtime_hours: "16",
      hourly_contribution_rate: "500",
      scrap_quantity: "750",
      material_cost_per_unit: "45",
      rework_hours: "40",
      rework_labor_rate: "65",
      disposal_inspection_cost: "2500",
      annual_event_frequency: "6",
    },
    units: {
      downtime_hours: "h",
      hourly_contribution_rate: "USD/h",
      scrap_quantity: "units",
      material_cost_per_unit: "USD/unit",
      rework_hours: "h",
      rework_labor_rate: "USD/h",
      disposal_inspection_cost: "USD",
      annual_event_frequency: "events/year",
    },
  },
  {
    label: "Minor process upset (low loss)",
    values: {
      downtime_hours: "1",
      hourly_contribution_rate: "150",
      scrap_quantity: "20",
      material_cost_per_unit: "12",
      rework_hours: "2",
      rework_labor_rate: "45",
      disposal_inspection_cost: "100",
      annual_event_frequency: "3",
    },
    units: {
      downtime_hours: "h",
      hourly_contribution_rate: "USD/h",
      scrap_quantity: "units",
      material_cost_per_unit: "USD/unit",
      rework_hours: "h",
      rework_labor_rate: "USD/h",
      disposal_inspection_cost: "USD",
      annual_event_frequency: "events/year",
    },
  },
];

export function getDefaultDowntimeScrapPreset(): ProPreset {
  return DOWNTIME_SCRAP_PRESETS[0];
}

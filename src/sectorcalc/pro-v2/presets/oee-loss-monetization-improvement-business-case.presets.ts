// SectorCalc PRO V2 — OEE Loss Monetization & Improvement Business Case Presets
// At least 2 realistic examples per tool.

import type { ProPreset } from "../proToolRegistry";

export const OEE_PRESETS: ProPreset[] = [
  {
    label: "Standard manufacturing line (good improvement case)",
    values: {
      planned_production_time_seconds: "28800",
      operating_time_seconds: "25200",
      net_operating_time_seconds: "23000",
      ideal_cycle_time_per_part: "30",
      total_parts_produced: "900",
      good_parts: "855",
      hourly_contribution: "100",
      improvement_investment: "50000",
      operating_hours_per_year: "2000",
    },
    units: {
      planned_production_time_seconds: "sec",
      operating_time_seconds: "sec",
      net_operating_time_seconds: "sec",
      ideal_cycle_time_per_part: "sec",
      total_parts_produced: "units",
      good_parts: "units",
      hourly_contribution: "USD/h",
      improvement_investment: "USD",
      operating_hours_per_year: "h",
    },
  },
  {
    label: "High-loss production line (weak ROI)",
    values: {
      planned_production_time_seconds: "28800",
      operating_time_seconds: "18000",
      net_operating_time_seconds: "14000",
      ideal_cycle_time_per_part: "30",
      total_parts_produced: "500",
      good_parts: "400",
      hourly_contribution: "150",
      improvement_investment: "200000",
      operating_hours_per_year: "2000",
    },
    units: {
      planned_production_time_seconds: "sec",
      operating_time_seconds: "sec",
      net_operating_time_seconds: "sec",
      ideal_cycle_time_per_part: "sec",
      total_parts_produced: "units",
      good_parts: "units",
      hourly_contribution: "USD/h",
      improvement_investment: "USD",
      operating_hours_per_year: "h",
    },
  },
  {
    label: "Well-performing line (strong ROI)",
    values: {
      planned_production_time_seconds: "28800",
      operating_time_seconds: "27000",
      net_operating_time_seconds: "26000",
      ideal_cycle_time_per_part: "25",
      total_parts_produced: "1050",
      good_parts: "1030",
      hourly_contribution: "200",
      improvement_investment: "30000",
      operating_hours_per_year: "2000",
    },
    units: {
      planned_production_time_seconds: "sec",
      operating_time_seconds: "sec",
      net_operating_time_seconds: "sec",
      ideal_cycle_time_per_part: "sec",
      total_parts_produced: "units",
      good_parts: "units",
      hourly_contribution: "USD/h",
      improvement_investment: "USD",
      operating_hours_per_year: "h",
    },
  },
];

export function getDefaultOeePreset(): ProPreset {
  return OEE_PRESETS[0];
}

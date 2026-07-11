// SectorCalc PRO V2 — Setup Time Reduction ROI (SMED) Preset Examples
// At least 2 realistic examples per tool.

import type { ProPreset } from "../proToolRegistry";

export const SMED_PRESETS: ProPreset[] = [
  {
    label: "Standard SMED case (good ROI — payback < 12 months)",
    values: {
      current_setup_time_minutes: "30",
      future_setup_time_minutes: "10",
      setups_per_year: "500",
      machine_hourly_rate: "85",
      labor_rate_per_hour: "45",
      implementation_cost: "35000",
      operator_count: "2",
    },
    units: {
      current_setup_time_minutes: "min",
      future_setup_time_minutes: "min",
      setups_per_year: "setups/year",
      machine_hourly_rate: "USD/h",
      labor_rate_per_hour: "USD/h",
      implementation_cost: "USD",
      operator_count: "operators",
    },
  },
  {
    label: "Expensive SMED project (extended payback)",
    values: {
      current_setup_time_minutes: "45",
      future_setup_time_minutes: "25",
      setups_per_year: "200",
      machine_hourly_rate: "200",
      labor_rate_per_hour: "65",
      implementation_cost: "150000",
      operator_count: "3",
    },
    units: {
      current_setup_time_minutes: "min",
      future_setup_time_minutes: "min",
      setups_per_year: "setups/year",
      machine_hourly_rate: "USD/h",
      labor_rate_per_hour: "USD/h",
      implementation_cost: "USD",
      operator_count: "operators",
    },
  },
  {
    label: "Quick-win SMED (rapid payback)",
    values: {
      current_setup_time_minutes: "20",
      future_setup_time_minutes: "5",
      setups_per_year: "1000",
      machine_hourly_rate: "75",
      labor_rate_per_hour: "40",
      implementation_cost: "15000",
      operator_count: "1",
    },
    units: {
      current_setup_time_minutes: "min",
      future_setup_time_minutes: "min",
      setups_per_year: "setups/year",
      machine_hourly_rate: "USD/h",
      labor_rate_per_hour: "USD/h",
      implementation_cost: "USD",
      operator_count: "operators",
    },
  },
];

export function getDefaultSmedPreset(): ProPreset {
  return SMED_PRESETS[0];
}

// SectorCalc PRO V2 — Motor/Compressor Replacement ROI Presets
// 3 realistic examples per tool.

import type { ProPreset } from "../proToolRegistry";

export const MOTOR_ROI_PRESETS: ProPreset[] = [
  {
    label: "Standard motor replacement (75kW → 60kW)",
    values: {
      current_power_kw: "75",
      proposed_power_kw: "60",
      annual_operating_hours: "6000",
      energy_price_per_kwh: "0.12",
      current_maintenance_cost: "5000",
      proposed_maintenance_cost: "3000",
      replacement_cost: "16000",
      useful_life_years: "10",
      discount_rate: "8",
    },
    units: {
      current_power_kw: "kW", proposed_power_kw: "kW",
      annual_operating_hours: "h", energy_price_per_kwh: "USD/kWh",
      current_maintenance_cost: "USD", proposed_maintenance_cost: "USD",
      replacement_cost: "USD", useful_life_years: "years",
      discount_rate: "%",
    },
  },
  {
    label: "Large compressor upgrade (200kW → 150kW)",
    values: {
      current_power_kw: "200",
      proposed_power_kw: "150",
      annual_operating_hours: "8000",
      energy_price_per_kwh: "0.10",
      current_maintenance_cost: "12000",
      proposed_maintenance_cost: "6000",
      replacement_cost: "45000",
      useful_life_years: "15",
      discount_rate: "10",
    },
    units: {
      current_power_kw: "kW", proposed_power_kw: "kW",
      annual_operating_hours: "h", energy_price_per_kwh: "USD/kWh",
      current_maintenance_cost: "USD", proposed_maintenance_cost: "USD",
      replacement_cost: "USD", useful_life_years: "years",
      discount_rate: "%",
    },
  },
  {
    label: "Small motor — marginal payback (10kW → 7.5kW)",
    values: {
      current_power_kw: "10",
      proposed_power_kw: "7.5",
      annual_operating_hours: "4000",
      energy_price_per_kwh: "0.15",
      current_maintenance_cost: "1500",
      proposed_maintenance_cost: "1000",
      replacement_cost: "5000",
      useful_life_years: "8",
      discount_rate: "6",
    },
    units: {
      current_power_kw: "kW", proposed_power_kw: "kW",
      annual_operating_hours: "h", energy_price_per_kwh: "USD/kWh",
      current_maintenance_cost: "USD", proposed_maintenance_cost: "USD",
      replacement_cost: "USD", useful_life_years: "years",
      discount_rate: "%",
    },
  },
];

export function getDefaultMotorRoiPreset(): ProPreset {
  return MOTOR_ROI_PRESETS[0];
}

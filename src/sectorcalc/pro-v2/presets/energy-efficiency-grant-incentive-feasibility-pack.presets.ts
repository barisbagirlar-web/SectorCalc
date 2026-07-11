// SectorCalc PRO V2 — Energy Efficiency Grant / Incentive Feasibility Pack Presets
// 3 realistic examples per tool.

import type { ProPreset } from "../proToolRegistry";

export const GRANT_FEASIBILITY_PRESETS: ProPreset[] = [
  {
    label: "Medium manufacturing energy retrofit with grant",
    values: {
      baseline_energy_consumption_kwh: "500000",
      baseline_energy_price_per_kwh: "0.12",
      projected_saving_pct: "30",
      gross_project_cost: "120000",
      eligible_project_cost: "100000",
      grant_incentive_amount: "35000",
      annual_maintenance_cost: "5000",
      useful_life_years: "10",
      discount_rate: "8",
      energy_price_escalation_pct: "2",
    },
    units: {
      baseline_energy_consumption_kwh: "kWh", baseline_energy_price_per_kwh: "USD/kWh",
      projected_saving_pct: "%", gross_project_cost: "USD",
      eligible_project_cost: "USD", grant_incentive_amount: "USD",
      annual_maintenance_cost: "USD", useful_life_years: "years",
      discount_rate: "%", energy_price_escalation_pct: "%",
    },
  },
  {
    label: "Small commercial lighting upgrade",
    values: {
      baseline_energy_consumption_kwh: "100000",
      baseline_energy_price_per_kwh: "0.14",
      projected_saving_pct: "40",
      gross_project_cost: "35000",
      eligible_project_cost: "30000",
      grant_incentive_amount: "12000",
      annual_maintenance_cost: "1000",
      useful_life_years: "8",
      discount_rate: "6",
      energy_price_escalation_pct: "3",
    },
    units: {
      baseline_energy_consumption_kwh: "kWh", baseline_energy_price_per_kwh: "USD/kWh",
      projected_saving_pct: "%", gross_project_cost: "USD",
      eligible_project_cost: "USD", grant_incentive_amount: "USD",
      annual_maintenance_cost: "USD", useful_life_years: "years",
      discount_rate: "%", energy_price_escalation_pct: "%",
    },
  },
  {
    label: "Large industrial HVAC modernization",
    values: {
      baseline_energy_consumption_kwh: "2000000",
      baseline_energy_price_per_kwh: "0.10",
      projected_saving_pct: "25",
      gross_project_cost: "500000",
      eligible_project_cost: "450000",
      grant_incentive_amount: "150000",
      annual_maintenance_cost: "25000",
      useful_life_years: "15",
      discount_rate: "10",
      energy_price_escalation_pct: "2.5",
    },
    units: {
      baseline_energy_consumption_kwh: "kWh", baseline_energy_price_per_kwh: "USD/kWh",
      projected_saving_pct: "%", gross_project_cost: "USD",
      eligible_project_cost: "USD", grant_incentive_amount: "USD",
      annual_maintenance_cost: "USD", useful_life_years: "years",
      discount_rate: "%", energy_price_escalation_pct: "%",
    },
  },
];

export function getDefaultGrantFeasibilityPreset(): ProPreset {
  return GRANT_FEASIBILITY_PRESETS[0];
}

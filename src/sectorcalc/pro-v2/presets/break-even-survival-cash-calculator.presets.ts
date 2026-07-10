// SectorCalc PRO V2 — Break-Even Survival Cash Presets

import type { ProPreset } from "../proToolRegistry";

export const BREAK_EVEN_PRESETS: ProPreset[] = [
  {
    label: "Manufacturing expansion ($500k investment)",
    values: {
      initial_investment: "500000", annual_net_cash_flow: "150000",
      discount_rate: "10", analysis_years: "5", residual_value: "50000",
      stress_downside_factor: "0.8",
      annual_volume: "10000", labor_rate: "80000", overhead_rate: "120000",
      defect_or_loss_cost: "15000",
    },
    units: {
      initial_investment: "USD", annual_net_cash_flow: "USD",
      discount_rate: "%", analysis_years: "years", residual_value: "USD",
      stress_downside_factor: "factor 0-1",
      annual_volume: "units", labor_rate: "USD", overhead_rate: "USD",
      defect_or_loss_cost: "USD",
    },
  },
  {
    label: "Equipment startup ($200k investment)",
    values: {
      initial_investment: "200000", annual_net_cash_flow: "80000",
      discount_rate: "8", analysis_years: "3", residual_value: "20000",
      stress_downside_factor: "0.75",
      annual_volume: "5000", labor_rate: "60000", overhead_rate: "80000",
      defect_or_loss_cost: "10000",
    },
    units: {
      initial_investment: "USD", annual_net_cash_flow: "USD",
      discount_rate: "%", analysis_years: "years", residual_value: "USD",
      stress_downside_factor: "factor 0-1",
      annual_volume: "units", labor_rate: "USD", overhead_rate: "USD",
      defect_or_loss_cost: "USD",
    },
  },
];

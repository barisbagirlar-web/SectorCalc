// SectorCalc PRO V2 — Capital Equipment Investment Appraisal (NPV/IRR) Presets
// 3 realistic examples per tool.

import type { ProPreset } from "../proToolRegistry";

export const NPV_IRR_PRESETS: ProPreset[] = [
  {
    label: "Medium manufacturing equipment investment",
    values: {
      initial_investment: "500000",
      working_capital: "50000",
      annual_cash_inflow_1: "150000",
      annual_cash_inflow_2: "165000",
      annual_cash_inflow_3: "180000",
      annual_cash_inflow_4: "195000",
      annual_cash_inflow_5: "210000",
      terminal_residual_value: "75000",
      discount_rate_percent: "10",
      scenario_downside_pct: "-20",
      scenario_upside_pct: "20",
    },
    units: {
      initial_investment: "USD", working_capital: "USD",
      annual_cash_inflow_1: "USD", annual_cash_inflow_2: "USD",
      annual_cash_inflow_3: "USD", annual_cash_inflow_4: "USD",
      annual_cash_inflow_5: "USD",
      terminal_residual_value: "USD", discount_rate_percent: "%",
      scenario_downside_pct: "%", scenario_upside_pct: "%",
    },
  },
  {
    label: "Small automation project with quick payback",
    values: {
      initial_investment: "150000",
      working_capital: "20000",
      annual_cash_inflow_1: "60000",
      annual_cash_inflow_2: "65000",
      annual_cash_inflow_3: "70000",
      annual_cash_inflow_4: "75000",
      annual_cash_inflow_5: "80000",
      terminal_residual_value: "15000",
      discount_rate_percent: "12",
      scenario_downside_pct: "-15",
      scenario_upside_pct: "15",
    },
    units: {
      initial_investment: "USD", working_capital: "USD",
      annual_cash_inflow_1: "USD", annual_cash_inflow_2: "USD",
      annual_cash_inflow_3: "USD", annual_cash_inflow_4: "USD",
      annual_cash_inflow_5: "USD",
      terminal_residual_value: "USD", discount_rate_percent: "%",
      scenario_downside_pct: "%", scenario_upside_pct: "%",
    },
  },
  {
    label: "Large capital expansion with long payback",
    values: {
      initial_investment: "2000000",
      working_capital: "300000",
      annual_cash_inflow_1: "500000",
      annual_cash_inflow_2: "550000",
      annual_cash_inflow_3: "600000",
      annual_cash_inflow_4: "650000",
      annual_cash_inflow_5: "700000",
      terminal_residual_value: "400000",
      discount_rate_percent: "8",
      scenario_downside_pct: "-25",
      scenario_upside_pct: "25",
    },
    units: {
      initial_investment: "USD", working_capital: "USD",
      annual_cash_inflow_1: "USD", annual_cash_inflow_2: "USD",
      annual_cash_inflow_3: "USD", annual_cash_inflow_4: "USD",
      annual_cash_inflow_5: "USD",
      terminal_residual_value: "USD", discount_rate_percent: "%",
      scenario_downside_pct: "%", scenario_upside_pct: "%",
    },
  },
];

export function getDefaultNpvIrrPreset(): ProPreset {
  return NPV_IRR_PRESETS[0];
}

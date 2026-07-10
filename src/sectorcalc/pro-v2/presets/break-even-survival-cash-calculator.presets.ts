import type { ProPreset } from "../proToolRegistry";

export const BREAK_EVEN_PRESETS: ProPreset[] = [
  {
    label: "Profitable Business",
    values: {
      annual_revenue: "1500000",
      variable_cost_percent: "45",
      annual_fixed_costs: "600000",
      available_cash_liquidity: "300000",
      unit_selling_price: "75",
      unit_variable_cost: "33.75",
    },
    units: {
      annual_revenue: "USD",
      variable_cost_percent: "%",
      annual_fixed_costs: "USD",
      available_cash_liquidity: "USD",
      unit_selling_price: "USD",
      unit_variable_cost: "USD",
    },
  },
  {
    label: "Low-Margin Business",
    values: {
      annual_revenue: "800000",
      variable_cost_percent: "70",
      annual_fixed_costs: "250000",
      available_cash_liquidity: "80000",
      unit_selling_price: "50",
      unit_variable_cost: "35",
    },
    units: {
      annual_revenue: "USD",
      variable_cost_percent: "%",
      annual_fixed_costs: "USD",
      available_cash_liquidity: "USD",
      unit_selling_price: "USD",
      unit_variable_cost: "USD",
    },
  },
  {
    label: "Loss-Making Business",
    values: {
      annual_revenue: "500000",
      variable_cost_percent: "80",
      annual_fixed_costs: "350000",
      available_cash_liquidity: "50000",
      unit_selling_price: "25",
      unit_variable_cost: "20",
    },
    units: {
      annual_revenue: "USD",
      variable_cost_percent: "%",
      annual_fixed_costs: "USD",
      available_cash_liquidity: "USD",
      unit_selling_price: "USD",
      unit_variable_cost: "USD",
    },
  },
];

// SectorCalc PRO V2 — FX Commodity Pass-Through Pricer Presets

import type { ProPreset } from "../proToolRegistry";

export const FX_COMMODITY_PRICER_PRESETS: ProPreset[] = [
  {
    label: "Stable Market — Within Deadband",
    values: {
      base_price: "100",
      fx_rate_spot: "1.08",
      fx_rate_budget: "1.05",
      commodity_index_current: "170",
      commodity_index_budget: "165",
      material_cost_pct: "40",
      fx_hedge_pct: "80",
      commodity_hedge_pct: "70",
      annual_volume: "10000",
      target_margin_percent: "25",
    },
    units: {
      base_price: "USD",
      annual_volume: "units",
      fx_rate_spot: "",
      fx_rate_budget: "",
      commodity_index_current: "",
      commodity_index_budget: "",
      material_cost_pct: "%",
      fx_hedge_pct: "%",
      commodity_hedge_pct: "%",
      target_margin_percent: "%",
    },
  },
  {
    label: "Market Movement — Review Required",
    values: {
      base_price: "100",
      fx_rate_spot: "1.10",
      fx_rate_budget: "1.05",
      commodity_index_current: "180",
      commodity_index_budget: "165",
      material_cost_pct: "40",
      fx_hedge_pct: "60",
      commodity_hedge_pct: "50",
      annual_volume: "5000",
      target_margin_percent: "20",
    },
    units: {
      base_price: "USD",
      annual_volume: "units",
      fx_rate_spot: "",
      fx_rate_budget: "",
      commodity_index_current: "",
      commodity_index_budget: "",
      material_cost_pct: "%",
      fx_hedge_pct: "%",
      commodity_hedge_pct: "%",
      target_margin_percent: "%",
    },
  },
  {
    label: "Severe Volatility — Price Blocked",
    values: {
      base_price: "100",
      fx_rate_spot: "1.25",
      fx_rate_budget: "1.05",
      commodity_index_current: "220",
      commodity_index_budget: "150",
      material_cost_pct: "50",
      fx_hedge_pct: "30",
      commodity_hedge_pct: "20",
      annual_volume: "2000",
      target_margin_percent: "15",
    },
    units: {
      base_price: "USD",
      annual_volume: "units",
      fx_rate_spot: "",
      fx_rate_budget: "",
      commodity_index_current: "",
      commodity_index_budget: "",
      material_cost_pct: "%",
      fx_hedge_pct: "%",
      commodity_hedge_pct: "%",
      target_margin_percent: "%",
    },
  },
];

export function getDefaultPreset(): ProPreset {
  return FX_COMMODITY_PRICER_PRESETS[0];
}

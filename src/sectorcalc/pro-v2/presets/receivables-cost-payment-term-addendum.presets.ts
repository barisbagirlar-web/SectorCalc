// SectorCalc PRO V2 — Receivables Cost Payment Term Addendum Presets

import type { ProPreset } from "../proToolRegistry";

export const RECEIVABLES_ADDENDUM_PRESETS: ProPreset[] = [
  {
    label: "Low Term Cost (Good)",
    values: {
      invoice_value: "100000",
      payment_days: "30",
      early_payment_discount_pct: "2",
      early_payment_days: "10",
      cost_of_capital_pct: "6",
      admin_collection_cost: "500",
      default_risk_allowance: "200",
    },
    units: {
      invoice_value: "USD",
      payment_days: "days",
      early_payment_discount_pct: "%",
      early_payment_days: "days",
      cost_of_capital_pct: "%",
      admin_collection_cost: "USD",
      default_risk_allowance: "USD",
    },
  },
  {
    label: "Moderate Term Cost (Review)",
    values: {
      invoice_value: "50000",
      payment_days: "60",
      early_payment_discount_pct: "1.5",
      early_payment_days: "15",
      cost_of_capital_pct: "8",
      admin_collection_cost: "1000",
      default_risk_allowance: "500",
    },
    units: {
      invoice_value: "USD",
      payment_days: "days",
      early_payment_discount_pct: "%",
      early_payment_days: "days",
      cost_of_capital_pct: "%",
      admin_collection_cost: "USD",
      default_risk_allowance: "USD",
    },
  },
  {
    label: "High Term Cost (Blocked)",
    values: {
      invoice_value: "25000",
      payment_days: "90",
      early_payment_discount_pct: "1",
      early_payment_days: "20",
      cost_of_capital_pct: "12",
      admin_collection_cost: "1500",
      default_risk_allowance: "800",
    },
    units: {
      invoice_value: "USD",
      payment_days: "days",
      early_payment_discount_pct: "%",
      early_payment_days: "days",
      cost_of_capital_pct: "%",
      admin_collection_cost: "USD",
      default_risk_allowance: "USD",
    },
  },
];

export function getDefaultPreset(): ProPreset {
  return RECEIVABLES_ADDENDUM_PRESETS[0];
}

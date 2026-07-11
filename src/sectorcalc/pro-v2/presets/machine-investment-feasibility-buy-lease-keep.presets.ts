// SectorCalc PRO V2 — Machine Investment Feasibility (Buy/Lease/Keep) Presets
// 3 realistic examples per tool.

import type { ProPreset } from "../proToolRegistry";

export const BUY_LEASE_KEEP_PRESETS: ProPreset[] = [
  {
    label: "Standard machine purchase vs lease comparison",
    values: {
      machine_purchase_price: "500000",
      down_payment_pct: "20",
      lease_annual_payment: "85000",
      lease_term_years: "5",
      loan_interest_rate_pct: "8",
      loan_term_years: "5",
      annual_maintenance_cost: "15000",
      annual_downtime_cost: "8000",
      residual_value: "120000",
      operating_savings_per_year: "180000",
      discount_rate: "10",
    },
    units: {
      machine_purchase_price: "USD", down_payment_pct: "%",
      lease_annual_payment: "USD", lease_term_years: "years",
      loan_interest_rate_pct: "%", loan_term_years: "years",
      annual_maintenance_cost: "USD", annual_downtime_cost: "USD",
      residual_value: "USD", operating_savings_per_year: "USD",
      discount_rate: "%",
    },
  },
  {
    label: "Low-cost equipment — lease favorable",
    values: {
      machine_purchase_price: "80000",
      down_payment_pct: "10",
      lease_annual_payment: "18000",
      lease_term_years: "4",
      loan_interest_rate_pct: "6",
      loan_term_years: "4",
      annual_maintenance_cost: "4000",
      annual_downtime_cost: "3000",
      residual_value: "10000",
      operating_savings_per_year: "35000",
      discount_rate: "8",
    },
    units: {
      machine_purchase_price: "USD", down_payment_pct: "%",
      lease_annual_payment: "USD", lease_term_years: "years",
      loan_interest_rate_pct: "%", loan_term_years: "years",
      annual_maintenance_cost: "USD", annual_downtime_cost: "USD",
      residual_value: "USD", operating_savings_per_year: "USD",
      discount_rate: "%",
    },
  },
  {
    label: "High-end CNC — keep existing is best",
    values: {
      machine_purchase_price: "1200000",
      down_payment_pct: "25",
      lease_annual_payment: "240000",
      lease_term_years: "7",
      loan_interest_rate_pct: "9",
      loan_term_years: "7",
      annual_maintenance_cost: "35000",
      annual_downtime_cost: "25000",
      residual_value: "200000",
      operating_savings_per_year: "250000",
      discount_rate: "12",
    },
    units: {
      machine_purchase_price: "USD", down_payment_pct: "%",
      lease_annual_payment: "USD", lease_term_years: "years",
      loan_interest_rate_pct: "%", loan_term_years: "years",
      annual_maintenance_cost: "USD", annual_downtime_cost: "USD",
      residual_value: "USD", operating_savings_per_year: "USD",
      discount_rate: "%",
    },
  },
];

export function getDefaultBuyLeaseKeepPreset(): ProPreset {
  return BUY_LEASE_KEEP_PRESETS[0];
}

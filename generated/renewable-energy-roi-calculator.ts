// @ts-nocheck
// Auto-generated from renewable-energy-roi-calculator-schema.json
import * as z from 'zod';

export interface Renewable_energy_roi_calculatorInput {
  system_capacity_kw: number;
  annual_energy_output_kwh: number;
  capital_cost_usd: number;
  annual_operating_cost_usd: number;
  electricity_price_usd_per_kwh: number;
  inflation_rate_percent: number;
  discount_rate_percent: number;
  system_lifetime_years: number;
}

export const Renewable_energy_roi_calculatorInputSchema = z.object({
  system_capacity_kw: z.number().min(1).max(10000).default(100),
  annual_energy_output_kwh: z.number().min(0).max(10000000).default(150000),
  capital_cost_usd: z.number().min(1000).max(50000000).default(250000),
  annual_operating_cost_usd: z.number().min(0).max(1000000).default(5000),
  electricity_price_usd_per_kwh: z.number().min(0.01).max(0.5).default(0.12),
  inflation_rate_percent: z.number().min(0).max(20).default(2.5),
  discount_rate_percent: z.number().min(0).max(30).default(8),
  system_lifetime_years: z.number().min(1).max(50).default(25),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Renewable_energy_roi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.system_capacity_kw + input.annual_energy_output_kwh + input.capital_cost_usd; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.system_capacity_kw + input.annual_energy_output_kwh + input.capital_cost_usd; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRenewable_energy_roi_calculator(input: Renewable_energy_roi_calculatorInput): Renewable_energy_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Sensitivity analysis","Benchmarking against industry standards"],
  };
}


export interface Renewable_energy_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

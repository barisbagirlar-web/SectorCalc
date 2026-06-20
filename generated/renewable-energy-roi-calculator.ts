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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Renewable_energy_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.system_lifetime_years * input.capital_cost_usd; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.system_lifetime_years * input.capital_cost_usd * (1 + (input.inflation_rate_percent / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.system_lifetime_years * input.capital_cost_usd * (1 + (input.inflation_rate_percent / 100)) * (input.system_capacity_kw); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.system_capacity_kw; results["factor_system_capacity_kw"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["factor_system_capacity_kw"] = Number.NaN; }
  return results;
}


export function calculateRenewable_energy_roi_calculator(input: Renewable_energy_roi_calculatorInput): Renewable_energy_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    base_cost: toNumericFormulaValue(values["base_cost"]),
    adjusted_cost: toNumericFormulaValue(values["adjusted_cost"]),
    factor_system_capacity_kw: toNumericFormulaValue(values["factor_system_capacity_kw"])
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Sensitivity analysis","Benchmarking against industry standards"],
  };
}


export interface Renewable_energy_roi_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { base_cost: number; adjusted_cost: number; factor_system_capacity_kw: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Renewable_energy_roi_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["base_cost","adjusted_cost","factor_system_capacity_kw"],
} as const;


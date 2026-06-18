// @ts-nocheck
// Auto-generated from cleaning-bid-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Cleaning_bid_optimizer_calculatorInput {
  total_sq_ft: number;
  cleaning_frequency: number;
  labor_rate_per_hour: number;
  labor_burden_percent: number;
  productivity_sqft_per_hour: number;
  material_cost_per_sqft: number;
  equipment_cost_per_sqft: number;
  overhead_percent: number;
}

export const Cleaning_bid_optimizer_calculatorInputSchema = z.object({
  total_sq_ft: z.number().min(100).max(1000000).default(10000),
  cleaning_frequency: z.number().min(1).max(7).default(5),
  labor_rate_per_hour: z.number().min(7.25).max(50).default(15),
  labor_burden_percent: z.number().min(0).max(60).default(25),
  productivity_sqft_per_hour: z.number().min(500).max(5000).default(2000),
  material_cost_per_sqft: z.number().min(0.005).max(0.1).default(0.02),
  equipment_cost_per_sqft: z.number().min(0.001).max(0.05).default(0.01),
  overhead_percent: z.number().min(0).max(50).default(15),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cleaning_bid_optimizer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1 * input.cleaning_frequency * input.productivity_sqft_per_hour * (input.labor_rate_per_hour / 100); results["annual_kwh"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annual_kwh"] = 0; }
  try { const v = 1 * input.cleaning_frequency * input.productivity_sqft_per_hour * (input.labor_rate_per_hour / 100) * input.material_cost_per_sqft; results["annual_energy_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annual_energy_cost"] = 0; }
  try { const v = 1 * input.cleaning_frequency * input.productivity_sqft_per_hour * (input.labor_rate_per_hour / 100) * input.material_cost_per_sqft; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCleaning_bid_optimizer_calculator(input: Cleaning_bid_optimizer_calculatorInput): Cleaning_bid_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Off-shift idle load","Leak or standby losses"];
  const suggestedActions: string[] = ["Meter validate kWh per shift","Prioritize top leak sources"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Custom KPI dashboard"],
  };
}


export interface Cleaning_bid_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

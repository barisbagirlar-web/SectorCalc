// @ts-nocheck
// Auto-generated from wind-turbine-roi-calculator-schema.json
import * as z from 'zod';

export interface Wind_turbine_roi_calculatorInput {
  turbine_capacity: number;
  capacity_factor: number;
  capital_cost_per_mw: number;
  opex_per_mwh: number;
  electricity_price: number;
  discount_rate: number;
  project_lifetime: number;
  degradation_rate: number;
}

export const Wind_turbine_roi_calculatorInputSchema = z.object({
  turbine_capacity: z.number().min(0.5).max(15).default(2),
  capacity_factor: z.number().min(10).max(60).default(35),
  capital_cost_per_mw: z.number().min(800000).max(2500000).default(1300000),
  opex_per_mwh: z.number().min(5).max(30).default(12),
  electricity_price: z.number().min(20).max(150).default(50),
  discount_rate: z.number().min(3).max(20).default(8),
  project_lifetime: z.number().min(10).max(30).default(20),
  degradation_rate: z.number().min(0).max(2).default(0.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wind_turbine_roi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.turbine_capacity + input.capacity_factor + input.capital_cost_per_mw; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.turbine_capacity + input.capacity_factor + input.capital_cost_per_mw; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWind_turbine_roi_calculator(input: Wind_turbine_roi_calculatorInput): Wind_turbine_roi_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario comparison","Sensitivity analysis"],
  };
}


export interface Wind_turbine_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

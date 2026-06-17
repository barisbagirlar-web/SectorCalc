// @ts-nocheck
// Auto-generated from recipe-cost-check-calculator-schema.json
import * as z from 'zod';

export interface Recipe_cost_check_calculatorInput {
  material_cost_per_kg: number;
  recipe_yield_percent: number;
  labor_rate_per_hour: number;
  batch_size_kg: number;
  processing_time_minutes: number;
  energy_cost_per_kwh: number;
  energy_consumption_kwh: number;
  overhead_rate_percent: number;
}

export const Recipe_cost_check_calculatorInputSchema = z.object({
  material_cost_per_kg: z.number().min(0).max(10000).default(0),
  recipe_yield_percent: z.number().min(0).max(100).default(95),
  labor_rate_per_hour: z.number().min(0).max(500).default(25),
  batch_size_kg: z.number().min(1).max(100000).default(100),
  processing_time_minutes: z.number().min(1).max(1440).default(60),
  energy_cost_per_kwh: z.number().min(0).max(10).default(0.12),
  energy_consumption_kwh: z.number().min(0).max(10000).default(50),
  overhead_rate_percent: z.number().min(0).max(200).default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Recipe_cost_check_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.material_cost_per_kg + input.recipe_yield_percent + input.labor_rate_per_hour; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.material_cost_per_kg + input.recipe_yield_percent + input.labor_rate_per_hour; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRecipe_cost_check_calculator(input: Recipe_cost_check_calculatorInput): Recipe_cost_check_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Real-time cost alerts"],
  };
}


export interface Recipe_cost_check_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

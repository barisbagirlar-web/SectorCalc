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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Recipe_cost_check_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.material_cost_per_kg * (input.recipe_yield_percent / 100) * (input.labor_rate_per_hour / 100) * input.batch_size_kg; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.material_cost_per_kg * (input.recipe_yield_percent / 100) * (input.labor_rate_per_hour / 100) * input.batch_size_kg * (input.processing_time_minutes * input.energy_cost_per_kwh * input.energy_consumption_kwh * (input.overhead_rate_percent / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.processing_time_minutes * input.energy_cost_per_kwh * input.energy_consumption_kwh * (input.overhead_rate_percent / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateRecipe_cost_check_calculator(input: Recipe_cost_check_calculatorInput): Recipe_cost_check_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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

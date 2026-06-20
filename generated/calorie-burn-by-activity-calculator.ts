// Auto-generated from calorie-burn-by-activity-calculator-schema.json
import * as z from 'zod';

export interface Calorie_burn_by_activity_calculatorInput {
  weight_kg: number;
  duration_min: number;
  met_value: number;
  efficiency_factor: number;
  dataConfidence?: number;
}

export const Calorie_burn_by_activity_calculatorInputSchema = z.object({
  weight_kg: z.number().default(70),
  duration_min: z.number().default(30),
  met_value: z.number().default(5),
  efficiency_factor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Calorie_burn_by_activity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight_kg * input.met_value * (input.duration_min / 60) * input.efficiency_factor; results["total_calories_burned"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_calories_burned"] = Number.NaN; }
  try { const v = input.duration_min / 60; results["duration_hours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["duration_hours"] = Number.NaN; }
  try { const v = input.met_value * (input.duration_min / 60); results["met_hours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["met_hours"] = Number.NaN; }
  try { const v = input.met_value * input.weight_kg * input.efficiency_factor; results["calories_per_hour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["calories_per_hour"] = Number.NaN; }
  return results;
}


export function calculateCalorie_burn_by_activity_calculator(input: Calorie_burn_by_activity_calculatorInput): Calorie_burn_by_activity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_calories_burned"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Calorie_burn_by_activity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

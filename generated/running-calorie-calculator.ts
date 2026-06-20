// Auto-generated from running-calorie-calculator-schema.json
import * as z from 'zod';

export interface Running_calorie_calculatorInput {
  weight: number;
  distance: number;
  elevation_gain: number;
  load_kg: number;
  dataConfidence?: number;
}

export const Running_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  distance: z.number().default(10),
  elevation_gain: z.number().default(0),
  load_kg: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Running_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight + input.load_kg; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeight"] = Number.NaN; }
  try { const v = input.elevation_gain / (input.distance * 1000); results["gradient"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gradient"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWeight"])) * input.distance * 1.036; results["flat_calories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flat_calories"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWeight"])) * input.elevation_gain * 0.0008; results["elevation_calories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["elevation_calories"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["flat_calories"])) + (toNumericFormulaValue(results["elevation_calories"])); results["total_calories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_calories"] = Number.NaN; }
  return results;
}


export function calculateRunning_calorie_calculator(input: Running_calorie_calculatorInput): Running_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_calories"]);
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


export interface Running_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

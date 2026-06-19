// Auto-generated from weight-training-calorie-calculator-schema.json
import * as z from 'zod';

export interface Weight_training_calorie_calculatorInput {
  bodyWeight: number;
  durationHours: number;
  durationMinutes: number;
  metValue: number;
  dataConfidence?: number;
}

export const Weight_training_calorie_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(75),
  durationHours: z.number().default(0),
  durationMinutes: z.number().default(45),
  metValue: z.number().default(4),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Weight_training_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.durationHours + input.durationMinutes / 60; results["totalDurationHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDurationHours"] = 0; }
  try { const v = input.metValue * input.bodyWeight * (asFormulaNumber(results["totalDurationHours"])); results["caloriesBurned"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesBurned"] = 0; }
  try { const v = input.durationHours * 60 + input.durationMinutes; results["totalMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["caloriesBurned"])) / (asFormulaNumber(results["totalMinutes"])); results["caloriesPerMinute"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["caloriesPerMinute"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWeight_training_calorie_calculator(input: Weight_training_calorie_calculatorInput): Weight_training_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["caloriesBurned"]);
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


export interface Weight_training_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from garmin-calorie-calculator-schema.json
import * as z from 'zod';

export interface Garmin_calorie_calculatorInput {
  weight: number;
  age: number;
  heartRate: number;
  duration: number;
  genderFactor: number;
  dataConfidence?: number;
}

export const Garmin_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  age: z.number().default(30),
  heartRate: z.number().default(120),
  duration: z.number().default(30),
  genderFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Garmin_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.genderFactor >= 1) ? ((input.age * 0.2017 - input.weight * 0.09036 + input.heartRate * 0.6309 - 55.0969) * input.duration / 4.184) : ((input.age * 0.074 - input.weight * 0.05741 + input.heartRate * 0.4472 - 20.4022) * input.duration / 4.184)); results["calories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["calories"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["calories"])) / input.duration; results["caloriesPerMin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caloriesPerMin"] = Number.NaN; }
  return results;
}


export function calculateGarmin_calorie_calculator(input: Garmin_calorie_calculatorInput): Garmin_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["calories"]);
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


export interface Garmin_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

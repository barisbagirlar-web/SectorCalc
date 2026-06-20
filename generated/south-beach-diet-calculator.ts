// Auto-generated from south-beach-diet-calculator-schema.json
import * as z from 'zod';

export interface South_beach_diet_calculatorInput {
  age: number;
  weight: number;
  height: number;
  gender: number;
  activityFactor: number;
  dataConfidence?: number;
}

export const South_beach_diet_calculatorInputSchema = z.object({
  age: z.number().default(30),
  weight: z.number().default(70),
  height: z.number().default(170),
  gender: z.number().default(0),
  activityFactor: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: South_beach_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * input.weight + 6.25 * input.height - 5 * input.age + (input.gender * 166 - 161); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmr"])) * input.activityFactor; results["dailyCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyCalories"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyCalories"])) * 0.4; results["carbsCals"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbsCals"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyCalories"])) * 0.3; results["proteinCals"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["proteinCals"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyCalories"])) * 0.3; results["fatCals"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fatCals"] = Number.NaN; }
  return results;
}


export function calculateSouth_beach_diet_calculator(input: South_beach_diet_calculatorInput): South_beach_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyCalories"]);
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


export interface South_beach_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

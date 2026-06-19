// Auto-generated from circadian-rhythm-diet-calculator-schema.json
import * as z from 'zod';

export interface Circadian_rhythm_diet_calculatorInput {
  chronotype: number;
  shiftStart: number;
  mealCount: number;
  fastingWindow: number;
  costPerMeal: number;
  days: number;
  dataConfidence?: number;
}

export const Circadian_rhythm_diet_calculatorInputSchema = z.object({
  chronotype: z.number().default(3),
  shiftStart: z.number().default(8),
  mealCount: z.number().default(3),
  fastingWindow: z.number().default(12),
  costPerMeal: z.number().default(5),
  days: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Circadian_rhythm_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mealCount * input.costPerMeal; results["dailyCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyCost"] = 0; }
  try { const v = (asFormulaNumber(results["dailyCost"])) * input.days; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.mealCount > 1 ? (24 - input.fastingWindow) / (input.mealCount - 1) : 0; results["mealInterval"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mealInterval"] = 0; }
  try { const v = ((input.shiftStart - input.chronotype * 0.5) % 24 + 24) % 24; results["firstMealTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["firstMealTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCircadian_rhythm_diet_calculator(input: Circadian_rhythm_diet_calculatorInput): Circadian_rhythm_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Circadian_rhythm_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

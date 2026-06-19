// Auto-generated from macro-nutrient-calculator-schema.json
import * as z from 'zod';

export interface Macro_nutrient_calculatorInput {
  weight: number;
  proteinPer100: number;
  carbsPer100: number;
  fatPer100: number;
  dataConfidence?: number;
}

export const Macro_nutrient_calculatorInputSchema = z.object({
  weight: z.number().default(100),
  proteinPer100: z.number().default(20),
  carbsPer100: z.number().default(10),
  fatPer100: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Macro_nutrient_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.proteinPer100 / 100) * input.weight; results["proteinGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["proteinGrams"] = 0; }
  try { const v = (input.carbsPer100 / 100) * input.weight; results["carbsGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["carbsGrams"] = 0; }
  try { const v = (input.fatPer100 / 100) * input.weight; results["fatGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fatGrams"] = 0; }
  try { const v = 4 * (asFormulaNumber(results["proteinGrams"])) + 4 * (asFormulaNumber(results["carbsGrams"])) + 9 * (asFormulaNumber(results["fatGrams"])); results["totalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCalories"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMacro_nutrient_calculator(input: Macro_nutrient_calculatorInput): Macro_nutrient_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCalories"]);
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


export interface Macro_nutrient_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

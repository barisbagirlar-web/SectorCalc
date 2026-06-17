// @ts-nocheck
// Auto-generated from food-conversion-calculator-schema.json
import * as z from 'zod';

export interface Food_conversion_calculatorInput {
  volumeMl: number;
  densityGml: number;
  numberOfServings: number;
  caloriesPerGram: number;
  cupFactor: number;
}

export const Food_conversion_calculatorInputSchema = z.object({
  volumeMl: z.number().default(250),
  densityGml: z.number().default(1),
  numberOfServings: z.number().default(1),
  caloriesPerGram: z.number().default(0.04),
  cupFactor: z.number().default(236.588),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Food_conversion_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.volumeMl * input.densityGml; results["totalWeightGrams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWeightGrams"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeightGrams"])) / input.numberOfServings; results["weightPerServingGrams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["weightPerServingGrams"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeightGrams"])) * input.caloriesPerGram; results["totalCalories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCalories"] = 0; }
  try { const v = (asFormulaNumber(results["totalCalories"])) / input.numberOfServings; results["caloriesPerServing"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["caloriesPerServing"] = 0; }
  try { const v = input.volumeMl / input.cupFactor; results["totalCups"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCups"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFood_conversion_calculator(input: Food_conversion_calculatorInput): Food_conversion_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWeightGrams"]);
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Food_conversion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

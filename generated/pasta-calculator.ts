// @ts-nocheck
// Auto-generated from pasta-calculator-schema.json
import * as z from 'zod';

export interface Pasta_calculatorInput {
  servings: number;
  portionWeight: number;
  waterRatio: number;
  saltConcentration: number;
  cookingTimeLoss: number;
  caloriesPer100g: number;
}

export const Pasta_calculatorInputSchema = z.object({
  servings: z.number().default(4),
  portionWeight: z.number().default(100),
  waterRatio: z.number().default(10),
  saltConcentration: z.number().default(10),
  cookingTimeLoss: z.number().default(1.8),
  caloriesPer100g: z.number().default(371),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pasta_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.servings * input.portionWeight; results["totalDryWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDryWeight"] = 0; }
  try { const v = ((asFormulaNumber(results["totalDryWeight"])) / 1000) * input.waterRatio; results["totalWater"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWater"] = 0; }
  try { const v = (asFormulaNumber(results["totalWater"])) * input.saltConcentration; results["totalSalt"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalSalt"] = 0; }
  try { const v = (asFormulaNumber(results["totalDryWeight"])) * input.cookingTimeLoss; results["cookedWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cookedWeight"] = 0; }
  try { const v = ((asFormulaNumber(results["totalDryWeight"])) / 100) * input.caloriesPer100g; results["totalCalories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCalories"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePasta_calculator(input: Pasta_calculatorInput): Pasta_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDryWeight"]);
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


export interface Pasta_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

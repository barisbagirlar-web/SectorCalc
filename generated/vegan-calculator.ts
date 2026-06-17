// @ts-nocheck
// Auto-generated from vegan-calculator-schema.json
import * as z from 'zod';

export interface Vegan_calculatorInput {
  mealsPerDay: number;
  daysPerYear: number;
  waterSavedPerMeal: number;
  co2SavedPerMeal: number;
  landSavedPerMeal: number;
}

export const Vegan_calculatorInputSchema = z.object({
  mealsPerDay: z.number().default(1),
  daysPerYear: z.number().default(365),
  waterSavedPerMeal: z.number().default(1500),
  co2SavedPerMeal: z.number().default(2.5),
  landSavedPerMeal: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vegan_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.mealsPerDay * input.daysPerYear * input.waterSavedPerMeal; results["totalWater"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWater"] = 0; }
  try { const v = input.mealsPerDay * input.daysPerYear * input.co2SavedPerMeal; results["totalCO2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCO2"] = 0; }
  try { const v = input.mealsPerDay * input.daysPerYear * input.landSavedPerMeal; results["totalLand"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLand"] = 0; }
  try { const v = (asFormulaNumber(results["totalCO2"])) / 20; results["treesEquivalent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["treesEquivalent"] = 0; }
  try { const v = (asFormulaNumber(results["totalCO2"])) / 0.4; results["carMilesSaved"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["carMilesSaved"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateVegan_calculator(input: Vegan_calculatorInput): Vegan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWater"]);
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


export interface Vegan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from vegan-calculator-schema.json
import * as z from 'zod';

export interface Vegan_calculatorInput {
  mealsPerDay: number;
  daysPerYear: number;
  waterSavedPerMeal: number;
  co2SavedPerMeal: number;
  landSavedPerMeal: number;
  dataConfidence?: number;
}

export const Vegan_calculatorInputSchema = z.object({
  mealsPerDay: z.number().default(1),
  daysPerYear: z.number().default(365),
  waterSavedPerMeal: z.number().default(1500),
  co2SavedPerMeal: z.number().default(2.5),
  landSavedPerMeal: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vegan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mealsPerDay * input.daysPerYear * input.waterSavedPerMeal; results["totalWater"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWater"] = Number.NaN; }
  try { const v = input.mealsPerDay * input.daysPerYear * input.co2SavedPerMeal; results["totalCO2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCO2"] = Number.NaN; }
  try { const v = input.mealsPerDay * input.daysPerYear * input.landSavedPerMeal; results["totalLand"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLand"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCO2"])) / 20; results["treesEquivalent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["treesEquivalent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCO2"])) / 0.4; results["carMilesSaved"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carMilesSaved"] = Number.NaN; }
  return results;
}


export function calculateVegan_calculator(input: Vegan_calculatorInput): Vegan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWater"]);
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


export interface Vegan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

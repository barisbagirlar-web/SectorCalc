// Auto-generated from thermic-effect-of-food-calculator-schema.json
import * as z from 'zod';

export interface Thermic_effect_of_food_calculatorInput {
  protein: number;
  carbohydrates: number;
  fat: number;
  alcohol: number;
  dataConfidence?: number;
}

export const Thermic_effect_of_food_calculatorInputSchema = z.object({
  protein: z.number().default(0),
  carbohydrates: z.number().default(0),
  fat: z.number().default(0),
  alcohol: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Thermic_effect_of_food_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.protein * 4; results["proteinEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["proteinEnergy"] = Number.NaN; }
  try { const v = input.carbohydrates * 4; results["carbsEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbsEnergy"] = Number.NaN; }
  try { const v = input.fat * 9; results["fatEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fatEnergy"] = Number.NaN; }
  try { const v = input.alcohol * 7; results["alcoholEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["alcoholEnergy"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["proteinEnergy"])) * 0.25; results["proteinTEF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["proteinTEF"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["carbsEnergy"])) * 0.08; results["carbsTEF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbsTEF"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fatEnergy"])) * 0.03; results["fatTEF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fatTEF"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["alcoholEnergy"])) * 0.20; results["alcoholTEF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["alcoholTEF"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["proteinTEF"])) + (toNumericFormulaValue(results["carbsTEF"])) + (toNumericFormulaValue(results["fatTEF"])) + (toNumericFormulaValue(results["alcoholTEF"])); results["totalTEF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTEF"] = Number.NaN; }
  try { const v = 'Protein: ' + (toNumericFormulaValue(results["proteinTEF"])) + ' kcal'; results["breakdown0"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown0"] = Number.NaN; }
  try { const v = 'Carbohydrates: ' + (toNumericFormulaValue(results["carbsTEF"])) + ' kcal'; results["breakdown1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown1"] = Number.NaN; }
  try { const v = 'Fat: ' + (toNumericFormulaValue(results["fatTEF"])) + ' kcal'; results["breakdown2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown2"] = Number.NaN; }
  try { const v = 'Alcohol: ' + (toNumericFormulaValue(results["alcoholTEF"])) + ' kcal'; results["breakdown3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown3"] = Number.NaN; }
  return results;
}


export function calculateThermic_effect_of_food_calculator(input: Thermic_effect_of_food_calculatorInput): Thermic_effect_of_food_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTEF"]);
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


export interface Thermic_effect_of_food_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

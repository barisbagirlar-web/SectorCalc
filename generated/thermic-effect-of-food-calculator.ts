// @ts-nocheck
// Auto-generated from thermic-effect-of-food-calculator-schema.json
import * as z from 'zod';

export interface Thermic_effect_of_food_calculatorInput {
  protein: number;
  carbohydrates: number;
  fat: number;
  alcohol: number;
}

export const Thermic_effect_of_food_calculatorInputSchema = z.object({
  protein: z.number().default(0),
  carbohydrates: z.number().default(0),
  fat: z.number().default(0),
  alcohol: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Thermic_effect_of_food_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.protein * 4; results["proteinEnergy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["proteinEnergy"] = 0; }
  try { const v = input.carbohydrates * 4; results["carbsEnergy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["carbsEnergy"] = 0; }
  try { const v = input.fat * 9; results["fatEnergy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fatEnergy"] = 0; }
  try { const v = input.alcohol * 7; results["alcoholEnergy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["alcoholEnergy"] = 0; }
  try { const v = (asFormulaNumber(results["proteinEnergy"])) * 0.25; results["proteinTEF"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["proteinTEF"] = 0; }
  try { const v = (asFormulaNumber(results["carbsEnergy"])) * 0.08; results["carbsTEF"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["carbsTEF"] = 0; }
  try { const v = (asFormulaNumber(results["fatEnergy"])) * 0.03; results["fatTEF"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fatTEF"] = 0; }
  try { const v = (asFormulaNumber(results["alcoholEnergy"])) * 0.20; results["alcoholTEF"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["alcoholTEF"] = 0; }
  try { const v = (asFormulaNumber(results["proteinTEF"])) + (asFormulaNumber(results["carbsTEF"])) + (asFormulaNumber(results["fatTEF"])) + (asFormulaNumber(results["alcoholTEF"])); results["totalTEF"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTEF"] = 0; }
  try { const v = 'Protein: ' + (asFormulaNumber(results["proteinTEF"])) + ' kcal'; results["breakdown0"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown0"] = 0; }
  try { const v = 'Carbohydrates: ' + (asFormulaNumber(results["carbsTEF"])) + ' kcal'; results["breakdown1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown1"] = 0; }
  try { const v = 'Fat: ' + (asFormulaNumber(results["fatTEF"])) + ' kcal'; results["breakdown2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown2"] = 0; }
  try { const v = 'Alcohol: ' + (asFormulaNumber(results["alcoholTEF"])) + ' kcal'; results["breakdown3"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown3"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateThermic_effect_of_food_calculator(input: Thermic_effect_of_food_calculatorInput): Thermic_effect_of_food_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTEF"]);
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


export interface Thermic_effect_of_food_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

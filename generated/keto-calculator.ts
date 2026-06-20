// Auto-generated from keto-calculator-schema.json
import * as z from 'zod';

export interface Keto_calculatorInput {
  weight: number;
  bodyFat: number;
  gender: number;
  activityLevel: number;
  deficitPercent: number;
  dataConfidence?: number;
}

export const Keto_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  bodyFat: z.number().default(25),
  gender: z.number().default(1),
  activityLevel: z.number().default(1.55),
  deficitPercent: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Keto_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (1 - input.bodyFat / 100); results["leanBodyMass"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leanBodyMass"] = Number.NaN; }
  try { const v = 370 + 21.6 * (toNumericFormulaValue(results["leanBodyMass"])); results["bmr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmr"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmr"])) * input.activityLevel; results["tdee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tdee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["tdee"])) * (1 - input.deficitPercent / 100); results["dailyCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyCalories"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["leanBodyMass"])) * 1.6; results["proteinGrams"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["proteinGrams"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["proteinGrams"])) * 4; results["proteinCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["proteinCalories"] = Number.NaN; }
  return results;
}


export function calculateKeto_calculator(input: Keto_calculatorInput): Keto_calculatorOutput {
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


export interface Keto_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

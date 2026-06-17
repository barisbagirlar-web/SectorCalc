// @ts-nocheck
// Auto-generated from keto-calculator-schema.json
import * as z from 'zod';

export interface Keto_calculatorInput {
  weight: number;
  bodyFat: number;
  gender: number;
  activityLevel: number;
  deficitPercent: number;
}

export const Keto_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  bodyFat: z.number().default(25),
  gender: z.number().default(1),
  activityLevel: z.number().default(1.55),
  deficitPercent: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Keto_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.weight * (1 - input.bodyFat / 100); results["leanBodyMass"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["leanBodyMass"] = 0; }
  try { const v = 370 + 21.6 * (asFormulaNumber(results["leanBodyMass"])); results["bmr"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bmr"] = 0; }
  try { const v = (asFormulaNumber(results["bmr"])) * input.activityLevel; results["tdee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tdee"] = 0; }
  try { const v = (asFormulaNumber(results["tdee"])) * (1 - input.deficitPercent / 100); results["dailyCalories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyCalories"] = 0; }
  try { const v = (asFormulaNumber(results["leanBodyMass"])) * 1.6; results["proteinGrams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["proteinGrams"] = 0; }
  try { const v = (asFormulaNumber(results["proteinGrams"])) * 4; results["proteinCalories"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["proteinCalories"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateKeto_calculator(input: Keto_calculatorInput): Keto_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyCalories"]);
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


export interface Keto_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

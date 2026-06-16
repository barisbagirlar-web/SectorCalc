// Auto-generated from nutrition-label-calculator-schema.json
import * as z from 'zod';

export interface Nutrition_label_calculatorInput {
  servingSize: number;
  calories: number;
  totalFat: number;
  saturatedFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbohydrates: number;
  protein: number;
}

export const Nutrition_label_calculatorInputSchema = z.object({
  servingSize: z.number().default(0),
  calories: z.number().default(0),
  totalFat: z.number().default(0),
  saturatedFat: z.number().default(0),
  cholesterol: z.number().default(0),
  sodium: z.number().default(0),
  totalCarbohydrates: z.number().default(0),
  protein: z.number().default(0),
});

function evaluateAllFormulas(input: Nutrition_label_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.totalFat / 65) * 100; results["fatDV"] = Number.isFinite(v) ? v : 0; } catch { results["fatDV"] = 0; }
  try { const v = (input.saturatedFat / 20) * 100; results["saturatedFatDV"] = Number.isFinite(v) ? v : 0; } catch { results["saturatedFatDV"] = 0; }
  try { const v = (input.cholesterol / 300) * 100; results["cholesterolDV"] = Number.isFinite(v) ? v : 0; } catch { results["cholesterolDV"] = 0; }
  try { const v = (input.sodium / 2300) * 100; results["sodiumDV"] = Number.isFinite(v) ? v : 0; } catch { results["sodiumDV"] = 0; }
  try { const v = (input.totalCarbohydrates / 300) * 100; results["carbsDV"] = Number.isFinite(v) ? v : 0; } catch { results["carbsDV"] = 0; }
  try { const v = (input.protein / 50) * 100; results["proteinDV"] = Number.isFinite(v) ? v : 0; } catch { results["proteinDV"] = 0; }
  try { const v = ((results["fatDV"] ?? 0) + (results["saturatedFatDV"] ?? 0) + (results["cholesterolDV"] ?? 0) + (results["sodiumDV"] ?? 0) + (results["carbsDV"] ?? 0) + (results["proteinDV"] ?? 0)) / 6; results["averageDV"] = Number.isFinite(v) ? v : 0; } catch { results["averageDV"] = 0; }
  return results;
}


export function calculateNutrition_label_calculator(input: Nutrition_label_calculatorInput): Nutrition_label_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["averageDV"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Nutrition_label_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

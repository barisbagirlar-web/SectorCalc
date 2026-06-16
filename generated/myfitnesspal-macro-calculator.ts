// Auto-generated from myfitnesspal-macro-calculator-schema.json
import * as z from 'zod';

export interface Myfitnesspal_macro_calculatorInput {
  totalCalories: number;
  proteinPercent: number;
  carbPercent: number;
  fatPercent: number;
  fiberGrams: number;
}

export const Myfitnesspal_macro_calculatorInputSchema = z.object({
  totalCalories: z.number().default(2000),
  proteinPercent: z.number().default(30),
  carbPercent: z.number().default(40),
  fatPercent: z.number().default(30),
  fiberGrams: z.number().default(25),
});

function evaluateAllFormulas(input: Myfitnesspal_macro_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCalories * input.proteinPercent / 400; results["proteinGrams"] = Number.isFinite(v) ? v : 0; } catch { results["proteinGrams"] = 0; }
  try { const v = input.totalCalories * input.carbPercent / 400; results["carbsGrams"] = Number.isFinite(v) ? v : 0; } catch { results["carbsGrams"] = 0; }
  try { const v = input.totalCalories * input.fatPercent / 900; results["fatGrams"] = Number.isFinite(v) ? v : 0; } catch { results["fatGrams"] = 0; }
  try { const v = input.fiberGrams; results["fiberGrams"] = Number.isFinite(v) ? v : 0; } catch { results["fiberGrams"] = 0; }
  return results;
}


export function calculateMyfitnesspal_macro_calculator(input: Myfitnesspal_macro_calculatorInput): Myfitnesspal_macro_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Your"] ?? 0;
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


export interface Myfitnesspal_macro_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

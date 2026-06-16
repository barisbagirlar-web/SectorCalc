// Auto-generated from macro-calculator-schema.json
import * as z from 'zod';

export interface Macro_calculatorInput {
  calories: number;
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

export const Macro_calculatorInputSchema = z.object({
  calories: z.number().default(2000),
  proteinPct: z.number().default(30),
  carbsPct: z.number().default(40),
  fatPct: z.number().default(30),
});

function evaluateAllFormulas(input: Macro_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.calories * (input.proteinPct / 100) / 4; results["proteinGrams"] = Number.isFinite(v) ? v : 0; } catch { results["proteinGrams"] = 0; }
  try { const v = input.calories * (input.carbsPct / 100) / 4; results["carbsGrams"] = Number.isFinite(v) ? v : 0; } catch { results["carbsGrams"] = 0; }
  try { const v = input.calories * (input.fatPct / 100) / 9; results["fatGrams"] = Number.isFinite(v) ? v : 0; } catch { results["fatGrams"] = 0; }
  return results;
}


export function calculateMacro_calculator(input: Macro_calculatorInput): Macro_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["proteinGrams"] ?? 0;
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


export interface Macro_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from sugar-cup-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Sugar_cup_to_grams_calculatorInput {
  cups: number;
  tablespoons: number;
  teaspoons: number;
  sugarType: number;
  dataConfidence?: number;
}

export const Sugar_cup_to_grams_calculatorInputSchema = z.object({
  cups: z.number().default(1),
  tablespoons: z.number().default(0),
  teaspoons: z.number().default(0),
  sugarType: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sugar_cup_to_grams_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cups * 236.588 + input.tablespoons * 14.7868 + input.teaspoons * 4.92892; results["volumeML"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeML"] = 0; }
  try { const v = input.cups * 236.588 + input.tablespoons * 14.7868 + input.teaspoons * 4.92892; results["volumeML_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeML_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSugar_cup_to_grams_calculator(input: Sugar_cup_to_grams_calculatorInput): Sugar_cup_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["volumeML_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Sugar_cup_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

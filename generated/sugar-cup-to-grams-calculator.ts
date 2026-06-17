// @ts-nocheck
// Auto-generated from sugar-cup-to-grams-calculator-schema.json
import * as z from 'zod';

export interface Sugar_cup_to_grams_calculatorInput {
  cups: number;
  tablespoons: number;
  teaspoons: number;
  sugarType: number;
}

export const Sugar_cup_to_grams_calculatorInputSchema = z.object({
  cups: z.number().default(1),
  tablespoons: z.number().default(0),
  teaspoons: z.number().default(0),
  sugarType: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sugar_cup_to_grams_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.cups * 236.588 + input.tablespoons * 14.7868 + input.teaspoons * 4.92892; results["volumeML"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volumeML"] = 0; }
  try { const v = input.cups * 236.588 + input.tablespoons * 14.7868 + input.teaspoons * 4.92892; results["volumeML_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volumeML_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSugar_cup_to_grams_calculator(input: Sugar_cup_to_grams_calculatorInput): Sugar_cup_to_grams_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["volumeML_aux"]);
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


export interface Sugar_cup_to_grams_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

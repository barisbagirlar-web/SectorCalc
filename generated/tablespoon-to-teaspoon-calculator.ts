// Auto-generated from tablespoon-to-teaspoon-calculator-schema.json
import * as z from 'zod';

export interface Tablespoon_to_teaspoon_calculatorInput {
  tablespoons: number;
  conversionRate: number;
  precision: number;
  batchMultiplier: number;
}

export const Tablespoon_to_teaspoon_calculatorInputSchema = z.object({
  tablespoons: z.number().default(1),
  conversionRate: z.number().default(3),
  precision: z.number().default(2),
  batchMultiplier: z.number().default(1),
});

function evaluateAllFormulas(input: Tablespoon_to_teaspoon_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round( (input.tablespoons * input.conversionRate * input.batchMultiplier) * Math.pow(10, input.precision) ) / Math.pow(10, input.precision); results["teaspoonsRounded"] = Number.isFinite(v) ? v : 0; } catch { results["teaspoonsRounded"] = 0; }
  try { const v = input.tablespoons * input.conversionRate * input.batchMultiplier; results["rawTeaspoons"] = Number.isFinite(v) ? v : 0; } catch { results["rawTeaspoons"] = 0; }
  try { const v = input.conversionRate; results["conversionRateUsed"] = Number.isFinite(v) ? v : 0; } catch { results["conversionRateUsed"] = 0; }
  try { const v = input.batchMultiplier; results["batchMultiplierUsed"] = Number.isFinite(v) ? v : 0; } catch { results["batchMultiplierUsed"] = 0; }
  return results;
}


export function calculateTablespoon_to_teaspoon_calculator(input: Tablespoon_to_teaspoon_calculatorInput): Tablespoon_to_teaspoon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["teaspoonsRounded"] ?? 0;
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


export interface Tablespoon_to_teaspoon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

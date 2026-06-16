// Auto-generated from enerji-icecegi-hesaplayici-calculator-schema.json
import * as z from 'zod';

export interface Enerji_icecegi_hesaplayici_calculatorInput {
  servings: number;
  caffeinePerServing: number;
  sugarPerServing: number;
  costPerCan: number;
  servingsPerCan: number;
}

export const Enerji_icecegi_hesaplayici_calculatorInputSchema = z.object({
  servings: z.number().default(1),
  caffeinePerServing: z.number().default(80),
  sugarPerServing: z.number().default(27),
  costPerCan: z.number().default(2.5),
  servingsPerCan: z.number().default(1),
});

function evaluateAllFormulas(input: Enerji_icecegi_hesaplayici_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.servings * input.caffeinePerServing; results["totalCaffeine"] = Number.isFinite(v) ? v : 0; } catch { results["totalCaffeine"] = 0; }
  try { const v = input.servings * input.sugarPerServing; results["totalSugar"] = Number.isFinite(v) ? v : 0; } catch { results["totalSugar"] = 0; }
  try { const v = input.costPerCan / input.servingsPerCan; results["costPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["costPerServing"] = 0; }
  try { const v = (results["totalCaffeine"] ?? 0) / input.costPerCan; results["caffeinePerCost"] = Number.isFinite(v) ? v : 0; } catch { results["caffeinePerCost"] = 0; }
  return results;
}


export function calculateEnerji_icecegi_hesaplayici_calculator(input: Enerji_icecegi_hesaplayici_calculatorInput): Enerji_icecegi_hesaplayici_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCaffeine"] ?? 0;
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


export interface Enerji_icecegi_hesaplayici_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

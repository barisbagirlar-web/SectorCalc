// Auto-generated from rice-calculator-schema.json
import * as z from 'zod';

export interface Rice_calculatorInput {
  uncookedRiceWeight: number;
  waterRatio: number;
  yieldFactor: number;
  servingSize: number;
}

export const Rice_calculatorInputSchema = z.object({
  uncookedRiceWeight: z.number().default(200),
  waterRatio: z.number().default(2),
  yieldFactor: z.number().default(2.5),
  servingSize: z.number().default(150),
});

function evaluateAllFormulas(input: Rice_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.uncookedRiceWeight * input.yieldFactor / input.servingSize; results["servings"] = Number.isFinite(v) ? v : 0; } catch { results["servings"] = 0; }
  try { const v = input.uncookedRiceWeight * input.yieldFactor; results["cookedRice"] = Number.isFinite(v) ? v : 0; } catch { results["cookedRice"] = 0; }
  try { const v = input.uncookedRiceWeight * input.waterRatio; results["waterNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["waterNeeded"] = 0; }
  return results;
}


export function calculateRice_calculator(input: Rice_calculatorInput): Rice_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["servings"] ?? 0;
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


export interface Rice_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

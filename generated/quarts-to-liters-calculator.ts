// Auto-generated from quarts-to-liters-calculator-schema.json
import * as z from 'zod';

export interface Quarts_to_liters_calculatorInput {
  quartsPerContainer: number;
  numberOfContainers: number;
  quartType: number;
  wasteFactor: number;
}

export const Quarts_to_liters_calculatorInputSchema = z.object({
  quartsPerContainer: z.number().default(1),
  numberOfContainers: z.number().default(1),
  quartType: z.number().default(0),
  wasteFactor: z.number().default(0),
});

function evaluateAllFormulas(input: Quarts_to_liters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quartsPerContainer * input.numberOfContainers; results["totalQuarts"] = Number.isFinite(v) ? v : 0; } catch { results["totalQuarts"] = 0; }
  try { const v = input.quartType === 0 ? 0.946352946 : 1.1365225; results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = (results["totalQuarts"] ?? 0) * (results["conversionFactor"] ?? 0); results["baseLiters"] = Number.isFinite(v) ? v : 0; } catch { results["baseLiters"] = 0; }
  try { const v = (results["baseLiters"] ?? 0) * input.wasteFactor / 100; results["wasteLiters"] = Number.isFinite(v) ? v : 0; } catch { results["wasteLiters"] = 0; }
  try { const v = (results["baseLiters"] ?? 0) + (results["wasteLiters"] ?? 0); results["totalLiters"] = Number.isFinite(v) ? v : 0; } catch { results["totalLiters"] = 0; }
  return results;
}


export function calculateQuarts_to_liters_calculator(input: Quarts_to_liters_calculatorInput): Quarts_to_liters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalLiters"] ?? 0;
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


export interface Quarts_to_liters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from gacha-calculator-schema.json
import * as z from 'zod';

export interface Gacha_calculatorInput {
  costPerPull: number;
  baseProbability: number;
  hardPityAt: number;
  desiredSuccesses: number;
}

export const Gacha_calculatorInputSchema = z.object({
  costPerPull: z.number().default(10),
  baseProbability: z.number().default(0.6),
  hardPityAt: z.number().default(90),
  desiredSuccesses: z.number().default(1),
});

function evaluateAllFormulas(input: Gacha_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseProbability / 100; results["pDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["pDecimal"] = 0; }
  try { const v = 1 - (results["pDecimal"] ?? 0); results["q"] = Number.isFinite(v) ? v : 0; } catch { results["q"] = 0; }
  try { const v = input.hardPityAt; results["hardPityPulls"] = Number.isFinite(v) ? v : 0; } catch { results["hardPityPulls"] = 0; }
  try { const v = (results["hardPityPulls"] ?? 0) > 0 ? (1 - Math.pow((results["q"] ?? 0), (results["hardPityPulls"] ?? 0))) / (results["pDecimal"] ?? 0) : 1 / (results["pDecimal"] ?? 0); results["expectedPullsOne"] = Number.isFinite(v) ? v : 0; } catch { results["expectedPullsOne"] = 0; }
  try { const v = (results["expectedPullsOne"] ?? 0) * input.desiredSuccesses; results["totalPulls"] = Number.isFinite(v) ? v : 0; } catch { results["totalPulls"] = 0; }
  try { const v = (results["totalPulls"] ?? 0) * input.costPerPull; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateGacha_calculator(input: Gacha_calculatorInput): Gacha_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Gacha_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from probability-gacha-calculator-schema.json
import * as z from 'zod';

export interface Probability_gacha_calculatorInput {
  attempts: number;
  probability: number;
  cost: number;
  guarantee: number;
}

export const Probability_gacha_calculatorInputSchema = z.object({
  attempts: z.number().default(10),
  probability: z.number().default(0.05),
  cost: z.number().default(100),
  guarantee: z.number().default(0),
});

function evaluateAllFormulas(input: Probability_gacha_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - Math.pow(1 - input.probability, input.attempts); results["probabilityAtLeastOne"] = Number.isFinite(v) ? v : 0; } catch { results["probabilityAtLeastOne"] = 0; }
  try { const v = Math.pow(1 - input.probability, input.attempts); results["probabilityZero"] = Number.isFinite(v) ? v : 0; } catch { results["probabilityZero"] = 0; }
  try { const v = 1 / input.probability; results["expectedAttempts"] = Number.isFinite(v) ? v : 0; } catch { results["expectedAttempts"] = 0; }
  try { const v = (1 / input.probability) * input.cost; results["expectedCost"] = Number.isFinite(v) ? v : 0; } catch { results["expectedCost"] = 0; }
  try { const v = input.guarantee * input.cost; results["worstCaseCost"] = Number.isFinite(v) ? v : 0; } catch { results["worstCaseCost"] = 0; }
  return results;
}


export function calculateProbability_gacha_calculator(input: Probability_gacha_calculatorInput): Probability_gacha_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["probabilityAtLeastOne"] ?? 0;
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


export interface Probability_gacha_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

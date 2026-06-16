// Auto-generated from craps-probability-schema.json
import * as z from 'zod';

export interface Craps_probabilityInput {
  point: number;
  rolls: number;
  betAmount: number;
  payoutOdds: number;
}

export const Craps_probabilityInputSchema = z.object({
  point: z.number().default(6),
  rolls: z.number().default(1),
  betAmount: z.number().default(10),
  payoutOdds: z.number().default(1),
});

function evaluateAllFormulas(input: Craps_probabilityInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.point === 6 || input.point === 8 ? 5/11 : input.point === 5 || input.point === 9 ? 4/10 : input.point === 4 || input.point === 10 ? 3/9 : 0; results["winProbability"] = Number.isFinite(v) ? v : 0; } catch { results["winProbability"] = 0; }
  try { const v = 1 - (results["winProbability"] ?? 0); results["loseProbability"] = Number.isFinite(v) ? v : 0; } catch { results["loseProbability"] = 0; }
  try { const v = input.betAmount * (input.payoutOdds * (results["winProbability"] ?? 0) - (results["loseProbability"] ?? 0)); results["expectedValue"] = Number.isFinite(v) ? v : 0; } catch { results["expectedValue"] = 0; }
  try { const v = 1 - (1 - (results["winProbability"] ?? 0)) ** input.rolls; results["winChanceAfterNRolls"] = Number.isFinite(v) ? v : 0; } catch { results["winChanceAfterNRolls"] = 0; }
  return results;
}


export function calculateCraps_probability(input: Craps_probabilityInput): Craps_probabilityOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["expectedValue"] ?? 0;
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


export interface Craps_probabilityOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

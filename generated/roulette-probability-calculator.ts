// Auto-generated from roulette-probability-calculator-schema.json
import * as z from 'zod';

export interface Roulette_probability_calculatorInput {
  numberOfSpins: number;
  numbersCovered: number;
  payoutMultiplier: number;
  betAmount: number;
  totalNumbers: number;
}

export const Roulette_probability_calculatorInputSchema = z.object({
  numberOfSpins: z.number().default(1),
  numbersCovered: z.number().default(1),
  payoutMultiplier: z.number().default(35),
  betAmount: z.number().default(1),
  totalNumbers: z.number().default(37),
});

function evaluateAllFormulas(input: Roulette_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - Math.pow(1 - input.numbersCovered / input.totalNumbers, input.numberOfSpins); results["winProbability"] = Number.isFinite(v) ? v : 0; } catch { results["winProbability"] = 0; }
  try { const v = input.numberOfSpins * input.numbersCovered / input.totalNumbers; results["expectedWins"] = Number.isFinite(v) ? v : 0; } catch { results["expectedWins"] = 0; }
  try { const v = input.numberOfSpins * input.betAmount; results["totalBetAmount"] = Number.isFinite(v) ? v : 0; } catch { results["totalBetAmount"] = 0; }
  try { const v = input.numberOfSpins * (input.betAmount * ( (input.numbersCovered / input.totalNumbers) * input.payoutMultiplier - (1 - input.numbersCovered / input.totalNumbers) )); results["expectedNetReturn"] = Number.isFinite(v) ? v : 0; } catch { results["expectedNetReturn"] = 0; }
  return results;
}


export function calculateRoulette_probability_calculator(input: Roulette_probability_calculatorInput): Roulette_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["winProbability"] ?? 0;
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


export interface Roulette_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

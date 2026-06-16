// Auto-generated from yahtzee-probability-calculator-schema.json
import * as z from 'zod';

export interface Yahtzee_probability_calculatorInput {
  diceCount: number;
  targetMatches: number;
  currentMatches: number;
}

export const Yahtzee_probability_calculatorInputSchema = z.object({
  diceCount: z.number().default(5),
  targetMatches: z.number().default(5),
  currentMatches: z.number().default(0),
});

function evaluateAllFormulas(input: Yahtzee_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentMatches >= input.targetMatches ? 1 : (input.currentMatches === 0 ? (6 * Math.pow(1/6, input.diceCount)) : Math.pow(1/6, input.diceCount - input.currentMatches)); results["probability"] = Number.isFinite(v) ? v : 0; } catch { results["probability"] = 0; }
  try { const v = (results["probability"] ?? 0) * 100; results["percentage"] = Number.isFinite(v) ? v : 0; } catch { results["percentage"] = 0; }
  try { const v = 1 / (results["probability"] ?? 0); results["oddsOneIn"] = Number.isFinite(v) ? v : 0; } catch { results["oddsOneIn"] = 0; }
  return results;
}


export function calculateYahtzee_probability_calculator(input: Yahtzee_probability_calculatorInput): Yahtzee_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["probability"] ?? 0;
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


export interface Yahtzee_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

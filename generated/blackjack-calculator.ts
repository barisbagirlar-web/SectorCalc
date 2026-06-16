// Auto-generated from blackjack-calculator-schema.json
import * as z from 'zod';

export interface Blackjack_calculatorInput {
  lambdaA: number;
  lambdaB: number;
  lotSize: number;
  costPerBlackjack: number;
}

export const Blackjack_calculatorInputSchema = z.object({
  lambdaA: z.number().default(0.02),
  lambdaB: z.number().default(0.015),
  lotSize: z.number().default(1000),
  costPerBlackjack: z.number().default(500),
});

function evaluateAllFormulas(input: Blackjack_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (1 - Math.exp(-input.lambdaA)) * (1 - Math.exp(-input.lambdaB)); results["probabilityPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["probabilityPerUnit"] = 0; }
  try { const v = input.lotSize * (results["probabilityPerUnit"] ?? 0); results["expectedBlackjackUnits"] = Number.isFinite(v) ? v : 0; } catch { results["expectedBlackjackUnits"] = 0; }
  try { const v = (results["expectedBlackjackUnits"] ?? 0) * input.costPerBlackjack; results["totalExpectedCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalExpectedCost"] = 0; }
  return results;
}


export function calculateBlackjack_calculator(input: Blackjack_calculatorInput): Blackjack_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalExpectedCost"] ?? 0;
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


export interface Blackjack_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

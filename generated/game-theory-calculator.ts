// Auto-generated from game-theory-calculator-schema.json
import * as z from 'zod';

export interface Game_theory_calculatorInput {
  payoff11: number;
  payoff12: number;
  payoff21: number;
  payoff22: number;
}

export const Game_theory_calculatorInputSchema = z.object({
  payoff11: z.number().default(0),
  payoff12: z.number().default(0),
  payoff21: z.number().default(0),
  payoff22: z.number().default(0),
});

function evaluateAllFormulas(input: Game_theory_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.payoff11 - input.payoff12 - input.payoff21 + input.payoff22; results["denom"] = Number.isFinite(v) ? v : 0; } catch { results["denom"] = 0; }
  try { const v = (input.payoff22 - input.payoff21) / (input.payoff11 - input.payoff12 - input.payoff21 + input.payoff22); results["rowProb"] = Number.isFinite(v) ? v : 0; } catch { results["rowProb"] = 0; }
  try { const v = (results["rowProb"] ?? 0) * input.payoff11 + (1 - (results["rowProb"] ?? 0)) * input.payoff21; results["gameValue"] = Number.isFinite(v) ? v : 0; } catch { results["gameValue"] = 0; }
  try { const v = (input.payoff22 - input.payoff12) / (input.payoff11 - input.payoff12 - input.payoff21 + input.payoff22); results["colProb"] = Number.isFinite(v) ? v : 0; } catch { results["colProb"] = 0; }
  return results;
}


export function calculateGame_theory_calculator(input: Game_theory_calculatorInput): Game_theory_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["gameValue"] ?? 0;
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


export interface Game_theory_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

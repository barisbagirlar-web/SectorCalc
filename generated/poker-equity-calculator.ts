// Auto-generated from poker-equity-calculator-schema.json
import * as z from 'zod';

export interface Poker_equity_calculatorInput {
  outs: number;
  streets: number;
  potSize: number;
  betToCall: number;
}

export const Poker_equity_calculatorInputSchema = z.object({
  outs: z.number().default(9),
  streets: z.number().default(2),
  potSize: z.number().default(100),
  betToCall: z.number().default(50),
});

function evaluateAllFormulas(input: Poker_equity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.streets === 2 ? Math.min(input.outs * 4, 99) : Math.min(input.outs * 2, 99)) / 100) * (input.potSize + input.betToCall) - (1 - (input.streets === 2 ? Math.min(input.outs * 4, 99) : Math.min(input.outs * 2, 99)) / 100) * input.betToCall; results["Expected Value (EV)"] = Number.isFinite(v) ? v : 0; } catch { results["Expected Value (EV)"] = 0; }
  try { const v = input.streets === 2 ? Math.min(input.outs * 4, 99) : Math.min(input.outs * 2, 99); results["Equity (%)"] = Number.isFinite(v) ? v : 0; } catch { results["Equity (%)"] = 0; }
  try { const v = (input.betToCall / (input.potSize + input.betToCall)) * 100; results["Pot Odds (%)"] = Number.isFinite(v) ? v : 0; } catch { results["Pot Odds (%)"] = 0; }
  try { const v = (input.betToCall / (input.potSize + 2 * input.betToCall)) * 100; results["Break-even Equity (%)"] = Number.isFinite(v) ? v : 0; } catch { results["Break-even Equity (%)"] = 0; }
  return results;
}


export function calculatePoker_equity_calculator(input: Poker_equity_calculatorInput): Poker_equity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Expected"] ?? 0;
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


export interface Poker_equity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

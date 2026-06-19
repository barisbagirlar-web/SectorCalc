// Auto-generated from poker-equity-calculator-schema.json
import * as z from 'zod';

export interface Poker_equity_calculatorInput {
  outs: number;
  streets: number;
  potSize: number;
  betToCall: number;
  dataConfidence?: number;
}

export const Poker_equity_calculatorInputSchema = z.object({
  outs: z.number().default(9),
  streets: z.number().default(2),
  potSize: z.number().default(100),
  betToCall: z.number().default(50),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Poker_equity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.betToCall / (input.potSize + input.betToCall)) * 100; results["Pot Odds (%)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Pot Odds (%)"] = 0; }
  try { const v = (input.betToCall / (input.potSize + 2 * input.betToCall)) * 100; results["Break-even Equity (%)"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Break-even Equity (%)"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePoker_equity_calculator(input: Poker_equity_calculatorInput): Poker_equity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Break"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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

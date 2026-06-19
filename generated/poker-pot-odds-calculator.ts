// Auto-generated from poker-pot-odds-calculator-schema.json
import * as z from 'zod';

export interface Poker_pot_odds_calculatorInput {
  potBeforeBet: number;
  opponentBet: number;
  callAmount: number;
  dataConfidence?: number;
}

export const Poker_pot_odds_calculatorInputSchema = z.object({
  potBeforeBet: z.number().default(0),
  opponentBet: z.number().default(0),
  callAmount: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Poker_pot_odds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.potBeforeBet + input.opponentBet) / input.callAmount; results["potOddsRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["potOddsRatio"] = 0; }
  try { const v = input.callAmount / (input.potBeforeBet + input.opponentBet + input.callAmount) * 100; results["requiredEquity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredEquity"] = 0; }
  try { const v = input.potBeforeBet + input.opponentBet + input.callAmount; results["totalPotAfterCall"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPotAfterCall"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePoker_pot_odds_calculator(input: Poker_pot_odds_calculatorInput): Poker_pot_odds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["potOddsRatio"]);
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


export interface Poker_pot_odds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// @ts-nocheck
// Auto-generated from poker-odds-calculator-schema.json
import * as z from 'zod';

export interface Poker_odds_calculatorInput {
  numberOfOuts: number;
  currentPot: number;
  betToCall: number;
  knownCards: number;
  totalCards: number;
}

export const Poker_odds_calculatorInputSchema = z.object({
  numberOfOuts: z.number().default(9),
  currentPot: z.number().default(100),
  betToCall: z.number().default(20),
  knownCards: z.number().default(5),
  totalCards: z.number().default(52),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Poker_odds_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalCards - input.knownCards; results["unseenCards"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["unseenCards"] = 0; }
  try { const v = input.numberOfOuts / (asFormulaNumber(results["unseenCards"])); results["probabilityWin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["probabilityWin"] = 0; }
  try { const v = input.betToCall / (input.currentPot + input.betToCall); results["potOdds"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["potOdds"] = 0; }
  try { const v = (asFormulaNumber(results["probabilityWin"])) * (input.currentPot + input.betToCall) - (1 - (asFormulaNumber(results["probabilityWin"]))) * input.betToCall; results["expectedValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["expectedValue"] = 0; }
  results["recommendation"] = 0;
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePoker_odds_calculator(input: Poker_odds_calculatorInput): Poker_odds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["unseenCards"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Poker_odds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// @ts-nocheck
// Auto-generated from poker-probability-calculator-schema.json
import * as z from 'zod';

export interface Poker_probability_calculatorInput {
  knownCards: number;
  deckSize: number;
  outs: number;
  draws: number;
}

export const Poker_probability_calculatorInputSchema = z.object({
  knownCards: z.number().default(2),
  deckSize: z.number().default(52),
  outs: z.number().default(4),
  draws: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Poker_probability_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.deckSize - input.knownCards; results["remaining"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["remaining"] = 0; }
  try { const v = (((asFormulaNumber(results["remaining"])) - input.outs) / (asFormulaNumber(results["remaining"]))) ** input.draws; results["missProb"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["missProb"] = 0; }
  try { const v = (1 - (asFormulaNumber(results["missProb"]))) * 100; results["winProbability"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["winProbability"] = 0; }
  try { const v = (asFormulaNumber(results["missProb"])) * 100; results["lossProbability"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["lossProbability"] = 0; }
  try { const v = (asFormulaNumber(results["missProb"])) / (1 - (asFormulaNumber(results["missProb"]))); results["oddsAgainst"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["oddsAgainst"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePoker_probability_calculator(input: Poker_probability_calculatorInput): Poker_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["winProbability"]);
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


export interface Poker_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

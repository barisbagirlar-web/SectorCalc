// Auto-generated from blackjack-probability-calculator-schema.json
import * as z from 'zod';

export interface Blackjack_probability_calculatorInput {
  numberOfDecks: number;
  acesRemaining: number;
  tensRemaining: number;
  otherCardsRemaining: number;
  dataConfidence?: number;
}

export const Blackjack_probability_calculatorInputSchema = z.object({
  numberOfDecks: z.number().default(6),
  acesRemaining: z.number().default(24),
  tensRemaining: z.number().default(96),
  otherCardsRemaining: z.number().default(192),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Blackjack_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.acesRemaining / (input.acesRemaining + input.tensRemaining + input.otherCardsRemaining)) * (input.tensRemaining / (input.acesRemaining + input.tensRemaining + input.otherCardsRemaining - 1)) + (input.tensRemaining / (input.acesRemaining + input.tensRemaining + input.otherCardsRemaining)) * (input.acesRemaining / (input.acesRemaining + input.tensRemaining + input.otherCardsRemaining - 1))) * 100; results["blackjackProbability"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["blackjackProbability"] = 0; }
  try { const v = (input.acesRemaining / (input.acesRemaining + input.tensRemaining + input.otherCardsRemaining)) * (input.tensRemaining / (input.acesRemaining + input.tensRemaining + input.otherCardsRemaining - 1)) * 100; results["aceThenTenProbability"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["aceThenTenProbability"] = 0; }
  try { const v = (input.tensRemaining / (input.acesRemaining + input.tensRemaining + input.otherCardsRemaining)) * (input.acesRemaining / (input.acesRemaining + input.tensRemaining + input.otherCardsRemaining - 1)) * 100; results["tenThenAceProbability"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tenThenAceProbability"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBlackjack_probability_calculator(input: Blackjack_probability_calculatorInput): Blackjack_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["blackjackProbability"]);
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


export interface Blackjack_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from roulette-probability-calculator-schema.json
import * as z from 'zod';

export interface Roulette_probability_calculatorInput {
  numberOfSpins: number;
  numbersCovered: number;
  payoutMultiplier: number;
  betAmount: number;
  totalNumbers: number;
  dataConfidence?: number;
}

export const Roulette_probability_calculatorInputSchema = z.object({
  numberOfSpins: z.number().default(1),
  numbersCovered: z.number().default(1),
  payoutMultiplier: z.number().default(35),
  betAmount: z.number().default(1),
  totalNumbers: z.number().default(37),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Roulette_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfSpins * input.numbersCovered / input.totalNumbers; results["expectedWins"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedWins"] = Number.NaN; }
  try { const v = input.numberOfSpins * input.betAmount; results["totalBetAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBetAmount"] = Number.NaN; }
  try { const v = input.numberOfSpins * (input.betAmount * ( (input.numbersCovered / input.totalNumbers) * input.payoutMultiplier - (1 - input.numbersCovered / input.totalNumbers) )); results["expectedNetReturn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedNetReturn"] = Number.NaN; }
  return results;
}


export function calculateRoulette_probability_calculator(input: Roulette_probability_calculatorInput): Roulette_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["expectedNetReturn"]);
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


export interface Roulette_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

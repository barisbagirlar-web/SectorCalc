// Auto-generated from implied-probability-calculator-schema.json
import * as z from 'zod';

export interface Implied_probability_calculatorInput {
  oddsType: number;
  decimalOdds: number;
  fractionalNumerator: number;
  fractionalDenominator: number;
  americanOdds: number;
}

export const Implied_probability_calculatorInputSchema = z.object({
  oddsType: z.number().default(1),
  decimalOdds: z.number().default(2),
  fractionalNumerator: z.number().default(1),
  fractionalDenominator: z.number().default(2),
  americanOdds: z.number().default(-110),
});

function evaluateAllFormulas(input: Implied_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.oddsType == 1 ? (1 / input.decimalOdds) * 100 : input.oddsType == 2 ? (input.fractionalDenominator / (input.fractionalNumerator + input.fractionalDenominator)) * 100 : input.oddsType == 3 ? (input.americanOdds > 0 ? (100 / (input.americanOdds + 100)) * 100 : (Math.abs(input.americanOdds) / (Math.abs(input.americanOdds) + 100)) * 100) : 0; results["impliedProbabilityPercent"] = Number.isFinite(v) ? v : 0; } catch { results["impliedProbabilityPercent"] = 0; }
  try { const v = (results["impliedProbabilityPercent"] ?? 0) / 100; results["probabilityDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["probabilityDecimal"] = 0; }
  try { const v = 100 / (results["impliedProbabilityPercent"] ?? 0); results["fairDecimalOdds"] = Number.isFinite(v) ? v : 0; } catch { results["fairDecimalOdds"] = 0; }
  return results;
}


export function calculateImplied_probability_calculator(input: Implied_probability_calculatorInput): Implied_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["impliedProbabilityPercent"] ?? 0;
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


export interface Implied_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from implied-probability-calculator-schema.json
import * as z from 'zod';

export interface Implied_probability_calculatorInput {
  oddsType: number;
  decimalOdds: number;
  fractionalNumerator: number;
  fractionalDenominator: number;
  americanOdds: number;
  dataConfidence?: number;
}

export const Implied_probability_calculatorInputSchema = z.object({
  oddsType: z.number().default(1),
  decimalOdds: z.number().default(2),
  fractionalNumerator: z.number().default(1),
  fractionalDenominator: z.number().default(2),
  americanOdds: z.number().default(-110),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Implied_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.oddsType * input.decimalOdds * input.fractionalNumerator * input.fractionalDenominator; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.oddsType * input.decimalOdds * input.fractionalNumerator * input.fractionalDenominator * (input.americanOdds); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.americanOdds; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateImplied_probability_calculator(input: Implied_probability_calculatorInput): Implied_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Implied_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

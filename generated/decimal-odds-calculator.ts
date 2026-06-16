// Auto-generated from decimal-odds-calculator-schema.json
import * as z from 'zod';

export interface Decimal_odds_calculatorInput {
  decimalOdds: number;
  stake: number;
  margin: number;
  taxRate: number;
}

export const Decimal_odds_calculatorInputSchema = z.object({
  decimalOdds: z.number().default(2),
  stake: z.number().default(100),
  margin: z.number().default(0),
  taxRate: z.number().default(0),
});

function evaluateAllFormulas(input: Decimal_odds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stake * input.decimalOdds; results["totalReturn"] = Number.isFinite(v) ? v : 0; } catch { results["totalReturn"] = 0; }
  try { const v = input.stake * input.decimalOdds - input.stake; results["profitBeforeTax"] = Number.isFinite(v) ? v : 0; } catch { results["profitBeforeTax"] = 0; }
  try { const v = (input.stake * input.decimalOdds - input.stake) * (1 - input.taxRate / 100); results["profitAfterTax"] = Number.isFinite(v) ? v : 0; } catch { results["profitAfterTax"] = 0; }
  try { const v = 1 / input.decimalOdds; results["impliedProbability"] = Number.isFinite(v) ? v : 0; } catch { results["impliedProbability"] = 0; }
  try { const v = 1 / ((1 / input.decimalOdds) / (1 + input.margin / 100)); results["fairDecimalOdds"] = Number.isFinite(v) ? v : 0; } catch { results["fairDecimalOdds"] = 0; }
  return results;
}


export function calculateDecimal_odds_calculator(input: Decimal_odds_calculatorInput): Decimal_odds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalReturn"] ?? 0;
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


export interface Decimal_odds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from decimal-odds-calculator-schema.json
import * as z from 'zod';

export interface Decimal_odds_calculatorInput {
  decimalOdds: number;
  stake: number;
  margin: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Decimal_odds_calculatorInputSchema = z.object({
  decimalOdds: z.number().default(2),
  stake: z.number().default(100),
  margin: z.number().default(0),
  taxRate: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Decimal_odds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.stake * input.decimalOdds; results["totalReturn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalReturn"] = Number.NaN; }
  try { const v = input.stake * input.decimalOdds - input.stake; results["profitBeforeTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitBeforeTax"] = Number.NaN; }
  try { const v = (input.stake * input.decimalOdds - input.stake) * (1 - input.taxRate / 100); results["profitAfterTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitAfterTax"] = Number.NaN; }
  try { const v = 1 / input.decimalOdds; results["impliedProbability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["impliedProbability"] = Number.NaN; }
  try { const v = 1 / ((1 / input.decimalOdds) / (1 + input.margin / 100)); results["fairDecimalOdds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fairDecimalOdds"] = Number.NaN; }
  return results;
}


export function calculateDecimal_odds_calculator(input: Decimal_odds_calculatorInput): Decimal_odds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalReturn"]);
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


export interface Decimal_odds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

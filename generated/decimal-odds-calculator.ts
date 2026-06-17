// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Decimal_odds_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.stake * input.decimalOdds; results["totalReturn"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalReturn"] = 0; }
  try { const v = input.stake * input.decimalOdds - input.stake; results["profitBeforeTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["profitBeforeTax"] = 0; }
  try { const v = (input.stake * input.decimalOdds - input.stake) * (1 - input.taxRate / 100); results["profitAfterTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["profitAfterTax"] = 0; }
  try { const v = 1 / input.decimalOdds; results["impliedProbability"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["impliedProbability"] = 0; }
  try { const v = 1 / ((1 / input.decimalOdds) / (1 + input.margin / 100)); results["fairDecimalOdds"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fairDecimalOdds"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDecimal_odds_calculator(input: Decimal_odds_calculatorInput): Decimal_odds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalReturn"]);
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


export interface Decimal_odds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// @ts-nocheck
// Auto-generated from fractional-odds-calculator-schema.json
import * as z from 'zod';

export interface Fractional_odds_calculatorInput {
  numerator: number;
  denominator: number;
  stake: number;
  taxRate: number;
}

export const Fractional_odds_calculatorInputSchema = z.object({
  numerator: z.number().default(1),
  denominator: z.number().default(1),
  stake: z.number().default(10),
  taxRate: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fractional_odds_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.stake * (input.numerator / input.denominator); results["profit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["profit"] = 0; }
  try { const v = input.stake * (1 + input.numerator / input.denominator); results["totalPayoutBeforeTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPayoutBeforeTax"] = 0; }
  try { const v = 1 + input.numerator / input.denominator; results["decimalOdds"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["decimalOdds"] = 0; }
  try { const v = (input.denominator / (input.numerator + input.denominator)) * 100; results["impliedProbability"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["impliedProbability"] = 0; }
  try { const v = (input.stake * (input.numerator / input.denominator)) * (1 - input.taxRate / 100); results["netProfitAfterTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netProfitAfterTax"] = 0; }
  try { const v = input.stake + (input.stake * (input.numerator / input.denominator)) * (1 - input.taxRate / 100); results["netTotalPayoutAfterTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netTotalPayoutAfterTax"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFractional_odds_calculator(input: Fractional_odds_calculatorInput): Fractional_odds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPayoutBeforeTax"]);
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


export interface Fractional_odds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

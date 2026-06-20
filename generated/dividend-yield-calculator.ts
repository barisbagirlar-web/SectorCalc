// Auto-generated from dividend-yield-calculator-schema.json
import * as z from 'zod';

export interface Dividend_yield_calculatorInput {
  annualDividendPerShare: number;
  marketPricePerShare: number;
  numberOfShares: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Dividend_yield_calculatorInputSchema = z.object({
  annualDividendPerShare: z.number().default(2),
  marketPricePerShare: z.number().default(40),
  numberOfShares: z.number().default(100),
  taxRate: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dividend_yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDividendPerShare / input.marketPricePerShare * 100; results["dividendYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dividendYield"] = Number.NaN; }
  try { const v = input.annualDividendPerShare * input.numberOfShares; results["totalDividend"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDividend"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dividendYield"])) * (1 - input.taxRate / 100); results["afterTaxYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["afterTaxYield"] = Number.NaN; }
  return results;
}


export function calculateDividend_yield_calculator(input: Dividend_yield_calculatorInput): Dividend_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dividendYield"]);
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


export interface Dividend_yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from dividend-yield-calculator-schema.json
import * as z from 'zod';

export interface Dividend_yield_calculatorInput {
  annualDividendPerShare: number;
  marketPricePerShare: number;
  numberOfShares: number;
  taxRate: number;
}

export const Dividend_yield_calculatorInputSchema = z.object({
  annualDividendPerShare: z.number().default(2),
  marketPricePerShare: z.number().default(40),
  numberOfShares: z.number().default(100),
  taxRate: z.number().default(0),
});

function evaluateAllFormulas(input: Dividend_yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDividendPerShare / input.marketPricePerShare * 100; results["dividendYield"] = Number.isFinite(v) ? v : 0; } catch { results["dividendYield"] = 0; }
  try { const v = input.annualDividendPerShare * input.numberOfShares; results["totalDividend"] = Number.isFinite(v) ? v : 0; } catch { results["totalDividend"] = 0; }
  try { const v = (results["dividendYield"] ?? 0) * (1 - input.taxRate / 100); results["afterTaxYield"] = Number.isFinite(v) ? v : 0; } catch { results["afterTaxYield"] = 0; }
  return results;
}


export function calculateDividend_yield_calculator(input: Dividend_yield_calculatorInput): Dividend_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dividendYield"] ?? 0;
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


export interface Dividend_yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

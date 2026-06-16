// Auto-generated from dividend-calculator-schema.json
import * as z from 'zod';

export interface Dividend_calculatorInput {
  sharePrice: number;
  purchasePrice: number;
  annualDividendPerShare: number;
  numberOfShares: number;
  dividendGrowthRate: number;
}

export const Dividend_calculatorInputSchema = z.object({
  sharePrice: z.number().default(100),
  purchasePrice: z.number().default(100),
  annualDividendPerShare: z.number().default(5),
  numberOfShares: z.number().default(100),
  dividendGrowthRate: z.number().default(3),
});

function evaluateAllFormulas(input: Dividend_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDividendPerShare * input.numberOfShares; results["annualIncome"] = Number.isFinite(v) ? v : 0; } catch { results["annualIncome"] = 0; }
  try { const v = (input.annualDividendPerShare / input.sharePrice) * 100; results["dividendYield"] = Number.isFinite(v) ? v : 0; } catch { results["dividendYield"] = 0; }
  try { const v = (input.annualDividendPerShare / input.purchasePrice) * 100; results["yieldOnCost"] = Number.isFinite(v) ? v : 0; } catch { results["yieldOnCost"] = 0; }
  try { const v = (input.annualDividendPerShare * (1 + input.dividendGrowthRate / 100)) * input.numberOfShares; results["projectedAnnualIncome"] = Number.isFinite(v) ? v : 0; } catch { results["projectedAnnualIncome"] = 0; }
  return results;
}


export function calculateDividend_calculator(input: Dividend_calculatorInput): Dividend_calculatorOutput {
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


export interface Dividend_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

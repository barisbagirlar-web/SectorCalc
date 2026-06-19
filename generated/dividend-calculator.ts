// Auto-generated from dividend-calculator-schema.json
import * as z from 'zod';

export interface Dividend_calculatorInput {
  sharePrice: number;
  purchasePrice: number;
  annualDividendPerShare: number;
  numberOfShares: number;
  dividendGrowthRate: number;
  dataConfidence?: number;
}

export const Dividend_calculatorInputSchema = z.object({
  sharePrice: z.number().default(100),
  purchasePrice: z.number().default(100),
  annualDividendPerShare: z.number().default(5),
  numberOfShares: z.number().default(100),
  dividendGrowthRate: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dividend_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDividendPerShare * input.numberOfShares; results["annualIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualIncome"] = 0; }
  try { const v = (input.annualDividendPerShare / input.sharePrice) * 100; results["dividendYield"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dividendYield"] = 0; }
  try { const v = (input.annualDividendPerShare / input.purchasePrice) * 100; results["yieldOnCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yieldOnCost"] = 0; }
  try { const v = (input.annualDividendPerShare * (1 + input.dividendGrowthRate / 100)) * input.numberOfShares; results["projectedAnnualIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["projectedAnnualIncome"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDividend_calculator(input: Dividend_calculatorInput): Dividend_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["dividendYield"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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

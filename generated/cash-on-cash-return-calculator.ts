// Auto-generated from cash-on-cash-return-calculator-schema.json
import * as z from 'zod';

export interface Cash_on_cash_return_calculatorInput {
  annualGrossIncome: number;
  annualOperatingExpenses: number;
  annualDebtService: number;
  totalCashInvested: number;
}

export const Cash_on_cash_return_calculatorInputSchema = z.object({
  annualGrossIncome: z.number().default(12000),
  annualOperatingExpenses: z.number().default(4000),
  annualDebtService: z.number().default(5000),
  totalCashInvested: z.number().default(50000),
});

function evaluateAllFormulas(input: Cash_on_cash_return_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualGrossIncome - input.annualOperatingExpenses - input.annualDebtService); results["annualCashFlow"] = Number.isFinite(v) ? v : 0; } catch { results["annualCashFlow"] = 0; }
  try { const v = ((input.annualGrossIncome - input.annualOperatingExpenses - input.annualDebtService) / input.totalCashInvested) * 100; results["cashOnCashReturn"] = Number.isFinite(v) ? v : 0; } catch { results["cashOnCashReturn"] = 0; }
  return results;
}


export function calculateCash_on_cash_return_calculator(input: Cash_on_cash_return_calculatorInput): Cash_on_cash_return_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cashOnCashReturn"] ?? 0;
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


export interface Cash_on_cash_return_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

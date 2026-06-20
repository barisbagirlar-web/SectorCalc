// Auto-generated from cash-on-cash-return-calculator-schema.json
import * as z from 'zod';

export interface Cash_on_cash_return_calculatorInput {
  annualGrossIncome: number;
  annualOperatingExpenses: number;
  annualDebtService: number;
  totalCashInvested: number;
  dataConfidence?: number;
}

export const Cash_on_cash_return_calculatorInputSchema = z.object({
  annualGrossIncome: z.number().default(12000),
  annualOperatingExpenses: z.number().default(4000),
  annualDebtService: z.number().default(5000),
  totalCashInvested: z.number().default(50000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cash_on_cash_return_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualGrossIncome - input.annualOperatingExpenses - input.annualDebtService); results["annualCashFlow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualCashFlow"] = Number.NaN; }
  try { const v = ((input.annualGrossIncome - input.annualOperatingExpenses - input.annualDebtService) / input.totalCashInvested) * 100; results["cashOnCashReturn"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cashOnCashReturn"] = Number.NaN; }
  return results;
}


export function calculateCash_on_cash_return_calculator(input: Cash_on_cash_return_calculatorInput): Cash_on_cash_return_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cashOnCashReturn"]);
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


export interface Cash_on_cash_return_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

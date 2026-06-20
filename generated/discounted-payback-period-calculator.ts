// Auto-generated from discounted-payback-period-calculator-schema.json
import * as z from 'zod';

export interface Discounted_payback_period_calculatorInput {
  initialInvestment: number;
  discountRate: number;
  annualCashFlow: number;
  maxYears: number;
  dataConfidence?: number;
}

export const Discounted_payback_period_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(10000),
  discountRate: z.number().default(10),
  annualCashFlow: z.number().default(3000),
  maxYears: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Discounted_payback_period_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.discountRate / 100; results["discountRateDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountRateDecimal"] = Number.NaN; }
  try { const v = 1 - (input.initialInvestment * (toNumericFormulaValue(results["discountRateDecimal"])) / input.annualCashFlow); results["paybackFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paybackFactor"] = Number.NaN; }
  return results;
}


export function calculateDiscounted_payback_period_calculator(input: Discounted_payback_period_calculatorInput): Discounted_payback_period_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["paybackFactor"]);
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


export interface Discounted_payback_period_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

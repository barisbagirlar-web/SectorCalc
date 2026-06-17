// @ts-nocheck
// Auto-generated from discounted-payback-period-calculator-schema.json
import * as z from 'zod';

export interface Discounted_payback_period_calculatorInput {
  initialInvestment: number;
  discountRate: number;
  annualCashFlow: number;
  maxYears: number;
}

export const Discounted_payback_period_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(10000),
  discountRate: z.number().default(10),
  annualCashFlow: z.number().default(3000),
  maxYears: z.number().default(50),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Discounted_payback_period_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.discountRate / 100; results["discountRateDecimal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["discountRateDecimal"] = 0; }
  try { const v = 1 - (input.initialInvestment * (asFormulaNumber(results["discountRateDecimal"])) / input.annualCashFlow); results["paybackFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["paybackFactor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDiscounted_payback_period_calculator(input: Discounted_payback_period_calculatorInput): Discounted_payback_period_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["paybackFactor"]);
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


export interface Discounted_payback_period_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

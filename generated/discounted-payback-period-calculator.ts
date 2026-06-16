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

function evaluateAllFormulas(input: Discounted_payback_period_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.discountRate / 100; results["discountRateDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["discountRateDecimal"] = 0; }
  try { const v = 1 - (input.initialInvestment * (results["discountRateDecimal"] ?? 0) / input.annualCashFlow); results["paybackFactor"] = Number.isFinite(v) ? v : 0; } catch { results["paybackFactor"] = 0; }
  try { const v = (results["paybackFactor"] ?? 0) > 0 && input.annualCashFlow > 0 ? -Math.log((results["paybackFactor"] ?? 0)) / Math.log(1 + (results["discountRateDecimal"] ?? 0)) : input.maxYears; results["paybackPeriod"] = Number.isFinite(v) ? v : 0; } catch { results["paybackPeriod"] = 0; }
  try { const v = input.annualCashFlow * (1 - Math.pow(1 + (results["discountRateDecimal"] ?? 0), -(results["paybackPeriod"] ?? 0))) / (results["discountRateDecimal"] ?? 0); results["cumulativePVatPayback"] = Number.isFinite(v) ? v : 0; } catch { results["cumulativePVatPayback"] = 0; }
  try { const v = input.annualCashFlow * (1 - Math.pow(1 + (results["discountRateDecimal"] ?? 0), -input.maxYears)) / (results["discountRateDecimal"] ?? 0); results["totalDiscountedCashFlows"] = Number.isFinite(v) ? v : 0; } catch { results["totalDiscountedCashFlows"] = 0; }
  return results;
}


export function calculateDiscounted_payback_period_calculator(input: Discounted_payback_period_calculatorInput): Discounted_payback_period_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["paybackPeriod"] ?? 0;
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


export interface Discounted_payback_period_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

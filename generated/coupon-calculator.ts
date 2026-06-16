// Auto-generated from coupon-calculator-schema.json
import * as z from 'zod';

export interface Coupon_calculatorInput {
  faceValue: number;
  couponRate: number;
  frequency: number;
  yearsToMaturity: number;
}

export const Coupon_calculatorInputSchema = z.object({
  faceValue: z.number().default(1000),
  couponRate: z.number().default(5),
  frequency: z.number().default(2),
  yearsToMaturity: z.number().default(10),
});

function evaluateAllFormulas(input: Coupon_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.faceValue * (input.couponRate / 100)) / input.frequency; results["periodicCoupon"] = Number.isFinite(v) ? v : 0; } catch { results["periodicCoupon"] = 0; }
  try { const v = input.faceValue * (input.couponRate / 100); results["annualCoupon"] = Number.isFinite(v) ? v : 0; } catch { results["annualCoupon"] = 0; }
  try { const v = input.faceValue * (input.couponRate / 100) * input.yearsToMaturity; results["totalCoupons"] = Number.isFinite(v) ? v : 0; } catch { results["totalCoupons"] = 0; }
  return results;
}


export function calculateCoupon_calculator(input: Coupon_calculatorInput): Coupon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["periodicCoupon"] ?? 0;
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


export interface Coupon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

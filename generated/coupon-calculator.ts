// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Coupon_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.faceValue * (input.couponRate / 100)) / input.frequency; results["periodicCoupon"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["periodicCoupon"] = 0; }
  try { const v = input.faceValue * (input.couponRate / 100); results["annualCoupon"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualCoupon"] = 0; }
  try { const v = input.faceValue * (input.couponRate / 100) * input.yearsToMaturity; results["totalCoupons"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCoupons"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCoupon_calculator(input: Coupon_calculatorInput): Coupon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["periodicCoupon"]);
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


export interface Coupon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

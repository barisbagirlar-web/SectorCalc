// @ts-nocheck
// Auto-generated from bond-yield-calculator-schema.json
import * as z from 'zod';

export interface Bond_yield_calculatorInput {
  faceValue: number;
  couponRate: number;
  currentPrice: number;
  yearsToMaturity: number;
  frequency: number;
}

export const Bond_yield_calculatorInputSchema = z.object({
  faceValue: z.number().default(1000),
  couponRate: z.number().default(5),
  currentPrice: z.number().default(950),
  yearsToMaturity: z.number().default(10),
  frequency: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bond_yield_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.faceValue * input.couponRate / 100; results["annualCoupon"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualCoupon"] = 0; }
  try { const v = (asFormulaNumber(results["annualCoupon"])) / input.currentPrice * 100; results["currentYield"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["currentYield"] = 0; }
  try { const v = ((asFormulaNumber(results["annualCoupon"])) + (input.faceValue - input.currentPrice) / input.yearsToMaturity) / ((input.faceValue + input.currentPrice) / 2) * 100; results["approxYTM"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["approxYTM"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBond_yield_calculator(input: Bond_yield_calculatorInput): Bond_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualCoupon"]);
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


export interface Bond_yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

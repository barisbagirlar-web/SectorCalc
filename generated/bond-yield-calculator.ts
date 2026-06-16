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

function evaluateAllFormulas(input: Bond_yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.faceValue * input.couponRate / 100; results["annualCoupon"] = Number.isFinite(v) ? v : 0; } catch { results["annualCoupon"] = 0; }
  try { const v = (results["annualCoupon"] ?? 0) / input.currentPrice * 100; results["currentYield"] = Number.isFinite(v) ? v : 0; } catch { results["currentYield"] = 0; }
  try { const v = ((results["annualCoupon"] ?? 0) + (input.faceValue - input.currentPrice) / input.yearsToMaturity) / ((input.faceValue + input.currentPrice) / 2) * 100; results["approxYTM"] = Number.isFinite(v) ? v : 0; } catch { results["approxYTM"] = 0; }
  return results;
}


export function calculateBond_yield_calculator(input: Bond_yield_calculatorInput): Bond_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["approxYTM"] ?? 0;
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


export interface Bond_yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

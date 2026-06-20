// Auto-generated from bond-yield-calculator-schema.json
import * as z from 'zod';

export interface Bond_yield_calculatorInput {
  faceValue: number;
  couponRate: number;
  currentPrice: number;
  yearsToMaturity: number;
  frequency: number;
  dataConfidence?: number;
}

export const Bond_yield_calculatorInputSchema = z.object({
  faceValue: z.number().default(1000),
  couponRate: z.number().default(5),
  currentPrice: z.number().default(950),
  yearsToMaturity: z.number().default(10),
  frequency: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bond_yield_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.faceValue * input.couponRate / 100; results["annualCoupon"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualCoupon"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualCoupon"])) / input.currentPrice * 100; results["currentYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["currentYield"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["annualCoupon"])) + (input.faceValue - input.currentPrice) / input.yearsToMaturity) / ((input.faceValue + input.currentPrice) / 2) * 100; results["approxYTM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["approxYTM"] = Number.NaN; }
  return results;
}


export function calculateBond_yield_calculator(input: Bond_yield_calculatorInput): Bond_yield_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualCoupon"]);
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


export interface Bond_yield_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

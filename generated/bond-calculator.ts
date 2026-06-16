// Auto-generated from bond-calculator-schema.json
import * as z from 'zod';

export interface Bond_calculatorInput {
  faceValue: number;
  couponRate: number;
  marketRate: number;
  yearsToMaturity: number;
  frequency: number;
}

export const Bond_calculatorInputSchema = z.object({
  faceValue: z.number().default(1000),
  couponRate: z.number().default(5),
  marketRate: z.number().default(5),
  yearsToMaturity: z.number().default(10),
  frequency: z.number().default(2),
});

function evaluateAllFormulas(input: Bond_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.faceValue * input.couponRate / 100 / input.frequency; results["couponPayment"] = Number.isFinite(v) ? v : 0; } catch { results["couponPayment"] = 0; }
  try { const v = input.marketRate / 100 / input.frequency; results["discountRate"] = Number.isFinite(v) ? v : 0; } catch { results["discountRate"] = 0; }
  try { const v = input.yearsToMaturity * input.frequency; results["totalPeriods"] = Number.isFinite(v) ? v : 0; } catch { results["totalPeriods"] = 0; }
  try { const v = (results["couponPayment"] ?? 0) * (1 - (1 + (results["discountRate"] ?? 0)) ** (-(results["totalPeriods"] ?? 0))) / (results["discountRate"] ?? 0); results["pvCoupons"] = Number.isFinite(v) ? v : 0; } catch { results["pvCoupons"] = 0; }
  try { const v = input.faceValue * (1 + (results["discountRate"] ?? 0)) ** (-(results["totalPeriods"] ?? 0)); results["pvFace"] = Number.isFinite(v) ? v : 0; } catch { results["pvFace"] = 0; }
  try { const v = (results["discountRate"] ?? 0) === 0 ? input.faceValue + (results["couponPayment"] ?? 0) * (results["totalPeriods"] ?? 0) : (results["pvCoupons"] ?? 0) + (results["pvFace"] ?? 0); results["bondPrice"] = Number.isFinite(v) ? v : 0; } catch { results["bondPrice"] = 0; }
  return results;
}


export function calculateBond_calculator(input: Bond_calculatorInput): Bond_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Bond"] ?? 0;
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


export interface Bond_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

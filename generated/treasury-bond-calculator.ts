// Auto-generated from treasury-bond-calculator-schema.json
import * as z from 'zod';

export interface Treasury_bond_calculatorInput {
  faceValue: number;
  couponRate: number;
  yearsToMaturity: number;
  yieldToMaturity: number;
  frequency: number;
}

export const Treasury_bond_calculatorInputSchema = z.object({
  faceValue: z.number().default(1000),
  couponRate: z.number().default(5),
  yearsToMaturity: z.number().default(10),
  yieldToMaturity: z.number().default(4),
  frequency: z.number().default(2),
});

function evaluateAllFormulas(input: Treasury_bond_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.faceValue * input.couponRate / 100; results["annualCoupon"] = Number.isFinite(v) ? v : 0; } catch { results["annualCoupon"] = 0; }
  try { const v = (results["annualCoupon"] ?? 0) / input.frequency; results["periodCoupon"] = Number.isFinite(v) ? v : 0; } catch { results["periodCoupon"] = 0; }
  try { const v = input.yearsToMaturity * input.frequency; results["numPeriods"] = Number.isFinite(v) ? v : 0; } catch { results["numPeriods"] = 0; }
  try { const v = (input.yieldToMaturity / 100) / input.frequency; results["periodRate"] = Number.isFinite(v) ? v : 0; } catch { results["periodRate"] = 0; }
  try { const v = (results["periodRate"] ?? 0) === 0 ? ((results["periodCoupon"] ?? 0) * (results["numPeriods"] ?? 0) + input.faceValue) : ((results["periodCoupon"] ?? 0) * (1 - Math.pow(1 + (results["periodRate"] ?? 0), -(results["numPeriods"] ?? 0))) / (results["periodRate"] ?? 0) + input.faceValue * Math.pow(1 + (results["periodRate"] ?? 0), -(results["numPeriods"] ?? 0))); results["bondPrice"] = Number.isFinite(v) ? v : 0; } catch { results["bondPrice"] = 0; }
  return results;
}


export function calculateTreasury_bond_calculator(input: Treasury_bond_calculatorInput): Treasury_bond_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bondPrice"] ?? 0;
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


export interface Treasury_bond_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

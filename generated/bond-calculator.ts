// Auto-generated from bond-calculator-schema.json
import * as z from 'zod';

export interface Bond_calculatorInput {
  faceValue: number;
  couponRate: number;
  marketRate: number;
  yearsToMaturity: number;
  frequency: number;
  dataConfidence?: number;
}

export const Bond_calculatorInputSchema = z.object({
  faceValue: z.number().default(1000),
  couponRate: z.number().default(5),
  marketRate: z.number().default(5),
  yearsToMaturity: z.number().default(10),
  frequency: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bond_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.faceValue * input.couponRate / 100 / input.frequency; results["couponPayment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["couponPayment"] = 0; }
  try { const v = input.marketRate / 100 / input.frequency; results["discountRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountRate"] = 0; }
  try { const v = input.yearsToMaturity * input.frequency; results["totalPeriods"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPeriods"] = 0; }
  try { const v = (asFormulaNumber(results["couponPayment"])) * (1 - (1 + (asFormulaNumber(results["discountRate"]))) ** (-(asFormulaNumber(results["totalPeriods"])))) / (asFormulaNumber(results["discountRate"])); results["pvCoupons"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pvCoupons"] = 0; }
  try { const v = input.faceValue * (1 + (asFormulaNumber(results["discountRate"]))) ** (-(asFormulaNumber(results["totalPeriods"]))); results["pvFace"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pvFace"] = 0; }
  try { const v = (((asFormulaNumber(results["discountRate"])) === 0 ? input.faceValue + (asFormulaNumber(results["couponPayment"])) * (asFormulaNumber(results["totalPeriods"])) : (asFormulaNumber(results["pvCoupons"])) + (asFormulaNumber(results["pvFace"]))) ? 1 : 0); results["bondPrice"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bondPrice"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBond_calculator(input: Bond_calculatorInput): Bond_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["couponPayment"]);
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


export interface Bond_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

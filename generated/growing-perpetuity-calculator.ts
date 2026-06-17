// @ts-nocheck
// Auto-generated from growing-perpetuity-calculator-schema.json
import * as z from 'zod';

export interface Growing_perpetuity_calculatorInput {
  initialCashFlow: number;
  discountRate: number;
  growthRate: number;
  timingFlag: number;
}

export const Growing_perpetuity_calculatorInputSchema = z.object({
  initialCashFlow: z.number().default(1000),
  discountRate: z.number().default(10),
  growthRate: z.number().default(3),
  timingFlag: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Growing_perpetuity_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.discountRate - input.growthRate) / 100; results["discountRateMinusGrowth"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["discountRateMinusGrowth"] = 0; }
  try { const v = input.initialCashFlow / (asFormulaNumber(results["discountRateMinusGrowth"])); results["presentValueBeforeTiming"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["presentValueBeforeTiming"] = 0; }
  try { const v = input.timingFlag === 1 ? (asFormulaNumber(results["presentValueBeforeTiming"])) * (1 + input.discountRate/100) : (asFormulaNumber(results["presentValueBeforeTiming"])); results["presentValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["presentValue"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGrowing_perpetuity_calculator(input: Growing_perpetuity_calculatorInput): Growing_perpetuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["presentValue"]);
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


export interface Growing_perpetuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

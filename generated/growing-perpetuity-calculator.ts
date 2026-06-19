// Auto-generated from growing-perpetuity-calculator-schema.json
import * as z from 'zod';

export interface Growing_perpetuity_calculatorInput {
  initialCashFlow: number;
  discountRate: number;
  growthRate: number;
  timingFlag: number;
  dataConfidence?: number;
}

export const Growing_perpetuity_calculatorInputSchema = z.object({
  initialCashFlow: z.number().default(1000),
  discountRate: z.number().default(10),
  growthRate: z.number().default(3),
  timingFlag: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Growing_perpetuity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.discountRate - input.growthRate) / 100; results["discountRateMinusGrowth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountRateMinusGrowth"] = 0; }
  try { const v = input.initialCashFlow / (asFormulaNumber(results["discountRateMinusGrowth"])); results["presentValueBeforeTiming"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["presentValueBeforeTiming"] = 0; }
  try { const v = input.timingFlag === 1 ? (asFormulaNumber(results["presentValueBeforeTiming"])) * (1 + input.discountRate/100) : (asFormulaNumber(results["presentValueBeforeTiming"])); results["presentValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["presentValue"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGrowing_perpetuity_calculator(input: Growing_perpetuity_calculatorInput): Growing_perpetuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["presentValue"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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

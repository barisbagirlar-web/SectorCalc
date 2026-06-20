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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Growing_perpetuity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.discountRate - input.growthRate) / 100; results["discountRateMinusGrowth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountRateMinusGrowth"] = Number.NaN; }
  try { const v = input.initialCashFlow / (toNumericFormulaValue(results["discountRateMinusGrowth"])); results["presentValueBeforeTiming"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["presentValueBeforeTiming"] = Number.NaN; }
  try { const v = input.timingFlag === 1 ? (toNumericFormulaValue(results["presentValueBeforeTiming"])) * (1 + input.discountRate/100) : (toNumericFormulaValue(results["presentValueBeforeTiming"])); results["presentValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["presentValue"] = Number.NaN; }
  return results;
}


export function calculateGrowing_perpetuity_calculator(input: Growing_perpetuity_calculatorInput): Growing_perpetuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["presentValue"]);
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


export interface Growing_perpetuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

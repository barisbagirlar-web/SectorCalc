// Auto-generated from breast-milk-calculator-schema.json
import * as z from 'zod';

export interface Breast_milk_calculatorInput {
  babyWeight: number;
  dailyMilkPerKg: number;
  feedingsPerDay: number;
  milkPerSession: number;
  dataConfidence?: number;
}

export const Breast_milk_calculatorInputSchema = z.object({
  babyWeight: z.number().default(3.5),
  dailyMilkPerKg: z.number().default(150),
  feedingsPerDay: z.number().default(8),
  milkPerSession: z.number().default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Breast_milk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.babyWeight * input.dailyMilkPerKg; results["dailyNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyNeeded"] = Number.NaN; }
  try { const v = input.milkPerSession * input.feedingsPerDay; results["dailySupplied"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailySupplied"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailySupplied"])) - (toNumericFormulaValue(results["dailyNeeded"])); results["deficit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deficit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyNeeded"])) / input.feedingsPerDay; results["perFeedingNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perFeedingNeeded"] = Number.NaN; }
  try { const v = input.milkPerSession; results["perFeedingSupplied"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perFeedingSupplied"] = Number.NaN; }
  return results;
}


export function calculateBreast_milk_calculator(input: Breast_milk_calculatorInput): Breast_milk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["deficit"]);
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


export interface Breast_milk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

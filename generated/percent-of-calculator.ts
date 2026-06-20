// Auto-generated from percent-of-calculator-schema.json
import * as z from 'zod';

export interface Percent_of_calculatorInput {
  baseAmount: number;
  percent: number;
  additionalFixed: number;
  decimalPlaces: number;
  dataConfidence?: number;
}

export const Percent_of_calculatorInputSchema = z.object({
  baseAmount: z.number().default(100),
  percent: z.number().default(20),
  additionalFixed: z.number().default(0),
  decimalPlaces: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Percent_of_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseAmount * input.percent / 100; results["rawPercentResult"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawPercentResult"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawPercentResult"])) + input.additionalFixed; results["totalBeforeRounding"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBeforeRounding"] = Number.NaN; }
  return results;
}


export function calculatePercent_of_calculator(input: Percent_of_calculatorInput): Percent_of_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBeforeRounding"]);
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


export interface Percent_of_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

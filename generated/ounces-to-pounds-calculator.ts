// Auto-generated from ounces-to-pounds-calculator-schema.json
import * as z from 'zod';

export interface Ounces_to_pounds_calculatorInput {
  ounces: number;
  quantity: number;
  tare: number;
  conversionFactor: number;
  dataConfidence?: number;
}

export const Ounces_to_pounds_calculatorInputSchema = z.object({
  ounces: z.number().default(0),
  quantity: z.number().default(1),
  tare: z.number().default(0),
  conversionFactor: z.number().default(16),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ounces_to_pounds_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ounces * input.quantity + input.tare; results["totalOunces"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalOunces"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalOunces"])) / input.conversionFactor; results["pounds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pounds"] = Number.NaN; }
  try { const v = input.conversionFactor; results["conversionFactorUsed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["conversionFactorUsed"] = Number.NaN; }
  return results;
}


export function calculateOunces_to_pounds_calculator(input: Ounces_to_pounds_calculatorInput): Ounces_to_pounds_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pounds"]);
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


export interface Ounces_to_pounds_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

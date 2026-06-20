// Auto-generated from knots-to-mph-calculator-schema.json
import * as z from 'zod';

export interface Knots_to_mph_calculatorInput {
  knots: number;
  calFactor: number;
  calOffset: number;
  precisionMode: number;
  dataConfidence?: number;
}

export const Knots_to_mph_calculatorInputSchema = z.object({
  knots: z.number().default(0),
  calFactor: z.number().default(1),
  calOffset: z.number().default(0),
  precisionMode: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Knots_to_mph_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.knots * input.calFactor + input.calOffset) * (1.15078 - (input.precisionMode - 1) * 0.00000055); results["mph"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mph"] = Number.NaN; }
  try { const v = input.knots * input.calFactor + input.calOffset; results["correctedKnots"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["correctedKnots"] = Number.NaN; }
  try { const v = 1.15078 - (input.precisionMode - 1) * 0.00000055; results["conversionFactorUsed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["conversionFactorUsed"] = Number.NaN; }
  return results;
}


export function calculateKnots_to_mph_calculator(input: Knots_to_mph_calculatorInput): Knots_to_mph_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["mph"]);
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


export interface Knots_to_mph_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

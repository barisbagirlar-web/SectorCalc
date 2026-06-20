// Auto-generated from rational-method-calculator-schema.json
import * as z from 'zod';

export interface Rational_method_calculatorInput {
  c: number;
  i: number;
  a: number;
  sf: number;
  dataConfidence?: number;
}

export const Rational_method_calculatorInputSchema = z.object({
  c: z.number().default(0.5),
  i: z.number().default(50),
  a: z.number().default(1),
  sf: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rational_method_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sf * input.c * input.i * input.a / 0.36; results["peakDischargeLps"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["peakDischargeLps"] = Number.NaN; }
  try { const v = input.sf * input.c * input.i * input.a / 360; results["peakDischargeCumecs"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["peakDischargeCumecs"] = Number.NaN; }
  return results;
}


export function calculateRational_method_calculator(input: Rational_method_calculatorInput): Rational_method_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["peakDischargeLps"]);
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


export interface Rational_method_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

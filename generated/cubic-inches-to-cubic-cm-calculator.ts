// Auto-generated from cubic-inches-to-cubic-cm-calculator-schema.json
import * as z from 'zod';

export interface Cubic_inches_to_cubic_cm_calculatorInput {
  cubicInches: number;
  conversionFactor: number;
  decimalPlaces: number;
  roundingMode: number;
  dataConfidence?: number;
}

export const Cubic_inches_to_cubic_cm_calculatorInputSchema = z.object({
  cubicInches: z.number().default(0),
  conversionFactor: z.number().default(16.387064),
  decimalPlaces: z.number().default(2),
  roundingMode: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cubic_inches_to_cubic_cm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cubicInches * input.conversionFactor; results["exactCubicCm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["exactCubicCm"] = 0; }
  try { const v = input.decimalPlaces; results["appliedPrecision"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["appliedPrecision"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCubic_inches_to_cubic_cm_calculator(input: Cubic_inches_to_cubic_cm_calculatorInput): Cubic_inches_to_cubic_cm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["appliedPrecision"]);
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


export interface Cubic_inches_to_cubic_cm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

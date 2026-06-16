// Auto-generated from cubic-inches-to-cubic-cm-calculator-schema.json
import * as z from 'zod';

export interface Cubic_inches_to_cubic_cm_calculatorInput {
  cubicInches: number;
  conversionFactor: number;
  decimalPlaces: number;
  roundingMode: number;
}

export const Cubic_inches_to_cubic_cm_calculatorInputSchema = z.object({
  cubicInches: z.number().default(0),
  conversionFactor: z.number().default(16.387064),
  decimalPlaces: z.number().default(2),
  roundingMode: z.number().default(0),
});

function evaluateAllFormulas(input: Cubic_inches_to_cubic_cm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cubicInches * input.conversionFactor; results["exactCubicCm"] = Number.isFinite(v) ? v : 0; } catch { results["exactCubicCm"] = 0; }
  try { const v = input.roundingMode === 0 ? Math.round((results["exactCubicCm"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces) : input.roundingMode === 1 ? Math.floor((results["exactCubicCm"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces) : Math.ceil((results["exactCubicCm"] ?? 0) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["cubicCm"] = Number.isFinite(v) ? v : 0; } catch { results["cubicCm"] = 0; }
  try { const v = input.decimalPlaces; results["appliedPrecision"] = Number.isFinite(v) ? v : 0; } catch { results["appliedPrecision"] = 0; }
  return results;
}


export function calculateCubic_inches_to_cubic_cm_calculator(input: Cubic_inches_to_cubic_cm_calculatorInput): Cubic_inches_to_cubic_cm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cubicCm"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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

// Auto-generated from ms-to-kmh-calculator-schema.json
import * as z from 'zod';

export interface Ms_to_kmh_calculatorInput {
  speedMs: number;
  conversionFactor: number;
  decimalPlaces: number;
  roundingMethod: number;
  expectedOutput: number;
  dataConfidence?: number;
}

export const Ms_to_kmh_calculatorInputSchema = z.object({
  speedMs: z.number().default(1),
  conversionFactor: z.number().default(3.6),
  decimalPlaces: z.number().default(2),
  roundingMethod: z.number().default(0),
  expectedOutput: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ms_to_kmh_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.speedMs) * (input.conversionFactor) * (input.decimalPlaces) * (input.roundingMethod) * (input.expectedOutput); results["rawValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawValue"] = 0; }
  try { const v = (input.speedMs) * (input.conversionFactor) * (input.decimalPlaces); results["rawValue_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawValue_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMs_to_kmh_calculator(input: Ms_to_kmh_calculatorInput): Ms_to_kmh_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["rawValue_aux"]));
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


export interface Ms_to_kmh_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

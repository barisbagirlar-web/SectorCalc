// Auto-generated from inverse-z-transform-calculator-schema.json
import * as z from 'zod';

export interface Inverse_z_transform_calculatorInput {
  b0: number;
  b1: number;
  b2: number;
  a1: number;
  a2: number;
  dataConfidence?: number;
}

export const Inverse_z_transform_calculatorInputSchema = z.object({
  b0: z.number().default(1),
  b1: z.number().default(0),
  b2: z.number().default(0),
  a1: z.number().default(0),
  a2: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Inverse_z_transform_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.b0 * input.b1 * input.b2 * input.a1; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.b0 * input.b1 * input.b2 * input.a1 * (input.a2); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.a2; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateInverse_z_transform_calculator(input: Inverse_z_transform_calculatorInput): Inverse_z_transform_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Inverse_z_transform_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

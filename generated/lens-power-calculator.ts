// Auto-generated from lens-power-calculator-schema.json
import * as z from 'zod';

export interface Lens_power_calculatorInput {
  n: number;
  R1: number;
  R2: number;
  d: number;
  dataConfidence?: number;
}

export const Lens_power_calculatorInputSchema = z.object({
  n: z.number().default(1.5),
  R1: z.number().default(100),
  R2: z.number().default(-100),
  d: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lens_power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1000 * (input.n - 1) * (1/input.R1 - 1/input.R2 + (input.n - 1) * input.d / (input.n * input.R1 * input.R2)); results["powerD"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["powerD"] = Number.NaN; }
  try { const v = 1 / ((input.n - 1) * (1/input.R1 - 1/input.R2 + (input.n - 1) * input.d / (input.n * input.R1 * input.R2))); results["focalLengthMM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["focalLengthMM"] = Number.NaN; }
  return results;
}


export function calculateLens_power_calculator(input: Lens_power_calculatorInput): Lens_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["powerD"]);
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


export interface Lens_power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

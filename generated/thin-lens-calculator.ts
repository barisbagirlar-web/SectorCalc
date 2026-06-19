// Auto-generated from thin-lens-calculator-schema.json
import * as z from 'zod';

export interface Thin_lens_calculatorInput {
  n: number;
  R1: number;
  R2: number;
  u: number;
  dataConfidence?: number;
}

export const Thin_lens_calculatorInputSchema = z.object({
  n: z.number().default(1.5),
  R1: z.number().default(100),
  R2: z.number().default(-100),
  u: z.number().default(200),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Thin_lens_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / ((input.n - 1) * (1/input.R1 - 1/input.R2)); results["focalLength_mm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["focalLength_mm"] = 0; }
  try { const v = 1 / (1/(asFormulaNumber(results["focalLength_mm"])) - 1/input.u); results["imageDistance_mm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["imageDistance_mm"] = 0; }
  try { const v = -(asFormulaNumber(results["imageDistance_mm"])) / input.u; results["magnification"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["magnification"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateThin_lens_calculator(input: Thin_lens_calculatorInput): Thin_lens_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["focalLength_mm"]);
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


export interface Thin_lens_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

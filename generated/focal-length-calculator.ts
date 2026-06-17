// @ts-nocheck
// Auto-generated from focal-length-calculator-schema.json
import * as z from 'zod';

export interface Focal_length_calculatorInput {
  n: number;
  R1: number;
  R2: number;
  d: number;
}

export const Focal_length_calculatorInputSchema = z.object({
  n: z.number().default(1.5),
  R1: z.number().default(100),
  R2: z.number().default(-100),
  d: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Focal_length_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1 / ((input.n - 1) * (1 / input.R1 - 1 / input.R2 + (input.n - 1) * input.d / (input.n * input.R1 * input.R2))); results["focalLength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["focalLength"] = 0; }
  try { const v = (asFormulaNumber(results["focalLength"])) * (1 - (input.n - 1) * input.d / (input.n * input.R1)); results["frontFocalLength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["frontFocalLength"] = 0; }
  try { const v = (asFormulaNumber(results["focalLength"])) * (1 - (input.n - 1) * input.d / (input.n * input.R2)); results["backFocalLength"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["backFocalLength"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFocal_length_calculator(input: Focal_length_calculatorInput): Focal_length_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["focalLength"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Focal_length_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

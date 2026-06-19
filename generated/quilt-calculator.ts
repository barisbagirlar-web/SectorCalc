// Auto-generated from quilt-calculator-schema.json
import * as z from 'zod';

export interface Quilt_calculatorInput {
  quiltWidth: number;
  quiltLength: number;
  blockWidth: number;
  blockLength: number;
  seamAllowance: number;
  fabricWidth: number;
  dataConfidence?: number;
}

export const Quilt_calculatorInputSchema = z.object({
  quiltWidth: z.number().default(200),
  quiltLength: z.number().default(200),
  blockWidth: z.number().default(20),
  blockLength: z.number().default(20),
  seamAllowance: z.number().default(0.6),
  fabricWidth: z.number().default(110),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Quilt_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.blockWidth + 2 * input.seamAllowance; results["blockCutWidth"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["blockCutWidth"] = 0; }
  try { const v = input.blockLength + 2 * input.seamAllowance; results["blockCutLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["blockCutLength"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateQuilt_calculator(input: Quilt_calculatorInput): Quilt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["blockCutLength"]));
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


export interface Quilt_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

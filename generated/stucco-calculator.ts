// @ts-nocheck
// Auto-generated from stucco-calculator-schema.json
import * as z from 'zod';

export interface Stucco_calculatorInput {
  wallArea: number;
  thickness: number;
  kgPerSqmPerMm: number;
  bagWeight: number;
  wasteFactor: number;
}

export const Stucco_calculatorInputSchema = z.object({
  wallArea: z.number().default(100),
  thickness: z.number().default(20),
  kgPerSqmPerMm: z.number().default(1),
  bagWeight: z.number().default(25),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stucco_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.wallArea * input.thickness * input.kgPerSqmPerMm * (1 + input.wasteFactor / 100); results["totalDryMix"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDryMix"] = 0; }
  try { const v = input.wallArea * input.thickness * input.kgPerSqmPerMm * (1 + input.wasteFactor / 100); results["totalDryMix_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDryMix_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStucco_calculator(input: Stucco_calculatorInput): Stucco_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDryMix"]);
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


export interface Stucco_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

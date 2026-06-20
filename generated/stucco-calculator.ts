// Auto-generated from stucco-calculator-schema.json
import * as z from 'zod';

export interface Stucco_calculatorInput {
  wallArea: number;
  thickness: number;
  kgPerSqmPerMm: number;
  bagWeight: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Stucco_calculatorInputSchema = z.object({
  wallArea: z.number().default(100),
  thickness: z.number().default(20),
  kgPerSqmPerMm: z.number().default(1),
  bagWeight: z.number().default(25),
  wasteFactor: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stucco_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallArea * input.thickness * input.kgPerSqmPerMm * (1 + input.wasteFactor / 100); results["totalDryMix"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDryMix"] = Number.NaN; }
  try { const v = input.wallArea * input.thickness * input.kgPerSqmPerMm * (1 + input.wasteFactor / 100); results["totalDryMix_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDryMix_aux"] = Number.NaN; }
  return results;
}


export function calculateStucco_calculator(input: Stucco_calculatorInput): Stucco_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDryMix"]);
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


export interface Stucco_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

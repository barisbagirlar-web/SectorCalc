// Auto-generated from gable-roof-calculator-schema.json
import * as z from 'zod';

export interface Gable_roof_calculatorInput {
  buildingWidth: number;
  buildingLength: number;
  roofPitch: number;
  overhang: number;
  rafterSpacing: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Gable_roof_calculatorInputSchema = z.object({
  buildingWidth: z.number().default(10),
  buildingLength: z.number().default(12),
  roofPitch: z.number().default(30),
  overhang: z.number().default(0.5),
  rafterSpacing: z.number().default(0.6),
  wasteFactor: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gable_roof_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.buildingLength; results["ridgeLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ridgeLength"] = 0; }
  try { const v = input.buildingLength; results["ridgeLength_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ridgeLength_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGable_roof_calculator(input: Gable_roof_calculatorInput): Gable_roof_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ridgeLength"]);
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


export interface Gable_roof_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

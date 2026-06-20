// Auto-generated from joint-compound-calculator-schema.json
import * as z from 'zod';

export interface Joint_compound_calculatorInput {
  numSheets: number;
  jointLength: number;
  jointWidth: number;
  thickness: number;
  numCoats: number;
  coverageFactor: number;
  dataConfidence?: number;
}

export const Joint_compound_calculatorInputSchema = z.object({
  numSheets: z.number().default(10),
  jointLength: z.number().default(3.6),
  jointWidth: z.number().default(150),
  thickness: z.number().default(1.5),
  numCoats: z.number().default(3),
  coverageFactor: z.number().default(1.2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Joint_compound_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numSheets * input.jointLength * (input.jointWidth / 1000) * input.numCoats; results["totalJointArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalJointArea"] = Number.NaN; }
  try { const v = input.thickness * input.numCoats; results["totalThickness"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalThickness"] = Number.NaN; }
  try { const v = (input.numSheets * input.jointLength * (input.jointWidth / 1000) * input.thickness * input.numCoats) / input.coverageFactor; results["totalCompound"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCompound"] = Number.NaN; }
  return results;
}


export function calculateJoint_compound_calculator(input: Joint_compound_calculatorInput): Joint_compound_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCompound"]);
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


export interface Joint_compound_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

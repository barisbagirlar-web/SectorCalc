// Auto-generated from crown-molding-calculator-schema.json
import * as z from 'zod';

export interface Crown_molding_calculatorInput {
  springAngle: number;
  cornerAngle: number;
  wallLength: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Crown_molding_calculatorInputSchema = z.object({
  springAngle: z.number().default(38),
  cornerAngle: z.number().default(90),
  wallLength: z.number().default(10),
  wasteFactor: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Crown_molding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * 2 * (1 + input.wasteFactor/100); results["totalMoldingLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMoldingLength"] = Number.NaN; }
  try { const v = input.wallLength * 2 * (1 + input.wasteFactor/100); results["totalMoldingLength_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMoldingLength_aux"] = Number.NaN; }
  return results;
}


export function calculateCrown_molding_calculator(input: Crown_molding_calculatorInput): Crown_molding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMoldingLength_aux"]);
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


export interface Crown_molding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

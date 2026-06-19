// Auto-generated from caulk-calculator-schema.json
import * as z from 'zod';

export interface Caulk_calculatorInput {
  jointLength: number;
  jointWidth: number;
  jointDepth: number;
  wasteFactor: number;
  tubeVolume: number;
  numberOfJoints: number;
  dataConfidence?: number;
}

export const Caulk_calculatorInputSchema = z.object({
  jointLength: z.number().default(1),
  jointWidth: z.number().default(6),
  jointDepth: z.number().default(6),
  wasteFactor: z.number().default(10),
  tubeVolume: z.number().default(310),
  numberOfJoints: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Caulk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.jointLength * input.jointWidth * input.jointDepth * input.numberOfJoints * (1 + input.wasteFactor/100); results["volumeWithWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeWithWaste"] = 0; }
  try { const v = input.jointLength * input.jointWidth * input.jointDepth * input.numberOfJoints; results["theoreticalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["theoreticalVolume"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCaulk_calculator(input: Caulk_calculatorInput): Caulk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["volumeWithWaste"]));
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


export interface Caulk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

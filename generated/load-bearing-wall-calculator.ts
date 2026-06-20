// Auto-generated from load-bearing-wall-calculator-schema.json
import * as z from 'zod';

export interface Load_bearing_wall_calculatorInput {
  wallThickness: number;
  wallLength: number;
  wallHeight: number;
  compressiveStrength: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Load_bearing_wall_calculatorInputSchema = z.object({
  wallThickness: z.number().default(200),
  wallLength: z.number().default(1),
  wallHeight: z.number().default(3),
  compressiveStrength: z.number().default(20),
  safetyFactor: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Load_bearing_wall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallThickness / 1000 * input.wallLength; results["area"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["area"] = Number.NaN; }
  try { const v = input.compressiveStrength / input.safetyFactor; results["axialStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["axialStress"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["area"])) * input.compressiveStrength * 1000 / input.safetyFactor; results["maxLoad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxLoad"] = Number.NaN; }
  return results;
}


export function calculateLoad_bearing_wall_calculator(input: Load_bearing_wall_calculatorInput): Load_bearing_wall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["maxLoad"]);
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


export interface Load_bearing_wall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

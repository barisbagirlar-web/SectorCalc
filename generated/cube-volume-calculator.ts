// Auto-generated from cube-volume-calculator-schema.json
import * as z from 'zod';

export interface Cube_volume_calculatorInput {
  sideLength: number;
  quantity: number;
  wasteFactor: number;
  density: number;
  dataConfidence?: number;
}

export const Cube_volume_calculatorInputSchema = z.object({
  sideLength: z.number().default(1),
  quantity: z.number().default(1),
  wasteFactor: z.number().default(5),
  density: z.number().default(1000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cube_volume_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sideLength ** 3 * input.quantity * (1 + input.wasteFactor / 100); results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = input.sideLength ** 3; results["singleCubeVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["singleCubeVolume"] = 0; }
  try { const v = input.sideLength ** 3 * input.quantity * (1 + input.wasteFactor / 100) * input.density; results["totalWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCube_volume_calculator(input: Cube_volume_calculatorInput): Cube_volume_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalVolume"]);
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


export interface Cube_volume_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

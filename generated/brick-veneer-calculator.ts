// Auto-generated from brick-veneer-calculator-schema.json
import * as z from 'zod';

export interface Brick_veneer_calculatorInput {
  wallWidth: number;
  wallHeight: number;
  brickLength: number;
  brickHeight: number;
  mortarJoint: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Brick_veneer_calculatorInputSchema = z.object({
  wallWidth: z.number().default(10),
  wallHeight: z.number().default(3),
  brickLength: z.number().default(230),
  brickHeight: z.number().default(76),
  mortarJoint: z.number().default(10),
  wasteFactor: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Brick_veneer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallWidth * input.wallHeight; results["wallArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wallArea"] = Number.NaN; }
  try { const v = (input.brickLength / 1000 + input.mortarJoint / 1000) * (input.brickHeight / 1000 + input.mortarJoint / 1000); results["brickAreaWithMortar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["brickAreaWithMortar"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wallArea"])) / (toNumericFormulaValue(results["brickAreaWithMortar"])); results["bricksWithoutWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bricksWithoutWaste"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bricksWithoutWaste"])) * input.wasteFactor / 100; results["wasteBricks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteBricks"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bricksWithoutWaste"])) + (toNumericFormulaValue(results["wasteBricks"])); results["totalBricks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBricks"] = Number.NaN; }
  return results;
}


export function calculateBrick_veneer_calculator(input: Brick_veneer_calculatorInput): Brick_veneer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBricks"]);
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


export interface Brick_veneer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

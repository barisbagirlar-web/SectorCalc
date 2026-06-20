// Auto-generated from brick-calculator-schema.json
import * as z from 'zod';

export interface Brick_calculatorInput {
  wallLength: number;
  wallHeight: number;
  brickLength: number;
  brickHeight: number;
  mortarThickness: number;
  openingArea: number;
  wastagePercentage: number;
  dataConfidence?: number;
}

export const Brick_calculatorInputSchema = z.object({
  wallLength: z.number().default(10),
  wallHeight: z.number().default(3),
  brickLength: z.number().default(200),
  brickHeight: z.number().default(100),
  mortarThickness: z.number().default(10),
  openingArea: z.number().default(2),
  wastagePercentage: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Brick_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * input.wallHeight - input.openingArea; results["wallArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wallArea"] = Number.NaN; }
  try { const v = input.brickLength / 1000; results["brickLengthM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["brickLengthM"] = Number.NaN; }
  try { const v = input.brickHeight / 1000; results["brickHeightM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["brickHeightM"] = Number.NaN; }
  try { const v = input.mortarThickness / 1000; results["mortarThicknessM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mortarThicknessM"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["brickLengthM"])) + (toNumericFormulaValue(results["mortarThicknessM"])); results["effectiveLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveLength"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["brickHeightM"])) + (toNumericFormulaValue(results["mortarThicknessM"])); results["effectiveHeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveHeight"] = Number.NaN; }
  try { const v = 1 / ((toNumericFormulaValue(results["effectiveLength"])) * (toNumericFormulaValue(results["effectiveHeight"]))); results["bricksPerSquareMeter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bricksPerSquareMeter"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["wallArea"])) * (toNumericFormulaValue(results["bricksPerSquareMeter"])); results["netBricks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netBricks"] = Number.NaN; }
  try { const v = 1 + input.wastagePercentage / 100; results["wastageMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wastageMultiplier"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netBricks"])) * (toNumericFormulaValue(results["wastageMultiplier"])); results["grossBricks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossBricks"] = Number.NaN; }
  return results;
}


export function calculateBrick_calculator(input: Brick_calculatorInput): Brick_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grossBricks"]);
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


export interface Brick_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

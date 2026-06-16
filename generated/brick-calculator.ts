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

function evaluateAllFormulas(input: Brick_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * input.wallHeight - input.openingArea; results["wallArea"] = Number.isFinite(v) ? v : 0; } catch { results["wallArea"] = 0; }
  try { const v = input.brickLength / 1000; results["brickLengthM"] = Number.isFinite(v) ? v : 0; } catch { results["brickLengthM"] = 0; }
  try { const v = input.brickHeight / 1000; results["brickHeightM"] = Number.isFinite(v) ? v : 0; } catch { results["brickHeightM"] = 0; }
  try { const v = input.mortarThickness / 1000; results["mortarThicknessM"] = Number.isFinite(v) ? v : 0; } catch { results["mortarThicknessM"] = 0; }
  try { const v = (results["brickLengthM"] ?? 0) + (results["mortarThicknessM"] ?? 0); results["effectiveLength"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveLength"] = 0; }
  try { const v = (results["brickHeightM"] ?? 0) + (results["mortarThicknessM"] ?? 0); results["effectiveHeight"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveHeight"] = 0; }
  try { const v = 1 / ((results["effectiveLength"] ?? 0) * (results["effectiveHeight"] ?? 0)); results["bricksPerSquareMeter"] = Number.isFinite(v) ? v : 0; } catch { results["bricksPerSquareMeter"] = 0; }
  try { const v = (results["wallArea"] ?? 0) * (results["bricksPerSquareMeter"] ?? 0); results["netBricks"] = Number.isFinite(v) ? v : 0; } catch { results["netBricks"] = 0; }
  try { const v = 1 + input.wastagePercentage / 100; results["wastageMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["wastageMultiplier"] = 0; }
  try { const v = (results["netBricks"] ?? 0) * (results["wastageMultiplier"] ?? 0); results["grossBricks"] = Number.isFinite(v) ? v : 0; } catch { results["grossBricks"] = 0; }
  try { const v = Math.ceil((results["grossBricks"] ?? 0)); results["totalBricksNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["totalBricksNeeded"] = 0; }
  return results;
}


export function calculateBrick_calculator(input: Brick_calculatorInput): Brick_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalBricksNeeded"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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

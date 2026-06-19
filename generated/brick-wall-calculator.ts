// Auto-generated from brick-wall-calculator-schema.json
import * as z from 'zod';

export interface Brick_wall_calculatorInput {
  wallLength: number;
  wallHeight: number;
  brickLength: number;
  brickHeight: number;
  brickWidth: number;
  mortarJointThickness: number;
  brickPrice: number;
  mortarPrice: number;
  dataConfidence?: number;
}

export const Brick_wall_calculatorInputSchema = z.object({
  wallLength: z.number().default(10),
  wallHeight: z.number().default(3),
  brickLength: z.number().default(20),
  brickHeight: z.number().default(10),
  brickWidth: z.number().default(10),
  mortarJointThickness: z.number().default(1),
  brickPrice: z.number().default(0.5),
  mortarPrice: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Brick_wall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.wallLength * 100 / (input.brickLength + input.mortarJointThickness)) * (input.wallHeight * 100 / (input.brickHeight + input.mortarJointThickness)); results["totalBricks"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBricks"] = 0; }
  try { const v = input.wallLength * 100 * input.wallHeight * 100 * input.brickWidth; results["wallVolumeCm3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wallVolumeCm3"] = 0; }
  try { const v = input.brickLength * input.brickHeight * input.brickWidth; results["oneBrickVolumeCm3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["oneBrickVolumeCm3"] = 0; }
  try { const v = (asFormulaNumber(results["wallVolumeCm3"])) - ((asFormulaNumber(results["totalBricks"])) * (asFormulaNumber(results["oneBrickVolumeCm3"]))); results["mortarVolumeCm3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mortarVolumeCm3"] = 0; }
  try { const v = (asFormulaNumber(results["mortarVolumeCm3"])) / 1000000; results["mortarVolumeM3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mortarVolumeM3"] = 0; }
  try { const v = (asFormulaNumber(results["totalBricks"])) * input.brickPrice + (asFormulaNumber(results["mortarVolumeM3"])) * input.mortarPrice; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBrick_wall_calculator(input: Brick_wall_calculatorInput): Brick_wall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalBricks"]));
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


export interface Brick_wall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

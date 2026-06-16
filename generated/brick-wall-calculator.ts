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

function evaluateAllFormulas(input: Brick_wall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.wallLength * 100 / (input.brickLength + input.mortarJointThickness)) * (input.wallHeight * 100 / (input.brickHeight + input.mortarJointThickness)); results["totalBricks"] = Number.isFinite(v) ? v : 0; } catch { results["totalBricks"] = 0; }
  try { const v = input.wallLength * 100 * input.wallHeight * 100 * input.brickWidth; results["wallVolumeCm3"] = Number.isFinite(v) ? v : 0; } catch { results["wallVolumeCm3"] = 0; }
  try { const v = input.brickLength * input.brickHeight * input.brickWidth; results["oneBrickVolumeCm3"] = Number.isFinite(v) ? v : 0; } catch { results["oneBrickVolumeCm3"] = 0; }
  try { const v = (results["wallVolumeCm3"] ?? 0) - ((results["totalBricks"] ?? 0) * (results["oneBrickVolumeCm3"] ?? 0)); results["mortarVolumeCm3"] = Number.isFinite(v) ? v : 0; } catch { results["mortarVolumeCm3"] = 0; }
  try { const v = (results["mortarVolumeCm3"] ?? 0) / 1000000; results["mortarVolumeM3"] = Number.isFinite(v) ? v : 0; } catch { results["mortarVolumeM3"] = 0; }
  try { const v = (results["totalBricks"] ?? 0) * input.brickPrice + (results["mortarVolumeM3"] ?? 0) * input.mortarPrice; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateBrick_wall_calculator(input: Brick_wall_calculatorInput): Brick_wall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalBricks"] ?? 0;
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


export interface Brick_wall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

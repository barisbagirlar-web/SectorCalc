// Auto-generated from mortar-calculator-schema.json
import * as z from 'zod';

export interface Mortar_calculatorInput {
  wallLength: number;
  wallHeight: number;
  brickLength: number;
  brickWidth: number;
  brickHeight: number;
  jointThickness: number;
  wasteFactor: number;
}

export const Mortar_calculatorInputSchema = z.object({
  wallLength: z.number().default(10),
  wallHeight: z.number().default(3),
  brickLength: z.number().default(190),
  brickWidth: z.number().default(90),
  brickHeight: z.number().default(90),
  jointThickness: z.number().default(10),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Mortar_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor(input.wallLength * 1000 / (input.brickLength + input.jointThickness)); results["bricksPerRow"] = Number.isFinite(v) ? v : 0; } catch { results["bricksPerRow"] = 0; }
  try { const v = Math.floor(input.wallHeight * 1000 / (input.brickHeight + input.jointThickness)); results["rows"] = Number.isFinite(v) ? v : 0; } catch { results["rows"] = 0; }
  try { const v = (results["bricksPerRow"] ?? 0) * (results["rows"] ?? 0); results["totalBricks"] = Number.isFinite(v) ? v : 0; } catch { results["totalBricks"] = 0; }
  try { const v = (results["totalBricks"] ?? 0) * (input.brickLength / 1000 * input.brickWidth / 1000 * input.brickHeight / 1000); results["solidVolume"] = Number.isFinite(v) ? v : 0; } catch { results["solidVolume"] = 0; }
  try { const v = input.wallLength * input.wallHeight * (input.brickWidth / 1000); results["wallVolume"] = Number.isFinite(v) ? v : 0; } catch { results["wallVolume"] = 0; }
  try { const v = (results["wallVolume"] ?? 0) - (results["solidVolume"] ?? 0); results["mortarVolumeBase"] = Number.isFinite(v) ? v : 0; } catch { results["mortarVolumeBase"] = 0; }
  try { const v = (results["mortarVolumeBase"] ?? 0) * input.wasteFactor / 100; results["waste"] = Number.isFinite(v) ? v : 0; } catch { results["waste"] = 0; }
  try { const v = (results["mortarVolumeBase"] ?? 0) + (results["waste"] ?? 0); results["totalMortar"] = Number.isFinite(v) ? v : 0; } catch { results["totalMortar"] = 0; }
  return results;
}


export function calculateMortar_calculator(input: Mortar_calculatorInput): Mortar_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalMortar"] ?? 0;
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


export interface Mortar_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

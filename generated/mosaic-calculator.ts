// Auto-generated from mosaic-calculator-schema.json
import * as z from 'zod';

export interface Mosaic_calculatorInput {
  area: number;
  tileLength: number;
  tileWidth: number;
  wasteFactor: number;
  costPerTile: number;
}

export const Mosaic_calculatorInputSchema = z.object({
  area: z.number().default(1),
  tileLength: z.number().default(2),
  tileWidth: z.number().default(2),
  wasteFactor: z.number().default(10),
  costPerTile: z.number().default(0.1),
});

function evaluateAllFormulas(input: Mosaic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area / ((input.tileLength / 100) * (input.tileWidth / 100)); results["totalTilesWithoutWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalTilesWithoutWaste"] = 0; }
  try { const v = (results["totalTilesWithoutWaste"] ?? 0) * (1 + input.wasteFactor / 100); results["totalTilesWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalTilesWithWaste"] = 0; }
  try { const v = (results["totalTilesWithWaste"] ?? 0) - (results["totalTilesWithoutWaste"] ?? 0); results["wasteTiles"] = Number.isFinite(v) ? v : 0; } catch { results["wasteTiles"] = 0; }
  try { const v = (results["totalTilesWithWaste"] ?? 0) * input.costPerTile; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateMosaic_calculator(input: Mosaic_calculatorInput): Mosaic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTilesWithWaste"] ?? 0;
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


export interface Mosaic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

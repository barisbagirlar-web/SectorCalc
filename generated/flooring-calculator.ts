// Auto-generated from flooring-calculator-schema.json
import * as z from 'zod';

export interface Flooring_calculatorInput {
  roomLength: number;
  roomWidth: number;
  tileLength: number;
  tileWidth: number;
  pricePerTile: number;
  wasteFactor: number;
}

export const Flooring_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  tileLength: z.number().default(0.3),
  tileWidth: z.number().default(0.3),
  pricePerTile: z.number().default(15),
  wasteFactor: z.number().default(10),
});

function evaluateAllFormulas(input: Flooring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roomLength * input.roomWidth; results["roomArea"] = Number.isFinite(v) ? v : 0; } catch { results["roomArea"] = 0; }
  try { const v = input.tileLength * input.tileWidth; results["tileArea"] = Number.isFinite(v) ? v : 0; } catch { results["tileArea"] = 0; }
  try { const v = (results["roomArea"] ?? 0) / (results["tileArea"] ?? 0); results["tilesWithoutWaste"] = Number.isFinite(v) ? v : 0; } catch { results["tilesWithoutWaste"] = 0; }
  try { const v = (results["tilesWithoutWaste"] ?? 0) * (1 + input.wasteFactor / 100); results["tilesWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["tilesWithWaste"] = 0; }
  try { const v = Math.ceil((results["tilesWithWaste"] ?? 0)); results["numberOfTiles"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfTiles"] = 0; }
  try { const v = (results["numberOfTiles"] ?? 0) * input.pricePerTile; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["numberOfTiles"] ?? 0) - (results["tilesWithoutWaste"] ?? 0); results["wasteTiles"] = Number.isFinite(v) ? v : 0; } catch { results["wasteTiles"] = 0; }
  return results;
}


export function calculateFlooring_calculator(input: Flooring_calculatorInput): Flooring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["numberOfTiles"] ?? 0;
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


export interface Flooring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

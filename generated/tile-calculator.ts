// Auto-generated from tile-calculator-schema.json
import * as z from 'zod';

export interface Tile_calculatorInput {
  length: number;
  width: number;
  tileLength: number;
  tileWidth: number;
  wasteFactor: number;
  pricePerTile: number;
}

export const Tile_calculatorInputSchema = z.object({
  length: z.number().default(5),
  width: z.number().default(4),
  tileLength: z.number().default(30),
  tileWidth: z.number().default(30),
  wasteFactor: z.number().default(10),
  pricePerTile: z.number().default(5),
});

function evaluateAllFormulas(input: Tile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = (input.tileLength / 100) * (input.tileWidth / 100); results["tileArea"] = Number.isFinite(v) ? v : 0; } catch { results["tileArea"] = 0; }
  try { const v = Math.ceil((results["area"] ?? 0) / (results["tileArea"] ?? 0)); results["tilesNeat"] = Number.isFinite(v) ? v : 0; } catch { results["tilesNeat"] = 0; }
  try { const v = Math.ceil((results["tilesNeat"] ?? 0) * (1 + input.wasteFactor / 100)); results["tilesWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["tilesWithWaste"] = 0; }
  try { const v = (results["tilesWithWaste"] ?? 0) * input.pricePerTile; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateTile_calculator(input: Tile_calculatorInput): Tile_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tilesWithWaste"] ?? 0;
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


export interface Tile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

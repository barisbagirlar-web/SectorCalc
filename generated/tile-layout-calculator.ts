// Auto-generated from tile-layout-calculator-schema.json
import * as z from 'zod';

export interface Tile_layout_calculatorInput {
  roomLength: number;
  roomWidth: number;
  tileLength: number;
  tileWidth: number;
  groutWidth: number;
  wastePercent: number;
}

export const Tile_layout_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  tileLength: z.number().default(30),
  tileWidth: z.number().default(20),
  groutWidth: z.number().default(3),
  wastePercent: z.number().default(10),
});

function evaluateAllFormulas(input: Tile_layout_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(input.roomLength * 1000 / (input.tileLength * 10 + input.groutWidth)); results["horizontalTiles"] = Number.isFinite(v) ? v : 0; } catch { results["horizontalTiles"] = 0; }
  try { const v = Math.ceil(input.roomWidth * 1000 / (input.tileWidth * 10 + input.groutWidth)); results["verticalTiles"] = Number.isFinite(v) ? v : 0; } catch { results["verticalTiles"] = 0; }
  try { const v = Math.ceil(input.roomLength * 1000 / (input.tileLength * 10 + input.groutWidth)) * Math.ceil(input.roomWidth * 1000 / (input.tileWidth * 10 + input.groutWidth)); results["tilesWithoutWaste"] = Number.isFinite(v) ? v : 0; } catch { results["tilesWithoutWaste"] = 0; }
  try { const v = Math.ceil((Math.ceil(input.roomLength * 1000 / (input.tileLength * 10 + input.groutWidth)) * Math.ceil(input.roomWidth * 1000 / (input.tileWidth * 10 + input.groutWidth))) * (1 + input.wastePercent / 100)); results["tilesWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["tilesWithWaste"] = 0; }
  try { const v = Math.ceil((Math.ceil(input.roomLength * 1000 / (input.tileLength * 10 + input.groutWidth)) * Math.ceil(input.roomWidth * 1000 / (input.tileWidth * 10 + input.groutWidth))) * (1 + input.wastePercent / 100)) - (Math.ceil(input.roomLength * 1000 / (input.tileLength * 10 + input.groutWidth)) * Math.ceil(input.roomWidth * 1000 / (input.tileWidth * 10 + input.groutWidth))); results["wasteTiles"] = Number.isFinite(v) ? v : 0; } catch { results["wasteTiles"] = 0; }
  return results;
}


export function calculateTile_layout_calculator(input: Tile_layout_calculatorInput): Tile_layout_calculatorOutput {
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


export interface Tile_layout_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

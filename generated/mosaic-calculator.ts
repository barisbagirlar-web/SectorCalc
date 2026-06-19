// Auto-generated from mosaic-calculator-schema.json
import * as z from 'zod';

export interface Mosaic_calculatorInput {
  area: number;
  tileLength: number;
  tileWidth: number;
  wasteFactor: number;
  costPerTile: number;
  dataConfidence?: number;
}

export const Mosaic_calculatorInputSchema = z.object({
  area: z.number().default(1),
  tileLength: z.number().default(2),
  tileWidth: z.number().default(2),
  wasteFactor: z.number().default(10),
  costPerTile: z.number().default(0.1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mosaic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area / ((input.tileLength / 100) * (input.tileWidth / 100)); results["totalTilesWithoutWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTilesWithoutWaste"] = 0; }
  try { const v = (asFormulaNumber(results["totalTilesWithoutWaste"])) * (1 + input.wasteFactor / 100); results["totalTilesWithWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTilesWithWaste"] = 0; }
  try { const v = (asFormulaNumber(results["totalTilesWithWaste"])) - (asFormulaNumber(results["totalTilesWithoutWaste"])); results["wasteTiles"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteTiles"] = 0; }
  try { const v = (asFormulaNumber(results["totalTilesWithWaste"])) * input.costPerTile; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMosaic_calculator(input: Mosaic_calculatorInput): Mosaic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTilesWithWaste"]);
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


export interface Mosaic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from flooring-calculator-schema.json
import * as z from 'zod';

export interface Flooring_calculatorInput {
  roomLength: number;
  roomWidth: number;
  tileLength: number;
  tileWidth: number;
  pricePerTile: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Flooring_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  tileLength: z.number().default(0.3),
  tileWidth: z.number().default(0.3),
  pricePerTile: z.number().default(15),
  wasteFactor: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Flooring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roomLength * input.roomWidth; results["roomArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roomArea"] = 0; }
  try { const v = input.tileLength * input.tileWidth; results["tileArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tileArea"] = 0; }
  try { const v = (asFormulaNumber(results["roomArea"])) / (asFormulaNumber(results["tileArea"])); results["tilesWithoutWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tilesWithoutWaste"] = 0; }
  try { const v = (asFormulaNumber(results["tilesWithoutWaste"])) * (1 + input.wasteFactor / 100); results["tilesWithWaste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tilesWithWaste"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFlooring_calculator(input: Flooring_calculatorInput): Flooring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["tilesWithWaste"]));
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


export interface Flooring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

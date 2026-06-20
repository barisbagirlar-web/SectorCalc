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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Flooring_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roomLength * input.roomWidth; results["roomArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roomArea"] = Number.NaN; }
  try { const v = input.tileLength * input.tileWidth; results["tileArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tileArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["roomArea"])) / (toNumericFormulaValue(results["tileArea"])); results["tilesWithoutWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tilesWithoutWaste"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["tilesWithoutWaste"])) * (1 + input.wasteFactor / 100); results["tilesWithWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tilesWithWaste"] = Number.NaN; }
  return results;
}


export function calculateFlooring_calculator(input: Flooring_calculatorInput): Flooring_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tilesWithWaste"]);
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


export interface Flooring_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

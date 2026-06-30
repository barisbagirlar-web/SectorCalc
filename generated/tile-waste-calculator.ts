// Auto-generated from tile-waste-calculator-schema.json
import * as z from 'zod';

export interface Tile_waste_calculatorInput {
  dataConfidence?: number;
  alanEn: number;
  fayansEn: number;
}

export const Tile_waste_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alanEn: z.number().min(0).default(4.2),
  fayansEn: z.number().min(0).default(0.6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tile_waste_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["alanEn"] % input["fayansEn"]) / Math.max(0.0001, input["fayansEn"]) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateTile_waste_calculator(input: Tile_waste_calculatorInput): Tile_waste_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Tile_waste_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Tile_waste_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;

// Auto-generated from grass-seed-calculator-schema.json
import * as z from 'zod';

export interface Grass_seed_calculatorInput {
  length: number;
  width: number;
  seedingRate: number;
  wasteFactor: number;
  germinationRate: number;
  seedPurity: number;
  overseedingFactor: number;
  dataConfidence?: number;
}

export const Grass_seed_calculatorInputSchema = z.object({
  length: z.number().default(10),
  width: z.number().default(5),
  seedingRate: z.number().default(30),
  wasteFactor: z.number().default(10),
  germinationRate: z.number().default(85),
  seedPurity: z.number().default(95),
  overseedingFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Grass_seed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["area"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = (asFormulaNumber(results["area"])) * input.seedingRate; results["baseSeedGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseSeedGrams"] = 0; }
  try { const v = (asFormulaNumber(results["baseSeedGrams"])) / (input.germinationRate / 100) / (input.seedPurity / 100) * (1 + input.wasteFactor / 100) * input.overseedingFactor; results["adjustedSeedGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedSeedGrams"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedSeedGrams"])) / 1000; results["totalSeedKg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSeedKg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGrass_seed_calculator(input: Grass_seed_calculatorInput): Grass_seed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalSeedKg"]);
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


export interface Grass_seed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

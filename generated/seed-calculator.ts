// Auto-generated from seed-calculator-schema.json
import * as z from 'zod';

export interface Seed_calculatorInput {
  area: number;
  plantDensity: number;
  germinationRate: number;
  seedPurity: number;
  tkw: number;
  dataConfidence?: number;
}

export const Seed_calculatorInputSchema = z.object({
  area: z.number().default(1),
  plantDensity: z.number().default(200),
  germinationRate: z.number().default(90),
  seedPurity: z.number().default(98),
  tkw: z.number().default(35),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Seed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.area * 10000) * input.plantDensity / ((input.germinationRate / 100) * (input.seedPurity / 100))) * (input.tkw / 1000000); results["totalSeedWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSeedWeight"] = 0; }
  try { const v = (input.plantDensity / ((input.germinationRate / 100) * (input.seedPurity / 100))) * input.tkw / 100; results["seedRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["seedRate"] = 0; }
  try { const v = input.area * 10000 * input.plantDensity; results["totalPlantsExpected"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPlantsExpected"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSeed_calculator(input: Seed_calculatorInput): Seed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalSeedWeight"]));
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


export interface Seed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

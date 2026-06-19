// Auto-generated from lawn-fertilizer-calculator-schema.json
import * as z from 'zod';

export interface Lawn_fertilizer_calculatorInput {
  lawnArea: number;
  nitrogenPercent: number;
  nitrogenRatePerSqM: number;
  applicationsPerYear: number;
  bagWeight: number;
  bagCost: number;
  dataConfidence?: number;
}

export const Lawn_fertilizer_calculatorInputSchema = z.object({
  lawnArea: z.number().default(100),
  nitrogenPercent: z.number().default(20),
  nitrogenRatePerSqM: z.number().default(25),
  applicationsPerYear: z.number().default(1),
  bagWeight: z.number().default(10),
  bagCost: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lawn_fertilizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lawnArea * input.nitrogenRatePerSqM * 0.1 / input.nitrogenPercent * input.applicationsPerYear; results["totalFertilizerWeight_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFertilizerWeight_kg"] = 0; }
  try { const v = input.lawnArea * input.nitrogenRatePerSqM * 0.1 / input.nitrogenPercent * input.applicationsPerYear; results["totalFertilizerWeight_kg_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFertilizerWeight_kg_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLawn_fertilizer_calculator(input: Lawn_fertilizer_calculatorInput): Lawn_fertilizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalFertilizerWeight_kg_aux"]);
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


export interface Lawn_fertilizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

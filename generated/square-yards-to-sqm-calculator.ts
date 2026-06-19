// Auto-generated from square-yards-to-sqm-calculator-schema.json
import * as z from 'zod';

export interface Square_yards_to_sqm_calculatorInput {
  lengthYards: number;
  widthYards: number;
  precision: number;
  conversionFactor: number;
  dataConfidence?: number;
}

export const Square_yards_to_sqm_calculatorInputSchema = z.object({
  lengthYards: z.number().default(1),
  widthYards: z.number().default(1),
  precision: z.number().default(2),
  conversionFactor: z.number().default(0.83612736),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Square_yards_to_sqm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.lengthYards * input.widthYards) * input.conversionFactor; results["areaSqm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["areaSqm"] = 0; }
  try { const v = input.lengthYards * input.widthYards; results["areaSqYards"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["areaSqYards"] = 0; }
  try { const v = input.conversionFactor; results["conversionFactorUsed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conversionFactorUsed"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSquare_yards_to_sqm_calculator(input: Square_yards_to_sqm_calculatorInput): Square_yards_to_sqm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["areaSqm"]));
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


export interface Square_yards_to_sqm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from square-yards-to-sqm-calculator-schema.json
import * as z from 'zod';

export interface Square_yards_to_sqm_calculatorInput {
  lengthYards: number;
  widthYards: number;
  precision: number;
  conversionFactor: number;
}

export const Square_yards_to_sqm_calculatorInputSchema = z.object({
  lengthYards: z.number().default(1),
  widthYards: z.number().default(1),
  precision: z.number().default(2),
  conversionFactor: z.number().default(0.83612736),
});

function evaluateAllFormulas(input: Square_yards_to_sqm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.lengthYards * input.widthYards) * input.conversionFactor; results["areaSqm"] = Number.isFinite(v) ? v : 0; } catch { results["areaSqm"] = 0; }
  try { const v = input.lengthYards * input.widthYards; results["areaSqYards"] = Number.isFinite(v) ? v : 0; } catch { results["areaSqYards"] = 0; }
  try { const v = input.conversionFactor; results["conversionFactorUsed"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactorUsed"] = 0; }
  return results;
}


export function calculateSquare_yards_to_sqm_calculator(input: Square_yards_to_sqm_calculatorInput): Square_yards_to_sqm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["areaSqm"] ?? 0;
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


export interface Square_yards_to_sqm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

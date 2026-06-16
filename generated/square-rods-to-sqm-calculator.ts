// Auto-generated from square-rods-to-sqm-calculator-schema.json
import * as z from 'zod';

export interface Square_rods_to_sqm_calculatorInput {
  squareRods: number;
  conversionFactor: number;
  roundingDecimals: number;
  areaAdjustment: number;
}

export const Square_rods_to_sqm_calculatorInputSchema = z.object({
  squareRods: z.number().default(1),
  conversionFactor: z.number().default(25.29285264),
  roundingDecimals: z.number().default(2),
  areaAdjustment: z.number().default(0),
});

function evaluateAllFormulas(input: Square_rods_to_sqm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.squareRods * input.conversionFactor; results["baseSqm"] = Number.isFinite(v) ? v : 0; } catch { results["baseSqm"] = 0; }
  try { const v = (results["baseSqm"] ?? 0) * (1 + input.areaAdjustment / 100); results["adjustedSqm"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedSqm"] = 0; }
  try { const v = Math.round((results["adjustedSqm"] ?? 0) * Math.pow(10, input.roundingDecimals)) / Math.pow(10, input.roundingDecimals); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateSquare_rods_to_sqm_calculator(input: Square_rods_to_sqm_calculatorInput): Square_rods_to_sqm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Square_rods_to_sqm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

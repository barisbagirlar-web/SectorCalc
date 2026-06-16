// Auto-generated from bai-calculator-schema.json
import * as z from 'zod';

export interface Bai_calculatorInput {
  landArea: number;
  totalFloorArea: number;
  builtAreaFootprint: number;
  maxFar: number;
}

export const Bai_calculatorInputSchema = z.object({
  landArea: z.number().default(1000),
  totalFloorArea: z.number().default(2000),
  builtAreaFootprint: z.number().default(500),
  maxFar: z.number().default(2),
});

function evaluateAllFormulas(input: Bai_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalFloorArea / input.landArea; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  return results;
}


export function calculateBai_calculator(input: Bai_calculatorInput): Bai_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Building"] ?? 0;
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


export interface Bai_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

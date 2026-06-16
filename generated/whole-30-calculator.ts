// Auto-generated from whole-30-calculator-schema.json
import * as z from 'zod';

export interface Whole_30_calculatorInput {
  sugar: number;
  alcohol: number;
  grain: number;
  legume: number;
  dairy: number;
}

export const Whole_30_calculatorInputSchema = z.object({
  sugar: z.number().default(0),
  alcohol: z.number().default(0),
  grain: z.number().default(0),
  legume: z.number().default(0),
  dairy: z.number().default(0),
});

function evaluateAllFormulas(input: Whole_30_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sugar <= 0 && input.alcohol <= 0 && input.grain === 0 && input.legume === 0 && input.dairy === 0) ? 1 : 0; results["isCompliant"] = Number.isFinite(v) ? v : 0; } catch { results["isCompliant"] = 0; }
  try { const v = (input.sugar > 0 ? 1 : 0) + (input.alcohol > 0 ? 1 : 0) + input.grain + input.legume + input.dairy; results["violationCount"] = Number.isFinite(v) ? v : 0; } catch { results["violationCount"] = 0; }
  return results;
}


export function calculateWhole_30_calculator(input: Whole_30_calculatorInput): Whole_30_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["isCompliant"] ?? 0;
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


export interface Whole_30_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

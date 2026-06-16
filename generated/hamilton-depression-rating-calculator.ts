// Auto-generated from hamilton-depression-rating-calculator-schema.json
import * as z from 'zod';

export interface Hamilton_depression_rating_calculatorInput {
  depth: number;
  area: number;
  count: number;
  sharpness: number;
  materialFactor: number;
}

export const Hamilton_depression_rating_calculatorInputSchema = z.object({
  depth: z.number().default(0.1),
  area: z.number().default(10),
  count: z.number().default(1),
  sharpness: z.number().default(1),
  materialFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Hamilton_depression_rating_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.depth * input.area * (1 + (input.count - 1) * 0.5) * input.sharpness / input.materialFactor; results["totalScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  try { const v = Math.min((results["totalScore"] ?? 0) / 1000, 10); results["severityIndex"] = Number.isFinite(v) ? v : 0; } catch { results["severityIndex"] = 0; }
  try { const v = input.depth * input.area * input.sharpness / input.materialFactor; results["depthEffect"] = Number.isFinite(v) ? v : 0; } catch { results["depthEffect"] = 0; }
  try { const v = 1 + (input.count - 1) * 0.5; results["countMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["countMultiplier"] = 0; }
  return results;
}


export function calculateHamilton_depression_rating_calculator(input: Hamilton_depression_rating_calculatorInput): Hamilton_depression_rating_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["severityIndex"] ?? 0;
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


export interface Hamilton_depression_rating_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

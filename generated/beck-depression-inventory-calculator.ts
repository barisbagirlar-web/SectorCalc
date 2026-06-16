// Auto-generated from beck-depression-inventory-calculator-schema.json
import * as z from 'zod';

export interface Beck_depression_inventory_calculatorInput {
  cognitive_affective: number;
  somatic: number;
  performance: number;
  guilt: number;
}

export const Beck_depression_inventory_calculatorInputSchema = z.object({
  cognitive_affective: z.number().default(0),
  somatic: z.number().default(0),
  performance: z.number().default(0),
  guilt: z.number().default(0),
});

function evaluateAllFormulas(input: Beck_depression_inventory_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cognitive_affective + input.somatic + input.performance + input.guilt; results["totalScore"] = Number.isFinite(v) ? v : 0; } catch { results["totalScore"] = 0; }
  try { const v = 1 / (1 + Math.exp(-((results["totalScore"] ?? 0) - 14.5) / 5)); results["severityIndex"] = Number.isFinite(v) ? v : 0; } catch { results["severityIndex"] = 0; }
  try { const v = ((results["totalScore"] ?? 0) - 14.5) / Math.sqrt(21); results["zScore"] = Number.isFinite(v) ? v : 0; } catch { results["zScore"] = 0; }
  return results;
}


export function calculateBeck_depression_inventory_calculator(input: Beck_depression_inventory_calculatorInput): Beck_depression_inventory_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalScore"] ?? 0;
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


export interface Beck_depression_inventory_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

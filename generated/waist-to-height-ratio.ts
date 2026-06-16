// Auto-generated from waist-to-height-ratio-schema.json
import * as z from 'zod';

export interface Waist_to_height_ratioInput {
  waist: number;
  height: number;
  weight: number;
  age: number;
  gender: number;
}

export const Waist_to_height_ratioInputSchema = z.object({
  waist: z.number().default(80),
  height: z.number().default(170),
  weight: z.number().default(70),
  age: z.number().default(30),
  gender: z.number().default(0),
});

function evaluateAllFormulas(input: Waist_to_height_ratioInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.waist / input.height; results["waistToHeightRatio"] = Number.isFinite(v) ? v : 0; } catch { results["waistToHeightRatio"] = 0; }
  try { const v = input.weight / ((input.height / 100) ** 2); results["bmi"] = Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  return results;
}


export function calculateWaist_to_height_ratio(input: Waist_to_height_ratioInput): Waist_to_height_ratioOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["waistToHeightRatio"] ?? 0;
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


export interface Waist_to_height_ratioOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

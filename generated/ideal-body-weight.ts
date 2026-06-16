// Auto-generated from ideal-body-weight-schema.json
import * as z from 'zod';

export interface Ideal_body_weightInput {
  gender_code: number;
  height_cm: number;
}

export const Ideal_body_weightInputSchema = z.object({
  gender_code: z.number().default(1),
  height_cm: z.number().default(170),
});

function evaluateAllFormulas(input: Ideal_body_weightInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.gender_code === 1 ? 50.0 + 0.9 * (input.height_cm - 150) : 45.5 + 0.9 * (input.height_cm - 150); results["ibw_kg"] = Number.isFinite(v) ? v : 0; } catch { results["ibw_kg"] = 0; }
  try { const v = (results["ibw_kg"] ?? 0) * 2.20462; results["ibw_lbs"] = Number.isFinite(v) ? v : 0; } catch { results["ibw_lbs"] = 0; }
  return results;
}


export function calculateIdeal_body_weight(input: Ideal_body_weightInput): Ideal_body_weightOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ibw_kg"] ?? 0;
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


export interface Ideal_body_weightOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

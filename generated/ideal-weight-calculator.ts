// Auto-generated from ideal-weight-calculator-schema.json
import * as z from 'zod';

export interface Ideal_weight_calculatorInput {
  height_ft: number;
  height_in: number;
  gender: number;
  body_frame: number;
}

export const Ideal_weight_calculatorInputSchema = z.object({
  height_ft: z.number().default(5),
  height_in: z.number().default(0),
  gender: z.number().default(1),
  body_frame: z.number().default(2),
});

function evaluateAllFormulas(input: Ideal_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { var total_in = input.height_ft * 12 + input.height_in; var base = input.gender == 1 ? 50 + 2.3*(total_in - 60) : 45.5 + 2.3*(total_in - 60); var factor = input.body_frame == 1 ? 0.9 : (input.body_frame == 2 ? 1.0 : 1.1); return base * factor; })(); results["ideal_weight_kg"] = Number.isFinite(v) ? v : 0; } catch { results["ideal_weight_kg"] = 0; }
  try { const v = (() => { var total_in = input.height_ft * 12 + input.height_in; var base = input.gender == 1 ? 50 + 2.3*(total_in - 60) : 45.5 + 2.3*(total_in - 60); var factor = input.body_frame == 1 ? 0.9 : (input.body_frame == 2 ? 1.0 : 1.1); var kg = base * factor; return kg * 2.20462; })(); results["ideal_weight_lbs"] = Number.isFinite(v) ? v : 0; } catch { results["ideal_weight_lbs"] = 0; }
  try { const v = (() => { var total_in = input.height_ft * 12 + input.height_in; var base = input.gender == 1 ? 50 + 2.3*(total_in - 60) : 45.5 + 2.3*(total_in - 60); var factor = input.body_frame == 1 ? 0.9 : (input.body_frame == 2 ? 1.0 : 1.1); var kg = base * factor; var m = total_in * 0.0254; return kg / (m * m); })(); results["bmi"] = Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  return results;
}


export function calculateIdeal_weight_calculator(input: Ideal_weight_calculatorInput): Ideal_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ideal_weight_kg"] ?? 0;
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


export interface Ideal_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

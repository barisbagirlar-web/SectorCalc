// Auto-generated from ideal-body-weight-calculator-schema.json
import * as z from 'zod';

export interface Ideal_body_weight_calculatorInput {
  heightFeet: number;
  heightInches: number;
  genderCode: number;
  frameFactor: number;
}

export const Ideal_body_weight_calculatorInputSchema = z.object({
  heightFeet: z.number().default(5),
  heightInches: z.number().default(0),
  genderCode: z.number().default(1),
  frameFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Ideal_body_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heightFeet * 12 + input.heightInches; results["totalInches"] = Number.isFinite(v) ? v : 0; } catch { results["totalInches"] = 0; }
  try { const v = 50 + 2.3 * ((results["totalInches"] ?? 0) - 60); results["ibwKgMale"] = Number.isFinite(v) ? v : 0; } catch { results["ibwKgMale"] = 0; }
  try { const v = 45.5 + 2.3 * ((results["totalInches"] ?? 0) - 60); results["ibwKgFemale"] = Number.isFinite(v) ? v : 0; } catch { results["ibwKgFemale"] = 0; }
  try { const v = input.genderCode == 1 ? (results["ibwKgMale"] ?? 0) : (results["ibwKgFemale"] ?? 0); results["ibwKg"] = Number.isFinite(v) ? v : 0; } catch { results["ibwKg"] = 0; }
  try { const v = (results["ibwKg"] ?? 0) * input.frameFactor; results["ibwKgAdjusted"] = Number.isFinite(v) ? v : 0; } catch { results["ibwKgAdjusted"] = 0; }
  try { const v = (results["totalInches"] ?? 0) * 2.54; results["heightCm"] = Number.isFinite(v) ? v : 0; } catch { results["heightCm"] = 0; }
  return results;
}


export function calculateIdeal_body_weight_calculator(input: Ideal_body_weight_calculatorInput): Ideal_body_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ibwKgAdjusted"] ?? 0;
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


export interface Ideal_body_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

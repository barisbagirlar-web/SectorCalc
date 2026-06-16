// Auto-generated from waist-to-hip-ratio-calculator-schema.json
import * as z from 'zod';

export interface Waist_to_hip_ratio_calculatorInput {
  waist: number;
  hip: number;
  height: number;
  weight: number;
  gender: number;
}

export const Waist_to_hip_ratio_calculatorInputSchema = z.object({
  waist: z.number().default(0),
  hip: z.number().default(0),
  height: z.number().default(0),
  weight: z.number().default(0),
  gender: z.number().default(0),
});

function evaluateAllFormulas(input: Waist_to_hip_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.waist / input.hip; results["waistToHipRatio"] = Number.isFinite(v) ? v : 0; } catch { results["waistToHipRatio"] = 0; }
  try { const v = input.waist / input.height; results["waistToHeightRatio"] = Number.isFinite(v) ? v : 0; } catch { results["waistToHeightRatio"] = 0; }
  try { const v = input.weight / ((input.height / 100) ** 2); results["bmi"] = Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  try { const v = input.gender === 0 ? ( (input.waist/input.hip) > 0.85 ? 1 : 0 ) : ( (input.waist/input.hip) > 0.90 ? 1 : 0 ); results["highRiskWHR"] = Number.isFinite(v) ? v : 0; } catch { results["highRiskWHR"] = 0; }
  return results;
}


export function calculateWaist_to_hip_ratio_calculator(input: Waist_to_hip_ratio_calculatorInput): Waist_to_hip_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["waistToHipRatio"] ?? 0;
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


export interface Waist_to_hip_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

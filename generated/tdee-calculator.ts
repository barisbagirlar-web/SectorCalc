// Auto-generated from tdee-calculator-schema.json
import * as z from 'zod';

export interface Tdee_calculatorInput {
  age: number;
  gender: string;
  weight: number;
  height: number;
  activityLevel: string;
  bodyFatPercent: number;
  isAthlete: boolean;
}

export const Tdee_calculatorInputSchema = z.object({
  age: z.number().min(10).max(120).default(30),
  gender: z.enum(['male', 'female']).default('male'),
  weight: z.number().min(20).max(300).default(70),
  height: z.number().min(50).max(250).default(170),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'veryActive']).default('moderate'),
  bodyFatPercent: z.number().min(3).max(60).default(20),
  isAthlete: z.boolean().default(false),
});

function evaluateAllFormulas(input: Tdee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["bmr_mifflin"] = 0;
  results["bmr_harris"] = 0;
  try { results["bmr_katch"] = 370 + (21.6 * (input.weight * (1 - input.bodyFatPercent / 100))); } catch { results["bmr_katch"] = 0; }
  results["bmr_ensemble"] = 0;
  results["activity_multiplier"] = 0;
  try { results["tdee_primary"] = (results["bmr_ensemble"] ?? 0) * (results["activity_multiplier"] ?? 0); } catch { results["tdee_primary"] = 0; }
  try { results["tdee_adjusted"] = (results["tdee_primary"] ?? 0) * dataConfidenceAdjusted; } catch { results["tdee_adjusted"] = 0; }
  return results;
}


export function calculateTdee_calculator(input: Tdee_calculatorInput): Tdee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tdee"] ?? 0;
  const breakdown = {
    bmr: values["bmr"] ?? 0,
    activityBurn: values["activityBurn"] ?? 0,
    thermicEffect: values["thermicEffect"] ?? 0,
    bmrMethod: values["bmrMethod"] ?? 0,
    activityMultiplier: values["activityMultiplier"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Activity Underreporting","Body Fat Estimation Error","Age-Related Metabolic Decline","TEF Variability"];
  const suggestedActions: string[] = ["Track Weekly Weight Trends","Use Objective PAL Measurement","Reassess Body Fat via DEXA or Calipers","Adjust for Athlete Recovery Days"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","BMR breakdown chart","Activity factor optimization report"],
  };
}


export interface Tdee_calculatorOutput {
  totalWasteCost: number;
  breakdown: { bmr: number; activityBurn: number; thermicEffect: number; bmrMethod: number; activityMultiplier: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

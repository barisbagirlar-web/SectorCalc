// Auto-generated from body-fat-calculator-schema.json
import * as z from 'zod';

export interface Body_fat_calculatorInput {
  gender: string;
  age: number;
  height: number;
  weight: number;
  neckCircumference: number;
  waistCircumference: number;
  hipCircumference: number;
  activityLevel: string;
}

export const Body_fat_calculatorInputSchema = z.object({
  gender: z.enum(['male', 'female']).default('male'),
  age: z.number().min(18).max(100).default(30),
  height: z.number().min(100).max(250).default(170),
  weight: z.number().min(30).max(300).default(75),
  neckCircumference: z.number().min(25).max(60).default(38),
  waistCircumference: z.number().min(50).max(150).default(85),
  hipCircumference: z.number().min(50).max(160).default(95),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very active']).default('moderate'),
});

function evaluateAllFormulas(input: Body_fat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["bmi"] = input.weight / ((input.height / 100) ^ 2); } catch { results["bmi"] = 0; }
  results["bodyDensity"] = 0;
  try { results["bodyFatPercentage"] = (495 / (results["bodyDensity"] ?? 0)) - 450; } catch { results["bodyFatPercentage"] = 0; }
  try { results["fatMass"] = input.weight * ((results["bodyFatPercentage"] ?? 0) / 100); } catch { results["fatMass"] = 0; }
  try { results["leanMass"] = input.weight - (results["fatMass"] ?? 0); } catch { results["leanMass"] = 0; }
  try { results["waistHipRatio"] = input.waistCircumference / input.hipCircumference; } catch { results["waistHipRatio"] = 0; }
  try { results["adjustedBodyFat"] = (results["bodyFatPercentage"] ?? 0) * (1 - 0.05 * (input.activityLevel == 'sedentary' ? 1 : input.activityLevel == 'light' ? 0.8 : input.activityLevel == 'moderate' ? 0.6 : input.activityLevel == 'active' ? 0.4 : 0.2)); } catch { results["adjustedBodyFat"] = 0; }
  return results;
}


export function calculateBody_fat_calculator(input: Body_fat_calculatorInput): Body_fat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bodyFatPercentage"] ?? 0;
  const breakdown = {
    bmi: values["bmi"] ?? 0,
    bodyDensity: values["bodyDensity"] ?? 0,
    fatMass: values["fatMass"] ?? 0,
    leanMass: values["leanMass"] ?? 0,
    waistHipRatio: values["waistHipRatio"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Neck circumference measurement error > 0.5 cm can bias body fat by ±2% (Six Sigma MSA).","Hydration affects body density; not accounted in Navy method (Lean waste: variation).","Self-reported activity level may overestimate energy expenditure (ISO 8996).","Siri equation assumes constant density of fat-free mass; bias increases with age (ISO 20685)."];
  const suggestedActions: string[] = ["If body fat > 25% (male) or > 32% (female): implement Lean Kaizen health improvement plan with diet and exercise.","If waist-hip ratio > 0.9 (male) or > 0.85 (female): schedule ergonomic workstation assessment per WERC guidelines.","If BMI > 30: refer to occupational health for metabolic screening (ISO 45001).","Repeat measurements monthly to reduce random error and track trend (SPC control chart)."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-user benchmarking","Custom report templates"],
  };
}


export interface Body_fat_calculatorOutput {
  totalWasteCost: number;
  breakdown: { bmi: number; bodyDensity: number; fatMass: number; leanMass: number; waistHipRatio: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from bmi-calculator-schema.json
import * as z from 'zod';

export interface Bmi_calculatorInput {
  weight_kg: number;
  height_cm: number;
  age_years: number;
  gender: string;
  activity_level: string;
  waist_circumference_cm: number;
}

export const Bmi_calculatorInputSchema = z.object({
  weight_kg: z.number().min(20).max(300).default(70),
  height_cm: z.number().min(50).max(250).default(170),
  age_years: z.number().min(18).max(120).default(30),
  gender: z.enum(['male', 'female']).default('male'),
  activity_level: z.enum(['sedentary', 'light', 'moderate', 'active', 'very active']).default('moderate'),
  waist_circumference_cm: z.number().min(40).max(200).default(80),
});

function evaluateAllFormulas(input: Bmi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["bmi"] = input.weight_kg / ((input.height_cm / 100) ** 2); } catch { results["bmi"] = 0; }
  try { results["lean_body_mass"] = input.gender == 'male' ? (0.407 * input.weight_kg + 0.267 * input.height_cm - 19.2) : (0.252 * input.weight_kg + 0.473 * input.height_cm - 48.3); } catch { results["lean_body_mass"] = 0; }
  try { results["body_fat_percentage"] = (1.20 * (results["bmi"] ?? 0)) + (0.23 * input.age_years) - (10.8 * (input.gender == 'male' ? 1 : 0)) - 5.4; } catch { results["body_fat_percentage"] = 0; }
  try { results["basal_metabolic_rate"] = input.gender == 'male' ? (10 * input.weight_kg + 6.25 * input.height_cm - 5 * input.age_years + 5) : (10 * input.weight_kg + 6.25 * input.height_cm - 5 * input.age_years - 161); } catch { results["basal_metabolic_rate"] = 0; }
  try { results["total_energy_expenditure"] = (results["basal_metabolic_rate"] ?? 0) * (input.activity_level == 'sedentary' ? 1.2 : input.activity_level == 'light' ? 1.375 : input.activity_level == 'moderate' ? 1.55 : input.activity_level == 'active' ? 1.725 : 1.9); } catch { results["total_energy_expenditure"] = 0; }
  try { results["waist_to_height_ratio"] = input.waist_circumference_cm / input.height_cm; } catch { results["waist_to_height_ratio"] = 0; }
  try { results["health_risk_score"] = ((results["bmi"] ?? 0) >= 30 ? 3 : (results["bmi"] ?? 0) >= 25 ? 2 : (results["bmi"] ?? 0) >= 18.5 ? 1 : 3) + ((results["waist_to_height_ratio"] ?? 0) > 0.5 ? 2 : 1) + (input.age_years > 50 ? 1 : 0); } catch { results["health_risk_score"] = 0; }
  return results;
}


export function calculateBmi_calculator(input: Bmi_calculatorInput): Bmi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bmi"] ?? 0;
  const breakdown = {
    bmi: values["bmi"] ?? 0,
    lean_body_mass: values["lean_body_mass"] ?? 0,
    body_fat_percentage: values["body_fat_percentage"] ?? 0,
    basal_metabolic_rate: values["basal_metabolic_rate"] ?? 0,
    total_energy_expenditure: values["total_energy_expenditure"] ?? 0,
    waist_to_height_ratio: values["waist_to_height_ratio"] ?? 0,
    health_risk_score: values["health_risk_score"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Visceral Fat Risk","Age-Related Metabolic Decline","Muscle Mass Deficit"];
  const suggestedActions: string[] = ["Increase Physical Activity","Dietary Adjustment","Strength Training","Monitor Waist Circumference","Medical Consultation"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Historical data comparison","Custom reporting"],
  };
}


export interface Bmi_calculatorOutput {
  totalWasteCost: number;
  breakdown: { bmi: number; lean_body_mass: number; body_fat_percentage: number; basal_metabolic_rate: number; total_energy_expenditure: number; waist_to_height_ratio: number; health_risk_score: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

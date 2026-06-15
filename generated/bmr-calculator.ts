// Auto-generated from bmr-calculator-schema.json
import * as z from 'zod';

export interface Bmr_calculatorInput {
  gender: string;
  weight_kg: number;
  height_cm: number;
  age_years: number;
  body_fat_percent: number;
  activity_factor: string;
  measurement_confidence: string;
}

export const Bmr_calculatorInputSchema = z.object({
  gender: z.enum(['male', 'female']).default('male'),
  weight_kg: z.number().min(20).max(300).default(70),
  height_cm: z.number().min(100).max(250).default(175),
  age_years: z.number().min(18).max(100).default(30),
  body_fat_percent: z.number().min(3).max(60),
  activity_factor: z.enum(['sedentary', 'lightly active', 'moderately active', 'very active', 'extra active']).default('sedentary'),
  measurement_confidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

function evaluateAllFormulas(input: Bmr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results["bmr_mifflin_st_jeor"] = 0;
  results["lean_body_mass"] = 0;
  try { results["bmr_adjusted_for_lean_mass"] = (results["bmr_mifflin_st_jeor"] ?? 0) * (1 + 0.1 * (((results["lean_body_mass"] ?? 0) / input.weight_kg) - 0.7)); } catch { results["bmr_adjusted_for_lean_mass"] = 0; }
  results["total_energy_expenditure"] = 0;
  try { results["metabolic_efficiency_index"] = (results["bmr_adjusted_for_lean_mass"] ?? 0) / (results["lean_body_mass"] ?? 0); } catch { results["metabolic_efficiency_index"] = 0; }
  try { results["data_confidence_factor"] = (input.measurement_confidence === 'low' ? 0.85 : (input.measurement_confidence === 'medium' ? 1.0 : (input.measurement_confidence === 'high' ? 1.05 : 0))); } catch { results["data_confidence_factor"] = 0; }
  try { results["bmr_primary"] = (results["bmr_adjusted_for_lean_mass"] ?? 0) * (results["data_confidence_factor"] ?? 0); } catch { results["bmr_primary"] = 0; }
  return results;
}


export function calculateBmr_calculator(input: Bmr_calculatorInput): Bmr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bmr_primary"] ?? 0;
  const breakdown = {
    bmr_mifflin_st_jeor: values["bmr_mifflin_st_jeor"] ?? 0,
    lean_body_mass: values["lean_body_mass"] ?? 0,
    bmr_adjusted_for_lean_mass: values["bmr_adjusted_for_lean_mass"] ?? 0,
    total_energy_expenditure: values["total_energy_expenditure"] ?? 0,
    metabolic_efficiency_index: values["metabolic_efficiency_index"] ?? 0,
    data_confidence_factor: values["data_confidence_factor"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Missing Body Fat Data","Activity Factor Uncertainty","Low Measurement Confidence","Age-Related Metabolic Decay"];
  const suggestedActions: string[] = ["Improve Body Fat Measurement","Calibrate Weight Scale","Use Activity Monitor","Repeat Measurements for Gage R&R"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-user comparison","Custom reporting"],
  };
}


export interface Bmr_calculatorOutput {
  totalWasteCost: number;
  breakdown: { bmr_mifflin_st_jeor: number; lean_body_mass: number; bmr_adjusted_for_lean_mass: number; total_energy_expenditure: number; metabolic_efficiency_index: number; data_confidence_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

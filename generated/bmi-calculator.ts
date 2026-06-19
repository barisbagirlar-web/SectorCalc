// Auto-generated from bmi-calculator-schema.json
import * as z from 'zod';

export interface Bmi_calculatorInput {
  weight_kg: number;
  height_cm: number;
  age_years: number;
  gender: string;
  activity_level: string;
  waist_circumference_cm: number;
  dataConfidence?: number;
}

export const Bmi_calculatorInputSchema = z.object({
  weight_kg: z.number().min(20).max(300).default(70),
  height_cm: z.number().min(50).max(250).default(170),
  age_years: z.number().min(18).max(120).default(30),
  gender: z.enum(['male', 'female']).default('male'),
  activity_level: z.enum(['sedentary', 'light', 'moderate', 'active', 'very active']).default('moderate'),
  waist_circumference_cm: z.number().min(40).max(200).default(80),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bmi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight_kg * input.height_cm * input.age_years * input.waist_circumference_cm; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.weight_kg * input.height_cm * input.age_years * input.waist_circumference_cm; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBmi_calculator(input: Bmi_calculatorInput): Bmi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

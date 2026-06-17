// Auto-generated from baby-bmi-calculator-schema.json
import * as z from 'zod';

export interface Baby_bmi_calculatorInput {
  weight_kg: number;
  length_cm: number;
  weight_lb: number;
  length_in: number;
}

export const Baby_bmi_calculatorInputSchema = z.object({
  weight_kg: z.number(),
  length_cm: z.number(),
  weight_lb: z.number(),
  length_in: z.number(),
});

function evaluateAllFormulas(input: Baby_bmi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight_kg != null && input.length_cm != null ? input.weight_kg / Math.pow(input.length_cm/100, 2) : (input.weight_lb != null && input.length_in != null ? (input.weight_lb/2.20462) / Math.pow((input.length_in*2.54)/100, 2) : null); results["bmi"] = Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  results["BMI___weight__kg_____length__m___"] = 0;
  results["BMI___weight_kg____length_cm_100__"] = 0;
  results["BMI____weight_lb___2_20462______length_i"] = 0;
  return results;
}


export function calculateBaby_bmi_calculator(input: Baby_bmi_calculatorInput): Baby_bmi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bmi"] ?? 0;
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


export interface Baby_bmi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from blood-pressure-category-calculator-schema.json
import * as z from 'zod';

export interface Blood_pressure_category_calculatorInput {
  systolic: number;
  diastolic: number;
  heart_rate: number;
  rest_duration: number;
}

export const Blood_pressure_category_calculatorInputSchema = z.object({
  systolic: z.number().default(120),
  diastolic: z.number().default(80),
  heart_rate: z.number().default(70),
  rest_duration: z.number().default(5),
});

function evaluateAllFormulas(input: Blood_pressure_category_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.systolic >= 180 || input.diastolic >= 120) ? 'Hypertensive Crisis' : ((input.systolic >= 140 || input.diastolic >= 90) ? 'Hypertension Stage 2' : ((input.systolic >= 130 || input.diastolic >= 80) ? 'Hypertension Stage 1' : (input.systolic >= 120 ? 'Elevated' : (input.systolic >= 90 && input.diastolic >= 60 ? 'Normal' : 'Low')))); results["category"] = Number.isFinite(v) ? v : 0; } catch { results["category"] = 0; }
  try { const v = (input.rest_duration >= 5) ? ((input.heart_rate < 60) ? 'Bradycardia' : (input.heart_rate <= 100 ? 'Normal' : 'Tachycardia')) : 'Insufficient Rest'; results["heart_rate_status"] = Number.isFinite(v) ? v : 0; } catch { results["heart_rate_status"] = 0; }
  try { const v = input.systolic < 90 ? 'Low' : input.systolic < 120 ? 'Normal' : input.systolic < 130 ? 'Elevated' : input.systolic < 140 ? 'High-Normal' : input.systolic < 180 ? 'Stage 1-2 Hypertension' : 'Hypertensive Crisis'; results["systolic_status"] = Number.isFinite(v) ? v : 0; } catch { results["systolic_status"] = 0; }
  try { const v = input.diastolic < 60 ? 'Low' : input.diastolic < 80 ? 'Normal' : input.diastolic < 90 ? 'Elevated' : input.diastolic < 120 ? 'High' : 'Hypertensive Crisis'; results["diastolic_status"] = Number.isFinite(v) ? v : 0; } catch { results["diastolic_status"] = 0; }
  return results;
}


export function calculateBlood_pressure_category_calculator(input: Blood_pressure_category_calculatorInput): Blood_pressure_category_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["category"] ?? 0;
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


export interface Blood_pressure_category_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

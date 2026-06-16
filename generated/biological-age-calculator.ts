// Auto-generated from biological-age-calculator-schema.json
import * as z from 'zod';

export interface Biological_age_calculatorInput {
  chronologicalAge: number;
  systolicBP: number;
  bmi: number;
  fastingGlucose: number;
  totalCholesterol: number;
  weeklyExercise: number;
  smoking: number;
  restingHeartRate: number;
}

export const Biological_age_calculatorInputSchema = z.object({
  chronologicalAge: z.number().default(30),
  systolicBP: z.number().default(120),
  bmi: z.number().default(24),
  fastingGlucose: z.number().default(90),
  totalCholesterol: z.number().default(180),
  weeklyExercise: z.number().default(3),
  smoking: z.number().default(0),
  restingHeartRate: z.number().default(70),
});

function evaluateAllFormulas(input: Biological_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.chronologicalAge + (input.systolicBP - 120) * 0.1 + (input.bmi - 25) * 0.2 + (input.fastingGlucose - 100) * 0.05 + (input.totalCholesterol - 200) * 0.02 - input.weeklyExercise * 0.5 + input.smoking * 0.5 + (input.restingHeartRate - 70) * 0.05; results["biologicalAge"] = Number.isFinite(v) ? v : 0; } catch { results["biologicalAge"] = 0; }
  try { const v = (input.systolicBP - 120) * 0.1; results["bpYears"] = Number.isFinite(v) ? v : 0; } catch { results["bpYears"] = 0; }
  try { const v = (input.bmi - 25) * 0.2; results["bmiYears"] = Number.isFinite(v) ? v : 0; } catch { results["bmiYears"] = 0; }
  try { const v = (input.fastingGlucose - 100) * 0.05; results["glucoseYears"] = Number.isFinite(v) ? v : 0; } catch { results["glucoseYears"] = 0; }
  try { const v = (input.totalCholesterol - 200) * 0.02; results["cholesterolYears"] = Number.isFinite(v) ? v : 0; } catch { results["cholesterolYears"] = 0; }
  try { const v = - input.weeklyExercise * 0.5; results["exerciseYears"] = Number.isFinite(v) ? v : 0; } catch { results["exerciseYears"] = 0; }
  try { const v = input.smoking * 0.5; results["smokingYears"] = Number.isFinite(v) ? v : 0; } catch { results["smokingYears"] = 0; }
  try { const v = (input.restingHeartRate - 70) * 0.05; results["hrYears"] = Number.isFinite(v) ? v : 0; } catch { results["hrYears"] = 0; }
  return results;
}


export function calculateBiological_age_calculator(input: Biological_age_calculatorInput): Biological_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["biologicalAge"] ?? 0;
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


export interface Biological_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Biological_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.chronologicalAge + (input.systolicBP - 120) * 0.1 + (input.bmi - 25) * 0.2 + (input.fastingGlucose - 100) * 0.05 + (input.totalCholesterol - 200) * 0.02 - input.weeklyExercise * 0.5 + input.smoking * 0.5 + (input.restingHeartRate - 70) * 0.05; results["biologicalAge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["biologicalAge"] = Number.NaN; }
  try { const v = (input.systolicBP - 120) * 0.1; results["bpYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bpYears"] = Number.NaN; }
  try { const v = (input.bmi - 25) * 0.2; results["bmiYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmiYears"] = Number.NaN; }
  try { const v = (input.fastingGlucose - 100) * 0.05; results["glucoseYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["glucoseYears"] = Number.NaN; }
  try { const v = (input.totalCholesterol - 200) * 0.02; results["cholesterolYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cholesterolYears"] = Number.NaN; }
  try { const v = - input.weeklyExercise * 0.5; results["exerciseYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exerciseYears"] = Number.NaN; }
  try { const v = input.smoking * 0.5; results["smokingYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["smokingYears"] = Number.NaN; }
  try { const v = (input.restingHeartRate - 70) * 0.05; results["hrYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hrYears"] = Number.NaN; }
  return results;
}


export function calculateBiological_age_calculator(input: Biological_age_calculatorInput): Biological_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["biologicalAge"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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

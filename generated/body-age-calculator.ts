// @ts-nocheck
// Auto-generated from body-age-calculator-schema.json
import * as z from 'zod';

export interface Body_age_calculatorInput {
  chronologicalAge: number;
  restingHeartRate: number;
  waistCircumference: number;
  exerciseDaysPerWeek: number;
  systolicBP: number;
  diastolicBP: number;
}

export const Body_age_calculatorInputSchema = z.object({
  chronologicalAge: z.number().default(30),
  restingHeartRate: z.number().default(70),
  waistCircumference: z.number().default(80),
  exerciseDaysPerWeek: z.number().default(3),
  systolicBP: z.number().default(120),
  diastolicBP: z.number().default(80),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Body_age_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.chronologicalAge + 0.2 * (input.restingHeartRate - 70) + 0.3 * (input.waistCircumference - 80) - 0.5 * (input.exerciseDaysPerWeek - 3) + 0.1 * (input.systolicBP - 120) + 0.1 * (input.diastolicBP - 80); results["biologicalAge"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["biologicalAge"] = 0; }
  try { const v = input.chronologicalAge; results["breakdown"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBody_age_calculator(input: Body_age_calculatorInput): Body_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["biologicalAge"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Body_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

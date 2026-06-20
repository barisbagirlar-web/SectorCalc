// Auto-generated from gestational-diabetes-calculator-schema.json
import * as z from 'zod';

export interface Gestational_diabetes_calculatorInput {
  age: number;
  bmi: number;
  previousGDM: number;
  familyDiabetes: number;
  fastingGlucose: number;
  ogtt1h: number;
  ogtt2h: number;
  gestationalWeek: number;
  dataConfidence?: number;
}

export const Gestational_diabetes_calculatorInputSchema = z.object({
  age: z.number().default(30),
  bmi: z.number().default(25),
  previousGDM: z.number().default(0),
  familyDiabetes: z.number().default(0),
  fastingGlucose: z.number().default(90),
  ogtt1h: z.number().default(140),
  ogtt2h: z.number().default(120),
  gestationalWeek: z.number().default(24),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gestational_diabetes_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.age - 25) * 0.1 + (input.bmi - 25) * 0.2 + input.previousGDM * 2 + input.familyDiabetes * 1.5 + (input.fastingGlucose - 92) * 0.05 + (input.ogtt1h - 180) * 0.02 + (input.ogtt2h - 153) * 0.02 + (input.gestationalWeek - 24) * 0.01); results["riskScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskScore"] = Number.NaN; }
  try { const v = ((input.fastingGlucose >= 92 || input.ogtt1h >= 180 || input.ogtt2h >= 153) ? 1 : 0); results["diagnosis"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["diagnosis"] = Number.NaN; }
  return results;
}


export function calculateGestational_diabetes_calculator(input: Gestational_diabetes_calculatorInput): Gestational_diabetes_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["diagnosis"]);
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


export interface Gestational_diabetes_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

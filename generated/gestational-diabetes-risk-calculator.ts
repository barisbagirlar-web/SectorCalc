// Auto-generated from gestational-diabetes-risk-calculator-schema.json
import * as z from 'zod';

export interface Gestational_diabetes_risk_calculatorInput {
  age: number;
  bmi: number;
  familyHistory: number;
  previousGdm: number;
  ethnicity: number;
  fastingGlucose: number;
  hba1c: number;
  triglycerides: number;
  dataConfidence?: number;
}

export const Gestational_diabetes_risk_calculatorInputSchema = z.object({
  age: z.number().default(30),
  bmi: z.number().default(25),
  familyHistory: z.number().default(0),
  previousGdm: z.number().default(0),
  ethnicity: z.number().default(1),
  fastingGlucose: z.number().default(90),
  hba1c: z.number().default(5.2),
  triglycerides: z.number().default(130),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gestational_diabetes_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.age-25)*0.05 + (input.bmi-22)*0.1 + input.familyHistory*0.7 + input.previousGdm*1.2 + input.ethnicity*0.4 + (input.fastingGlucose-80)*0.02 + (input.hba1c-4.5)*0.5 + (input.triglycerides-100)*0.003; results["logitScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["logitScore"] = 0; }
  try { const v = (input.age-25)*0.05 + (input.bmi-22)*0.1 + input.familyHistory*0.7 + input.previousGdm*1.2 + input.ethnicity*0.4 + (input.fastingGlucose-80)*0.02 + (input.hba1c-4.5)*0.5 + (input.triglycerides-100)*0.003; results["logitScore_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["logitScore_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGestational_diabetes_risk_calculator(input: Gestational_diabetes_risk_calculatorInput): Gestational_diabetes_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["logitScore_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Gestational_diabetes_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

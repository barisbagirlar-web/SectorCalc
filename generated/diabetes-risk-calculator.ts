// @ts-nocheck
// Auto-generated from diabetes-risk-calculator-schema.json
import * as z from 'zod';

export interface Diabetes_risk_calculatorInput {
  age: number;
  bmi: number;
  fastingGlucose: number;
  hba1c: number;
  familyHistory: number;
  physicalActivity: number;
}

export const Diabetes_risk_calculatorInputSchema = z.object({
  age: z.number().default(45),
  bmi: z.number().default(25),
  fastingGlucose: z.number().default(100),
  hba1c: z.number().default(5.5),
  familyHistory: z.number().default(0),
  physicalActivity: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Diabetes_risk_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 0.1 * input.age; results["ageContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ageContribution"] = 0; }
  try { const v = 0.5 * input.bmi; results["bmiContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bmiContribution"] = 0; }
  try { const v = 0.3 * input.fastingGlucose; results["fastingGlucoseContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fastingGlucoseContribution"] = 0; }
  try { const v = 1.5 * input.hba1c; results["hba1cContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hba1cContribution"] = 0; }
  try { const v = 2 * input.familyHistory; results["familyHistoryContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["familyHistoryContribution"] = 0; }
  try { const v = -1 * input.physicalActivity; results["physicalActivityContribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["physicalActivityContribution"] = 0; }
  try { const v = 0.1 * input.age + 0.5 * input.bmi + 0.3 * input.fastingGlucose + 1.5 * input.hba1c + 2 * input.familyHistory - 1 * input.physicalActivity; results["riskScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["riskScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDiabetes_risk_calculator(input: Diabetes_risk_calculatorInput): Diabetes_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["riskScore"]);
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


export interface Diabetes_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

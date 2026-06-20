// Auto-generated from diabetes-risk-calculator-schema.json
import * as z from 'zod';

export interface Diabetes_risk_calculatorInput {
  age: number;
  bmi: number;
  fastingGlucose: number;
  hba1c: number;
  familyHistory: number;
  physicalActivity: number;
  dataConfidence?: number;
}

export const Diabetes_risk_calculatorInputSchema = z.object({
  age: z.number().default(45),
  bmi: z.number().default(25),
  fastingGlucose: z.number().default(100),
  hba1c: z.number().default(5.5),
  familyHistory: z.number().default(0),
  physicalActivity: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Diabetes_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.1 * input.age; results["ageContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ageContribution"] = Number.NaN; }
  try { const v = 0.5 * input.bmi; results["bmiContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmiContribution"] = Number.NaN; }
  try { const v = 0.3 * input.fastingGlucose; results["fastingGlucoseContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fastingGlucoseContribution"] = Number.NaN; }
  try { const v = 1.5 * input.hba1c; results["hba1cContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hba1cContribution"] = Number.NaN; }
  try { const v = 2 * input.familyHistory; results["familyHistoryContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["familyHistoryContribution"] = Number.NaN; }
  try { const v = -1 * input.physicalActivity; results["physicalActivityContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["physicalActivityContribution"] = Number.NaN; }
  try { const v = 0.1 * input.age + 0.5 * input.bmi + 0.3 * input.fastingGlucose + 1.5 * input.hba1c + 2 * input.familyHistory - 1 * input.physicalActivity; results["riskScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskScore"] = Number.NaN; }
  return results;
}


export function calculateDiabetes_risk_calculator(input: Diabetes_risk_calculatorInput): Diabetes_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["riskScore"]);
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


export interface Diabetes_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

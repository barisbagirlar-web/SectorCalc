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

function evaluateAllFormulas(input: Diabetes_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.1 * input.age; results["ageContribution"] = Number.isFinite(v) ? v : 0; } catch { results["ageContribution"] = 0; }
  try { const v = 0.5 * input.bmi; results["bmiContribution"] = Number.isFinite(v) ? v : 0; } catch { results["bmiContribution"] = 0; }
  try { const v = 0.3 * input.fastingGlucose; results["fastingGlucoseContribution"] = Number.isFinite(v) ? v : 0; } catch { results["fastingGlucoseContribution"] = 0; }
  try { const v = 1.5 * input.hba1c; results["hba1cContribution"] = Number.isFinite(v) ? v : 0; } catch { results["hba1cContribution"] = 0; }
  try { const v = 2 * input.familyHistory; results["familyHistoryContribution"] = Number.isFinite(v) ? v : 0; } catch { results["familyHistoryContribution"] = 0; }
  try { const v = -1 * input.physicalActivity; results["physicalActivityContribution"] = Number.isFinite(v) ? v : 0; } catch { results["physicalActivityContribution"] = 0; }
  try { const v = 0.1 * input.age + 0.5 * input.bmi + 0.3 * input.fastingGlucose + 1.5 * input.hba1c + 2 * input.familyHistory - 1 * input.physicalActivity; results["riskScore"] = Number.isFinite(v) ? v : 0; } catch { results["riskScore"] = 0; }
  return results;
}


export function calculateDiabetes_risk_calculator(input: Diabetes_risk_calculatorInput): Diabetes_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["riskScore"] ?? 0;
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


export interface Diabetes_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

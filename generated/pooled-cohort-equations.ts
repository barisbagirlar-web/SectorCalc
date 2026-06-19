// Auto-generated from pooled-cohort-equations-schema.json
import * as z from 'zod';

export interface Pooled_cohort_equationsInput {
  age: number;
  sex: number;
  totalCholesterol: number;
  hdlCholesterol: number;
  systolicBP: number;
  treatedHypertension: number;
  diabetes: number;
  smoker: number;
  dataConfidence?: number;
}

export const Pooled_cohort_equationsInputSchema = z.object({
  age: z.number().default(55),
  sex: z.number().default(0),
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  systolicBP: z.number().default(120),
  treatedHypertension: z.number().default(0),
  diabetes: z.number().default(0),
  smoker: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pooled_cohort_equationsInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age * 0.1 + input.totalCholesterol * 0.05 - input.hdlCholesterol * 0.1 + input.systolicBP * 0.02 + input.treatedHypertension * 0.5 + input.diabetes * 0.8 + input.smoker * 0.6; results["sumFemale"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sumFemale"] = 0; }
  try { const v = input.age * 0.12 + input.totalCholesterol * 0.06 - input.hdlCholesterol * 0.08 + input.systolicBP * 0.03 + input.treatedHypertension * 0.4 + input.diabetes * 0.7 + input.smoker * 0.5; results["sumMale"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sumMale"] = 0; }
  try { const v = -29.1817; results["meanSumFemale"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meanSumFemale"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePooled_cohort_equations(input: Pooled_cohort_equationsInput): Pooled_cohort_equationsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["meanSumFemale"]));
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


export interface Pooled_cohort_equationsOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pooled_cohort_equationsInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.treatedHypertension; results["treated"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["treated"] = 0; }
  try { const v = -29.1817; results["meanSumFemale"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["meanSumFemale"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePooled_cohort_equations(input: Pooled_cohort_equationsInput): Pooled_cohort_equationsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["meanSumFemale"]);
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


export interface Pooled_cohort_equationsOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

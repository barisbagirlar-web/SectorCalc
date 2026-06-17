// @ts-nocheck
// Auto-generated from student-aid-index-calculator-schema.json
import * as z from 'zod';

export interface Student_aid_index_calculatorInput {
  parentAGI: number;
  parentAssets: number;
  studentIncome: number;
  studentAssets: number;
  familySize: number;
  numberInCollege: number;
}

export const Student_aid_index_calculatorInputSchema = z.object({
  parentAGI: z.number().default(0),
  parentAssets: z.number().default(0),
  studentIncome: z.number().default(0),
  studentAssets: z.number().default(0),
  familySize: z.number().default(4),
  numberInCollege: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Student_aid_index_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.studentAssets * 0.20; results["studentAssetContrib"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["studentAssetContrib"] = 0; }
  try { const v = input.studentAssets * 0.20; results["studentAssetContrib_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["studentAssetContrib_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStudent_aid_index_calculator(input: Student_aid_index_calculatorInput): Student_aid_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["studentAssetContrib_aux"]);
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


export interface Student_aid_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

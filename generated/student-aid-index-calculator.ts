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

function evaluateAllFormulas(input: Student_aid_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.parentAGI - (10000 + input.familySize * 5000 + input.numberInCollege * 3000)) * 0.22; results["parentIncomeContrib"] = Number.isFinite(v) ? v : 0; } catch { results["parentIncomeContrib"] = 0; }
  try { const v = Math.max(0, input.parentAssets - (2000 * input.familySize)) * 0.12; results["parentAssetContrib"] = Number.isFinite(v) ? v : 0; } catch { results["parentAssetContrib"] = 0; }
  try { const v = Math.max(0, input.studentIncome - 7000) * 0.50; results["studentIncomeContrib"] = Number.isFinite(v) ? v : 0; } catch { results["studentIncomeContrib"] = 0; }
  try { const v = input.studentAssets * 0.20; results["studentAssetContrib"] = Number.isFinite(v) ? v : 0; } catch { results["studentAssetContrib"] = 0; }
  try { const v = Math.round((results["parentIncomeContrib"] ?? 0) + (results["parentAssetContrib"] ?? 0) + (results["studentIncomeContrib"] ?? 0) + (results["studentAssetContrib"] ?? 0)); results["sai"] = Number.isFinite(v) ? v : 0; } catch { results["sai"] = 0; }
  return results;
}


export function calculateStudent_aid_index_calculator(input: Student_aid_index_calculatorInput): Student_aid_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sai"] ?? 0;
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


export interface Student_aid_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

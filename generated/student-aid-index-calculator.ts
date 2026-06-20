// Auto-generated from student-aid-index-calculator-schema.json
import * as z from 'zod';

export interface Student_aid_index_calculatorInput {
  parentAGI: number;
  parentAssets: number;
  studentIncome: number;
  studentAssets: number;
  familySize: number;
  numberInCollege: number;
  dataConfidence?: number;
}

export const Student_aid_index_calculatorInputSchema = z.object({
  parentAGI: z.number().default(0),
  parentAssets: z.number().default(0),
  studentIncome: z.number().default(0),
  studentAssets: z.number().default(0),
  familySize: z.number().default(4),
  numberInCollege: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Student_aid_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.parentAGI * 0.47; results["parentIncomeContrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["parentIncomeContrib"] = Number.NaN; }
  try { const v = input.parentAssets * 0.12; results["parentAssetContrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["parentAssetContrib"] = Number.NaN; }
  try { const v = input.studentIncome * 0.50; results["studentIncomeContrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["studentIncomeContrib"] = Number.NaN; }
  try { const v = input.studentAssets * 0.20; results["studentAssetContrib"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["studentAssetContrib"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["parentIncomeContrib"])) + (toNumericFormulaValue(results["parentAssetContrib"])) + (toNumericFormulaValue(results["studentIncomeContrib"])) + (toNumericFormulaValue(results["studentAssetContrib"])); results["sai"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sai"] = Number.NaN; }
  return results;
}


export function calculateStudent_aid_index_calculator(input: Student_aid_index_calculatorInput): Student_aid_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sai"]);
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


export interface Student_aid_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

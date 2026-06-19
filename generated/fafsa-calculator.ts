// Auto-generated from fafsa-calculator-schema.json
import * as z from 'zod';

export interface Fafsa_calculatorInput {
  parentIncome: number;
  studentIncome: number;
  parentAssets: number;
  studentAssets: number;
  numberInCollege: number;
  dataConfidence?: number;
}

export const Fafsa_calculatorInputSchema = z.object({
  parentIncome: z.number().default(0),
  studentIncome: z.number().default(0),
  parentAssets: z.number().default(0),
  studentAssets: z.number().default(0),
  numberInCollege: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fafsa_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.parentIncome * 0.22 + input.parentAssets * 0.12; results["parentContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["parentContribution"] = 0; }
  try { const v = input.studentIncome * 0.50 + input.studentAssets * 0.20; results["studentContribution"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["studentContribution"] = 0; }
  try { const v = (input.parentIncome * 0.22 + input.parentAssets * 0.12 + input.studentIncome * 0.50 + input.studentAssets * 0.20) / input.numberInCollege; results["totalEFC"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalEFC"] = 0; }
  try { const v = input.parentIncome * 0.22 + input.parentAssets * 0.12; results["parentIncome___0_22___parentAssets___0_1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["parentIncome___0_22___parentAssets___0_1"] = 0; }
  try { const v = input.studentIncome * 0.50 + input.studentAssets * 0.20; results["studentIncome___0_50___studentAssets___0"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["studentIncome___0_50___studentAssets___0"] = 0; }
  try { const v = (input.parentIncome * 0.22 + input.parentAssets * 0.12 + input.studentIncome * 0.50 + input.studentAssets * 0.20) / input.numberInCollege; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFafsa_calculator(input: Fafsa_calculatorInput): Fafsa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Fafsa_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

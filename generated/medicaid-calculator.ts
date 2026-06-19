// Auto-generated from medicaid-calculator-schema.json
import * as z from 'zod';

export interface Medicaid_calculatorInput {
  grossIncome: number;
  otherIncome: number;
  deductions: number;
  dependents: number;
  thresholdPercent: number;
  dataConfidence?: number;
}

export const Medicaid_calculatorInputSchema = z.object({
  grossIncome: z.number().default(0),
  otherIncome: z.number().default(0),
  deductions: z.number().default(0),
  dependents: z.number().default(1),
  thresholdPercent: z.number().default(138),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Medicaid_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossIncome + input.otherIncome - input.deductions; results["netIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netIncome"] = 0; }
  try { const v = 15060 + (input.dependents - 1) * 5380; results["fpl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fpl"] = 0; }
  try { const v = ((asFormulaNumber(results["netIncome"])) / (asFormulaNumber(results["fpl"]))) * 100; results["incomePercent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["incomePercent"] = 0; }
  try { const v = (asFormulaNumber(results["incomePercent"])) <= input.thresholdPercent ? 1 : 0; results["eligible"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["eligible"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMedicaid_calculator(input: Medicaid_calculatorInput): Medicaid_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["eligible"]));
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


export interface Medicaid_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

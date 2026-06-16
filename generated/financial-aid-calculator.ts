// Auto-generated from financial-aid-calculator-schema.json
import * as z from 'zod';

export interface Financial_aid_calculatorInput {
  annualIncome: number;
  totalAssets: number;
  dependents: number;
  costOfAttendance: number;
}

export const Financial_aid_calculatorInputSchema = z.object({
  annualIncome: z.number().default(50000),
  totalAssets: z.number().default(20000),
  dependents: z.number().default(2),
  costOfAttendance: z.number().default(30000),
});

function evaluateAllFormulas(input: Financial_aid_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.annualIncome * 0.2 + input.totalAssets * 0.05 - input.dependents * 2000) + Math.sqrt((input.annualIncome * 0.2 + input.totalAssets * 0.05 - input.dependents * 2000) ** 2)) / 2; results["efc"] = Number.isFinite(v) ? v : 0; } catch { results["efc"] = 0; }
  try { const v = ((input.costOfAttendance - (results["efc"] ?? 0)) + Math.sqrt((input.costOfAttendance - (results["efc"] ?? 0)) ** 2)) / 2; results["financialAid"] = Number.isFinite(v) ? v : 0; } catch { results["financialAid"] = 0; }
  return results;
}


export function calculateFinancial_aid_calculator(input: Financial_aid_calculatorInput): Financial_aid_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["financialAid"] ?? 0;
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


export interface Financial_aid_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

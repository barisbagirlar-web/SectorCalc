// Auto-generated from medicaid-calculator-schema.json
import * as z from 'zod';

export interface Medicaid_calculatorInput {
  grossIncome: number;
  otherIncome: number;
  deductions: number;
  dependents: number;
  thresholdPercent: number;
}

export const Medicaid_calculatorInputSchema = z.object({
  grossIncome: z.number().default(0),
  otherIncome: z.number().default(0),
  deductions: z.number().default(0),
  dependents: z.number().default(1),
  thresholdPercent: z.number().default(138),
});

function evaluateAllFormulas(input: Medicaid_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossIncome + input.otherIncome - input.deductions; results["netIncome"] = Number.isFinite(v) ? v : 0; } catch { results["netIncome"] = 0; }
  try { const v = 15060 + (input.dependents - 1) * 5380; results["fpl"] = Number.isFinite(v) ? v : 0; } catch { results["fpl"] = 0; }
  try { const v = ((results["netIncome"] ?? 0) / (results["fpl"] ?? 0)) * 100; results["incomePercent"] = Number.isFinite(v) ? v : 0; } catch { results["incomePercent"] = 0; }
  try { const v = (results["incomePercent"] ?? 0) <= input.thresholdPercent ? 1 : 0; results["eligible"] = Number.isFinite(v) ? v : 0; } catch { results["eligible"] = 0; }
  return results;
}


export function calculateMedicaid_calculator(input: Medicaid_calculatorInput): Medicaid_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["eligible"] ?? 0;
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


export interface Medicaid_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

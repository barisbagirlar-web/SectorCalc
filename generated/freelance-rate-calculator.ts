// Auto-generated from freelance-rate-calculator-schema.json
import * as z from 'zod';

export interface Freelance_rate_calculatorInput {
  desiredAnnualIncome: number;
  overheadCosts: number;
  billableHoursPerYear: number;
  profitMarginPercent: number;
  taxRatePercent: number;
}

export const Freelance_rate_calculatorInputSchema = z.object({
  desiredAnnualIncome: z.number().default(100000),
  overheadCosts: z.number().default(20000),
  billableHoursPerYear: z.number().default(1500),
  profitMarginPercent: z.number().default(20),
  taxRatePercent: z.number().default(30),
});

function evaluateAllFormulas(input: Freelance_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.desiredAnnualIncome / (1 - input.taxRatePercent / 100); results["annualGrossIncomeNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["annualGrossIncomeNeeded"] = 0; }
  try { const v = (results["annualGrossIncomeNeeded"] ?? 0) + input.overheadCosts; results["totalAnnualCosts"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnualCosts"] = 0; }
  try { const v = (results["totalAnnualCosts"] ?? 0) / input.billableHoursPerYear * (1 + input.profitMarginPercent / 100); results["hourlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["hourlyRate"] = 0; }
  return results;
}


export function calculateFreelance_rate_calculator(input: Freelance_rate_calculatorInput): Freelance_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["hourlyRate"] ?? 0;
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


export interface Freelance_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

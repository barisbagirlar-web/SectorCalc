// Auto-generated from debt-service-coverage-ratio-calculator-schema.json
import * as z from 'zod';

export interface Debt_service_coverage_ratio_calculatorInput {
  netOperatingIncome: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
}

export const Debt_service_coverage_ratio_calculatorInputSchema = z.object({
  netOperatingIncome: z.number().default(120000),
  loanAmount: z.number().default(500000),
  interestRate: z.number().default(5),
  loanTerm: z.number().default(10),
});

function evaluateAllFormulas(input: Debt_service_coverage_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.loanAmount * (input.interestRate/100)) / (1 - Math.pow(1 + (input.interestRate/100), -input.loanTerm)); results["annualDebtService"] = Number.isFinite(v) ? v : 0; } catch { results["annualDebtService"] = 0; }
  try { const v = input.netOperatingIncome / (results["annualDebtService"] ?? 0); results["dscr"] = Number.isFinite(v) ? v : 0; } catch { results["dscr"] = 0; }
  return results;
}


export function calculateDebt_service_coverage_ratio_calculator(input: Debt_service_coverage_ratio_calculatorInput): Debt_service_coverage_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dscr"] ?? 0;
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


export interface Debt_service_coverage_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

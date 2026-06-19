// Auto-generated from debt-service-coverage-ratio-calculator-schema.json
import * as z from 'zod';

export interface Debt_service_coverage_ratio_calculatorInput {
  netOperatingIncome: number;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  dataConfidence?: number;
}

export const Debt_service_coverage_ratio_calculatorInputSchema = z.object({
  netOperatingIncome: z.number().default(120000),
  loanAmount: z.number().default(500000),
  interestRate: z.number().default(5),
  loanTerm: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Debt_service_coverage_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netOperatingIncome * input.loanAmount * (input.interestRate / 100) * input.loanTerm; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.netOperatingIncome * input.loanAmount * (input.interestRate / 100) * input.loanTerm; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDebt_service_coverage_ratio_calculator(input: Debt_service_coverage_ratio_calculatorInput): Debt_service_coverage_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Debt_service_coverage_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

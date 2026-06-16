// Auto-generated from business-debt-service-coverage-ratio-calculator-schema.json
import * as z from 'zod';

export interface Business_debt_service_coverage_ratio_calculatorInput {
  netOperatingIncome: number;
  principalRepayments: number;
  interestPayments: number;
  leasePayments: number;
}

export const Business_debt_service_coverage_ratio_calculatorInputSchema = z.object({
  netOperatingIncome: z.number().default(100000),
  principalRepayments: z.number().default(20000),
  interestPayments: z.number().default(10000),
  leasePayments: z.number().default(5000),
});

function evaluateAllFormulas(input: Business_debt_service_coverage_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principalRepayments + input.interestPayments + input.leasePayments; results["totalDebtService"] = Number.isFinite(v) ? v : 0; } catch { results["totalDebtService"] = 0; }
  try { const v = input.netOperatingIncome / (input.principalRepayments + input.interestPayments + input.leasePayments); results["dscr"] = Number.isFinite(v) ? v : 0; } catch { results["dscr"] = 0; }
  return results;
}


export function calculateBusiness_debt_service_coverage_ratio_calculator(input: Business_debt_service_coverage_ratio_calculatorInput): Business_debt_service_coverage_ratio_calculatorOutput {
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


export interface Business_debt_service_coverage_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

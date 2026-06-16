// Auto-generated from turkey-installment-calculator-schema.json
import * as z from 'zod';

export interface Turkey_installment_calculatorInput {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  bsmv: number;
  kkdf: number;
  fee: number;
}

export const Turkey_installment_calculatorInputSchema = z.object({
  loanAmount: z.number().default(10000),
  interestRate: z.number().default(24),
  loanTerm: z.number().default(12),
  bsmv: z.number().default(5),
  kkdf: z.number().default(15),
  fee: z.number().default(0),
});

function evaluateAllFormulas(input: Turkey_installment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.interestRate / 100 / 12) * (1 + input.bsmv/100 + input.kkdf/100); results["effectiveMonthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveMonthlyRate"] = 0; }
  try { const v = ((input.loanAmount + input.fee) * (results["effectiveMonthlyRate"] ?? 0) * Math.pow(1 + (results["effectiveMonthlyRate"] ?? 0), input.loanTerm)) / (Math.pow(1 + (results["effectiveMonthlyRate"] ?? 0), input.loanTerm) - 1); results["monthlyInstallment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInstallment"] = 0; }
  try { const v = (results["monthlyInstallment"] ?? 0) * input.loanTerm; results["totalPayment"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayment"] = 0; }
  try { const v = (results["totalPayment"] ?? 0) - (input.loanAmount + input.fee); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = (results["totalInterest"] ?? 0) * (input.bsmv/100 + input.kkdf/100); results["totalTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalTax"] = 0; }
  return results;
}


export function calculateTurkey_installment_calculator(input: Turkey_installment_calculatorInput): Turkey_installment_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyInstallment"] ?? 0;
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


export interface Turkey_installment_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from capital-lease-calculator-schema.json
import * as z from 'zod';

export interface Capital_lease_calculatorInput {
  assetCost: number;
  leaseTerm: number;
  interestRate: number;
  residualValue: number;
  paymentFrequency: number;
}

export const Capital_lease_calculatorInputSchema = z.object({
  assetCost: z.number().default(100000),
  leaseTerm: z.number().default(5),
  interestRate: z.number().default(8),
  residualValue: z.number().default(20000),
  paymentFrequency: z.number().default(12),
});

function evaluateAllFormulas(input: Capital_lease_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.interestRate / 100) / input.paymentFrequency; results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = input.leaseTerm * input.paymentFrequency; results["n"] = Number.isFinite(v) ? v : 0; } catch { results["n"] = 0; }
  try { const v = input.residualValue / Math.pow(1 + (results["r"] ?? 0), (results["n"] ?? 0)); results["pvResidual"] = Number.isFinite(v) ? v : 0; } catch { results["pvResidual"] = 0; }
  try { const v = (input.assetCost - (results["pvResidual"] ?? 0)) * (results["r"] ?? 0) / (1 - Math.pow(1 + (results["r"] ?? 0), -(results["n"] ?? 0))); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * (results["n"] ?? 0); results["totalPayments"] = Number.isFinite(v) ? v : 0; } catch { results["totalPayments"] = 0; }
  try { const v = (results["totalPayments"] ?? 0) + input.residualValue - input.assetCost; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = (Math.pow(1 + (results["r"] ?? 0), input.paymentFrequency) - 1) * 100; results["effectiveAnnualRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRate"] = 0; }
  return results;
}


export function calculateCapital_lease_calculator(input: Capital_lease_calculatorInput): Capital_lease_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyPayment"] ?? 0;
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


export interface Capital_lease_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

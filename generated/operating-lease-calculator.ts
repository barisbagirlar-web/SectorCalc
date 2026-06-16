// Auto-generated from operating-lease-calculator-schema.json
import * as z from 'zod';

export interface Operating_lease_calculatorInput {
  assetCost: number;
  residualValue: number;
  leaseTerm: number;
  interestRate: number;
}

export const Operating_lease_calculatorInputSchema = z.object({
  assetCost: z.number().default(50000),
  residualValue: z.number().default(10000),
  leaseTerm: z.number().default(36),
  interestRate: z.number().default(5),
});

function evaluateAllFormulas(input: Operating_lease_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.interestRate / 100 / 12; results["monthlyInterestRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyInterestRate"] = 0; }
  try { const v = input.residualValue / Math.pow(1 + (results["monthlyInterestRate"] ?? 0), input.leaseTerm); results["pvResidual"] = Number.isFinite(v) ? v : 0; } catch { results["pvResidual"] = 0; }
  try { const v = (1 - Math.pow(1 + (results["monthlyInterestRate"] ?? 0), -input.leaseTerm)) / (results["monthlyInterestRate"] ?? 0); results["pvAnnuityFactor"] = Number.isFinite(v) ? v : 0; } catch { results["pvAnnuityFactor"] = 0; }
  try { const v = (input.assetCost - (results["pvResidual"] ?? 0)) / (results["pvAnnuityFactor"] ?? 0); results["monthlyPayment"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyPayment"] = 0; }
  try { const v = (results["monthlyPayment"] ?? 0) * input.leaseTerm; results["totalLeaseCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalLeaseCost"] = 0; }
  try { const v = (results["totalLeaseCost"] ?? 0) - (input.assetCost - input.residualValue); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateOperating_lease_calculator(input: Operating_lease_calculatorInput): Operating_lease_calculatorOutput {
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


export interface Operating_lease_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from buy-vs-lease-calculator-schema.json
import * as z from 'zod';

export interface Buy_vs_lease_calculatorInput {
  purchasePrice: number;
  leasePayment: number;
  leaseTerm: number;
  residualValue: number;
  discountRate: number;
}

export const Buy_vs_lease_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(50000),
  leasePayment: z.number().default(1000),
  leaseTerm: z.number().default(36),
  residualValue: z.number().default(20000),
  discountRate: z.number().default(5),
});

function evaluateAllFormulas(input: Buy_vs_lease_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.discountRate / 100 / 12; results["monthlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyRate"] = 0; }
  try { const v = input.leasePayment * (1 - Math.pow(1 + (results["monthlyRate"] ?? 0), -input.leaseTerm)) / (results["monthlyRate"] ?? 0); results["npvLeasing"] = Number.isFinite(v) ? v : 0; } catch { results["npvLeasing"] = 0; }
  try { const v = input.residualValue / Math.pow(1 + (results["monthlyRate"] ?? 0), input.leaseTerm); results["pvResidual"] = Number.isFinite(v) ? v : 0; } catch { results["pvResidual"] = 0; }
  try { const v = input.purchasePrice - (results["pvResidual"] ?? 0); results["npvBuying"] = Number.isFinite(v) ? v : 0; } catch { results["npvBuying"] = 0; }
  try { const v = (results["npvLeasing"] ?? 0) - (results["npvBuying"] ?? 0); results["netAdvantage"] = Number.isFinite(v) ? v : 0; } catch { results["netAdvantage"] = 0; }
  return results;
}


export function calculateBuy_vs_lease_calculator(input: Buy_vs_lease_calculatorInput): Buy_vs_lease_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netAdvantage"] ?? 0;
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


export interface Buy_vs_lease_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

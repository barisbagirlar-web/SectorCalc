// Auto-generated from realtor-fee-calculator-schema.json
import * as z from 'zod';

export interface Realtor_fee_calculatorInput {
  salePrice: number;
  commissionRate: number;
  additionalFixedFee: number;
  splitRatio: number;
}

export const Realtor_fee_calculatorInputSchema = z.object({
  salePrice: z.number().default(300000),
  commissionRate: z.number().default(6),
  additionalFixedFee: z.number().default(0),
  splitRatio: z.number().default(0.5),
});

function evaluateAllFormulas(input: Realtor_fee_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salePrice * input.commissionRate / 100; results["totalCommission"] = Number.isFinite(v) ? v : 0; } catch { results["totalCommission"] = 0; }
  try { const v = (results["totalCommission"] ?? 0) + input.additionalFixedFee; results["totalFee"] = Number.isFinite(v) ? v : 0; } catch { results["totalFee"] = 0; }
  try { const v = (results["totalFee"] ?? 0) * input.splitRatio; results["agent1Fee"] = Number.isFinite(v) ? v : 0; } catch { results["agent1Fee"] = 0; }
  try { const v = (results["totalFee"] ?? 0) * (1 - input.splitRatio); results["agent2Fee"] = Number.isFinite(v) ? v : 0; } catch { results["agent2Fee"] = 0; }
  return results;
}


export function calculateRealtor_fee_calculator(input: Realtor_fee_calculatorInput): Realtor_fee_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFee"] ?? 0;
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


export interface Realtor_fee_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

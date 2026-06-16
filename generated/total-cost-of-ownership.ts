// Auto-generated from total-cost-of-ownership-schema.json
import * as z from 'zod';

export interface Total_cost_of_ownershipInput {
  purchasePrice: number;
  annualMaintenance: number;
  annualEnergy: number;
  resaleValue: number;
  ownershipYears: number;
  discountRate: number;
}

export const Total_cost_of_ownershipInputSchema = z.object({
  purchasePrice: z.number().default(10000),
  annualMaintenance: z.number().default(200),
  annualEnergy: z.number().default(500),
  resaleValue: z.number().default(3000),
  ownershipYears: z.number().default(5),
  discountRate: z.number().default(5),
});

function evaluateAllFormulas(input: Total_cost_of_ownershipInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.purchasePrice + (input.annualMaintenance + input.annualEnergy) * input.ownershipYears - input.resaleValue; results["totalUndiscounted"] = Number.isFinite(v) ? v : 0; } catch { results["totalUndiscounted"] = 0; }
  try { const v = input.discountRate / 100; results["r"] = Number.isFinite(v) ? v : 0; } catch { results["r"] = 0; }
  try { const v = input.purchasePrice + (input.annualMaintenance + input.annualEnergy) * ((1 - (1 + input.discountRate/100) ** (-input.ownershipYears)) / (input.discountRate/100)) - input.resaleValue * (1 + input.discountRate/100) ** (-input.ownershipYears); results["netPresentValue"] = Number.isFinite(v) ? v : 0; } catch { results["netPresentValue"] = 0; }
  return results;
}


export function calculateTotal_cost_of_ownership(input: Total_cost_of_ownershipInput): Total_cost_of_ownershipOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netPresentValue"] ?? 0;
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


export interface Total_cost_of_ownershipOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

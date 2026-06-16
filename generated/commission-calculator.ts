// Auto-generated from commission-calculator-schema.json
import * as z from 'zod';

export interface Commission_calculatorInput {
  totalSales: number;
  baseCommissionRate: number;
  highTierThreshold: number;
  highTierRate: number;
}

export const Commission_calculatorInputSchema = z.object({
  totalSales: z.number().default(5000),
  baseCommissionRate: z.number().default(5),
  highTierThreshold: z.number().default(10000),
  highTierRate: z.number().default(10),
});

function evaluateAllFormulas(input: Commission_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalSales <= input.highTierThreshold ? input.totalSales * input.baseCommissionRate / 100 : input.highTierThreshold * input.baseCommissionRate / 100; results["tier1Commission"] = Number.isFinite(v) ? v : 0; } catch { results["tier1Commission"] = 0; }
  try { const v = input.totalSales > input.highTierThreshold ? (input.totalSales - input.highTierThreshold) * input.highTierRate / 100 : 0; results["tier2Commission"] = Number.isFinite(v) ? v : 0; } catch { results["tier2Commission"] = 0; }
  try { const v = (results["tier1Commission"] ?? 0) + (results["tier2Commission"] ?? 0); results["totalCommission"] = Number.isFinite(v) ? v : 0; } catch { results["totalCommission"] = 0; }
  return results;
}


export function calculateCommission_calculator(input: Commission_calculatorInput): Commission_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCommission"] ?? 0;
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


export interface Commission_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

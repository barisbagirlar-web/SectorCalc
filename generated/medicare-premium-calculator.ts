// Auto-generated from medicare-premium-calculator-schema.json
import * as z from 'zod';

export interface Medicare_premium_calculatorInput {
  magi: number;
  filingStatus: number;
  partBBase: number;
  partDBase: number;
  planCost: number;
}

export const Medicare_premium_calculatorInputSchema = z.object({
  magi: z.number().default(75000),
  filingStatus: z.number().default(1),
  partBBase: z.number().default(174.7),
  partDBase: z.number().default(33.35),
  planCost: z.number().default(30),
});

function evaluateAllFormulas(input: Medicare_premium_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.magi <= (input.filingStatus === 1 ? 103000 : 206000) ? 0 : input.magi <= (input.filingStatus === 1 ? 129000 : 258000) ? 69.90 : input.magi <= (input.filingStatus === 1 ? 161000 : 322000) ? 174.70 : input.magi <= (input.filingStatus === 1 ? 193000 : 386000) ? 279.50 : input.magi < (input.filingStatus === 1 ? 500000 : 750000) ? 384.30 : 419.30; results["irmaaB"] = Number.isFinite(v) ? v : 0; } catch { results["irmaaB"] = 0; }
  try { const v = input.magi <= (input.filingStatus === 1 ? 103000 : 206000) ? 0 : input.magi <= (input.filingStatus === 1 ? 129000 : 258000) ? 12.40 : input.magi <= (input.filingStatus === 1 ? 161000 : 322000) ? 32.00 : input.magi <= (input.filingStatus === 1 ? 193000 : 386000) ? 51.70 : input.magi < (input.filingStatus === 1 ? 500000 : 750000) ? 71.30 : 77.90; results["irmaaD"] = Number.isFinite(v) ? v : 0; } catch { results["irmaaD"] = 0; }
  try { const v = input.partBBase + (results["irmaaB"] ?? 0) + (input.planCost > 0 ? input.planCost : input.partDBase + (results["irmaaD"] ?? 0)); results["totalPremium"] = Number.isFinite(v) ? v : 0; } catch { results["totalPremium"] = 0; }
  return results;
}


export function calculateMedicare_premium_calculator(input: Medicare_premium_calculatorInput): Medicare_premium_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPremium"] ?? 0;
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


export interface Medicare_premium_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

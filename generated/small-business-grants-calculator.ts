// Auto-generated from small-business-grants-calculator-schema.json
import * as z from 'zod';

export interface Small_business_grants_calculatorInput {
  avgAnnualRevenue: number;
  numEmployees: number;
  projectCost: number;
  matchingFunds: number;
  isMinorityOwned: number;
  isWomanOwned: number;
}

export const Small_business_grants_calculatorInputSchema = z.object({
  avgAnnualRevenue: z.number().default(100000),
  numEmployees: z.number().default(10),
  projectCost: z.number().default(50000),
  matchingFunds: z.number().default(10000),
  isMinorityOwned: z.number().default(0),
  isWomanOwned: z.number().default(0),
});

function evaluateAllFormulas(input: Small_business_grants_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(input.projectCost * 0.5, Math.min(input.avgAnnualRevenue * 0.1, 50000)); results["baseGrant"] = Number.isFinite(v) ? v : 0; } catch { results["baseGrant"] = 0; }
  try { const v = 1 + 0.1 * input.isMinorityOwned + 0.1 * input.isWomanOwned; results["diversityMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["diversityMultiplier"] = 0; }
  try { const v = (results["baseGrant"] ?? 0) * (results["diversityMultiplier"] ?? 0); results["adjustedGrant"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedGrant"] = 0; }
  try { const v = Math.min((results["adjustedGrant"] ?? 0), input.projectCost - input.matchingFunds); results["finalGrant"] = Number.isFinite(v) ? v : 0; } catch { results["finalGrant"] = 0; }
  return results;
}


export function calculateSmall_business_grants_calculator(input: Small_business_grants_calculatorInput): Small_business_grants_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalGrant"] ?? 0;
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


export interface Small_business_grants_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

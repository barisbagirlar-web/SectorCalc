// Auto-generated from cap-table-calculator-schema.json
import * as z from 'zod';

export interface Cap_table_calculatorInput {
  totalAuthorizedShares: number;
  sharesOutstanding: number;
  optionPoolSize: number;
  newInvestment: number;
  preMoneyValuation: number;
}

export const Cap_table_calculatorInputSchema = z.object({
  totalAuthorizedShares: z.number().default(10000000),
  sharesOutstanding: z.number().default(5000000),
  optionPoolSize: z.number().default(500000),
  newInvestment: z.number().default(1000000),
  preMoneyValuation: z.number().default(10000000),
});

function evaluateAllFormulas(input: Cap_table_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sharesOutstanding + input.optionPoolSize; results["fullyDilutedPre"] = Number.isFinite(v) ? v : 0; } catch { results["fullyDilutedPre"] = 0; }
  try { const v = input.preMoneyValuation / (results["fullyDilutedPre"] ?? 0); results["pricePerShare"] = Number.isFinite(v) ? v : 0; } catch { results["pricePerShare"] = 0; }
  try { const v = input.newInvestment / (results["pricePerShare"] ?? 0); results["newSharesIssued"] = Number.isFinite(v) ? v : 0; } catch { results["newSharesIssued"] = 0; }
  try { const v = input.preMoneyValuation + input.newInvestment; results["postMoneyValuation"] = Number.isFinite(v) ? v : 0; } catch { results["postMoneyValuation"] = 0; }
  try { const v = (results["fullyDilutedPre"] ?? 0) + (results["newSharesIssued"] ?? 0); results["totalPostShares"] = Number.isFinite(v) ? v : 0; } catch { results["totalPostShares"] = 0; }
  try { const v = ((results["newSharesIssued"] ?? 0) / (results["totalPostShares"] ?? 0)) * 100; results["investorOwnershipPct"] = Number.isFinite(v) ? v : 0; } catch { results["investorOwnershipPct"] = 0; }
  return results;
}


export function calculateCap_table_calculator(input: Cap_table_calculatorInput): Cap_table_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["investorOwnershipPct"] ?? 0;
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


export interface Cap_table_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

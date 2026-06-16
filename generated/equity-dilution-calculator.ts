// Auto-generated from equity-dilution-calculator-schema.json
import * as z from 'zod';

export interface Equity_dilution_calculatorInput {
  totalOutstandingShares: number;
  newSharesIssued: number;
  investorCurrentShares: number;
  investorNewShares: number;
}

export const Equity_dilution_calculatorInputSchema = z.object({
  totalOutstandingShares: z.number().default(1000000),
  newSharesIssued: z.number().default(200000),
  investorCurrentShares: z.number().default(100000),
  investorNewShares: z.number().default(0),
});

function evaluateAllFormulas(input: Equity_dilution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalOutstandingShares + input.newSharesIssued; results["totalAfter"] = Number.isFinite(v) ? v : 0; } catch { results["totalAfter"] = 0; }
  try { const v = input.investorCurrentShares + input.investorNewShares; results["investorTotalAfter"] = Number.isFinite(v) ? v : 0; } catch { results["investorTotalAfter"] = 0; }
  try { const v = input.investorCurrentShares / input.totalOutstandingShares; results["ownershipBefore"] = Number.isFinite(v) ? v : 0; } catch { results["ownershipBefore"] = 0; }
  try { const v = (results["investorTotalAfter"] ?? 0) / (results["totalAfter"] ?? 0); results["ownershipAfter"] = Number.isFinite(v) ? v : 0; } catch { results["ownershipAfter"] = 0; }
  try { const v = (((results["ownershipBefore"] ?? 0) - (results["ownershipAfter"] ?? 0)) / (results["ownershipBefore"] ?? 0)) * 100; results["dilutionPercent"] = Number.isFinite(v) ? v : 0; } catch { results["dilutionPercent"] = 0; }
  return results;
}


export function calculateEquity_dilution_calculator(input: Equity_dilution_calculatorInput): Equity_dilution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dilutionPercent"] ?? 0;
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


export interface Equity_dilution_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

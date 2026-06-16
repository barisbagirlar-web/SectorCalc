// Auto-generated from convertible-note-calculator-schema.json
import * as z from 'zod';

export interface Convertible_note_calculatorInput {
  investmentAmount: number;
  discountRate: number;
  valuationCap: number;
  nextRoundPricePerShare: number;
  interestRate: number;
  maturity: number;
  preMoneyFullyDilutedShares: number;
}

export const Convertible_note_calculatorInputSchema = z.object({
  investmentAmount: z.number().default(100000),
  discountRate: z.number().default(20),
  valuationCap: z.number().default(5000000),
  nextRoundPricePerShare: z.number().default(1),
  interestRate: z.number().default(5),
  maturity: z.number().default(2),
  preMoneyFullyDilutedShares: z.number().default(10000000),
});

function evaluateAllFormulas(input: Convertible_note_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.investmentAmount * (1 + input.interestRate/100 * input.maturity); results["accruedPrincipal"] = Number.isFinite(v) ? v : 0; } catch { results["accruedPrincipal"] = 0; }
  try { const v = input.nextRoundPricePerShare * (1 - input.discountRate/100); results["discountPrice"] = Number.isFinite(v) ? v : 0; } catch { results["discountPrice"] = 0; }
  try { const v = input.valuationCap / input.preMoneyFullyDilutedShares; results["capPrice"] = Number.isFinite(v) ? v : 0; } catch { results["capPrice"] = 0; }
  try { const v = Math.min((results["discountPrice"] ?? 0), (results["capPrice"] ?? 0)); results["conversionPrice"] = Number.isFinite(v) ? v : 0; } catch { results["conversionPrice"] = 0; }
  try { const v = (results["accruedPrincipal"] ?? 0) / (results["conversionPrice"] ?? 0); results["numberOfShares"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfShares"] = 0; }
  try { const v = (results["numberOfShares"] ?? 0) / (input.preMoneyFullyDilutedShares + (results["numberOfShares"] ?? 0)) * 100; results["ownershipPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["ownershipPercentage"] = 0; }
  return results;
}


export function calculateConvertible_note_calculator(input: Convertible_note_calculatorInput): Convertible_note_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["numberOfShares"] ?? 0;
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


export interface Convertible_note_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

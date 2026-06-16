// Auto-generated from safe-note-calculator-schema.json
import * as z from 'zod';

export interface Safe_note_calculatorInput {
  investmentAmount: number;
  valuationCap: number;
  discountRate: number;
  preMoneyValuation: number;
}

export const Safe_note_calculatorInputSchema = z.object({
  investmentAmount: z.number().default(100000),
  valuationCap: z.number().default(5000000),
  discountRate: z.number().default(20),
  preMoneyValuation: z.number().default(8000000),
});

function evaluateAllFormulas(input: Safe_note_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.investmentAmount / (results["effectiveVal"] ?? 0)) * 100; results["ownershipPct"] = Number.isFinite(v) ? v : 0; } catch { results["ownershipPct"] = 0; }
  try { const v = Math.min(input.valuationCap, input.preMoneyValuation * (1 - input.discountRate/100)); results["effectiveVal"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveVal"] = 0; }
  try { const v = input.preMoneyValuation * (1 - input.discountRate/100); results["discountedVal"] = Number.isFinite(v) ? v : 0; } catch { results["discountedVal"] = 0; }
  try { const v = (results["effectiveVal"] ?? 0) === input.valuationCap ? 0 : 1; results["convType"] = Number.isFinite(v) ? v : 0; } catch { results["convType"] = 0; }
  return results;
}


export function calculateSafe_note_calculator(input: Safe_note_calculatorInput): Safe_note_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ownershipPct"] ?? 0;
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


export interface Safe_note_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

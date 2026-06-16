// Auto-generated from semi-annual-compound-interest-schema.json
import * as z from 'zod';

export interface Semi_annual_compound_interestInput {
  principal: number;
  annualRate: number;
  years: number;
  compoundsPerYear: number;
  inflationRate: number;
}

export const Semi_annual_compound_interestInputSchema = z.object({
  principal: z.number().default(10000),
  annualRate: z.number().default(5),
  years: z.number().default(10),
  compoundsPerYear: z.number().default(2),
  inflationRate: z.number().default(0),
});

function evaluateAllFormulas(input: Semi_annual_compound_interestInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * Math.pow(1 + input.annualRate/100/input.compoundsPerYear, input.compoundsPerYear * input.years); results["nominalFutureValue"] = Number.isFinite(v) ? v : 0; } catch { results["nominalFutureValue"] = 0; }
  try { const v = (results["nominalFutureValue"] ?? 0) - input.principal; results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = (Math.pow(1 + input.annualRate/100/input.compoundsPerYear, input.compoundsPerYear) - 1) * 100; results["effectiveAnnualRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRate"] = 0; }
  try { const v = input.inflationRate > 0 ? (results["nominalFutureValue"] ?? 0) / Math.pow(1 + input.inflationRate/100, input.years) : (results["nominalFutureValue"] ?? 0); results["realFutureValue"] = Number.isFinite(v) ? v : 0; } catch { results["realFutureValue"] = 0; }
  return results;
}


export function calculateSemi_annual_compound_interest(input: Semi_annual_compound_interestInput): Semi_annual_compound_interestOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["nominalFutureValue"] ?? 0;
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


export interface Semi_annual_compound_interestOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from quarterly-compound-interest-schema.json
import * as z from 'zod';

export interface Quarterly_compound_interestInput {
  principal: number;
  annualRate: number;
  years: number;
  quarterlyContribution: number;
}

export const Quarterly_compound_interestInputSchema = z.object({
  principal: z.number().default(1000),
  annualRate: z.number().default(5),
  years: z.number().default(5),
  quarterlyContribution: z.number().default(0),
});

function evaluateAllFormulas(input: Quarterly_compound_interestInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualRate / 100 / 4; results["quarterlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["quarterlyRate"] = 0; }
  try { const v = input.years * 4; results["periods"] = Number.isFinite(v) ? v : 0; } catch { results["periods"] = 0; }
  try { const v = input.principal * Math.pow(1 + (results["quarterlyRate"] ?? 0), (results["periods"] ?? 0)); results["fvPrincipal"] = Number.isFinite(v) ? v : 0; } catch { results["fvPrincipal"] = 0; }
  try { const v = input.quarterlyContribution > 0 ? input.quarterlyContribution * (Math.pow(1 + (results["quarterlyRate"] ?? 0), (results["periods"] ?? 0)) - 1) / (results["quarterlyRate"] ?? 0) : 0; results["fvContributions"] = Number.isFinite(v) ? v : 0; } catch { results["fvContributions"] = 0; }
  try { const v = (results["fvPrincipal"] ?? 0) + (results["fvContributions"] ?? 0); results["totalFutureValue"] = Number.isFinite(v) ? v : 0; } catch { results["totalFutureValue"] = 0; }
  try { const v = input.principal + input.quarterlyContribution * (results["periods"] ?? 0); results["totalContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = (results["totalFutureValue"] ?? 0) - (results["totalContributions"] ?? 0); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateQuarterly_compound_interest(input: Quarterly_compound_interestInput): Quarterly_compound_interestOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFutureValue"] ?? 0;
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


export interface Quarterly_compound_interestOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

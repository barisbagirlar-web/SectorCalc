// Auto-generated from sep-ira-calculator-schema.json
import * as z from 'zod';

export interface Sep_ira_calculatorInput {
  annualCompensation: number;
  contributionRatePercent: number;
  isSelfEmployed: number;
  contributionLimit: number;
}

export const Sep_ira_calculatorInputSchema = z.object({
  annualCompensation: z.number().default(100000),
  contributionRatePercent: z.number().default(25),
  isSelfEmployed: z.number().default(0),
  contributionLimit: z.number().default(66000),
});

function evaluateAllFormulas(input: Sep_ira_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { const compensation = input.annualCompensation; const rate = input.contributionRatePercent / 100; const isSE = input.isSelfEmployed; return isSE === 1 ? compensation * rate / (1 + rate) : compensation * rate; })(); results["calculatedContribution"] = Number.isFinite(v) ? v : 0; } catch { results["calculatedContribution"] = 0; }
  try { const v = (() => { const calculated = function() { const c=input.annualCompensation; const r=input.contributionRatePercent/100; const se=input.isSelfEmployed; return se===1? c*r/(1+r) : c*r; }(); const limit = input.contributionLimit; return Math.min(calculated, limit); })(); results["contributionAfterLimit"] = Number.isFinite(v) ? v : 0; } catch { results["contributionAfterLimit"] = 0; }
  try { const v = (() => { return input['contributionAfterLimit']; })(); results["finalContribution"] = Number.isFinite(v) ? v : 0; } catch { results["finalContribution"] = 0; }
  return results;
}


export function calculateSep_ira_calculator(input: Sep_ira_calculatorInput): Sep_ira_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalContribution"] ?? 0;
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


export interface Sep_ira_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

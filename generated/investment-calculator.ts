// Auto-generated from investment-calculator-schema.json
import * as z from 'zod';

export interface Investment_calculatorInput {
  initialInvestment: number;
  annualContribution: number;
  years: number;
  annualRate: number;
  compoundingFrequency: number;
}

export const Investment_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(10000),
  annualContribution: z.number().default(5000),
  years: z.number().default(10),
  annualRate: z.number().default(7),
  compoundingFrequency: z.number().default(12),
});

function evaluateAllFormulas(input: Investment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualRate === 0 ? (input.initialInvestment + input.annualContribution * input.years) : input.initialInvestment * Math.pow(1 + input.annualRate/100/input.compoundingFrequency, input.compoundingFrequency * input.years) + input.annualContribution * ((Math.pow(1 + input.annualRate/100/input.compoundingFrequency, input.compoundingFrequency * input.years) - 1) / (input.annualRate/100/input.compoundingFrequency)); results["futureValue"] = Number.isFinite(v) ? v : 0; } catch { results["futureValue"] = 0; }
  try { const v = input.initialInvestment + input.annualContribution * input.years; results["totalContributions"] = Number.isFinite(v) ? v : 0; } catch { results["totalContributions"] = 0; }
  try { const v = (input.annualRate === 0 ? (input.initialInvestment + input.annualContribution * input.years) : input.initialInvestment * Math.pow(1 + input.annualRate/100/input.compoundingFrequency, input.compoundingFrequency * input.years) + input.annualContribution * ((Math.pow(1 + input.annualRate/100/input.compoundingFrequency, input.compoundingFrequency * input.years) - 1) / (input.annualRate/100/input.compoundingFrequency))) - (input.initialInvestment + input.annualContribution * input.years); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  return results;
}


export function calculateInvestment_calculator(input: Investment_calculatorInput): Investment_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["futureValue"] ?? 0;
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


export interface Investment_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

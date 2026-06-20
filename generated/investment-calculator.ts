// Auto-generated from investment-calculator-schema.json
import * as z from 'zod';

export interface Investment_calculatorInput {
  initialInvestment: number;
  annualContribution: number;
  years: number;
  annualRate: number;
  compoundingFrequency: number;
  dataConfidence?: number;
}

export const Investment_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(10000),
  annualContribution: z.number().default(5000),
  years: z.number().default(10),
  annualRate: z.number().default(7),
  compoundingFrequency: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Investment_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.initialInvestment + input.annualContribution * input.years; results["totalContributions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalContributions"] = Number.NaN; }
  try { const v = input.initialInvestment + input.annualContribution * input.years; results["totalContributions_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalContributions_aux"] = Number.NaN; }
  return results;
}


export function calculateInvestment_calculator(input: Investment_calculatorInput): Investment_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalContributions_aux"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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

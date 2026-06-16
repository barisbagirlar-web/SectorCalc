// Auto-generated from cd-calculator-schema.json
import * as z from 'zod';

export interface Cd_calculatorInput {
  initialDeposit: number;
  annualRate: number;
  termMonths: number;
  compoundingFrequency: number;
  additionalDeposit: number;
}

export const Cd_calculatorInputSchema = z.object({
  initialDeposit: z.number().default(10000),
  annualRate: z.number().default(5),
  termMonths: z.number().default(12),
  compoundingFrequency: z.number().default(12),
  additionalDeposit: z.number().default(0),
});

function evaluateAllFormulas(input: Cd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (results["finalBalance"] ?? 0) - input.initialDeposit - (input.additionalDeposit * input.termMonths); results["totalInterest"] = Number.isFinite(v) ? v : 0; } catch { results["totalInterest"] = 0; }
  try { const v = input.initialDeposit * Math.pow(1 + (input.annualRate / 100) / input.compoundingFrequency, input.compoundingFrequency * (input.termMonths / 12)) + input.additionalDeposit * ((Math.pow(1 + (input.annualRate / 100) / input.compoundingFrequency, input.compoundingFrequency * (input.termMonths / 12)) - 1) / ((input.annualRate / 100) / input.compoundingFrequency)); results["finalBalance"] = Number.isFinite(v) ? v : 0; } catch { results["finalBalance"] = 0; }
  try { const v = Math.pow(1 + (input.annualRate / 100) / input.compoundingFrequency, input.compoundingFrequency) - 1; results["effectiveAnnualRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveAnnualRate"] = 0; }
  return results;
}


export function calculateCd_calculator(input: Cd_calculatorInput): Cd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalBalance"] ?? 0;
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


export interface Cd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// Auto-generated from rule-of-144-calculator-schema.json
import * as z from 'zod';

export interface Rule_of_144_calculatorInput {
  interestRate: number;
  compoundingPeriods: number;
  initialInvestment: number;
  targetMultiplier: number;
}

export const Rule_of_144_calculatorInputSchema = z.object({
  interestRate: z.number().default(7),
  compoundingPeriods: z.number().default(1),
  initialInvestment: z.number().default(1000),
  targetMultiplier: z.number().default(2),
});

function evaluateAllFormulas(input: Rule_of_144_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 144 / input.interestRate; results["rule144Estimate"] = Number.isFinite(v) ? v : 0; } catch { results["rule144Estimate"] = 0; }
  try { const v = Math.log(input.targetMultiplier) / (input.compoundingPeriods * Math.log(1 + input.interestRate / (100 * input.compoundingPeriods))); results["exactYears"] = Number.isFinite(v) ? v : 0; } catch { results["exactYears"] = 0; }
  try { const v = (results["exactYears"] ?? 0) - (results["rule144Estimate"] ?? 0); results["difference"] = Number.isFinite(v) ? v : 0; } catch { results["difference"] = 0; }
  return results;
}


export function calculateRule_of_144_calculator(input: Rule_of_144_calculatorInput): Rule_of_144_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["rule144Estimate"] ?? 0;
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


export interface Rule_of_144_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

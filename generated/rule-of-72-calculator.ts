// Auto-generated from rule-of-72-calculator-schema.json
import * as z from 'zod';

export interface Rule_of_72_calculatorInput {
  interestRate: number;
  compoundingFrequency: number;
  ruleConstant: number;
  initialInvestment: number;
}

export const Rule_of_72_calculatorInputSchema = z.object({
  interestRate: z.number().default(8),
  compoundingFrequency: z.number().default(1),
  ruleConstant: z.number().default(72),
  initialInvestment: z.number().default(10000),
});

function evaluateAllFormulas(input: Rule_of_72_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((1 + input.interestRate / 100 / input.compoundingFrequency) ** input.compoundingFrequency - 1); results["effectiveRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveRate"] = 0; }
  try { const v = Math.log(2) / Math.log(1 + (results["effectiveRate"] ?? 0)); results["exactYears"] = Number.isFinite(v) ? v : 0; } catch { results["exactYears"] = 0; }
  try { const v = input.ruleConstant / input.interestRate; results["approxYears"] = Number.isFinite(v) ? v : 0; } catch { results["approxYears"] = 0; }
  try { const v = input.initialInvestment * Math.exp((results["exactYears"] ?? 0) * Math.log(1 + (results["effectiveRate"] ?? 0))); results["finalExact"] = Number.isFinite(v) ? v : 0; } catch { results["finalExact"] = 0; }
  try { const v = input.initialInvestment * (1 + (results["effectiveRate"] ?? 0)) ** (results["approxYears"] ?? 0); results["finalApprox"] = Number.isFinite(v) ? v : 0; } catch { results["finalApprox"] = 0; }
  return results;
}


export function calculateRule_of_72_calculator(input: Rule_of_72_calculatorInput): Rule_of_72_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["approxYears"] ?? 0;
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


export interface Rule_of_72_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

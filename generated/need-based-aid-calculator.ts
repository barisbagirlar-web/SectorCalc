// Auto-generated from need-based-aid-calculator-schema.json
import * as z from 'zod';

export interface Need_based_aid_calculatorInput {
  costOfAttendance: number;
  annualIncome: number;
  numberOfDependents: number;
  assets: number;
  otherAid: number;
}

export const Need_based_aid_calculatorInputSchema = z.object({
  costOfAttendance: z.number().default(20000),
  annualIncome: z.number().default(50000),
  numberOfDependents: z.number().default(1),
  assets: z.number().default(0),
  otherAid: z.number().default(0),
});

function evaluateAllFormulas(input: Need_based_aid_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualIncome * 0.47 + input.assets * 0.12 - (input.numberOfDependents - 1) * 5000; results["efc"] = Number.isFinite(v) ? v : 0; } catch { results["efc"] = 0; }
  try { const v = input.costOfAttendance - input.otherAid; results["adjustedCost"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedCost"] = 0; }
  try { const v = (results["adjustedCost"] ?? 0) - (results["efc"] ?? 0); results["need"] = Number.isFinite(v) ? v : 0; } catch { results["need"] = 0; }
  return results;
}


export function calculateNeed_based_aid_calculator(input: Need_based_aid_calculatorInput): Need_based_aid_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["need"] ?? 0;
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


export interface Need_based_aid_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

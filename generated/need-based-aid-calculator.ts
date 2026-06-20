// Auto-generated from need-based-aid-calculator-schema.json
import * as z from 'zod';

export interface Need_based_aid_calculatorInput {
  costOfAttendance: number;
  annualIncome: number;
  numberOfDependents: number;
  assets: number;
  otherAid: number;
  dataConfidence?: number;
}

export const Need_based_aid_calculatorInputSchema = z.object({
  costOfAttendance: z.number().default(20000),
  annualIncome: z.number().default(50000),
  numberOfDependents: z.number().default(1),
  assets: z.number().default(0),
  otherAid: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Need_based_aid_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualIncome * 0.47 + input.assets * 0.12 - (input.numberOfDependents - 1) * 5000; results["efc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["efc"] = Number.NaN; }
  try { const v = input.costOfAttendance - input.otherAid; results["adjustedCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustedCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["adjustedCost"])) - (toNumericFormulaValue(results["efc"])); results["need"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["need"] = Number.NaN; }
  return results;
}


export function calculateNeed_based_aid_calculator(input: Need_based_aid_calculatorInput): Need_based_aid_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["need"]);
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


export interface Need_based_aid_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

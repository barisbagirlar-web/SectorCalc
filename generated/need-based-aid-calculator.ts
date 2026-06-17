// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Need_based_aid_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annualIncome * 0.47 + input.assets * 0.12 - (input.numberOfDependents - 1) * 5000; results["efc"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["efc"] = 0; }
  try { const v = input.costOfAttendance - input.otherAid; results["adjustedCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedCost"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedCost"])) - (asFormulaNumber(results["efc"])); results["need"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["need"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNeed_based_aid_calculator(input: Need_based_aid_calculatorInput): Need_based_aid_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["need"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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

// @ts-nocheck
// Auto-generated from 529-plan-calculator-schema.json
import * as z from 'zod';

export interface _529_plan_calculatorInput {
  childAge: number;
  annualContribution: number;
  existingBalance: number;
  yearsUntilCollege: number;
  annualReturn: number;
  inflationRate: number;
}

export const _529_plan_calculatorInputSchema = z.object({
  childAge: z.number().default(5),
  annualContribution: z.number().default(5000),
  existingBalance: z.number().default(10000),
  yearsUntilCollege: z.number().default(13),
  annualReturn: z.number().default(6),
  inflationRate: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _529_plan_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.childAge + input.annualContribution + input.existingBalance; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.childAge + input.annualContribution + input.existingBalance; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculate_529_plan_calculator(input: _529_plan_calculatorInput): _529_plan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface _529_plan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

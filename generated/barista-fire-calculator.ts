// @ts-nocheck
// Auto-generated from barista-fire-calculator-schema.json
import * as z from 'zod';

export interface Barista_fire_calculatorInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlySavings: number;
  annualReturn: number;
  withdrawalRate: number;
  annualExpenses: number;
  partTimeIncome: number;
}

export const Barista_fire_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  currentSavings: z.number().default(50000),
  monthlySavings: z.number().default(1000),
  annualReturn: z.number().default(7),
  withdrawalRate: z.number().default(4),
  annualExpenses: z.number().default(40000),
  partTimeIncome: z.number().default(12000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Barista_fire_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.currentAge + input.retirementAge + input.currentSavings; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.currentAge + input.retirementAge + input.currentSavings; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBarista_fire_calculator(input: Barista_fire_calculatorInput): Barista_fire_calculatorOutput {
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


export interface Barista_fire_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

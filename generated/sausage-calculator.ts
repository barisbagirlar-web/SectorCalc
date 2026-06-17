// @ts-nocheck
// Auto-generated from sausage-calculator-schema.json
import * as z from 'zod';

export interface Sausage_calculatorInput {
  totalWeight: number;
  fatPercentage: number;
  meatCost: number;
  fatCost: number;
  casingDiameter: number;
  casingCost: number;
}

export const Sausage_calculatorInputSchema = z.object({
  totalWeight: z.number().default(10),
  fatPercentage: z.number().default(20),
  meatCost: z.number().default(5),
  fatCost: z.number().default(2),
  casingDiameter: z.number().default(30),
  casingCost: z.number().default(0.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sausage_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalWeight * (1 - input.fatPercentage / 100); results["meatWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["meatWeight"] = 0; }
  try { const v = input.totalWeight * (input.fatPercentage / 100); results["fatWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fatWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSausage_calculator(input: Sausage_calculatorInput): Sausage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["fatWeight"]);
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


export interface Sausage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

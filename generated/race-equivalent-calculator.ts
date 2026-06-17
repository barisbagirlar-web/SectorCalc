// @ts-nocheck
// Auto-generated from race-equivalent-calculator-schema.json
import * as z from 'zod';

export interface Race_equivalent_calculatorInput {
  knownDistance: number;
  knownTimeHours: number;
  knownTimeMinutes: number;
  knownTimeSeconds: number;
  targetDistance: number;
}

export const Race_equivalent_calculatorInputSchema = z.object({
  knownDistance: z.number().default(10),
  knownTimeHours: z.number().default(0),
  knownTimeMinutes: z.number().default(50),
  knownTimeSeconds: z.number().default(0),
  targetDistance: z.number().default(42.195),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Race_equivalent_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.knownDistance + input.knownTimeHours + input.knownTimeMinutes; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.knownDistance + input.knownTimeHours + input.knownTimeMinutes; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRace_equivalent_calculator(input: Race_equivalent_calculatorInput): Race_equivalent_calculatorOutput {
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


export interface Race_equivalent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

// @ts-nocheck
// Auto-generated from cure-calculator-schema.json
import * as z from 'zod';

export interface Cure_calculatorInput {
  curingTemperature: number;
  curingTimeHours: number;
  datumTemperature: number;
  strengthCoefficientA: number;
  strengthCoefficientB: number;
}

export const Cure_calculatorInputSchema = z.object({
  curingTemperature: z.number().default(20),
  curingTimeHours: z.number().default(168),
  datumTemperature: z.number().default(-10),
  strengthCoefficientA: z.number().default(20),
  strengthCoefficientB: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cure_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.curingTemperature + input.curingTimeHours + input.datumTemperature; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.curingTemperature + input.curingTimeHours + input.datumTemperature; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCure_calculator(input: Cure_calculatorInput): Cure_calculatorOutput {
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


export interface Cure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

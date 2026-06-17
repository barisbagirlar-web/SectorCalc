// @ts-nocheck
// Auto-generated from canoeing-calculator-schema.json
import * as z from 'zod';

export interface Canoeing_calculatorInput {
  paddlePower: number;
  dragCoefficient: number;
  waterDensity: number;
  frontalArea: number;
  canoeWeight: number;
  paddlerWeight: number;
}

export const Canoeing_calculatorInputSchema = z.object({
  paddlePower: z.number().default(100),
  dragCoefficient: z.number().default(0.04),
  waterDensity: z.number().default(1000),
  frontalArea: z.number().default(0.5),
  canoeWeight: z.number().default(20),
  paddlerWeight: z.number().default(75),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Canoeing_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.canoeWeight + input.paddlerWeight; results["totalWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = input.canoeWeight + input.paddlerWeight; results["totalWeight_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWeight_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCanoeing_calculator(input: Canoeing_calculatorInput): Canoeing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWeight_aux"]);
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


export interface Canoeing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

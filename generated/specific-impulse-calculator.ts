// @ts-nocheck
// Auto-generated from specific-impulse-calculator-schema.json
import * as z from 'zod';

export interface Specific_impulse_calculatorInput {
  thrust: number;
  massFlowRate: number;
  standardGravity: number;
}

export const Specific_impulse_calculatorInputSchema = z.object({
  thrust: z.number(),
  massFlowRate: z.number(),
  standardGravity: z.number().default(9.80665),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Specific_impulse_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.thrust / (input.massFlowRate * input.standardGravity); results["primary"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.thrust / (input.massFlowRate * input.standardGravity); results["primary_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["primary_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSpecific_impulse_calculator(input: Specific_impulse_calculatorInput): Specific_impulse_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["primary_aux"]);
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


export interface Specific_impulse_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

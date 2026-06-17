// @ts-nocheck
// Auto-generated from capillary-action-calculator-schema.json
import * as z from 'zod';

export interface Capillary_action_calculatorInput {
  surfaceTension: number;
  contactAngle: number;
  density: number;
  radius: number;
  gravity: number;
}

export const Capillary_action_calculatorInputSchema = z.object({
  surfaceTension: z.number().default(0.0728),
  contactAngle: z.number().default(20),
  density: z.number().default(1000),
  radius: z.number().default(0.0005),
  gravity: z.number().default(9.81),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Capillary_action_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.surfaceTension + input.contactAngle + input.density; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.surfaceTension + input.contactAngle + input.density; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCapillary_action_calculator(input: Capillary_action_calculatorInput): Capillary_action_calculatorOutput {
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


export interface Capillary_action_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

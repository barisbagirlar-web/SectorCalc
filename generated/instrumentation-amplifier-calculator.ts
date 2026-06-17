// @ts-nocheck
// Auto-generated from instrumentation-amplifier-calculator-schema.json
import * as z from 'zod';

export interface Instrumentation_amplifier_calculatorInput {
  r1: number;
  r2: number;
  vinPlus: number;
  vinMinus: number;
  vref: number;
}

export const Instrumentation_amplifier_calculatorInputSchema = z.object({
  r1: z.number().default(1000),
  r2: z.number().default(10000),
  vinPlus: z.number().default(0.01),
  vinMinus: z.number().default(0),
  vref: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Instrumentation_amplifier_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1 + 2 * input.r2 / input.r1; results["gain"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["gain"] = 0; }
  try { const v = input.vinPlus - input.vinMinus; results["vd"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vd"] = 0; }
  try { const v = (1 + 2 * input.r2 / input.r1) * (input.vinPlus - input.vinMinus) + input.vref; results["vout"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vout"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateInstrumentation_amplifier_calculator(input: Instrumentation_amplifier_calculatorInput): Instrumentation_amplifier_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vout"]);
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


export interface Instrumentation_amplifier_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

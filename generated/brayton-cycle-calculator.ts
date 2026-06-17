// @ts-nocheck
// Auto-generated from brayton-cycle-calculator-schema.json
import * as z from 'zod';

export interface Brayton_cycle_calculatorInput {
  T1: number;
  T3: number;
  rp: number;
  eta_c: number;
  eta_t: number;
  gamma: number;
  cp: number;
}

export const Brayton_cycle_calculatorInputSchema = z.object({
  T1: z.number().default(300),
  T3: z.number().default(1200),
  rp: z.number().default(10),
  eta_c: z.number().default(0.85),
  eta_t: z.number().default(0.9),
  gamma: z.number().default(1.4),
  cp: z.number().default(1.005),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Brayton_cycle_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.T1 + input.T3 + input.rp; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.T1 + input.T3 + input.rp; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBrayton_cycle_calculator(input: Brayton_cycle_calculatorInput): Brayton_cycle_calculatorOutput {
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


export interface Brayton_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

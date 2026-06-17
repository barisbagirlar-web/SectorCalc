// @ts-nocheck
// Auto-generated from atl-ctl-tsb-calculator-schema.json
import * as z from 'zod';

export interface Atl_ctl_tsb_calculatorInput {
  t1: number;
  t2: number;
  t3: number;
  t4: number;
  nominal: number;
}

export const Atl_ctl_tsb_calculatorInputSchema = z.object({
  t1: z.number().default(0.1),
  t2: z.number().default(0.1),
  t3: z.number().default(0.1),
  t4: z.number().default(0.1),
  nominal: z.number().default(100),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Atl_ctl_tsb_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.t1 + input.t2 + input.t3 + input.t4; results["atl"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["atl"] = 0; }
  try { const v = input.t1 + input.t2 + input.t3 + input.t4; results["atl_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["atl_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAtl_ctl_tsb_calculator(input: Atl_ctl_tsb_calculatorInput): Atl_ctl_tsb_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["atl_aux"]);
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


export interface Atl_ctl_tsb_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

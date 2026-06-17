// @ts-nocheck
// Auto-generated from okr-calculator-schema.json
import * as z from 'zod';

export interface Okr_calculatorInput {
  kr1Weight: number;
  kr1Progress: number;
  kr2Weight: number;
  kr2Progress: number;
  kr3Weight: number;
  kr3Progress: number;
  kr4Weight: number;
  kr4Progress: number;
}

export const Okr_calculatorInputSchema = z.object({
  kr1Weight: z.number().default(25),
  kr1Progress: z.number().default(0),
  kr2Weight: z.number().default(25),
  kr2Progress: z.number().default(0),
  kr3Weight: z.number().default(25),
  kr3Progress: z.number().default(0),
  kr4Weight: z.number().default(25),
  kr4Progress: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Okr_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = ((((input.kr1Weight * input.kr1Progress + input.kr2Weight * input.kr2Progress + input.kr3Weight * input.kr3Progress + input.kr4Weight * input.kr4Progress) / (input.kr1Weight + input.kr2Weight + input.kr3Weight + input.kr4Weight)) || 0) ? 1 : 0); results["overallProgress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overallProgress"] = 0; }
  try { const v = ((((input.kr1Weight * input.kr1Progress) / (input.kr1Weight + input.kr2Weight + input.kr3Weight + input.kr4Weight)) || 0) ? 1 : 0); results["kr1Contribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["kr1Contribution"] = 0; }
  try { const v = ((((input.kr2Weight * input.kr2Progress) / (input.kr1Weight + input.kr2Weight + input.kr3Weight + input.kr4Weight)) || 0) ? 1 : 0); results["kr2Contribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["kr2Contribution"] = 0; }
  try { const v = ((((input.kr3Weight * input.kr3Progress) / (input.kr1Weight + input.kr2Weight + input.kr3Weight + input.kr4Weight)) || 0) ? 1 : 0); results["kr3Contribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["kr3Contribution"] = 0; }
  try { const v = ((((input.kr4Weight * input.kr4Progress) / (input.kr1Weight + input.kr2Weight + input.kr3Weight + input.kr4Weight)) || 0) ? 1 : 0); results["kr4Contribution"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["kr4Contribution"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOkr_calculator(input: Okr_calculatorInput): Okr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallProgress"]);
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


export interface Okr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

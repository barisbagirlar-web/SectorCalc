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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Okr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((((input.kr1Weight * input.kr1Progress + input.kr2Weight * input.kr2Progress + input.kr3Weight * input.kr3Progress + input.kr4Weight * input.kr4Progress) / (input.kr1Weight + input.kr2Weight + input.kr3Weight + input.kr4Weight)) || 0) ? 1 : 0); results["overallProgress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overallProgress"] = Number.NaN; }
  try { const v = ((((input.kr1Weight * input.kr1Progress) / (input.kr1Weight + input.kr2Weight + input.kr3Weight + input.kr4Weight)) || 0) ? 1 : 0); results["kr1Contribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kr1Contribution"] = Number.NaN; }
  try { const v = ((((input.kr2Weight * input.kr2Progress) / (input.kr1Weight + input.kr2Weight + input.kr3Weight + input.kr4Weight)) || 0) ? 1 : 0); results["kr2Contribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kr2Contribution"] = Number.NaN; }
  try { const v = ((((input.kr3Weight * input.kr3Progress) / (input.kr1Weight + input.kr2Weight + input.kr3Weight + input.kr4Weight)) || 0) ? 1 : 0); results["kr3Contribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kr3Contribution"] = Number.NaN; }
  try { const v = ((((input.kr4Weight * input.kr4Progress) / (input.kr1Weight + input.kr2Weight + input.kr3Weight + input.kr4Weight)) || 0) ? 1 : 0); results["kr4Contribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["kr4Contribution"] = Number.NaN; }
  return results;
}


export function calculateOkr_calculator(input: Okr_calculatorInput): Okr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallProgress"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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

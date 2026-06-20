// Auto-generated from cha2ds2-vasc-calculator-schema.json
import * as z from 'zod';

export interface Cha2ds2_vasc_calculatorInput {
  chf: number;
  hypertension: number;
  age75: number;
  diabetes: number;
  stroke: number;
  vascular: number;
  age65to74: number;
  sexFemale: number;
  dataConfidence?: number;
}

export const Cha2ds2_vasc_calculatorInputSchema = z.object({
  chf: z.number().default(0),
  hypertension: z.number().default(0),
  age75: z.number().default(0),
  diabetes: z.number().default(0),
  stroke: z.number().default(0),
  vascular: z.number().default(0),
  age65to74: z.number().default(0),
  sexFemale: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cha2ds2_vasc_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.chf + input.hypertension + input.age75 * 2 + input.diabetes + input.stroke * 2 + input.vascular + input.age65to74 + input.sexFemale; results["score"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["score"] = Number.NaN; }
  try { const v = input.chf + input.hypertension + input.age75 * 2 + input.diabetes + input.stroke * 2 + input.vascular + input.age65to74 + input.sexFemale; results["score_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["score_aux"] = Number.NaN; }
  return results;
}


export function calculateCha2ds2_vasc_calculator(input: Cha2ds2_vasc_calculatorInput): Cha2ds2_vasc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["score_aux"]);
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


export interface Cha2ds2_vasc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

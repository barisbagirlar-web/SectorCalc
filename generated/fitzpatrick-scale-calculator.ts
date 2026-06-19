// Auto-generated from fitzpatrick-scale-calculator-schema.json
import * as z from 'zod';

export interface Fitzpatrick_scale_calculatorInput {
  baseColor: number;
  tanAbility: number;
  burnTendency: number;
  geneticFactor: number;
  hairColor: number;
  eyeColor: number;
  dataConfidence?: number;
}

export const Fitzpatrick_scale_calculatorInputSchema = z.object({
  baseColor: z.number().default(2),
  tanAbility: z.number().default(5),
  burnTendency: z.number().default(5),
  geneticFactor: z.number().default(0.5),
  hairColor: z.number().default(3),
  eyeColor: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fitzpatrick_scale_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseColor * 0.3 + (10 - input.tanAbility) * 0.2 + input.burnTendency * 0.25 + input.geneticFactor * 10 * 0.15 + input.hairColor * 0.05 + input.eyeColor * 0.05; results["score"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["score"] = 0; }
  try { const v = input.baseColor * 0.3 + (10 - input.tanAbility) * 0.2 + input.burnTendency * 0.25 + input.geneticFactor * 10 * 0.15 + input.hairColor * 0.05 + input.eyeColor * 0.05; results["score_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["score_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFitzpatrick_scale_calculator(input: Fitzpatrick_scale_calculatorInput): Fitzpatrick_scale_calculatorOutput {
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


export interface Fitzpatrick_scale_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

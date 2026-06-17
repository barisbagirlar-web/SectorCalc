// @ts-nocheck
// Auto-generated from gym-kalori-hesaplayici-calculator-schema.json
import * as z from 'zod';

export interface Gym_kalori_hesaplayici_calculatorInput {
  duration: number;
  weight: number;
  met: number;
  intensity: number;
}

export const Gym_kalori_hesaplayici_calculatorInputSchema = z.object({
  duration: z.number().default(30),
  weight: z.number().default(70),
  met: z.number().default(5),
  intensity: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gym_kalori_hesaplayici_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.met * input.weight * (input.duration / 60) * input.intensity; results["toplamKalori"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["toplamKalori"] = 0; }
  try { const v = input.met * input.weight * input.intensity / 60; results["dakikaKalori"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dakikaKalori"] = 0; }
  try { const v = input.met * input.weight * (input.duration / 60) * input.intensity / 9; results["yagYakimi"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["yagYakimi"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGym_kalori_hesaplayici_calculator(input: Gym_kalori_hesaplayici_calculatorInput): Gym_kalori_hesaplayici_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["toplamKalori"]);
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


export interface Gym_kalori_hesaplayici_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

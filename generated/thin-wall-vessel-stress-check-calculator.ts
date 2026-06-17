// @ts-nocheck
// Auto-generated from thin-wall-vessel-stress-check-calculator-schema.json
import * as z from 'zod';

export interface Thin_wall_vessel_stress_check_calculatorInput {
  P: number;
  D: number;
  t: number;
  S: number;
  E: number;
}

export const Thin_wall_vessel_stress_check_calculatorInputSchema = z.object({
  P: z.number().default(1),
  D: z.number().default(1000),
  t: z.number().default(10),
  S: z.number().default(150),
  E: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Thin_wall_vessel_stress_check_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.P * input.D) / (2 * input.t * input.E); results["hoopStress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hoopStress"] = 0; }
  try { const v = (input.P * input.D) / (4 * input.t * input.E); results["longStress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["longStress"] = 0; }
  try { const v = (input.S * 2 * input.t * input.E) / (input.P * input.D); results["safetyFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["safetyFactor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateThin_wall_vessel_stress_check_calculator(input: Thin_wall_vessel_stress_check_calculatorInput): Thin_wall_vessel_stress_check_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["safetyFactor"]);
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


export interface Thin_wall_vessel_stress_check_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

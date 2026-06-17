// @ts-nocheck
// Auto-generated from cycling-distance-calculator-schema.json
import * as z from 'zod';

export interface Cycling_distance_calculatorInput {
  wheelDiameter: number;
  cadence: number;
  frontTeeth: number;
  rearTeeth: number;
  timeMinutes: number;
}

export const Cycling_distance_calculatorInputSchema = z.object({
  wheelDiameter: z.number().default(700),
  cadence: z.number().default(80),
  frontTeeth: z.number().default(50),
  rearTeeth: z.number().default(15),
  timeMinutes: z.number().default(60),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cycling_distance_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = ((input.cadence * (input.frontTeeth / input.rearTeeth) * input.timeMinutes) * (Math.PI * input.wheelDiameter)) / 1000000; results["distance"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["distance"] = 0; }
  try { const v = Math.PI * input.wheelDiameter; results["wheelCircumference"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wheelCircumference"] = 0; }
  try { const v = input.cadence * (input.frontTeeth / input.rearTeeth) * input.timeMinutes; results["totalRotations"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalRotations"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCycling_distance_calculator(input: Cycling_distance_calculatorInput): Cycling_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["distance"]);
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


export interface Cycling_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
